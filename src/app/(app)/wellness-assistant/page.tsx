'use client';

import { ChatInterface } from '@/components/chat-interface';
import { wellnessAssistant } from '@/ai/flows/wellness-ai-assistant';
import { useAuth } from '@/hooks/use-auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { useEffect, useState } from 'react';

export default function WellnessAssistantPage() {
  const { user } = useAuth();
  const [k10Score, setK10Score] = useState<number | undefined>();
  const firstName = user?.displayName?.split(' ')[0] || 'there';

  useEffect(() => {
    async function fetchK10Score() {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists() && userDoc.data().k10?.answers) {
          const answers = userDoc.data().k10.answers as number[];
          const score = answers.reduce((sum, current) => sum + current, 0);
          setK10Score(score);
        }
      }
    }
    fetchK10Score();
  }, [user]);

  const handleAiFlow = async (input: string, pastMessages: any[]) => {
    const response = await wellnessAssistant({
      userInput: input,
      k10Score: k10Score,
      pastResponses: pastMessages.map(m => ({ question: m.role, answer: m.content })),
    });
    // The chat interface now expects the full object to handle suggested actions.
    return response;
  };

  const initialMessage = `Hello ${firstName}, I'm your AI wellness assistant. How are you feeling right now?`;

  return (
    <div className="mx-auto w-full max-w-3xl h-full">
        <ChatInterface
            title="AI Wellness Assistant"
            description="Your personal guide to well-being. How can I help you today?"
            initialMessage={initialMessage}
            aiFlow={handleAiFlow}
        />
    </div>
  );
}
