import React, { useEffect } from 'react';
import {
  Box,
  Text,
  Group,
  ActionIcon,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconStar, IconX } from '@tabler/icons-react';

interface PointsNotificationProps {
  points: number;
  message?: string;
  onClose?: () => void;
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
}

const POSITION_STYLES: Record<string, React.CSSProperties> = {
  top:    { top: '1.5rem',   bottom: 'auto',   left: '50%', transform: 'translateX(-50%)' },
  bottom: { bottom: '1.5rem', top: 'auto',     left: '50%', transform: 'translateX(-50%)' },
  center: { top: '50%',      bottom: 'auto',   left: '50%', transform: 'translate(-50%, -50%)' },
};

const PointsNotification: React.FC<PointsNotificationProps> = ({
  points,
  message,
  onClose,
  duration = 3000,
  position = 'top',
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const displayMsg = message ?? `You earned ${points} points!`;

  useEffect(() => {
    if (!onClose) return;
    const timer = setTimeout(onClose, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bg     = dark ? theme.colors.dark[7]  : theme.white;
  const border = dark ? theme.colors[primary][7]  : theme.colors[primary][3];
  const shadow = dark
    ? `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px ${theme.colors[primary][8]}40`
    : `0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px ${theme.colors[primary][2]}60`;
  const titleClr = dark ? theme.colors.gray[0]  : theme.colors.dark[7];
  const subClr   = dark ? theme.colors.gray[4]  : theme.colors.gray[6];

  return (
    <Box
      style={{
        position: 'fixed',
        zIndex: 9000,
        ...POSITION_STYLES[position],
        pointerEvents: 'auto',
        animation: 'pn-slide-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    >
      <style>{`
        @keyframes pn-slide-in {
          from { opacity: 0; transform: ${position === 'top' ? 'translateX(-50%) translateY(-12px)' : position === 'bottom' ? 'translateX(-50%) translateY(12px)' : 'translate(-50%, -50%) scale(0.9)'}; }
          to   { opacity: 1; transform: ${position === 'center' ? 'translate(-50%, -50%) scale(1)' : 'translateX(-50%) translateY(0)'}; }
        }
      `}</style>
      <Box
        p="md"
        pr="xl"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: theme.spacing.md,
          backgroundColor: bg,
          border: `1.5px solid ${border}`,
          borderRadius: theme.radius.xl,
          boxShadow: shadow,
          minWidth: 260,
          maxWidth: 360,
        }}
      >
        <ThemeIcon size={48} radius="xl" variant="light" color={primary}>
          <IconStar size={24} stroke={1.8} />
        </ThemeIcon>

        <Box>
          <Text size="sm" fw={700} c={titleClr} lh={1.2} mb={2}>
            {displayMsg}
          </Text>
          <Text
            size="xl"
            fw={900}
            c={theme.colors[primary][6]}
            style={{ fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}
          >
            +{points} pts
          </Text>
        </Box>

        {onClose && (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="sm"
            radius="xl"
            onClick={onClose}
            style={{ position: 'absolute', top: 8, right: 8 }}
          >
            <IconX size={14} stroke={2.5} />
          </ActionIcon>
        )}
      </Box>
    </Box>
  );
};

export default PointsNotification;