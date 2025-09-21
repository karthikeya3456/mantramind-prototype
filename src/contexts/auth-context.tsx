'use client';

import React, { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  k10TestCompleted: boolean | null;
  refreshK10Status: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  k10TestCompleted: null,
  refreshK10Status: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [k10TestCompleted, setK10TestCompleted] = useState<boolean | null>(null);

  const checkK10Status = useCallback(async (currentUser: User | null) => {
    if (currentUser) {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userDocRef);
      const hasCompletedTest = userDoc.exists() && !!userDoc.data().k10?.answers;
      setK10TestCompleted(hasCompletedTest);
    } else {
      setK10TestCompleted(null);
    }
  }, []);
  
  const refreshK10Status = useCallback(async () => {
    if (user) {
        await checkK10Status(user);
    }
  }, [user, checkK10Status]);


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      await checkK10Status(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [checkK10Status]);

  return (
    <AuthContext.Provider value={{ user, loading, k10TestCompleted, refreshK10Status }}>
      {children}
    </AuthContext.Provider>
  );
};
