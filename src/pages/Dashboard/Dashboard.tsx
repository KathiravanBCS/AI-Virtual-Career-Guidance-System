import { Container, Grid, Stack } from '@mantine/core';
import { IconBook, IconCalendarEvent, IconMailOpened, IconSend } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { useGetGuidanceSessions } from '@/features/guidance/api/useGetGuidanceSessions';
import { useGetLearningGuidanceByUser } from '@/features/guidance/api/useGetLearningGuidanceByUser';
import { GuidanceSession, type LearningGuidance } from '@/features/guidance/types';
import { useLoggedInUser } from '@/lib/auth/useLoggedInUser';

import { ContactGroupsCard } from './ContactGroupsCard';
import { GuidanceSection } from './GuidanceSection';
import { HeroBanner } from './HeroBanner';
import { QuickActions } from './QuickActions';

export function Dashboard() {
  const navigate = useNavigate();
  const { user: loggedInUser } = useLoggedInUser();
  const { data: guidanceSessions = [], isLoading: sessionsLoading } = useGetGuidanceSessions();
  const { data: learningGuidanceData, isLoading: guidanceLoading } = useGetLearningGuidanceByUser(loggedInUser?.id);

  const scheduled = guidanceSessions
    .filter((s: GuidanceSession) => s.status === 'scheduled')
    .sort(
      (a: GuidanceSession, b: GuidanceSession) =>
        new Date(a.scheduled_at || 0).getTime() - new Date(b.scheduled_at || 0).getTime()
    )
    .slice(0, 4);

  const inProgress = guidanceSessions.filter((s: GuidanceSession) => s.status === 'in-progress').slice(0, 3);

  const completed = guidanceSessions
    .filter((s: GuidanceSession) => s.status === 'completed')
    .sort(
      (a: GuidanceSession, b: GuidanceSession) =>
        new Date(b.updated_at || b.created_at).getTime() - new Date(a.updated_at || a.created_at).getTime()
    )
    .slice(0, 4);

  const recentGuidances = (learningGuidanceData?.data || [])
    .sort(
      (a: LearningGuidance, b: LearningGuidance) =>
        new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
    )
    .slice(0, 5);

  return (
    <Container data-component="dashboard" size="xl" py="xl">
      <HeroBanner />

      <Grid gutter="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            {(inProgress.length > 0 || sessionsLoading) && (
              <GuidanceSection
                title="In Progress"
                sessions={inProgress}
                loading={sessionsLoading}
                emptyIcon={IconSend}
                emptyText="No sessions currently in progress"
              />
            )}

            {(scheduled.length > 0 || sessionsLoading) && (
              <GuidanceSection
                title="Scheduled Sessions"
                sessions={scheduled}
                loading={sessionsLoading}
                emptyIcon={IconCalendarEvent}
                emptyText="No scheduled sessions"
              />
            )}

            <GuidanceSection
              title="Recently Created Guidance"
              guidances={recentGuidances}
              loading={guidanceLoading}
              emptyIcon={IconBook}
              emptyText="No guidance created yet"
              emptyAction={{ label: 'Create your first guidance', onClick: () => navigate('/guidance') }}
            />
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 4 }}>
          <Stack gap="lg">
            <QuickActions />
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
