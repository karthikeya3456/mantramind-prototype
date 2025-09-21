'use server';
/**
 * @fileOverview Allows users to communicate with an AI-simulated version of their loved ones (chat and voice) to combat loneliness.
 *
 * - talkToLovedOne - A function that handles the AI simulation of a loved one.
 * - TalkToLovedOneInput - The input type for the talkToLovedOne function.
 * - TalkToLovedOneOutput - The return type for the talkToLovedOne function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const TalkToLovedOneInputSchema = z.object({
  lovedOneDescription: z
    .string()
    .describe('Description of the loved one, including personality, history, and typical phrases.'),
  userMessage: z.string().describe('The user message to send to the AI-simulated loved one.'),
});
export type TalkToLovedOneInput = z.infer<typeof TalkToLovedOneInputSchema>;

const TalkToLovedOneOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-simulated loved one response.'),
});
export type TalkToLovedOneOutput = z.infer<typeof TalkToLovedOneOutputSchema>;

export async function talkToLovedOne(input: TalkToLovedOneInput): Promise<TalkToLovedOneOutput> {
  return talkToLovedOneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'talkToLovedOnePrompt',
  input: {schema: TalkToLovedOneInputSchema},
  output: {schema: TalkToLovedOneOutputSchema},
  prompt: `You are simulating a conversation with a loved one based on the following description:
  {{{lovedOneDescription}}}

  Respond to the following message from the user as if you were that loved one:
  {{{userMessage}}}`,
});

const talkToLovedOneFlow = ai.defineFlow(
  {
    name: 'talkToLovedOneFlow',
    inputSchema: TalkToLovedOneInputSchema,
    outputSchema: TalkToLovedOneOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
