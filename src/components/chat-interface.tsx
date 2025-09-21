'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2, Send, Wind, HeartHandshake, CalendarPlus, Sparkles } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { ScrollArea } from './ui/scroll-area';
import Link from 'next/link';

type SuggestedAction = 'relaxation-entertainment' | 'talk-to-loved-ones' | 'appointments' | 'none';

export type Message = {
  role: 'user' | 'assistant';
  content: string;
  suggestedAction?: SuggestedAction;
};

type ChatInterfaceProps = {
  title: string;
  description: string;
  initialMessage: string;
  aiFlow: (input: string, pastMessages: Message[]) => Promise<any>;
  headerContent?: React.ReactNode;
};

const actionConfig = {
  'relaxation-entertainment': {
    href: '/relaxation-entertainment',
    label: 'Explore Relaxation & Entertainment',
    icon: <Sparkles className="mr-2 h-4 w-4" />,
  },
  'talk-to-loved-ones': {
    href: '/talk-to-loved-ones',
    label: 'Talk to a Loved One',
    icon: <HeartHandshake className="mr-2 h-4 w-4" />,
  },
  'appointments': {
    href: '/appointments',
    label: 'Book an Appointment',
    icon: <CalendarPlus className="mr-2 h-4 w-4" />,
  },
};

export function ChatInterface({ title, description, initialMessage, aiFlow, headerContent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([{ role: 'assistant', content: initialMessage }]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = scrollAreaRef.current?.querySelector<HTMLDivElement>(':scope > div');
    if (viewport) {
      viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage: Message = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const aiResult = await aiFlow(input, newMessages);
      const aiMessage: Message = {
        role: 'assistant',
        content: aiResult.response,
        suggestedAction: aiResult.suggestedAction !== 'none' ? aiResult.suggestedAction : undefined,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error(error);
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };

  return (
    <Card className="flex flex-col h-full max-h-[calc(100vh-8rem)] w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
        {headerContent}
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden">
        <ScrollArea className="h-full pr-4" ref={scrollAreaRef}>
          <div className="space-y-4">
            {messages.map((message, index) => {
              const action = message.suggestedAction && actionConfig[message.suggestedAction];
              return (
                <div
                  key={index}
                  className={cn('flex items-start gap-3', message.role === 'user' ? 'justify-end' : '')}
                >
                  {message.role === 'assistant' && (
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>AI</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex flex-col gap-2 items-start">
                    <div
                      className={cn(
                        'max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 text-sm',
                        message.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-secondary-foreground'
                      )}
                    >
                      {message.content}
                    </div>
                    {action && (
                      <Button asChild variant="outline" size="sm" className="max-w-xs md:max-w-md lg:max-w-lg">
                        <Link href={action.href}>
                          {action.icon}
                          {action.label}
                        </Link>
                      </Button>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.photoURL || ''} />
                      <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
            {loading && (
              <div className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div className="bg-secondary rounded-lg px-4 py-2 text-sm flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin"/>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
