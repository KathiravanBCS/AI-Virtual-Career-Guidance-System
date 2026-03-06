import { useState } from 'react';

import {
  Badge,
  Button,
  Group,
  Progress,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowRight,
  IconBook,
  IconBrain,
  IconCode,
  IconHeadphones,
  IconLeaf,
  IconMicroscope,
  IconRocket,
  IconSchool,
  IconTarget,
  IconTrash,
  IconTrendingUp,
} from '@tabler/icons-react';
import { color, motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { CareerPath } from '../types';

interface PathCardProps {
  path: CareerPath;
  onDelete?: (id: string) => void;
  index?: number;
  guidance?: any;
}

const ICONS = [
  IconCode,
  IconBrain,
  IconRocket,
  IconSchool,
  IconBook,
  IconTarget,
  IconMicroscope,
  IconTrendingUp,
  IconLeaf,
  IconHeadphones,
];

const getRandomIcon = (id: string) => {
  const charCode = id.charCodeAt(0);
  return ICONS[charCode % ICONS.length];
};

export const PathCard: React.FC<PathCardProps> = ({ path, onDelete, index = 0, guidance }) => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const primaryColor = theme.colors[theme.primaryColor]?.[6] || theme.primaryColor;
  const [isHovered, setIsHovered] = useState(false);

  const IconComponent = getRandomIcon(path.$id);
  const completedCount = path.completedModules?.length || 0;
  const totalModules = path.modules?.length || 0;

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
          : 'white',
        backdropFilter: 'blur(10px)',
        border: `1.5px solid ${isHovered ? primaryColor : 'rgba(255, 255, 255, 0.15)'}`,
        borderRadius: '12px',
        padding: '16px',
        cursor: 'pointer',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
        transition: 'all 0.3s ease',
      }}
      onClick={() => navigate(`/learning-path/${path.$id}`)}
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
            AI Generated
          </Badge>
          {isHovered && onDelete && (
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation();
                if (onDelete) onDelete(path.$id);
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

        {/* Title */}
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
          {path.careerName}
        </Title>

        {/* Module Count */}
        <Text
          size="xs"
          style={{
            color: '#b0b0b5',
            transition: 'color 0.3s ease',
          }}
        >
          {totalModules} modules • {completedCount} completed
        </Text>

        {/* Progress Bar */}
        <div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, delay: index * 0.1 + 0.3 }}
          >
            <Progress
              value={path.progress}
              color={primaryColor}
              style={{
                height: '6px',
                borderRadius: '3px',
              }}
            />
          </motion.div>
        </div>

        {/* Completion Percentage with Arrow */}
        <Group justify="space-between" align="center">
          <Text
            size="sm"
            fw={600}
            style={{
              color: primaryColor,
              transition: 'color 0.3s ease',
            }}
          >
            {path.progress}% Complete
          </Text>
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
