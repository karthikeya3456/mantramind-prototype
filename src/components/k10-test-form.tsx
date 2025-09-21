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
import { analyzeK10TestResults, AnalyzeK10TestResultsOutput } from '@/ai/flows/analyze-k10-test-results';
import { useState } from 'react';
import { Loader2, ArrowRight, ArrowLeft } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import { Progress } from './ui/progress';
import { useAuth } from '@/hooks/use-auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useRouter } from 'next/navigation';

const formSchema = z.object({
  answers: z.array(z.string().min(1, 'Please select an option.')).length(10, { message: 'Please answer all 10 questions.' }),
});

export function K10TestForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeK10TestResultsOutput | null>(null);
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
    setResult(null);

    try {
      const answersAsNumbers = values.answers.map(Number);
      const aiResult = await analyzeK10TestResults({ answers: answersAsNumbers });
      setResult(aiResult);
      
      // Save results to Firestore
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        k10: {
            answers: answersAsNumbers,
            analysis: aiResult,
            completedAt: new Date().toISOString(),
        }
      }, { merge: true });

    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing your results. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const handleNext = async () => {
      const isValid = await form.trigger(`answers.${currentQuestion}`);
      if (isValid) {
          if (currentQuestion < K10_QUESTIONS.length - 1) {
              setCurrentQuestion(currentQuestion + 1);
          } else {
              form.handleSubmit(onSubmit)();
          }
      }
  };

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const progress = (currentQuestion / (K10_QUESTIONS.length -1)) * 100;

  if (result) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Results</CardTitle>
                <CardDescription>Here is an AI-powered analysis of your answers. This information will help us personalize your experience.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Alert>
                    <AlertTitle>Mental State Analysis</AlertTitle>
                    <AlertDescription>{result.mentalState}</AlertDescription>
                </Alert>
                <Alert>
                    <AlertTitle>Personalized Advice</AlertTitle>
                    <AlertDescription>{result.advice}</AlertDescription>
                </Alert>
                <p className="text-xs text-muted-foreground">Disclaimer: This is not a medical diagnosis. Please consult a healthcare professional for any health concerns.</p>
            </CardContent>
            <CardFooter>
                 <Button onClick={() => router.push('/dashboard')}>Go to Dashboard</Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Let's get to know you</CardTitle>
        <CardDescription>
          This quick scientific psychological test will help us understand your current well-being. Please answer based on how you have been feeling over the past 4 weeks.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={(e) => e.preventDefault()}>
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
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex flex-col space-y-2 pt-2"
                      >
                        {K10_OPTIONS.map((option) => (
                          <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={String(option.value)} id={`q${currentQuestion}-o${option.value}`} />
                            </FormControl>
                            <Label htmlFor={`q${currentQuestion}-o${option.value}`} className="font-normal cursor-pointer">{option.label}</Label>
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
            <Button type="button" variant="outline" onClick={handleBack} disabled={currentQuestion === 0 || loading}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
            </Button>
            <Button type="button" onClick={handleNext} disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {currentQuestion < K10_QUESTIONS.length - 1 ? 'Next' : 'Get My Results'}
                {currentQuestion < K10_QUESTIONS.length - 1 && <ArrowRight className="ml-2 h-4 w-4" />}
            </Button>
          </CardFooter>
        </form>
         {error && <p className="text-sm text-destructive p-6 pt-0">{error}</p>}
      </Form>
    </Card>
  );
}
