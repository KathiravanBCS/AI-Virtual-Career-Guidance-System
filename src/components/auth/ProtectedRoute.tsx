import { ReactNode } from 'react';

import { Center, Stack, Text } from '@mantine/core';
import { Navigate, useLocation } from 'react-router-dom';

import { useAbility } from '@/lib/casl/useAbility';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredAction: string;
  requiredSubject: string;
  redirectTo?: string;
}

export function ProtectedRoute({ children, requiredAction, requiredSubject, redirectTo = '/' }: ProtectedRouteProps) {
  const ability = useAbility();
  const location = useLocation();

  if (!ability.can(requiredAction, requiredSubject)) {
    // Check if redirectTo is set, otherwise show 403 message
    if (redirectTo) {
      return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return (
      <Center h="100vh">
        <Stack align="center">
          <Text size="lg" fw={500}>
            Access Denied
          </Text>
          <Text c="dimmed">
            You don't have permission to {requiredAction} {requiredSubject}
          </Text>
        </Stack>
      </Center>
    );
  }

  return <>{children}</>;
}

/**
 * Example Usage in Router:
 *
 * {
 *   path: 'settings',
 *   element: (
 *     <ProtectedRoute
 *       requiredAction="manage"
 *       requiredSubject="Settings"
 *       redirectTo="/"
 *     >
 *       <SettingsPage />
 *     </ProtectedRoute>
 *   ),
 * }
 */
