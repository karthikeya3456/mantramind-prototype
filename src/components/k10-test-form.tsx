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
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

const formSchema = z.object({
  answers: z.array(z.string()).length(10, { message: 'Please answer all 10 questions.' }),
});

export function K10TestForm() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalyzeK10TestResultsOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      answers: [],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const answersAsNumbers = values.answers.map(Number);
      const aiResult = await analyzeK10TestResults({ answers: answersAsNumbers });
      setResult(aiResult);
    } catch (e) {
      console.error(e);
      setError('An error occurred while analyzing your results. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (result) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Your Results</CardTitle>
                <CardDescription>Here is an AI-powered analysis of your answers.</CardDescription>
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
                 <Button onClick={() => { setResult(null); form.reset(); }}>Take the test again</Button>
            </CardFooter>
        </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>K-10 Psychological Test</CardTitle>
        <CardDescription>
          Answer the following questions based on how you have been feeling over the past 4 weeks.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent className="space-y-8">
            {K10_QUESTIONS.map((question, index) => (
              <FormField
                key={index}
                control={form.control}
                name={`answers.${index}`}
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>{`${index + 1}. ${question}`}</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        {K10_OPTIONS.map((option) => (
                          <FormItem key={option.value} className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={String(option.value)} />
                            </FormControl>
                            <FormLabel className="font-normal">{option.label}</FormLabel>
                          </FormItem>
                        ))}
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </CardContent>
          <CardFooter className="flex-col items-start gap-4">
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {loading ? 'Analyzing...' : 'Get My Results'}
            </Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
            <FormMessage>{form.formState.errors.answers?.message}</FormMessage>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
