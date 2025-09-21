'use server';
/**
 * @fileOverview Analyzes the results of the K-10 psychological test using AI.
 *
 * - analyzeK10TestResults - A function that analyzes K-10 test results.
 * - AnalyzeK10TestResultsInput - The input type for the analyzeK10TestResults function.
 * - AnalyzeK10TestResultsOutput - The return type for the analyzeK10TestResults function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeK10TestResultsInputSchema = z.object({
  answers: z
    .array(z.number())
    .length(10)
    .describe(
      'An array of 10 numbers representing the answers to the K-10 test questions. Each number should be an integer.'
    ),
});
export type AnalyzeK10TestResultsInput = z.infer<typeof AnalyzeK10TestResultsInputSchema>;

const AnalyzeK10TestResultsOutputSchema = z.object({
  mentalState: z
    .string()
    .describe(
      'A string describing the users mental state derived from their answers to the K-10 test.'
    ),
  advice: z
    .string()
    .describe(
      'A string of advice tailored to the users mental state, derived from their answers to the K-10 test.'
    ),
});
export type AnalyzeK10TestResultsOutput = z.infer<typeof AnalyzeK10TestResultsOutputSchema>;

export async function analyzeK10TestResults(
  input: AnalyzeK10TestResultsInput
): Promise<AnalyzeK10TestResultsOutput> {
  return analyzeK10TestResultsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeK10TestResultsPrompt',
  input: {schema: AnalyzeK10TestResultsInputSchema},
  output: {schema: AnalyzeK10TestResultsOutputSchema},
  prompt: `You are an AI psychologist who will analyze the results of the K-10 psychological test.

  The test consists of 10 questions, and the answers are provided as an array of numbers. The possible answers for each question range from 1 to 5.

  Here are the users answers: {{{answers}}}

  Please analyze the answers and determine the users mental state, and provide some advice tailored to their situation.
  `,
});

const analyzeK10TestResultsFlow = ai.defineFlow(
  {
    name: 'analyzeK10TestResultsFlow',
    inputSchema: AnalyzeK10TestResultsInputSchema,
    outputSchema: AnalyzeK10TestResultsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
