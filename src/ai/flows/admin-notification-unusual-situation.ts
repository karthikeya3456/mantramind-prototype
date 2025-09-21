'use server';
/**
 * @fileOverview This flow sends a notification to the admin if the Wellness AI Assistant detects an unusual situation.
 *
 * - adminNotificationUnusualSituation - A function that sends the notification.
 * - AdminNotificationUnusualSituationInput - The input type for the adminNotificationUnusualSituation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AdminNotificationUnusualSituationInputSchema = z.object({
  message: z.string().describe('The message to send to the admin.'),
});

export type AdminNotificationUnusualSituationInput =
  z.infer<typeof AdminNotificationUnusualSituationInputSchema>;

export async function adminNotificationUnusualSituation(
  input: AdminNotificationUnusualSituationInput
): Promise<void> {
  return adminNotificationUnusualSituationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'adminNotificationUnusualSituationPrompt',
  prompt: `The Wellness AI Assistant has detected an unusual situation and needs to notify the admin with the following message:

  {{message}}`,
});

const adminNotificationUnusualSituationFlow = ai.defineFlow(
  {
    name: 'adminNotificationUnusualSituationFlow',
    inputSchema: AdminNotificationUnusualSituationInputSchema,
  },
  async input => {
    await prompt(input);
    // TODO: Implement Cloud Functions notification here.
    // This is a placeholder for the actual notification logic using Cloud Functions.
    console.log('Sending notification to admin: ' + input.message);
  }
);
