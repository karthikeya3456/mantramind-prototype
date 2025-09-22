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
        role: z.enum(['user', 'assistant']),
        content: z.string(),
      })
    )
    .optional()
    .describe('A list of past messages in the conversation.'),
});
export type WellnessAssistantInput = z.infer<typeof WellnessAssistantInputSchema>;

const WellnessAssistantOutputSchema = z.object({
  response: z
    .string()
    .describe('The AI assistant response to the user input.'),
  suggestedAction: z
    .enum([
      'relaxation-entertainment',
      'talk-to-loved-ones',
      'appointments',
      'none',
    ])
    .optional()
    .describe(
      "A suggested feature to redirect the user to. Only suggest a feature if it's highly relevant to the user's message."
    ),
});
export type WellnessAssistantOutput = z.infer<typeof WellnessAssistantOutputSchema>;

const wellnessAssistantPrompt = ai.definePrompt({
  name: 'wellnessAssistantPrompt',
  input: {schema: WellnessAssistantInputSchema},
  output: {schema: WellnessAssistantOutputSchema},
  prompt: `You are a friendly and empathetic Wellness AI Assistant. Your goal is to have a simple, interactive, and natural conversation to understand the user's current situation before suggesting a solution.

Here is how you should behave:
1.  Start by asking open-ended questions to understand why the user feels a certain way (e.g., "I'm sorry to hear you're feeling down. Can you tell me a bit more about what's on your mind?").
2.  Listen to their response and ask one or two follow-up questions to get more clarity if needed. Keep your questions simple and empathetic.
3.  Once you have a good understanding, gently ask if they would be open to a suggestion (e.g., "Based on what you've shared, I have an idea that might help. Would you be open to hearing it?").
4.  If the user agrees, you can then suggest ONE of the app's features if it's a good fit. Otherwise, continue the conversation naturally.
5.  Keep your responses short and natural, like a real conversation. Avoid being overly clinical or formal.

Based on their input, you can suggest ONE of the following features if it seems helpful.
- 'relaxation-entertainment': Suggest if the user seems stressed, bored, or in need of a distraction.
- 'talk-to-loved-ones': Suggest if the user expresses feelings of loneliness or wants to connect with someone.
- 'appointments': Suggest if the user expresses a need for professional help or wants to talk to a person.
- 'none': Default to this if you are still gathering information, if the user declines a suggestion, or if no specific action is relevant.

Here is the user's input: {{{userInput}}}

{{#if k10Score}}
The user has completed a wellness test. A higher score indicates more distress. Use this information to gently guide the conversation, but DO NOT mention the score or the test itself in your response.
{{/if}}

{{#if pastResponses.length}}
Here is the recent conversation history:
{{#each pastResponses}}
{{role}}: {{{content}}}
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
