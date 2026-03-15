import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { IconStar, IconX } from '@tabler/icons-react';
import { useMantineTheme, useMantineColorScheme } from '@mantine/core';
import { useNotification } from '../context/NotificationContext';

const NotificationContainer: React.FC = () => {
  const { notifications, removeNotification } = useNotification();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  // Get theme colors
  const primaryColor = theme.colors[theme.primaryColor][6];
  const primaryColorLight = theme.colors[theme.primaryColor][0];
  const primaryColorDark = theme.colors[theme.primaryColor][8];

  // Background gradient based on theme and color scheme
  const bgGradient = colorScheme === 'dark'
    ? `linear-gradient(135deg, ${primaryColorDark}cc 0%, ${theme.colors[theme.primaryColor][7]}cc 100%)`
    : `linear-gradient(135deg, ${primaryColor} 0%, ${theme.colors[theme.primaryColor][5]} 100%)`;

  // Border color based on color scheme
  const borderColor = colorScheme === 'dark'
    ? theme.colors[theme.primaryColor][6]
    : theme.colors[theme.primaryColor][4];

  // Text color
  const textColor = colorScheme === 'dark'
    ? theme.colors.gray[0]
    : 'white';

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999,
        pointerEvents: 'none',
      }}
    >
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
              duration: 0.3,
            }}
            style={{
              marginBottom: '1rem',
              pointerEvents: 'auto',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1rem',
                padding: '2rem 2.5rem',
                background: bgGradient,
                border: `2px solid ${borderColor}`,
                borderRadius: '16px',
                boxShadow: colorScheme === 'dark'
                  ? `0 8px 32px rgba(0, 0, 0, 0.5), inset 0 1px 1px rgba(255, 255, 255, 0.1)`
                  : `0 8px 32px rgba(0, 0, 0, 0.2), inset 0 1px 1px rgba(255, 255, 255, 0.3)`,
                color: textColor,
                minWidth: '320px',
                maxWidth: '400px',
                textAlign: 'center',
                backdropFilter: 'blur(10px)',
              }}
            >
              {/* Icon */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: colorScheme === 'dark'
                    ? `${theme.colors[theme.primaryColor][7]}40`
                    : `${theme.colors[theme.primaryColor][0]}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconStar
                  size={32}
                  color={primaryColor}
                  fill={primaryColor}
                  style={{ flexShrink: 0 }}
                />
              </motion.div>

              {/* Text Content */}
              <div style={{ flex: 1 }}>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  style={{
                    margin: '0 0 0.5rem 0',
                    fontWeight: 600,
                    fontSize: '1.1rem',
                    color: textColor,
                  }}
                >
                  {notification.message}
                </motion.p>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.25 }}
                  style={{
                    margin: 0,
                    fontSize: '0.95rem',
                    color: colorScheme === 'dark'
                      ? theme.colors.gray[2]
                      : `rgba(255, 255, 255, 0.9)`,
                    fontWeight: 500,
                  }}
                >
                  +{notification.points} points
                </motion.p>
              </div>

              {/* Motivational Message */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{
                  margin: 0,
                  fontSize: '0.85rem',
                  color: colorScheme === 'dark'
                    ? theme.colors.gray[3]
                    : `rgba(255, 255, 255, 0.85)`,
                  fontStyle: 'italic',
                }}
              >
                Keep up the great work!
              </motion.p>

              {/* Close Button */}
              <motion.button
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.35 }}
                onClick={() => removeNotification(notification.id)}
                style={{
                  position: 'absolute',
                  top: '0.75rem',
                  right: '0.75rem',
                  background: colorScheme === 'dark'
                    ? `${theme.colors[theme.primaryColor][8]}40`
                    : `rgba(255, 255, 255, 0.2)`,
                  border: 'none',
                  color: textColor,
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s ease',
                  padding: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget).style.background = colorScheme === 'dark'
                    ? `${theme.colors[theme.primaryColor][8]}60`
                    : `rgba(255, 255, 255, 0.3)`;
                  (e.currentTarget).style.transform = 'scale(1.1)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget).style.background = colorScheme === 'dark'
                    ? `${theme.colors[theme.primaryColor][8]}40`
                    : `rgba(255, 255, 255, 0.2)`;
                  (e.currentTarget).style.transform = 'scale(1)';
                }}
              >
                <IconX size={18} stroke={2} />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationContainer;
