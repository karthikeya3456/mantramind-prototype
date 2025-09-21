'use client';

import { ChatInterface } from '@/components/chat-interface';
import { wellnessAssistant } from '@/ai/flows/wellness-ai-assistant';
import { useAuth } from '@/hooks/use-auth';

export default function WellnessAssistantPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  const handleAiFlow = async (input: string, pastMessages: any[]) => {
    // We can add logic to get K-10 score here if available
    const response = await wellnessAssistant({
      userInput: input,
      pastResponses: pastMessages.map(m => ({ question: m.role, answer: m.content })),
    });
    return response.response;
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
        <ChatInterface
            title="AI Wellness Assistant"
            description="Your personal guide to well-being. How can I help you today?"
            initialMessage={`Hello ${firstName}, I'm your AI wellness assistant. How are you feeling right now?`}
            aiFlow={handleAiFlow}
        />
    </div>
  );
}
