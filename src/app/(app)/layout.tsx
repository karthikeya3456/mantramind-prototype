'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/components/logo';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarFooter
} from '@/components/ui/sidebar';
import { 
    LayoutDashboard, 
    BotMessageSquare, 
    Wind, 
    Youtube, 
    HeartHandshake, 
    CalendarPlus,
    Sparkles
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { usePathname } from 'next/navigation';
import { UserNav } from '@/components/user-nav';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/client';


const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/wellness-assistant', icon: BotMessageSquare, label: 'AI Assistant' },
  { href: '/relaxation-entertainment', icon: Sparkles, label: 'Relaxation & Entertainment' },
  { href: '/talk-to-loved-ones', icon: HeartHandshake, label: 'Talk to Loved Ones' },
  { href: '/appointments', icon: CalendarPlus, label: 'Appointments' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [testCompleted, setTestCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/');
      return;
    }

    const checkTestCompletion = async () => {
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const hasCompletedTest = userDoc.exists() && !!userDoc.data().k10?.answers;
        setTestCompleted(hasCompletedTest);

        if (pathname === '/k10-test' && hasCompletedTest) {
          router.push('/dashboard');
        } else if (!hasCompletedTest && pathname !== '/k10-test' && pathname !== '/welcome/profile') {
           // If test is not completed, they should be on k10-test page or profile page.
           // This prevents access to other pages before completing the test.
           router.push('/k10-test');
        }
      }
    };

    checkTestCompletion();

  }, [user, loading, router, pathname]);

  if (loading || testCompleted === null || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-32" />
            </div>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
            <div className="p-2">
                 <Logo />
            </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={{
                    children: item.label,
                  }}
                >
                  <a href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            {/* Can add footer items here if needed */}
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 sm:px-6">
            <SidebarTrigger className="md:hidden"/>
            <div className="flex-1">
                <h1 className="text-lg font-semibold font-headline">
                    {navItems.find(item => item.href === pathname)?.label || 'MantraMind'}
                </h1>
            </div>
            <UserNav />
        </header>
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
