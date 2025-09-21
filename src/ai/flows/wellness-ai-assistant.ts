'use server';

/**
 * @fileOverview Wellness AI Assistant that greets the user, assesses their well-being based on questions, analyzes the responses,
 * explains possible reasons for negative feelings, suggests solutions, and redirects them to relevant features.
 *
 * - wellnessAssistant - A function that orchestrates the wellness assistant flow.
 * - WellnessAssistantInput - The input type for the wellnessAssistant function.
 * - WellnessAssistantOutput - The return type for the wellnessAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WellnessAssistantInputSchema = z.object({
  userInput: z.string().describe('The user input message.'),
  k10Score: z.number().optional().describe('The user K-10 score, if available.'),
  pastResponses: z
    .array(
      z.object({
        question: z.string(),
        answer: z.string(),
      })
    )
    .optional()
    .describe('A list of past questions and answers in the conversation.'),
});
export type WellnessAssistantInput = z.infer<typeof WellnessAssistantInputSchema>;

const WellnessAssistantOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI assistant response to the user input.'),
  suggestedAction: z
    .enum([
      'wellness-assistant',
      'relaxation-entertainment',
      'talk-to-loved-ones',
      'appointments',
      'none',
    ])
    .optional()
    .describe('A suggested feature to redirect the user to.'),
});
export type WellnessAssistantOutput = z.infer<typeof WellnessAssistantOutputSchema>;

const wellnessAssistantPrompt = ai.definePrompt({
  name: 'wellnessAssistantPrompt',
  input: {schema: WellnessAssistantInputSchema},
  output: {schema: WellnessAssistantOutputSchema},
  prompt: `You are a friendly and empathetic Wellness AI Assistant.
  Your goal is to provide simple, short, and supportive responses in natural, everyday language. Keep your answers to just a couple of sentences.
  Analyze the user's message and the conversation history to understand their needs.

  Based on their input, you can suggest one of the following features if it seems helpful. Only suggest one at a time.
  - 'relaxation-entertainment': If the user seems stressed, bored, or in need of a distraction.
  - 'talk-to-loved-ones': If the user expresses feelings of loneliness or wants to connect with someone.
  - 'appointments': If the user expresses a need for professional help or wants to talk to a person.
  - 'none': If no specific action is relevant, or if you are just having a general conversation.

  Here is the user's input: {{{userInput}}}

  {{#if k10Score}}
  The user has completed a wellness test. A higher score indicates more distress. Use this information to gently guide the conversation, but DO NOT mention the score or the test itself in your response.
  {{/if}}

  {{#if pastResponses}}
  Here are the past questions and answers in the conversation:
  {{#each pastResponses}}
  Question: {{{question}}}, Answer: {{{answer}}}
  {{/each}}
  {{/if}}
  `,
});

const wellnessAssistantFlow = ai.defineFlow(
  {
    name: 'wellnessAssistantFlow',
    inputSchema: WellnessAssistantInputSchema,
    outputSchema: WellnessAssistantOutputSchema,
  },
  async input => {
    const {output} = await wellnessAssistantPrompt(input);
    return output!;
  }
);

export async function wellnessAssistant(
  input: WellnessAssistantInput
): Promise<WellnessAssistantOutput> {
  return wellnessAssistantFlow(input);
}
