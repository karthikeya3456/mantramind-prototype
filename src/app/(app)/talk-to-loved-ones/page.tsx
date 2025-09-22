'use client';

import { useState, useEffect } from 'react';
import { ChatInterface, Message } from '@/components/chat-interface';
import { talkToLovedOne } from '@/ai/flows/talk-to-loved-ones-ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';
import { Loader2, PlusCircle, User, Users } from 'lucide-react';
import Link from 'next/link';

export type LovedOne = {
  id: string;
  name: string;
  relationship: string;
  greeting: string;
  characteristics: string;
};

export default function TalkToLovedOnesPage() {
  const [lovedOnes, setLovedOnes] = useState<LovedOne[]>([]);
  const [selectedLovedOne, setSelectedLovedOne] = useState<LovedOne | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const userDocRef = doc(db, 'users', user.uid);
    const unsubscribe = onSnapshot(userDocRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setLovedOnes(data.lovedOnes || []);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAiFlow = async (input: string, pastMessages: Message[]) => {
    if (!selectedLovedOne) {
      return { response: "I'm sorry, I don't have the information about your loved one." };
    }
    // Take the last 4 messages (2 user, 2 assistant) for context.
    const recentHistory = pastMessages.slice(-4);
    
    const response = await talkToLovedOne({
      lovedOne: {
        name: selectedLovedOne.name,
        relationship: selectedLovedOne.relationship,
        greeting: selectedLovedOne.greeting,
        characteristics: selectedLovedOne.characteristics,
      },
      userMessage: input,
      pastResponses: recentHistory,
    });
    // The ChatInterface component expects an object with a `response` property.
    return { response: response.aiResponse };
  };
  
  if (selectedLovedOne) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <ChatInterface
          title={`Chat with ${selectedLovedOne.name}`}
          description={`A simulated conversation with your ${selectedLovedOne.relationship}.`}
          initialMessage={selectedLovedOne.greeting || "Hello there, it's so good to hear from you."}
          aiFlow={handleAiFlow}
          headerContent={
            <Button variant="link" onClick={() => setSelectedLovedOne(null)} className="p-0 h-auto">
              Choose another person
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Card>
        <CardHeader>
          <CardTitle>Talk to a Loved One</CardTitle>
          <CardDescription>
            Select a loved one to start a simulated conversation. This can help you feel connected and reduce feelings of loneliness.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : lovedOnes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {lovedOnes.map((lovedOne) => (
                <Card key={lovedOne.id} className="flex flex-col">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User />
                            {lovedOne.name}
                        </CardTitle>
                        <CardDescription>{lovedOne.relationship}</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow">
                        <p className="text-sm text-muted-foreground line-clamp-3">{lovedOne.characteristics}</p>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" onClick={() => setSelectedLovedOne(lovedOne)}>
                            Start Chat
                        </Button>
                    </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <Users className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-semibold text-gray-900 dark:text-gray-100">No loved ones added yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">Get started by creating a profile for a loved one.</p>
            </div>
          )}
        </CardContent>
        <CardFooter>
            <Button asChild className="w-full">
                <Link href="/talk-to-loved-ones/manage">
                    <PlusCircle className="mr-2 h-4 w-4"/>
                    Manage Loved Ones
                </Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
