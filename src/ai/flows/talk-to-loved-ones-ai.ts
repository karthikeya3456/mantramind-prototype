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
  lovedOne: z.object({
    name: z.string(),
    relationship: z.string(),
    greeting: z.string(),
    characteristics: z.string(),
  }),
  userMessage: z
    .string()
    .describe('The user message to send to the AI-simulated loved one.'),
  pastResponses: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional()
    .describe('A list of past messages in the conversation.'),
});
export type TalkToLovedOneInput = z.infer<typeof TalkToLovedOneInputSchema>;

const TalkToLovedOneOutputSchema = z.object({
  aiResponse: z.string().describe('The AI-simulated loved one response.'),
});
export type TalkToLovedOneOutput = z.infer<typeof TalkToLovedOneOutputSchema>;

export async function talkToLovedOne(
  input: TalkToLovedOneInput
): Promise<TalkToLovedOneOutput> {
  return talkToLovedOneFlow(input);
}

const prompt = ai.definePrompt({
  name: 'talkToLovedOnePrompt',
  input: {schema: TalkToLovedOneInputSchema},
  output: {schema: TalkToLovedOneOutputSchema},
  prompt: `You are simulating a conversation with a loved one. Your responses must be simple, short, and use natural, everyday language. Do not act like a formal assistant.

  Their name is {{lovedOne.name}}.
  Their relationship to the user is: {{lovedOne.relationship}}.
  Here are their characteristics and traits: {{lovedOne.characteristics}}

  {{#if pastResponses.length}}
  Here is the recent conversation history:
  {{#each pastResponses}}
  {{#if (eq role "assistant")}}model{{else}}{{role}}{{/if}}: {{{content}}}
  {{/each}}
  {{/if}}

  Respond to the following message from the user as if you were that loved one. Do not break character. Keep your reply to just a few sentences at most.
  User's message: {{{userMessage}}}`,
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
