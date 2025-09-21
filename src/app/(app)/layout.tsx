'use client';

import { useEffect } from 'react';
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

const navItems = [
  { href: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/wellness-assistant', icon: BotMessageSquare, label: 'AI Assistant' },
  { href: '/relaxation-entertainment', icon: Sparkles, label: 'Relaxation & Entertainment' },
  { href: '/talk-to-loved-ones', icon: HeartHandshake, label: 'Talk to Loved Ones' },
  { href: '/appointments', icon: CalendarPlus, label: 'Appointments' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, loading, k10TestCompleted } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return; // Wait for auth state to load
    
    if (!user) {
      router.push('/');
      return;
    }

    // This is the single source of truth for redirection logic within the app.
    if (k10TestCompleted === false) {
        if (pathname !== '/k10-test' && pathname !== '/welcome/profile') {
             router.push('/k10-test');
        }
    } else if (k10TestCompleted === true) {
        if (pathname === '/k10-test') {
            router.push('/dashboard');
        }
    }

  }, [user, loading, k10TestCompleted, router, pathname]);

  // This loading state handles initial auth check and k10 status check.
  // It prevents rendering the layout for a split second before redirection.
  if (loading || k10TestCompleted === null || !user) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex items-center space-x-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-6 w-32" />
            </div>
        </div>
    );
  }

  // This protects against rendering the wrong page while redirecting.
  if (k10TestCompleted === false && pathname !== '/k10-test') {
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
