'use client';

import { useState } from 'react';
import { ChatInterface } from '@/components/chat-interface';
import { talkToLovedOne } from '@/ai/flows/talk-to-loved-ones-ai';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';

const formSchema = z.object({
  description: z.string().min(50, 'Please provide a detailed description (at least 50 characters).'),
});
type FormData = z.infer<typeof formSchema>;

export default function TalkToLovedOnesPage() {
  const [lovedOneDescription, setLovedOneDescription] = useState('');
  const [isChatting, setIsChatting] = useState(false);
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0] || 'User';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    setLovedOneDescription(data.description);
    setIsChatting(true);
  };

  const handleAiFlow = async (input: string) => {
    const response = await talkToLovedOne({
      lovedOneDescription,
      userMessage: input,
    });
    return response.aiResponse;
  };

  if (isChatting) {
    return (
      <div className="mx-auto w-full max-w-3xl">
        <ChatInterface
          title="Talk to Your Loved One"
          description="A simulated conversation to help you feel connected."
          initialMessage="Hello there, it's so good to hear from you."
          aiFlow={handleAiFlow}
          headerContent={
            <Button variant="link" onClick={() => setIsChatting(false)} className="p-0 h-auto">
              Change description
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Talk to a Loved One</CardTitle>
          <CardDescription>
            To help you feel less lonely, describe a loved one (a family member, friend, or even a pet) you'd like to talk to. The AI will simulate a conversation with them based on your description.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <Label htmlFor="description">Describe your loved one</Label>
              <Textarea
                id="description"
                placeholder="e.g., 'My grandmother was a kind and gentle soul. She always gave the best advice and had a great sense of humor. She loved baking and would often say things like 'A little bit of sugar makes everything better'. She had a soft, comforting voice...'"
                className="min-h-[150px]"
                {...register('description')}
              />
              {errors.description && <p className="text-sm text-destructive mt-1">{errors.description.message}</p>}
            </div>
            <Button type="submit">Start Chatting</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
