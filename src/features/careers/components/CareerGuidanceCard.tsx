import { useState } from 'react';

import {
  Badge,
  Group,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowRight,
  IconBriefcase,
  IconFlame,
  IconRocket,
  IconStar,
  IconTarget,
  IconTrash,
  IconTrendingUp,
  IconSparkles,
  IconCircleDot,
} from '@tabler/icons-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import type { CareerGuidance } from '../types';

interface CareerGuidanceCardProps {
  guidance: CareerGuidance;
  onDelete?: (id: number) => void;
  index?: number;
}

const ICONS = [IconBriefcase, IconRocket, IconTarget, IconStar, IconFlame, IconTrendingUp];

const getIconForId = (id: number) => ICONS[id % ICONS.length];

export const CareerGuidanceCard: React.FC<CareerGuidanceCardProps> = ({
  guidance,
  onDelete,
  index = 0,
}) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const primary = theme.colors[theme.primaryColor];
  const primaryHex = primary?.[6] ?? '#ff9d54';
  const primaryLight = primary?.[0] ?? '#fff4ec';
  const primaryDarkTint = `${primary?.[8] ?? '#c96a1a'}40`;

  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = getIconForId(guidance.id);

  const cardBg = isHovered
    ? isDark
      ? primaryDarkTint
      : primaryLight
    : isDark
      ? theme.colors.dark[6]
      : '#ffffff';

  const borderColor = isHovered ? primaryHex : isDark ? theme.colors.dark[4] : theme.colors.gray[2];

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -5, transition: { duration: 0.25, ease: 'easeOut' } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/career-guidance/${guidance.id}`)}
      style={{
        background: cardBg,
        border: `1.5px solid ${borderColor}`,
        borderRadius: '14px',
        padding: '20px',
        cursor: 'pointer',
        boxShadow: isHovered
          ? `0 12px 32px ${primaryHex}22, 0 2px 8px rgba(0,0,0,0.12)`
          : '0 2px 10px rgba(0,0,0,0.08)',
        transition: 'background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Subtle accent line at top */}
      <motion.div
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: `linear-gradient(90deg, ${primaryHex}, ${primary?.[4] ?? '#ffb87a'})`,
          transformOrigin: 'left',
          borderRadius: '14px 14px 0 0',
        }}
      />

      <Stack gap={14}>
        {/* Top row: badge + delete */}
        <Group justify="space-between" align="center">
          <Badge
            size="sm"
            variant="light"
            leftSection={<IconSparkles size={11} />}
            style={{
              backgroundColor: `${primaryHex}18`,
              color: primaryHex,
              border: `1px solid ${primaryHex}40`,
              fontWeight: 600,
              letterSpacing: '0.02em',
            }}
          >
            AI Analysis
          </Badge>

          <AnimatePresence>
            {isHovered && onDelete && (
              <motion.div
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.7 }}
                transition={{ duration: 0.18 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(guidance.id);
                }}
                style={{ cursor: 'pointer' }}
              >
                <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}>
                  <IconTrash
                    size={18}
                    style={{ color: primaryHex, display: 'block' }}
                  />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </Group>

        {/* Icon */}
        <ThemeIcon
          size={40}
          radius="xl"
          style={{
            background: `linear-gradient(135deg, ${primaryHex}25, ${primaryHex}10)`,
            color: primaryHex,
            border: `1px solid ${primaryHex}30`,
            boxShadow: isHovered ? `0 4px 14px ${primaryHex}30` : 'none',
            transition: 'box-shadow 0.3s ease',
          }}
        >
          <IconComponent size={20} />
        </ThemeIcon>

        {/* Career Goals */}
        <Title
          order={4}
          style={{
            color: primaryHex,
            fontSize: '15px',
            fontWeight: 700,
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
          }}
        >
          {guidance.career_goals || 'Career Development'}
        </Title>

        {/* Summary */}
        <Text
          size="xs"
          style={{
            color: isDark ? theme.colors.dark[2] : theme.colors.gray[6],
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {guidance.summary || 'AI-powered career guidance analysis'}
        </Text>

        {/* Meta counts */}
        <Group gap={6}>
          <Text size="xs" style={{ color: isDark ? theme.colors.dark[3] : theme.colors.gray[5] }}>
            {guidance.current_skills?.length ?? 0} Skills
          </Text>
          <Text size="xs" style={{ color: isDark ? theme.colors.dark[3] : theme.colors.gray[4] }}>·</Text>
          <Text size="xs" style={{ color: isDark ? theme.colors.dark[3] : theme.colors.gray[5] }}>
            {guidance.interests?.length ?? 0} Interests
          </Text>
        </Group>

        {/* Footer: status + arrow */}
        <Group justify="space-between" align="center" mt={2}>
          <Badge
            size="sm"
            variant="dot"
            color={guidance.status === 'active' ? 'teal' : 'gray'}
            style={{ fontWeight: 500 }}
          >
            {guidance.status
              ? guidance.status.charAt(0).toUpperCase() + guidance.status.slice(1)
              : 'Active'}
          </Badge>

          <motion.div animate={{ x: isHovered ? 5 : 0 }} transition={{ duration: 0.25 }}>
            <IconArrowRight size={17} style={{ color: primaryHex, display: 'block' }} />
          </motion.div>
        </Group>
      </Stack>
    </motion.div>
  );
};

export default CareerGuidanceCard;