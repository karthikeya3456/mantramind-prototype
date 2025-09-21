import { config } from 'dotenv';
config();

import '@/ai/flows/wellness-ai-assistant.ts';
import '@/ai/flows/admin-notification-unusual-situation.ts';
import '@/ai/flows/analyze-k10-test-results.ts';
import '@/ai/flows/talk-to-loved-ones-ai.ts';