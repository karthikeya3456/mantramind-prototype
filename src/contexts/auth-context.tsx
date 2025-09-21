'use client';

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '@/lib/firebase/client';
import { doc, getDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  k10TestCompleted: boolean | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  k10TestCompleted: null,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [k10TestCompleted, setK10TestCompleted] = useState<boolean | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // User is signed in, check for K-10 test completion.
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        const hasCompletedTest = userDoc.exists() && !!userDoc.data().k10?.answers;
        setK10TestCompleted(hasCompletedTest);
      } else {
        // User is signed out.
        setK10TestCompleted(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, k10TestCompleted }}>
      {children}
    </AuthContext.Provider>
  );
};
