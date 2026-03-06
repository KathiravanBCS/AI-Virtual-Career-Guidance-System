import { useContext } from 'react';
import type { ReactNode } from 'react';

import { Center, Loader, Stack, Text } from '@mantine/core';
import { Navigate } from 'react-router-dom';

import { AuthContext } from './AuthProvider';

interface AuthGuardProps {
  children: ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const authContext = useContext(AuthContext);

  if (!authContext) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="lg" />
          <Text>Loading...</Text>
        </Stack>
      </Center>
    );
  }

  const { user, isLoading } = authContext;

  if (isLoading) {
    return (
      <Center h="100vh">
        <Stack align="center">
          <Loader size="lg" />
          <Text>Loading...</Text>
        </Stack>
      </Center>
    );
  }

  if (!user) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
}
