'use client';

import { auth, db } from '@/lib/firebase/client';
import { signOut, deleteUser } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/use-auth';
import { LogOut, User as UserIcon, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { DeleteAccountDialog } from './delete-account-dialog';
import { doc, deleteDoc } from 'firebase/firestore';

export function UserNav() {
  const { user } = useAuth();
  const router = useRouter();
  const [isDeleteAccountDialogOpen, setIsDeleteAccountDialogOpen] = useState(false);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return names[0][0] + names[names.length - 1][0];
    }
    return name.substring(0, 2);
  };
  
  const handleDeleteAccount = async () => {
    if (!user) return;
    try {
        const userDocRef = doc(db, 'users', user.uid);
        await deleteDoc(userDocRef);
        await deleteUser(user);
        router.push('/');
    } catch (error) {
        console.error("Error deleting account", error);
        // Handle specific errors like 'auth/requires-recent-login'
    }
  }

  return (
    <>
        <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
                <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                <AvatarFallback>{getInitials(user?.displayName)}</AvatarFallback>
            </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
            <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.displayName || 'Welcome'}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
            <DropdownMenuItem disabled>
                <UserIcon className="mr-2 h-4 w-4" />
                <span>Profile</span>
            </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
                className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                onClick={() => setIsDeleteAccountDialogOpen(true)}
            >
                <Trash2 className="mr-2 h-4 w-4" />
                <span>Delete Account</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
        </DropdownMenu>
        <DeleteAccountDialog
            isOpen={isDeleteAccountDialogOpen}
            onOpenChange={setIsDeleteAccountDialogOpen}
            onConfirm={handleDeleteAccount}
        />
    </>
  );
}
