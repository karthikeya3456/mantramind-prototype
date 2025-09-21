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
  pastResponses: z.array(z.object({
    question: z.string(),
    answer: z.string(),
  })).optional().describe('A list of past questions and answers in the conversation.'),
});
export type WellnessAssistantInput = z.infer<typeof WellnessAssistantInputSchema>;

const WellnessAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user input.'),
  suggestedAction: z.string().optional().describe('A suggested action or feature to redirect the user to.'),
});
export type WellnessAssistantOutput = z.infer<typeof WellnessAssistantOutputSchema>;

const incorporateUserDataTool = ai.defineTool({
  name: 'incorporateUserData',
  description: 'Decides whether and how to incorporate user data such as K10 score and past responses into the assistant reply.',
  inputSchema: z.object({
    shouldIncorporateK10Score: z.boolean().describe('Whether to incorporate the K-10 score in the response.'),
    shouldIncorporatePastResponses: z.boolean().describe('Whether to incorporate past responses in the response.'),
  }),
  outputSchema: z.object({
    incorporateK10Score: z.boolean().describe('Whether to incorporate the K-10 score.'),
    incorporatePastResponses: z.boolean().describe('Whether to incorporate past responses.'),
  }),
},
async (input) => {
  // Implement the logic to decide whether to incorporate user data
  return {
    incorporateK10Score: input.shouldIncorporateK10Score,
    incorporatePastResponses: input.shouldIncorporatePastResponses,
  };
});


const wellnessAssistantPrompt = ai.definePrompt({
  name: 'wellnessAssistantPrompt',
  input: {schema: WellnessAssistantInputSchema},
  output: {schema: WellnessAssistantOutputSchema},
  tools: [incorporateUserDataTool],
  prompt: `You are a friendly and empathetic Wellness AI Assistant.
  Your goal is to provide simple, short, and supportive responses in natural, everyday language. Keep your answers to just a couple of sentences.

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

export async function wellnessAssistant(input: WellnessAssistantInput): Promise<WellnessAssistantOutput> {
  return wellnessAssistantFlow(input);
}
