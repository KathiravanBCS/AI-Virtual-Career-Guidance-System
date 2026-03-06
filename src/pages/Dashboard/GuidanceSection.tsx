import { Badge, Box, Button, Card, Group, Skeleton, Stack, Text, ThemeIcon } from '@mantine/core';
import { IconCalendarEvent, IconClock, IconFileText, IconMail, IconMailOpened, IconSend } from '@tabler/icons-react';
import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import { useNavigate } from 'react-router-dom';

import { useGuidanceSessionStats } from '@/features/guidance/api/useGuidanceSessionStats';
import type { GuidanceSession, LearningGuidance } from '@/features/guidance/types';

import classes from './Dashboard.module.css';

dayjs.extend(utc);
dayjs.extend(timezone);

const STATUS_CONFIG = {
  scheduled: { color: 'blue', label: 'Scheduled', icon: IconCalendarEvent },
  'in-progress': { color: 'orange', label: 'In Progress', icon: IconSend },
  completed: { color: 'gray', label: 'Completed', icon: IconMailOpened },
  draft: { color: 'gray', label: 'Draft', icon: IconFileText },
} as const;

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] || { color: 'gray', label: status, icon: IconMail };
}

function GuidanceSessionItem({ session, onClick }: { session: GuidanceSession; onClick: () => void }) {
  const config = getStatusConfig(session.status);
  const StatusIcon = config.icon;
  const isCompleted = session.status === 'completed';
  const { data: stats } = useGuidanceSessionStats(isCompleted ? session.id : undefined);

  const getDisplayDate = () => {
    const date =
      session.status === 'scheduled' && session.scheduled_at
        ? session.scheduled_at
        : session.updated_at || session.created_at;
    return dayjs(date).tz('Asia/Kolkata').format('MMM D, h:mm A');
  };

  return (
    <Box className={classes.sessionItem} onClick={onClick}>
      <ThemeIcon size={36} radius="xl" variant="light" color={config.color}>
        <StatusIcon size={18} />
      </ThemeIcon>

      <div className={classes.sessionContent}>
        <div className={classes.sessionMain}>
          <Text fz="sm" fw={500} lineClamp={1}>
            {session.name}
          </Text>
          <Text fz="xs" c="dimmed" lineClamp={1}>
            {session.topic || 'No topic'}
          </Text>
          {session.user_email && (
            <Text fz="xs" c="dimmed" lineClamp={1}>
              {session.user_email}
            </Text>
          )}
        </div>

        <div className={classes.sessionMeta}>
          {isCompleted && stats && (
            <Group gap="md" visibleFrom="sm" className={classes.sessionStats}>
              <div className={classes.statItem}>
                <Text fz="xs" fw={500}>
                  {stats.total}
                </Text>
                <Text fz="xs" c="dimmed">
                  Recipients
                </Text>
              </div>
              <div className={classes.statItem}>
                <Text fz="xs" fw={500}>
                  {(stats.open_rate ?? 0).toFixed(1)}%
                </Text>
                <Text fz="xs" c="dimmed">
                  Opens
                </Text>
              </div>
              <div className={classes.statItem}>
                <Text fz="xs" fw={500}>
                  {(stats.click_rate ?? 0).toFixed(1)}%
                </Text>
                <Text fz="xs" c="dimmed">
                  Clicks
                </Text>
              </div>
            </Group>
          )}

          {!isCompleted && (
            <Badge size="sm" variant="light" color={config.color}>
              {config.label}
            </Badge>
          )}

          <Group gap={4} style={{ flexShrink: 0 }}>
            <IconClock size={12} color="var(--mantine-color-dimmed)" />
            <Text fz="xs" c="dimmed">
              {getDisplayDate()}
            </Text>
          </Group>
        </div>
      </div>
    </Box>
  );
}

function LearningGuidanceItem({ guidance, onClick }: { guidance: LearningGuidance; onClick: () => void }) {
  const getDisplayDate = () => {
    return dayjs(guidance.created_at).tz('Asia/Kolkata').format('MMM D, h:mm A');
  };

  return (
    <Box className={classes.sessionItem} onClick={onClick}>
      <ThemeIcon size={36} radius="xl" variant="light" color="blue">
        <IconFileText size={18} />
      </ThemeIcon>

      <div className={classes.sessionContent}>
        <div className={classes.sessionMain}>
          <Text fz="sm" fw={500} lineClamp={1}>
            {guidance.career_goal}
          </Text>
          <Text fz="xs" c="dimmed" lineClamp={1}>
            {guidance.name}
          </Text>
          <Text fz="xs" c="dimmed" lineClamp={1}>
            Code: {guidance.learning_guidance_code}
          </Text>
        </div>

        <div className={classes.sessionMeta}>
          <Badge size="sm" variant="light" color="blue">
            {guidance.status}
          </Badge>

          <Group gap={4} style={{ flexShrink: 0 }}>
            <IconClock size={12} color="var(--mantine-color-dimmed)" />
            <Text fz="xs" c="dimmed">
              {getDisplayDate()}
            </Text>
          </Group>
        </div>
      </div>
    </Box>
  );
}

interface GuidanceSectionProps {
  title: string;
  sessions?: GuidanceSession[];
  guidances?: LearningGuidance[];
  loading: boolean;
  emptyIcon: React.ElementType;
  emptyText: string;
  emptyAction?: { label: string; onClick: () => void };
}

export function GuidanceSection({
  title,
  sessions = [],
  guidances = [],
  loading,
  emptyIcon: EmptyIcon,
  emptyText,
  emptyAction,
}: GuidanceSectionProps) {
  const navigate = useNavigate();

  const isGuidanceSection = guidances.length > 0 || (!sessions.length && guidances !== undefined);
  const items = isGuidanceSection ? guidances : sessions;
  const itemCount = items.length;

  if (loading) {
    return (
      <Card withBorder shadow="0" padding="md" radius="md">
        <Skeleton height={16} width={100} mb="md" />
        <Stack gap={0}>
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={56} radius={0} mb={1} />
          ))}
        </Stack>
      </Card>
    );
  }

  return (
    <Card data-component="guidance-section" data-section-title={title} withBorder shadow="0" padding="md" radius="md">
      <Group justify="space-between" mb="sm">
        <Text fz="sm" fw={600}>
          {title}
        </Text>
        <Badge size="sm" variant="light" color="gray">
          {itemCount}
        </Badge>
      </Group>

      {itemCount === 0 ? (
        <Stack align="center" py="lg">
          <ThemeIcon size={36} radius="xl" variant="light" color="gray">
            <EmptyIcon size={18} />
          </ThemeIcon>
          <Text fz="sm" c="dimmed">
            {emptyText}
          </Text>
          {emptyAction && (
            <Button variant="subtle" size="xs" onClick={emptyAction.onClick}>
              {emptyAction.label}
            </Button>
          )}
        </Stack>
      ) : (
        <div className={classes.sessionList}>
          {isGuidanceSection
            ? guidances.map((guidance) => (
                <LearningGuidanceItem
                  key={guidance.id}
                  guidance={guidance}
                  onClick={() => {
                    navigate(`/learning-guidance/${guidance.id}`, { state: { from: '/', selectedId: guidance.id } });
                  }}
                />
              ))
            : sessions.map((session) => (
                <GuidanceSessionItem
                  key={session.id}
                  session={session}
                  onClick={() => {
                    const path =
                      session.status === 'draft' ? `/guidance/${session.id}/edit` : `/guidance/${session.id}/view`;
                    navigate(path, { state: { from: '/', selectedId: session.id } });
                  }}
                />
              ))}
        </div>
      )}
    </Card>
  );
}
