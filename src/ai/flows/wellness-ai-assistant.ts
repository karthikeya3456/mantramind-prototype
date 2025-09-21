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
  prompt: `You are a Wellness AI Assistant designed to provide personalized support and guidance to users.

  Your responsibilities include:
  - Greeting the user in a friendly and empathetic manner.
  - Assessing the user's well-being by asking relevant questions.
  - Analyzing the user's responses to understand their emotional state.
  - Explaining the possible reasons for any negative feelings the user may be experiencing.
  - Suggesting solutions and coping mechanisms to improve the user's well-being.
  - Redirecting users to relevant features within the app that can provide further assistance.

  Here's the user's input: {{{userInput}}}

  {{#if k10Score}}
  The user's K-10 score is: {{{k10Score}}}
  {{/if}}

  {{#if pastResponses}}
  Here are the past questions and answers in the conversation:
  {{#each pastResponses}}
  Question: {{{question}}}, Answer: {{{answer}}}
  {{/each}}
  {{/if}}

  Use the incorporateUserData tool to decide whether to incorporate user data like K-10 score and past responses into your reply.

  Provide a response that is helpful, supportive, and actionable. Suggest a relevant action or feature within the app if appropriate.
  Response:
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
