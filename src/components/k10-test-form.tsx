'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { K10_QUESTIONS, K10_OPTIONS } from '@/lib/constants';
import { analyzeK10TestResults } from '@/ai/flows/analyze-k10-test-results';
import { useState } from 'react';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Progress } from './ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';
import { Label } from '@/components/ui/label';

const formSchema = z.object({
  answers: z.array(z.string().min(1, 'Please select an option.')).length(10, { message: 'Please answer all 10 questions.' }),
});

export function K10TestForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const { user } = useAuth();
  const router = useRouter();


  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: Array(10).fill(''),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!user) {
      setError('You must be logged in to submit your results.');
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const answersAsNumbers = values.answers.map(Number);
      
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        k10: {
            answers: answersAsNumbers,
            completedAt: new Date().toISOString(),
        }
      }, { merge: true });
      
      router.push('/wellness-assistant');

      analyzeK10TestResults({ answers: answersAsNumbers }).then(aiResult => {
          setDoc(userDocRef, {
              k10: {
                  analysis: aiResult,
              }
          }, { merge: true });
      }).catch(e => {
        console.error("Error analyzing K-10 results in background:", e);
      });

    } catch (e) {
      console.error(e);
      setError('An error occurred while submitting your results. Please try again.');
      setLoading(false);
      router.refresh(); 
    }
  }

  const handleAnswerSelect = (value: string) => {
    form.setValue(`answers.${currentQuestion}`, value, { shouldValidate: true });
  };
  
  const handleNext = () => {
    if (currentQuestion < K10_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleBack = () => {
      if (currentQuestion > 0) {
          setCurrentQuestion(currentQuestion - 1);
      }
  }
  
  const progress = ((currentQuestion + 1) / K10_QUESTIONS.length) * 100;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Let's get to know you</CardTitle>
        <CardDescription>
          This quick scientific psychological test will help us understand your current well-being. Please answer based on how you have been feeling over the past 4 weeks.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8 min-h-[300px]">
             <Progress value={progress} className="mb-8" />
             <FormField
                control={form.control}
                name={`answers.${currentQuestion}`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-lg">{`${currentQuestion + 1}. ${K10_QUESTIONS[currentQuestion]}`}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={handleAnswerSelect}
                        value={field.value}
                        className="flex flex-col space-y-2 pt-2"
                        key={currentQuestion}
                      >
                        {K10_OPTIONS.map((option) => (
                          <FormItem key={option.value}>
                             <Label htmlFor={`q${currentQuestion}-o${option.value}`} className="flex items-center space-x-3 space-y-0 p-3 rounded-md border hover:bg-accent hover:border-primary/50 has-[:checked]:bg-secondary has-[:checked]:border-primary transition-colors cursor-pointer">
                                <FormControl>
                                  <RadioGroupItem value={String(option.value)} id={`q${currentQuestion}-o${option.value}`} />
                                </FormControl>
                                <span className="font-normal">{option.label}</span>
                            </Label>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
          </CardContent>
          <CardFooter className="flex justify-between">
            {currentQuestion > 0 ? (
                <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                </Button>
            ) : <div />}
             {currentQuestion < K10_QUESTIONS.length - 1 && (
                <Button 
                    type="button" 
                    onClick={handleNext} 
                    disabled={!form.getValues('answers')[currentQuestion]} 
                    className="ml-auto"
                >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )}
             {currentQuestion === K10_QUESTIONS.length - 1 && (
                <Button type="submit" disabled={loading || !form.getValues('answers')[currentQuestion]} className="ml-auto">
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Go to Assistant
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
            )}
          </CardFooter>
        </form>
         {error && <p className="text-sm text-destructive p-6 pt-0">{error}</p>}
      </Form>
    </Card>
  );
}
