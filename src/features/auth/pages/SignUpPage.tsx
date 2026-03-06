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
import { IconArrowRight, IconBrandGoogle, IconLock, IconMail, IconUser } from '@tabler/icons-react';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

import { auth } from '@/config/firebaseConfig';
import { useCreateUser } from '@/features/users/api/users/useCreateUser';

export const SignUpPage: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const createUserMutation = useCreateUser();

  // Helper function to create user in database
  const createUserInDB = async (firebaseUser: any, fname: string, lname: string) => {
    if (!firebaseUser.email) return;

    const userData: any = {
      email: firebaseUser.email,
      first_name: fname || firebaseUser.displayName?.split(' ')[0] || '',
      last_name: lname || firebaseUser.displayName?.split(' ')[1] || '',
      phone: '',
      location: '',
      profile_picture_url: firebaseUser.photoURL || '',
      password: '',
      role_id: 2,
    };

    try {
      await createUserMutation.mutateAsync(userData);
    } catch (err) {
      console.error('[AUTH] Failed to create user profile:', err);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!firstName || !lastName || !email || !password || !confirmPassword) {
        setError('Please fill in all fields');
        setLoading(false);
        return;
      }

      if (password !== confirmPassword) {
        setError('Passwords do not match');
        setLoading(false);
        return;
      }

      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      const result = await createUserWithEmailAndPassword(auth, email, password);

      // Update profile with display name
      await updateProfile(result.user, {
        displayName: `${firstName} ${lastName}`,
      });

      await createUserInDB(result.user, firstName, lastName);

      notifications.show({
        title: 'Success',
        message: 'Account created successfully!',
        color: 'green',
      });

      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Sign up failed. Please try again.';
      setError(errorMessage);
      notifications.show({
        title: 'Sign Up Failed',
        message: errorMessage,
        color: 'red',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setError('');
    setLoading(true);

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      const nameParts = result.user.displayName?.split(' ') || ['', ''];
      await createUserInDB(result.user, nameParts[0], nameParts[1]);

      notifications.show({
        title: 'Success',
        message: 'Account created successfully!',
        color: 'green',
      });

      navigate('/dashboard');
    } catch (err: any) {
      const errorMessage = err.message || 'Google sign up failed. Please try again.';
      setError(errorMessage);
      notifications.show({
        title: 'Sign Up Failed',
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
              🚀 Get Started
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
                Create Account
              </Title>
              <Text size="lg" c="dimmed">
                Start your learning journey today
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

                {/* Google Sign Up */}
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} style={{ width: '100%' }}>
                  <Button
                    onClick={handleGoogleSignUp}
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
                  label="Or sign up with email"
                  labelPosition="center"
                  style={{
                    borderColor: 'rgba(255, 157, 84, 0.2)',
                  }}
                />

                {/* Form */}
                <form onSubmit={handleSignUp} style={{ width: '100%' }}>
                  <Stack gap="md">
                    {/* Name Fields */}
                    <Group grow>
                      <div>
                        <Text size="sm" fw={500} mb="6px">
                          First Name
                        </Text>
                        <TextInput
                          placeholder="John"
                          value={firstName}
                          onChange={(e) => setFirstName(e.currentTarget.value)}
                          disabled={loading}
                          leftSection={<IconUser size={16} />}
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
                      <div>
                        <Text size="sm" fw={500} mb="6px">
                          Last Name
                        </Text>
                        <TextInput
                          placeholder="Doe"
                          value={lastName}
                          onChange={(e) => setLastName(e.currentTarget.value)}
                          disabled={loading}
                          leftSection={<IconUser size={16} />}
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
                    </Group>

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

                    {/* Confirm Password */}
                    <div>
                      <Text size="sm" fw={500} mb="6px">
                        Confirm Password
                      </Text>
                      <PasswordInput
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.currentTarget.value)}
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

                    {/* Sign Up Button */}
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
                        Create Account
                      </Button>
                    </motion.div>
                  </Stack>
                </form>

                {/* Sign In Link */}
                <Center>
                  <Text size="sm" c="dimmed">
                    Already have an account?{' '}
                    <Button
                      variant="subtle"
                      size="xs"
                      component={Link}
                      to="/login"
                      style={{
                        color: '#ff9d54',
                        fontWeight: 600,
                        padding: 0,
                        height: 'auto',
                      }}
                    >
                      Sign In
                    </Button>
                  </Text>
                </Center>
              </Stack>
            </Box>

            {/* Terms */}
            <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default SignUpPage;
