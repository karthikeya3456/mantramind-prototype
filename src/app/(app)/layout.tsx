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
    // Wait for auth state and k10 status to be fully loaded
    if (loading || k10TestCompleted === null) return;
    
    if (!user) {
      router.push('/');
      return;
    }

    // This is now the single source of truth for redirection logic within the app.
    // It runs only after we are sure about the user's k10TestCompleted status.
    if (k10TestCompleted === false) {
        // If the test is not completed, the user MUST be on the k10 test page,
        // or the profile page (for new users).
        if (pathname !== '/k10-test' && pathname !== '/welcome/profile') {
             router.push('/k10-test');
        }
    } else if (k10TestCompleted === true) {
        // If the test IS completed, the user should NOT be on the k10 test page.
        // Redirect them away if they try to access it.
        if (pathname === '/k10-test') {
            router.push('/wellness-assistant');
        }
    }

  }, [user, loading, k10TestCompleted, router, pathname]);

  // This loading state handles the initial check for auth and k10 status.
  // It prevents rendering a page for a split second before the correct redirection occurs.
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
  
  // This is an additional safeguard to prevent rendering the wrong page while redirecting.
  // If the logic above has determined a redirect is needed, this will show a loader
  // until the redirect completes.
  if (k10TestCompleted === false && pathname !== '/k10-test' && pathname !== '/welcome/profile') {
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
