'use client';

import { useAuth } from '@/hooks/use-auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import {
  LayoutDashboard,
  ClipboardCheck,
  BotMessageSquare,
  Wind,
  Youtube,
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
    image_id: 'dashboard-assistant',
  },
  {
    title: 'Relaxation',
    description: 'Calming music and meditation.',
    href: '/relax',
    icon: Wind,
    image_id: 'dashboard-relax',
  },
  {
    title: 'Entertainment',
    description: 'Uplifting videos and podcasts.',
    href: '/entertainment',
    icon: Youtube,
    image_id: 'dashboard-entertainment',
  },
  {
    title: 'Talk to Loved Ones',
    description: 'Simulate a chat with loved ones.',
    href: '/talk-to-loved-ones',
    icon: HeartHandshake,
    image_id: 'dashboard-loved-ones',
  },
  {
    title: 'Appointments',
    description: 'Book a session with a professional.',
    href: '/appointments',
    icon: CalendarPlus,
    image_id: 'dashboard-appointments',
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

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => {
          const image = PlaceHolderImages.find((img) => img.id === feature.image_id);
          return (
            <Link href={feature.href} key={feature.title} className="group">
              <Card className="h-full overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <CardHeader className="p-0">
                  {image && (
                    <div className="aspect-video overflow-hidden">
                      <Image
                        src={image.imageUrl}
                        alt={image.description}
                        width={600}
                        height={400}
                        data-ai-hint={image.imageHint}
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <div className="p-6 pb-2">
                    <CardTitle className="flex items-center justify-between text-xl font-headline">
                      {feature.title}
                      <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:translate-x-1" />
                    </CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
