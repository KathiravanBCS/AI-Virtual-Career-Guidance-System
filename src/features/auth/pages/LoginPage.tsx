import { useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Center,
  Container,
  Divider,
  Group,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowRight, IconBrandGoogle, IconLock, IconMail } from '@tabler/icons-react';
import { GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import { auth } from '@/config/firebaseConfig';
import { useCreateUser } from '@/features/users/api/users/useCreateUser';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const createUserMutation = useCreateUser();

  // Helper function to create user after successful Firebase login
  const createUserInDB = async (firebaseUser: any) => {
    if (!firebaseUser.email) return;

    // Parse display name into first and last name
    const [firstName = '', lastName = ''] = firebaseUser.displayName?.split(' ') || ['', ''];

    const userData: any = {
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
    } catch (err) {
      console.error('[AUTH] Failed to create user profile:', err);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      const result = await signInWithEmailAndPassword(auth, email, password);
      await createUserInDB(result.user);

      notifications.show({
        title: 'Success',
        message: 'Logged in successfully!',
        color: 'green',
      });

      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed. Please try again.';
      setError(errorMessage);
      notifications.show({
        title: 'Login Failed',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await createUserInDB(result.user);

      notifications.show({
        title: 'Success',
        message: 'Logged in successfully!',
        color: 'green',
      });

      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Google login failed. Please try again.';
      setError(errorMessage);
      notifications.show({
        title: 'Login Failed',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      style={{
        backgroundColor: '#1c1b1b',
        color: 'white',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background gradient blobs */}
      <Box
        style={{
          position: 'absolute',
          top: '20%',
          left: '-100px',
          width: '400px',
          height: '400px',
          backgroundColor: 'rgba(255, 157, 84, 0.1)',
          borderRadius: '9999px',
          filter: 'blur(96px)',
          zIndex: 0,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '-100px',
          width: '500px',
          height: '500px',
          backgroundColor: 'rgba(255, 138, 48, 0.08)',
          borderRadius: '9999px',
          filter: 'blur(96px)',
          zIndex: 0,
        }}
      />

      <Container size="xs" style={{ position: 'relative', zIndex: 10 }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <Stack align="center" gap="lg">
            {/* Badge */}
            <Badge
              variant="light"
              size="lg"
              style={{
                backgroundColor: 'rgba(42, 42, 42, 0.8)',
                border: '1px solid rgba(255, 157, 84, 0.3)',
                color: '#ff9d54',
              }}
            >
              ✨ Welcome Back
            </Badge>

            {/* Title */}
            <div style={{ textAlign: 'center' }}>
              <Title
                order={1}
                style={{
                  fontSize: '42px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Sign In to GM-AICG
              </Title>
              <Text size="lg" c="dimmed">
                Continue your learning journey
              </Text>
            </div>

            {/* Card */}
            <Box
              style={{
                width: '100%',
                backgroundColor: 'rgba(42, 42, 42, 0.5)',
                border: '1px solid rgba(58, 58, 58, 0.8)',
                borderRadius: '16px',
                padding: '32px',
                backdropFilter: 'blur(10px)',
              }}
            >
              <Stack gap="lg">
                {/* Error message */}
                {error && (
                  <Box
                    style={{
                      backgroundColor: 'rgba(255, 82, 82, 0.1)',
                      border: '1px solid rgba(255, 82, 82, 0.3)',
                      borderRadius: '8px',
                      padding: '12px',
                      color: '#ff5252',
                      fontSize: '14px',
                      textAlign: 'center',
                    }}
                  >
                    {error}
                  </Box>
                )}

                {/* Google Login */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%' }}>
                  <Button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    fullWidth
                    size="lg"
                    variant="subtle"
                    leftSection={<IconBrandGoogle size={20} />}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      color: 'white',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                      e.currentTarget.style.borderColor = 'rgba(255, 157, 84, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    }}
                  >
                    Continue with Google
                  </Button>
                </motion.div>

                {/* Divider */}
                <Divider
                  label="Or continue with email"
                  labelPosition="center"
                  style={{
                    borderColor: 'rgba(255, 157, 84, 0.2)',
                  }}
                />

                {/* Form */}
                <form onSubmit={handleEmailLogin} style={{ width: '100%' }}>
                  <Stack gap="md">
                    {/* Email */}
                    <div>
                      <Text size="sm" fw={500} mb="6px">
                        Email Address
                      </Text>
                      <TextInput
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.currentTarget.value)}
                        disabled={loading}
                        leftSection={<IconMail size={16} />}
                        style={{
                          marginBottom: '12px',
                        }}
                        styles={{
                          input: {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            '&:focus': {
                              borderColor: '#ff9d54',
                              backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            },
                            '&::placeholder': {
                              color: 'rgba(255, 255, 255, 0.4)',
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Password */}
                    <div>
                      <Text size="sm" fw={500} mb="6px">
                        Password
                      </Text>
                      <PasswordInput
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.currentTarget.value)}
                        disabled={loading}
                        leftSection={<IconLock size={16} />}
                        visibilityToggleButtonProps={{
                          style: { color: '#ff9d54' },
                        }}
                        styles={{
                          input: {
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '14px',
                            transition: 'all 0.3s ease',
                            '&:focus': {
                              borderColor: '#ff9d54',
                              backgroundColor: 'rgba(255, 255, 255, 0.12)',
                            },
                            '&::placeholder': {
                              color: 'rgba(255, 255, 255, 0.4)',
                            },
                          },
                        }}
                      />
                    </div>

                    {/* Forgot Password */}
                    <Group justify="flex-end">
                      <Button
                        variant="subtle"
                        size="xs"
                        component={Link}
                        to="/forgot-password"
                        style={{ color: '#ff9d54', fontWeight: 600 }}
                      >
                        Forgot Password?
                      </Button>
                    </Group>

                    {/* Sign In Button */}
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%' }}>
                      <Button
                        type="submit"
                        fullWidth
                        size="lg"
                        loading={loading}
                        disabled={loading}
                        style={{
                          background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
                          color: 'white',
                          fontWeight: 600,
                          boxShadow: '0 10px 30px rgba(255, 157, 84, 0.25)',
                          marginTop: '12px',
                        }}
                        rightSection={<IconArrowRight size={18} />}
                      >
                        Sign In
                      </Button>
                    </motion.div>
                  </Stack>
                </form>

                {/* Sign Up Link */}
                <Center>
                  <Text size="sm" c="dimmed">
                    Don't have an account?{' '}
                    <Button
                      variant="subtle"
                      size="xs"
                      component={Link}
                      to="/signup"
                      style={{
                        color: '#ff9d54',
                        fontWeight: 600,
                        padding: 0,
                        height: 'auto',
                      }}
                    >
                      Create Account
                    </Button>
                  </Text>
                </Center>
              </Stack>
            </Box>

            {/* Terms */}
            <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
              By signing in, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default LoginPage;
