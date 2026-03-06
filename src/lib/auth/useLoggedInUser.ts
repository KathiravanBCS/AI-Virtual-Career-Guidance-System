import { useQuery } from '@tanstack/react-query';

import type { User } from '@/features/users/types';
import { api } from '@/lib/api';

import { useAuth } from './useAuth';

interface UseLoggedInUserReturn {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Hook to get the currently logged-in user's complete profile from the database
 * Matches the authenticated user's email with the database user records
 */
export function useLoggedInUser(): UseLoggedInUserReturn {
  const { user: authUser, isLoading: authLoading } = useAuth();

  const {
    data: users = [],
    isLoading: usersLoading,
    error,
  } = useQuery({
    queryKey: ['users'],
    queryFn: async () => {
      const allUsers = await api.users.getAll();
      return allUsers;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!authUser, // Only fetch when user is authenticated
  });

  // Find the logged-in user in the database by matching email
  const loggedInUser =
    authUser && users.length > 0 ? users.find((dbUser: User) => dbUser.email === authUser.email) || null : null;

  return {
    user: loggedInUser,
    isLoading: authLoading || usersLoading,
    error: error as Error | null,
  };
}
