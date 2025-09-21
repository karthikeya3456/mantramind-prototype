'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import {
  BotMessageSquare,
  Sparkles,
  HeartHandshake,
  CalendarPlus,
  ArrowRight,
} from 'lucide-react';

const features = [
  {
    title: 'AI Assistant',
    description: 'Chat with our wellness bot.',
    href: '/wellness-assistant',
    icon: BotMessageSquare,
  },
  {
    title: 'Relax & Entertain',
    description: 'Music, videos, and more.',
    href: '/relaxation-entertainment',
    icon: Sparkles,
  },
  {
    title: 'Talk to Loved Ones',
    description: 'Simulate a chat with loved ones.',
    href: '/talk-to-loved-ones',
    icon: HeartHandshake,
  },
  {
    title: 'Appointments',
    description: 'Book a session with a professional.',
    href: '/appointments',
    icon: CalendarPlus,
  },
];

export default function DashboardPage() {
  const { user } = useAuth();
  const firstName = user?.displayName?.split(' ')[0];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold font-headline">
          Welcome back, {firstName || 'User'}!
        </h1>
        <p className="text-muted-foreground">How are you feeling today? Here are some tools to support you.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature) => (
            <Link href={feature.href} key={feature.title} className="group">
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col">
                <CardHeader>
                    <CardTitle className="flex items-start justify-between text-xl font-headline">
                        <div className="flex items-center gap-3">
                            <feature.icon className="h-6 w-6" />
                            {feature.title}
                        </div>
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
      </div>
    </div>
  );
}
