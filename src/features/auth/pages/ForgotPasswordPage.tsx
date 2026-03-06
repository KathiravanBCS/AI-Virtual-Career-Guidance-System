import { useState } from 'react';

import { Badge, Box, Button, Center, Container, Stack, Text, TextInput, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft, IconCircleCheck, IconMail } from '@tabler/icons-react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

import { auth } from '@/config/firebaseConfig';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email) {
        setError('Please enter your email address');
        setLoading(false);
        return;
      }

      await sendPasswordResetEmail(auth, email);

      setSubmitted(true);
      notifications.show({
        title: 'Success',
        message: 'Password reset email sent! Check your inbox.',
        color: 'green',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to send reset email. Please try again.';
      setError(errorMessage);
      notifications.show({
        title: 'Error',
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
            {/* Back Button */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              style={{ width: '100%' }}
            >
              <Button
                variant="subtle"
                size="sm"
                component={Link}
                to="/login"
                leftSection={<IconArrowLeft size={16} />}
                style={{
                  color: '#ff9d54',
                  fontWeight: 600,
                }}
              >
                Back to Sign In
              </Button>
            </motion.div>

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
              🔐 Reset Password
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
                Forgot Password?
              </Title>
              <Text size="lg" c="dimmed">
                Don't worry, we'll help you get back into your account
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
                {!submitted ? (
                  <>
                    {/* Helper Text */}
                    <Text size="sm" c="dimmed" style={{ textAlign: 'center' }}>
                      Enter the email address associated with your account and we'll send you a link to reset your
                      password.
                    </Text>

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

                    {/* Form */}
                    <form onSubmit={handleResetPassword} style={{ width: '100%' }}>
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

                        {/* Submit Button */}
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
                          >
                            Send Reset Link
                          </Button>
                        </motion.div>
                      </Stack>
                    </form>
                  </>
                ) : (
                  <>
                    {/* Success Message */}
                    <Center>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <IconCircleCheck size={64} style={{ color: '#51cf66', marginBottom: '16px' }} />
                      </motion.div>
                    </Center>

                    <Stack gap="md" align="center">
                      <div style={{ textAlign: 'center' }}>
                        <Title order={3} style={{ marginBottom: '8px', color: '#51cf66' }}>
                          Email Sent!
                        </Title>
                        <Text size="sm" c="dimmed">
                          We've sent a password reset link to <strong>{email}</strong>
                        </Text>
                      </div>

                      <Box
                        style={{
                          backgroundColor: 'rgba(81, 207, 102, 0.1)',
                          border: '1px solid rgba(81, 207, 102, 0.2)',
                          borderRadius: '8px',
                          padding: '12px',
                          textAlign: 'center',
                          width: '100%',
                        }}
                      >
                        <Text size="xs" c="dimmed">
                          Check your email inbox and spam folder. The link will expire in 24 hours.
                        </Text>
                      </Box>

                      <Button
                        component={Link}
                        to="/login"
                        fullWidth
                        size="lg"
                        style={{
                          background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
                          color: 'white',
                          fontWeight: 600,
                          boxShadow: '0 10px 30px rgba(255, 157, 84, 0.25)',
                          marginTop: '12px',
                        }}
                      >
                        Back to Sign In
                      </Button>
                    </Stack>
                  </>
                )}
              </Stack>
            </Box>

            {/* Help Text */}
            <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
              Didn't receive the email?{' '}
              <Button
                variant="subtle"
                size="xs"
                onClick={handleResetPassword}
                disabled={loading || submitted}
                style={{
                  color: '#ff9d54',
                  fontWeight: 600,
                  padding: 0,
                  height: 'auto',
                }}
              >
                Try again
              </Button>
            </Text>
          </Stack>
        </motion.div>
      </Container>
    </Box>
  );
};

export default ForgotPasswordPage;
