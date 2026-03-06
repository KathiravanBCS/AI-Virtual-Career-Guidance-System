import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/config/firebaseConfig';
import { defineAbility, type UserRole } from '@/lib/casl/ability';
import { AbilityContext } from '@/lib/casl/AbilityContext';

interface AuthProviderProps {
  children: ReactNode;
}

interface AuthContextValue {
  user: User | null;
  userRole: UserRole | null;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
AuthContext.displayName = 'AuthContext';

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Fetch or create user role from Firestore
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            const role: UserRole = {
              uid: firebaseUser.uid,
              email: firebaseUser.email || undefined,
              role: userData.role || 'viewer',
            };
            setUserRole(role);
          } else {
            // Create default user doc if it doesn't exist
            const defaultUserData = {
              uid: firebaseUser.uid,
              email: firebaseUser.email,
              displayName: firebaseUser.displayName || '',
              role: 'viewer',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };
            await setDoc(userDocRef, defaultUserData);

            setUserRole({
              uid: firebaseUser.uid,
              email: firebaseUser.email || undefined,
              role: 'viewer',
            });
          }

          setUser(firebaseUser);
        } catch (error) {
          console.error('Error setting up user:', error);
          // Still set the user even if Firestore setup fails
          setUser(firebaseUser);
          setUserRole({
            uid: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            role: 'viewer',
          });
        }
      } else {
        setUser(null);
        setUserRole(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  const ability = defineAbility(userRole);

  return (
    <AuthContext.Provider value={{ user, userRole, isLoading }}>
      <AbilityContext.Provider value={ability as any}>{children}</AbilityContext.Provider>
    </AuthContext.Provider>
  );
}
