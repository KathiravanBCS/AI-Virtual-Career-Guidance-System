import { useState } from 'react';

import { Button, Group, Modal, PasswordInput, Stack, TextInput } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { GithubAuthProvider, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';

import { auth } from '@/config/firebaseConfig';
import { useCreateUser } from '@/features/users/api/users/useCreateUser';
import type { CreateUserRequest } from '@/features/users/types';

export function LoginButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const createUserMutation = useCreateUser();

  // Helper function to create user after successful Firebase login
  const createUserInDB = async (firebaseUser: any) => {
    if (!firebaseUser.email) return;

    // Parse display name into first and last name
    const [firstName = '', lastName = ''] = firebaseUser.displayName?.split(' ') || ['', ''];

    const userData: CreateUserRequest = {
      email: firebaseUser.email,
      first_name: firstName,
      last_name: lastName,
      phone: '',
      location: '',
      profile_picture_url: firebaseUser.photoURL || '',
      password: '', // Password is handled by Firebase
      role_id: 2, // Default user role
    };

    try {
      await createUserMutation.mutateAsync(userData);
    } catch (error) {
      // Error handling is done in the mutation
      console.error('[AUTH] Failed to create user profile:', error);
    }
  };

  const handleEmailLogin = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Create user in database after successful Firebase login
      await createUserInDB(result.user);
      setIsOpen(false);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      notifications.show({
        title: 'Login Failed',
        message: error.message,
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Create user in database after successful Firebase login
      await createUserInDB(result.user);
      setIsOpen(false);
    } catch (error: any) {
      notifications.show({
        title: 'Login Failed',
        message: error.message,
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGithubLogin = async () => {
    try {
      setIsLoading(true);
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      // Create user in database after successful Firebase login
      await createUserInDB(result.user);
      setIsOpen(false);
    } catch (error: any) {
      notifications.show({
        title: 'Login Failed',
        message: error.message,
        color: 'red',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)} variant="filled">
        Sign In
      </Button>

      <Modal opened={isOpen} onClose={() => setIsOpen(false)} title="Sign In to Career Guidance System" centered>
        <Stack gap="md">
          <TextInput
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            disabled={isLoading}
          />
          <PasswordInput
            label="Password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            disabled={isLoading}
          />

          <Button onClick={handleEmailLogin} fullWidth loading={isLoading} variant="filled">
            Sign In with Email
          </Button>

          <Group grow>
            <Button onClick={handleGoogleLogin} loading={isLoading} variant="default">
              Google
            </Button>
            <Button onClick={handleGithubLogin} loading={isLoading} variant="default">
              GitHub
            </Button>
          </Group>
        </Stack>
      </Modal>
    </>
  );
}
