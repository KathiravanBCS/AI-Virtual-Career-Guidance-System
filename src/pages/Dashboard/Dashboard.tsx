import {
  Avatar,
  Badge,
  Box,
  Card,
  Container,
  Grid,
  Group,
  Loader,
  Progress,
  RingProgress,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import {
  IconActivity,
  IconAward,
  IconBolt,
  IconBook,
  IconBrain,
  IconBriefcase,
  IconChartBar,
  IconChartPie,
  IconCheck,
  IconClock,
  IconFlame,
  IconGauge,
  IconLock,
  IconMedal,
  IconMessage,
  IconPlayerPlay,
  IconRocket,
  IconSearch,
  IconStar,
  IconTarget,
  IconTrendingUp,
  IconTrophy,
  IconUsers,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useGetDashboardSummaryMe } from '@/features/dashboard';
import type { DashboardActivity, DashboardQuickAction } from '@/features/dashboard/types';

import classes from './Dashboard.module.css';

const ACCENT = '#6366F1';
const TEAL = '#14B8A6';
const AMBER = '#F59E0B';
const ROSE = '#F43F5E';
const PIE_COLORS = [ACCENT, TEAL, AMBER, ROSE, '#8B5CF6', '#06B6D4'];

const ACTION_META: Record<string, { icon: React.ElementType; color: string; gradient: string }> = {
  create_resume: { icon: IconBriefcase, color: 'indigo', gradient: 'linear-gradient(135deg,#6366F1,#818CF8)' },
  import_resume: { icon: IconBook, color: 'violet', gradient: 'linear-gradient(135deg,#7C3AED,#A78BFA)' },
  create_learning_path: { icon: IconRocket, color: 'teal', gradient: 'linear-gradient(135deg,#0D9488,#2DD4BF)' },
  explore_careers: { icon: IconSearch, color: 'cyan', gradient: 'linear-gradient(135deg,#0891B2,#22D3EE)' },
  take_quiz: { icon: IconBolt, color: 'amber', gradient: 'linear-gradient(135deg,#D97706,#FCD34D)' },
  study_flashcards: { icon: IconBook, color: 'orange', gradient: 'linear-gradient(135deg,#EA580C,#FB923C)' },
  ai_career_chat: { icon: IconMessage, color: 'blue', gradient: 'linear-gradient(135deg,#2563EB,#60A5FA)' },
  view_skill_gaps: { icon: IconTarget, color: 'rose', gradient: 'linear-gradient(135deg,#E11D48,#FB7185)' },
  check_leaderboard: { icon: IconTrophy, color: 'yellow', gradient: 'linear-gradient(135deg,#CA8A04,#FDE68A)' },
  view_progress: { icon: IconTrendingUp, color: 'green', gradient: 'linear-gradient(135deg,#16A34A,#4ADE80)' },
  manage_users: { icon: IconUsers, color: 'gray', gradient: 'linear-gradient(135deg,#6B7280,#9CA3AF)' },
  manage_roles: { icon: IconAward, color: 'gray', gradient: 'linear-gradient(135deg,#6B7280,#9CA3AF)' },
  manage_permissions: { icon: IconGauge, color: 'gray', gradient: 'linear-gradient(135deg,#6B7280,#9CA3AF)' },
  platform_analytics: { icon: IconChartBar, color: 'gray', gradient: 'linear-gradient(135deg,#6B7280,#9CA3AF)' },
};

function StatPill({ label, value, color }: { label: string; value: number | string; color: string }) {
  return (
    <Box className={classes.statPill} data-color={color}>
      <Text className={classes.statPillValue}>{value}</Text>
      <Text className={classes.statPillLabel}>{label}</Text>
    </Box>
  );
}

function KpiCard({
  label,
  value,
  icon: Icon,
  color,
  sub,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  color: string;
  sub?: string;
}) {
  return (
    <Card className={classes.kpiCardNew} withBorder>
      <Group justify="space-between" align="flex-start" mb="xs">
        <Box className={classes.kpiIconBox} style={{ background: `var(--mantine-color-${color}-1)` }}>
          <Icon size={18} style={{ color: `var(--mantine-color-${color}-6)` }} />
        </Box>
        <Text fz={9} tt="uppercase" fw={700} c="dimmed" style={{ letterSpacing: '0.08em' }}>
          {label}
        </Text>
      </Group>
      <Text className={classes.kpiValue}>{value}</Text>
      {sub && (
        <Text fz="xs" c="dimmed" mt={2}>
          {sub}
        </Text>
      )}
    </Card>
  );
}

function ActionCard({ action }: { action: DashboardQuickAction }) {
  const meta = ACTION_META[action.key] ?? {
    icon: IconPlayerPlay,
    color: 'indigo',
    gradient: 'linear-gradient(135deg,#6366F1,#818CF8)',
  };
  const Icon = meta.icon;

  return (
    <Tooltip label={action.reason_if_blocked ?? action.label} disabled={action.allowed} withArrow>
      <UnstyledButton
        className={classes.actionCard}
        data-blocked={!action.allowed}
        onClick={() => action.allowed && (window.location.href = action.route)}
      >
        <Box className={classes.actionIconWrap} style={{ background: action.allowed ? meta.gradient : undefined }}>
          {action.allowed ? <Icon size={16} color="#fff" /> : <IconLock size={14} color="#9CA3AF" />}
        </Box>
        <Text fz={11} fw={600} ta="center" lineClamp={2} className={classes.actionLabel}>
          {action.label}
        </Text>
      </UnstyledButton>
    </Tooltip>
  );
}

export function Dashboard() {
  const { data, isLoading, isError } = useGetDashboardSummaryMe();

  const learningStatusData = useMemo(
    () =>
      Object.entries(data?.insights.learning_status_breakdown || { active: 2 }).map(([name, value]) => ({
        name: name.charAt(0).toUpperCase() + name.slice(1),
        value,
      })),
    [data?.insights.learning_status_breakdown]
  );

  const activityBreakdownData = useMemo(
    () =>
      Object.entries(data?.insights.activity_breakdown || {}).map(([name, value]) => ({ name, value })),
    [data?.insights.activity_breakdown]
  );

  const skillGapData = useMemo(
    () =>
      Object.entries(data?.insights.skill_gap_breakdown || {}).map(([name, value]) => ({ name, value })),
    [data?.insights.skill_gap_breakdown]
  );

  const progressTrendData = [
    { period: 'Weekly', points: data?.kpis.weekly_points ?? 0, fill: ACCENT },
    { period: 'Monthly', points: data?.kpis.monthly_points ?? 0, fill: TEAL },
    { period: 'Total', points: data?.kpis.total_points ?? 0, fill: AMBER },
  ];

  const completionPct =
    (data?.kpis.total_learning_paths ?? 0) > 0
      ? Math.round(((data?.kpis.completed_learning_paths ?? 0) / (data?.kpis.total_learning_paths ?? 1)) * 100)
      : 0;

  const careerMatchScore = data?.insights.top_career_match?.match_score ?? 95;
  const skillAlignment = data?.insights.skill_alignment_avg ?? 83.75;

  const radialData = [
    { name: 'Career Match', value: careerMatchScore, fill: ACCENT },
    { name: 'Skill Alignment', value: skillAlignment, fill: TEAL },
    { name: 'Completion', value: completionPct || 5, fill: AMBER },
  ];

  const user = data?.user;
  const initials = `${user?.first_name?.[0] ?? 'K'}${user?.last_name?.[0] ?? 'V'}`;

  return (
    <Box className={classes.dashRoot}>
      {/* Top ambient glow */}
      <Box className={classes.ambientGlow} />

      <Container size="xl" py="xl">
        {/* ── HERO HEADER ── */}
        <Card className={classes.heroCard} mb="xl" withBorder>
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Group gap="md">
              <Box className={classes.avatarRing}>
                <Avatar
                  src={user?.profile_picture_url}
                  size={56}
                  radius="xl"
                  className={classes.heroAvatar}
                >
                  {initials}
                </Avatar>
              </Box>
              <Stack gap={2}>
                <Group gap="xs">
                  <Text className={classes.heroName}>
                    {user?.first_name ?? 'Kathiravan'} {user?.last_name ?? 'V'}
                  </Text>
                  <Badge className={classes.roleBadge} variant="gradient" gradient={{ from: ACCENT, to: '#818CF8', deg: 135 }}>
                    {user?.role_name ?? 'superadmin'}
                  </Badge>
                </Group>
                <Text fz="sm" c="dimmed">
                  {user?.years_of_experience ?? 0} yrs experience •{' '}
                  {user?.career_goal ?? 'Career goal not set'} •{' '}
                  {user?.personality_type ?? 'Personality not set'}
                </Text>
              </Stack>
            </Group>

            <Group gap="sm" className={classes.heroPills}>
              <StatPill label="Points" value={data?.kpis.total_points ?? 0} color="indigo" />
              <StatPill label="Streak" value={`${data?.kpis.current_streak ?? 0}d`} color="orange" />
              <StatPill label="Rank" value={data?.kpis.rank ? `#${data.kpis.rank}` : '—'} color="violet" />
              <StatPill label="Sessions" value={data?.kpis.total_chat_sessions ?? 2} color="teal" />
            </Group>
          </Group>
        </Card>

        {isLoading && (
          <Group justify="center" py="xl">
            <Loader size="sm" color="indigo" />
            <Text c="dimmed" fz="sm">Loading your intelligence hub…</Text>
          </Group>
        )}

        {isError && (
          <Card withBorder mb="lg" className={classes.errorCard}>
            <Text c="red" fw={500}>Failed to load dashboard. Please refresh.</Text>
          </Card>
        )}

        {/* ── KPI STRIP ── */}
        <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="sm" mb="xl">
          <KpiCard label="Learning Paths" value={`${data?.kpis.active_learning_paths ?? 2}/${data?.kpis.total_learning_paths ?? 2}`} icon={IconRocket} color="indigo" sub="active / total" />
          <KpiCard label="Recommendations" value={data?.kpis.total_recommendations ?? 4} icon={IconStar} color="amber" sub="personalised" />
          <KpiCard label="Chat Messages" value={data?.kpis.total_chat_messages ?? 8} icon={IconMessage} color="teal" sub="AI conversations" />
          <KpiCard label="Skill Gaps" value={data?.kpis.total_skill_gaps ?? 0} icon={IconTarget} color="rose" sub={`${data?.kpis.critical_skill_gaps ?? 0} critical`} />
          <KpiCard label="Quizzes" value={data?.kpis.total_quizzes ?? 0} icon={IconBolt} color="violet" sub="completed" />
          <KpiCard label="Flashcards" value={data?.kpis.total_flashcards ?? 0} icon={IconBook} color="cyan" sub="studied" />
        </SimpleGrid>

        {/* ── MAIN GRID ── */}
        <Grid gutter="lg">
          {/* Left column — charts */}
          <Grid.Col span={{ base: 12, lg: 8 }}>
            <Stack gap="lg">

              {/* Radial overview */}
              <Card className={classes.glassCard} withBorder>
                <Group justify="space-between" mb="md">
                  <Stack gap={2}>
                    <Text className={classes.cardTitle}>Performance Overview</Text>
                    <Text fz="xs" c="dimmed">Career match · skill alignment · completion</Text>
                  </Stack>
                  <ThemeIcon size={34} radius="md" variant="gradient" gradient={{ from: ACCENT, to: '#818CF8', deg: 135 }}>
                    <IconGauge size={18} />
                  </ThemeIcon>
                </Group>

                <Grid>
                  <Grid.Col span={{ base: 12, sm: 5 }}>
                    <Box style={{ height: 220 }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius={30}
                          outerRadius={90}
                          data={radialData}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <RadialBar dataKey="value" cornerRadius={6} background={{ fill: 'var(--mantine-color-gray-1)' }} />
                        <ReTooltip formatter={(value) => `${Number(value ?? 0)}%`} />
                      </RadialBarChart>
                      </ResponsiveContainer>
                    </Box>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 7 }}>
                    <Stack gap="md" justify="center" h="100%" py="sm">
                      {[
                        { label: 'Career Match', value: careerMatchScore, color: ACCENT, icon: IconTrophy },
                        { label: 'Skill Alignment', value: Math.round(skillAlignment), color: TEAL, icon: IconBrain },
                        { label: 'Path Completion', value: completionPct, color: AMBER, icon: IconCheck },
                      ].map((item) => (
                        <Box key={item.label}>
                          <Group justify="space-between" mb={4}>
                            <Group gap="xs">
                              <item.icon size={14} style={{ color: item.color }} />
                              <Text fz="sm" fw={500}>{item.label}</Text>
                            </Group>
                            <Text fz="sm" fw={700} style={{ color: item.color }}>{item.value}%</Text>
                          </Group>
                          <Progress value={item.value} size="sm" color={item.color} radius="xl" />
                        </Box>
                      ))}

                      <Box className={classes.careerMatchBadge}>
                        <Group gap="xs">
                          <IconMedal size={16} style={{ color: AMBER }} />
                          <Text fz="sm" fw={600}>
                            Best fit: {data?.insights.top_career_match?.career_title ?? 'Pilot'}
                          </Text>
                        </Group>
                        <Badge size="sm" variant="light" color="amber">
                          {careerMatchScore}% match
                        </Badge>
                      </Box>
                    </Stack>
                  </Grid.Col>
                </Grid>
              </Card>

              {/* Points momentum area chart */}
              <Card className={classes.glassCard} withBorder>
                <Group justify="space-between" mb="md">
                  <Stack gap={2}>
                    <Text className={classes.cardTitle}>Points Momentum</Text>
                    <Text fz="xs" c="dimmed">Weekly · monthly · all-time</Text>
                  </Stack>
                  <ThemeIcon size={34} radius="md" variant="gradient" gradient={{ from: TEAL, to: '#2DD4BF', deg: 135 }}>
                    <IconTrendingUp size={18} />
                  </ThemeIcon>
                </Group>
                <Box style={{ height: 200 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={progressTrendData}>
                      <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor={ACCENT} stopOpacity={0.3} />
                          <stop offset="95%" stopColor={ACCENT} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--mantine-color-gray-2)" />
                      <XAxis dataKey="period" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 8, border: '1px solid var(--mantine-color-gray-2)' }} />
                      <Area
                        type="monotone"
                        dataKey="points"
                        stroke={ACCENT}
                        strokeWidth={2.5}
                        fill="url(#areaGrad)"
                        dot={{ r: 5, fill: ACCENT, strokeWidth: 2, stroke: '#fff' }}
                        activeDot={{ r: 7 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Box>
              </Card>

              {/* Learning status + Activity mix side by side */}
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                <Card className={classes.glassCard} withBorder>
                  <Group justify="space-between" mb="md">
                    <Text className={classes.cardTitle}>Learning Status</Text>
                    <ThemeIcon size={30} radius="md" variant="light" color="teal">
                      <IconChartBar size={16} />
                    </ThemeIcon>
                  </Group>
                  <Box style={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={learningStatusData.length ? learningStatusData : [{ name: 'Active', value: 2 }]} barSize={32}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--mantine-color-gray-2)" />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <ReTooltip contentStyle={{ borderRadius: 8 }} />
                        <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                          {learningStatusData.map((_, i) => (
                            <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>

                <Card className={classes.glassCard} withBorder>
                  <Group justify="space-between" mb="md">
                    <Text className={classes.cardTitle}>Activity Mix</Text>
                    <ThemeIcon size={30} radius="md" variant="light" color="violet">
                      <IconChartPie size={16} />
                    </ThemeIcon>
                  </Group>
                  <Box style={{ height: 180 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={activityBreakdownData.length ? activityBreakdownData : [{ name: 'No Activity', value: 1 }]}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          innerRadius={45}
                          outerRadius={75}
                          paddingAngle={3}
                        >
                          {(activityBreakdownData.length ? activityBreakdownData : [{ name: 'No Activity', value: 1 }]).map(
                            (entry, i) => (
                              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                            )
                          )}
                        </Pie>
                        <ReTooltip contentStyle={{ borderRadius: 8 }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </Card>
              </SimpleGrid>

              {/* Skill gap distribution */}
              <Card className={classes.glassCard} withBorder>
                <Group justify="space-between" mb="md">
                  <Stack gap={2}>
                    <Text className={classes.cardTitle}>Skill Gap Distribution</Text>
                    <Text fz="xs" c="dimmed">Areas requiring attention</Text>
                  </Stack>
                  <ThemeIcon size={34} radius="md" variant="gradient" gradient={{ from: ROSE, to: '#FB7185', deg: 135 }}>
                    <IconTarget size={18} />
                  </ThemeIcon>
                </Group>
                <Box style={{ height: 180 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={skillGapData.length ? skillGapData : [{ name: 'No gaps', value: 0 }]}
                      layout="vertical"
                      barSize={14}
                    >
                      <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="var(--mantine-color-gray-2)" />
                      <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="name" width={80} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                      <ReTooltip contentStyle={{ borderRadius: 8 }} />
                      <Bar dataKey="value" fill={ROSE} radius={[0, 6, 6, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </Card>

              {/* Recent activity */}
              <Card className={classes.glassCard} withBorder>
                <Group justify="space-between" mb="md">
                  <Text className={classes.cardTitle}>Recent Activity</Text>
                  <ThemeIcon size={30} radius="md" variant="light" color="blue">
                    <IconActivity size={16} />
                  </ThemeIcon>
                </Group>

                {!data?.recent_activity?.length ? (
                  <Box className={classes.emptyState}>
                    <IconClock size={32} style={{ color: 'var(--mantine-color-gray-4)' }} />
                    <Text fz="sm" c="dimmed" mt="xs">No recent activity yet — start a learning path!</Text>
                  </Box>
                ) : (
                  <Stack gap="xs">
                    {data.recent_activity.slice(0, 6).map((a: DashboardActivity, i: number) => (
                      <Box key={i} className={classes.activityRow}>
                        <Box className={classes.activityDot} />
                        <Stack gap={0} style={{ flex: 1, minWidth: 0 }}>
                          <Text fz="sm" fw={500} lineClamp={1}>{a.description || a.activity_type || 'Activity'}</Text>
                          <Text fz="xs" c="dimmed">{a.reference_type || 'dashboard'}{a.created_at ? ` · ${new Date(a.created_at).toLocaleString()}` : ''}</Text>
                        </Stack>
                        <Badge size="xs" variant="light" color="indigo" radius="sm">+{a.points_earned ?? 0} pts</Badge>
                      </Box>
                    ))}
                  </Stack>
                )}
              </Card>
            </Stack>
          </Grid.Col>

          {/* Right column — sidebar */}
          <Grid.Col span={{ base: 12, lg: 4 }}>
            <Stack gap="lg">

              {/* Quick actions grid */}
              <Card className={classes.glassCard} withBorder>
                <Text className={classes.cardTitle} mb="md">Quick Actions</Text>
                <SimpleGrid cols={3} spacing="sm">
                  {(data?.quick_actions ?? []).slice(0, 12).map((action) => (
                    <ActionCard key={action.key} action={action} />
                  ))}
                </SimpleGrid>
              </Card>

              {/* Learning paths summary */}
              <Card className={classes.glassCard} withBorder>
                <Group justify="space-between" mb="md">
                  <Text className={classes.cardTitle}>Learning Paths</Text>
                  <ThemeIcon size={30} radius="md" variant="light" color="indigo">
                    <IconRocket size={16} />
                  </ThemeIcon>
                </Group>
                <Stack gap="md">
                  <Group justify="space-between">
                    <RingProgress
                      size={90}
                      thickness={8}
                      roundCaps
                      sections={[{ value: completionPct || 5, color: ACCENT }]}
                      label={
                        <Text ta="center" fz="xs" fw={700}>{completionPct}%</Text>
                      }
                    />
                    <Stack gap={4} style={{ flex: 1 }}>
                      {[
                        { label: 'Total paths', value: data?.kpis.total_learning_paths ?? 2 },
                        { label: 'Active', value: data?.kpis.active_learning_paths ?? 2 },
                        { label: 'Completed', value: data?.kpis.completed_learning_paths ?? 0 },
                      ].map((r) => (
                        <Group key={r.label} justify="space-between">
                          <Text fz="xs" c="dimmed">{r.label}</Text>
                          <Text fz="xs" fw={700}>{r.value}</Text>
                        </Group>
                      ))}
                    </Stack>
                  </Group>
                  <Progress value={completionPct || 5} size="xs" color="indigo" radius="xl" />
                </Stack>
              </Card>

              {/* Streak & rank card */}
              <Card className={classes.streakCard} withBorder>
                <Group justify="space-between" mb="sm">
                  <Text className={classes.cardTitle} c="white">Streak & Rank</Text>
                  <IconFlame size={20} color={AMBER} />
                </Group>
                <SimpleGrid cols={2} spacing="sm">
                  {[
                    { label: 'Current Streak', value: `${data?.kpis.current_streak ?? 0}d`, icon: IconFlame },
                    { label: 'Longest Streak', value: `${data?.kpis.longest_streak ?? 0}d`, icon: IconTrendingUp },
                    { label: 'Global Rank', value: data?.kpis.rank ? `#${data.kpis.rank}` : '—', icon: IconTrophy },
                    { label: 'Total Points', value: data?.kpis.total_points ?? 0, icon: IconStar },
                  ].map((s) => (
                    <Box key={s.label} className={classes.streakStat}>
                      <s.icon size={14} color="rgba(255,255,255,0.6)" />
                      <Text fz="xl" fw={800} c="white">{s.value}</Text>
                      <Text fz={10} c="rgba(255,255,255,0.6)" tt="uppercase" style={{ letterSpacing: '0.06em' }}>{s.label}</Text>
                    </Box>
                  ))}
                </SimpleGrid>
              </Card>

              {/* Modules summary */}
              <Card className={classes.glassCard} withBorder>
                <Group justify="space-between" mb="md">
                  <Text className={classes.cardTitle}>Modules</Text>
                  <ThemeIcon size={30} radius="md" variant="light" color="teal">
                    <IconBook size={16} />
                  </ThemeIcon>
                </Group>
                <Stack gap="xs">
                  {[
                    { label: 'Total Modules', value: data?.kpis.total_modules ?? 0, color: ACCENT },
                    { label: 'Completed', value: data?.kpis.completed_modules ?? 0, color: TEAL },
                    { label: 'In Progress', value: data?.kpis.in_progress_modules ?? 0, color: AMBER },
                  ].map((m) => (
                    <Group key={m.label} justify="space-between">
                      <Group gap="xs">
                        <Box style={{ width: 8, height: 8, borderRadius: '50%', background: m.color }} />
                        <Text fz="sm" c="dimmed">{m.label}</Text>
                      </Group>
                      <Text fz="sm" fw={700}>{m.value}</Text>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </Stack>
          </Grid.Col>
        </Grid>
      </Container>
    </Box>
  );
}