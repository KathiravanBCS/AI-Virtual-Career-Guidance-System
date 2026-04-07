import { Card, Group, Stack, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import {
  IconArrowUpRight,
  IconBook,
  IconBrain,
  IconDownload,
  IconFileText,
  IconLock,
  IconMessageCircle,
  IconRoute,
  IconShield,
  IconSparkles,
  IconTarget,
  IconTrophy,
  IconUsers,
} from '@tabler/icons-react';
import type { ElementType } from 'react';
import { useNavigate } from 'react-router-dom';

import type { DashboardQuickAction } from '@/features/dashboard/types';

import classes from './Dashboard.module.css';

interface QuickActionsProps {
  actions?: DashboardQuickAction[];
}

const DEFAULT_ACTIONS: DashboardQuickAction[] = [
  {
    key: 'create_resume',
    label: 'Create Resume',
    route: '/resume-builder',
    allowed: true,
    reason_if_blocked: null,
  },
  {
    key: 'import_resume',
    label: 'Import Resume',
    route: '/resume-builder?import=true',
    allowed: true,
    reason_if_blocked: null,
  },
];

const keyToIcon: Record<string, ElementType> = {
  create_resume: IconFileText,
  import_resume: IconDownload,
  create_learning_path: IconRoute,
  explore_careers: IconBook,
  take_quiz: IconBrain,
  study_flashcards: IconSparkles,
  ai_career_chat: IconMessageCircle,
  view_skill_gaps: IconTarget,
  check_leaderboard: IconTrophy,
  view_progress: IconTarget,
  manage_users: IconUsers,
  manage_roles: IconShield,
  manage_permissions: IconShield,
  platform_analytics: IconTrophy,
};

function normalizeRoute(route: string): string {
  const routeMap: Record<string, string> = {
    '/resume-builder?import=true': '/resume-import',
    '/learning-paths/create': '/learning-path',
    '/careers': '/career-guidance',
    '/chat': '/ai-chat',
    '/progress': '/learning-path',
    '/analytics': '/gamification',
  };

  return routeMap[route] || route;
}

export function QuickActions({ actions }: QuickActionsProps) {
  const navigate = useNavigate();
  const actionItems = (actions && actions.length > 0 ? actions : DEFAULT_ACTIONS).slice(0, 10);

  return (
    <Card data-component="quick-actions" withBorder={false} shadow="0" padding="md" radius="md">
      <Text fz="sm" fw={600} mb="md">
        Quick Actions
      </Text>
      <Stack gap="xs">
        {actionItems.map((action) => {
          const Icon = keyToIcon[action.key] || IconFileText;
          const color = action.allowed ? 'blue' : 'gray';

          return (
            <UnstyledButton
              key={action.key}
              className={classes.actionButton}
              onClick={() => {
                if (!action.allowed) return;
                navigate(normalizeRoute(action.route));
              }}
              title={action.allowed ? action.route : action.reason_if_blocked || 'Not allowed'}
              style={{ opacity: action.allowed ? 1 : 0.6, cursor: action.allowed ? 'pointer' : 'not-allowed' }}
            >
            <Group gap="sm">
              <ThemeIcon size={32} radius="md" variant="light" color={color}>
                <Icon size={20} />
              </ThemeIcon>
              <div>
                <Text fz="sm" fw={500}>
                  {action.label}
                </Text>
                <Text fz="xs" c="dimmed">
                  {action.allowed ? 'Open tool' : action.reason_if_blocked || 'No access'}
                </Text>
              </div>
            </Group>
            {action.allowed ? (
              <IconArrowUpRight size={14} color="var(--mantine-color-dimmed)" />
            ) : (
              <IconLock size={14} color="var(--mantine-color-dimmed)" />
            )}
            </UnstyledButton>
          );
        })}
      </Stack>
    </Card>
  );
}
