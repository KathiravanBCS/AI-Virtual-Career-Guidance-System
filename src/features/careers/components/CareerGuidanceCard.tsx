import { useState } from 'react';

import {
  Badge,
  Button,
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
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import type { CareerGuidance } from '../types';

interface CareerGuidanceCardProps {
  guidance: CareerGuidance;
  onDelete?: (id: number) => void;
  index?: number;
}

const ICONS = [IconBriefcase, IconRocket, IconTarget, IconStar, IconFlame, IconTrendingUp];

const getRandomIcon = (id: number) => {
  return ICONS[id % ICONS.length];
};

export const CareerGuidanceCard: React.FC<CareerGuidanceCardProps> = ({ guidance, onDelete, index = 0 }) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const primaryColor = theme.colors[theme.primaryColor]?.[6] || theme.primaryColor;
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = getRandomIcon(guidance.id);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -4, transition: { duration: 0.3 } }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        background: isHovered
          ? colorScheme === 'dark'
            ? `${theme.colors[theme.primaryColor][8]}40`
            : theme.colors[theme.primaryColor][0]
          : colorScheme === 'dark'
            ? theme.colors.gray[8]
            : 'white',
        backdropFilter: 'blur(10px)',
        border: `1.5px solid ${isHovered ? primaryColor : 'rgba(255, 255, 255, 0.15)'}`,
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
      }}
      onClick={() => navigate(`/career-guidance/${guidance.id}`)}
    >
      <Stack gap="sm">
        {/* AI Generated Badge */}
        <Group justify="space-between" align="flex-start">
          <Badge
            size="sm"
            variant="light"
            style={{
              backgroundColor: `${primaryColor}20`,
              color: primaryColor,
              border: `1px solid ${primaryColor}`,
            }}
            leftSection="⚡"
          >
            AI Analysis
          </Badge>
          {isHovered && onDelete && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(guidance.id);
              }}
              style={{
                cursor: 'pointer',
              }}
            >
              <IconTrash
                size={20}
                style={{
                  color: primaryColor,
                  transition: 'color 0.3s ease',
                }}
              />
            </motion.div>
          )}
        </Group>

        {/* Icon */}
        <ThemeIcon
          variant="light"
          size="md"
          radius="md"
          style={{
            backgroundColor: `${primaryColor}20`,
            color: primaryColor,
            transition: 'all 0.3s ease',
          }}
        >
          <IconComponent size={18} />
        </ThemeIcon>

        {/* Career Goals */}
        <Title
          order={4}
          style={{
            color: primaryColor,
            fontSize: '15px',
            fontWeight: 700,
            transition: 'color 0.3s ease',
            lineHeight: 1.3,
          }}
        >
          {guidance.career_goals || 'Career Development'}
        </Title>

        {/* Summary Preview */}
        <Text
          size="xs"
          style={{
            color: '#b0b0b5',
            transition: 'color 0.3s ease',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {guidance.summary || 'Career guidance analysis'}
        </Text>

        {/* Skills Count */}
        <Group gap="xs">
          <Text
            size="xs"
            style={{
              color: '#b0b0b5',
            }}
          >
            {guidance.current_skills?.length || 0} Skills
          </Text>
          <Text
            size="xs"
            style={{
              color: '#b0b0b5',
            }}
          >
            •
          </Text>
          <Text
            size="xs"
            style={{
              color: '#b0b0b5',
            }}
          >
            {guidance.interests?.length || 0} Interests
          </Text>
        </Group>

        {/* Status Badge */}
        <Group justify="space-between" align="center">
          <Badge size="sm" variant="dot" color={guidance.status === 'active' ? 'green' : 'gray'}>
            {guidance.status?.charAt(0).toUpperCase() + guidance.status?.slice(1) || 'Active'}
          </Badge>
          <motion.div animate={{ x: isHovered ? 4 : 0 }} transition={{ duration: 0.3 }}>
            <IconArrowRight
              size={18}
              style={{
                color: primaryColor,
                transition: 'color 0.3s ease',
              }}
            />
          </motion.div>
        </Group>
      </Stack>
    </motion.div>
  );
};
