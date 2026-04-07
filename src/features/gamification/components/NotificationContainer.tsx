import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Box,
  Text,
  ActionIcon,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconStar, IconX } from '@tabler/icons-react';
import { useNotification } from '../context/NotificationContext';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const p6 = theme.colors[primary][6];
  const p5 = theme.colors[primary][5];
  const p8 = theme.colors[primary][8];
  const p9 = theme.colors[primary][9];

  const bgGradient = dark
    ? `linear-gradient(135deg, ${p9}ee 0%, ${p8}ee 100%)`
    : `linear-gradient(135deg, ${p6} 0%, ${p5} 100%)`;

  const borderClr  = dark ? p6 : theme.colors[primary][4];
  const textClr    = 'white';
  const subTextClr = dark ? theme.colors.gray[2] : 'rgba(255,255,255,0.85)';
  const shadowStr  = dark
    ? `0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px ${p8}80`
    : `0 20px 60px rgba(0,0,0,0.18), 0 0 0 1px ${p5}40`;

  return (
    <Box
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        pointerEvents: 'none',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: theme.spacing.md,
      }}
    >
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, scale: 0.75, y: -30 }}
            animate={{ opacity: 1, scale: 1,    y: 0   }}
            exit  ={{ opacity: 0, scale: 0.75, y: 30  }}
            transition={{ type: 'spring', stiffness: 320, damping: 26, duration: 0.35 }}
            style={{ pointerEvents: 'auto', width: '100%' }}
          >
            <Box
              style={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: theme.spacing.sm,
                padding: `${theme.spacing.xl} ${theme.spacing.xl}`,
                background: bgGradient,
                border: `1.5px solid ${borderClr}`,
                borderRadius: theme.radius.xl,
                boxShadow: shadowStr,
                color: textClr,
                minWidth: 300,
                maxWidth: 380,
                textAlign: 'center',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
              }}
            >
              {/* Star icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
              >
                <ThemeIcon
                  size={64}
                  radius="xl"
                  style={{
                    background: 'rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <IconStar size={32} stroke={1.8} fill="currentColor" />
                </ThemeIcon>
              </motion.div>

              {/* Message */}
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ width: '100%' }}
              >
                <Text fw={700} size="lg" c={textClr} mb={4} lh={1.2}>
                  {notification.message}
                </Text>
                <Text fw={600} size="xl" c={textClr} style={{ fontVariantNumeric: 'tabular-nums' }}>
                  +{notification.points} pts
                </Text>
              </motion.div>

              {/* Motivational sub-text */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Text size="sm" c={subTextClr} fs="italic">
                  Keep up the great work! 🎉
                </Text>
              </motion.div>

              {/* Close button */}
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                style={{ position: 'absolute', top: 10, right: 10 }}
              >
                <ActionIcon
                  variant="subtle"
                  color="white"
                  radius="xl"
                  size="md"
                  onClick={() => removeNotification(notification.id)}
                  style={{ color: 'white', '--ai-hover': 'rgba(255,255,255,0.2)' }}
                >
                  <IconX size={16} stroke={2.5} />
                </ActionIcon>
              </motion.div>
            </Box>
          </motion.div>
        ))}
      </AnimatePresence>
    </Box>
  );
};

export default NotificationContainer;