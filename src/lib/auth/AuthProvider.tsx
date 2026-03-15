import { createContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';

import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

import { auth, db } from '@/config/firebaseConfig';
import { ability } from '@/lib/casl/ability';
import { AbilityContext } from '@/lib/casl/AbilityContext';
import { loadPermissionsFromBackend } from '@/lib/casl/useCASLIntegration';

interface AuthProviderProps {
  children: ReactNode;
}

interface UserRole {
  uid: string;
  email?: string;
  role: string;
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
      console.log('[AuthProvider] Auth state changed. User:', firebaseUser?.email);

      if (firebaseUser) {
        try {
          console.log('[AuthProvider] Setting up authenticated user:', firebaseUser.email);

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
        } catch (error) {
          console.error('[AuthProvider] Error setting up Firestore user:', error);
          // Still set the user even if Firestore setup fails
          setUserRole({
            uid: firebaseUser.uid,
            email: firebaseUser.email || undefined,
            role: 'viewer',
          });
        }

        // Always set user after Firestore attempt (succeeds or fails)
        setUser(firebaseUser);

        // Load permissions from backend (ALWAYS try this, even if Firestore failed)
        console.log('[AuthProvider] About to load permissions...');
        try {
          const permResponse = await loadPermissionsFromBackend();
          console.log('[AuthProvider] Permissions loaded successfully:', permResponse);
        } catch (permissionError) {
          console.error('[AuthProvider] Failed to load permissions:', permissionError);
        }
      } else {
        console.log('[AuthProvider] User logged out');
        setUser(null);
        setUserRole(null);
      }

      setIsLoading(false);
    });

    return unsubscribe;
  }, []);

  return (
    <AuthContext.Provider value={{ user, userRole, isLoading }}>
      <AbilityContext.Provider value={ability as any}>{children}</AbilityContext.Provider>
    </AuthContext.Provider>
  );
}
