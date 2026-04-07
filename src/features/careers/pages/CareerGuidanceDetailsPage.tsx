import { useMemo, useState } from 'react';

import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Loader,
  Paper,
  Progress,
  RingProgress,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconBolt,
  IconBook,
  IconBriefcase,
  IconBuilding,
  IconBulb,
  IconChartBar,
  IconChartLine,
  IconCheck,
  IconClock,
  IconCoin,
  IconFlame,
  IconStar,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useGetCareerGuidance } from '../api/useCareerGuidance';
import type { CareerGuidanceDetail } from '../types';

interface CareerGuidanceDetailsPageProps {
  data?: CareerGuidanceDetail;
  loading?: boolean;
  error?: string | null;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.42, 0, 0.58, 1] as any } },
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: [0.42, 0, 0.58, 1] as any } },
};

// ─── Stat Tile ──────────────────────────────────────────────────────────────
function StatTile({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  return (
    <Paper
      p="md"
      radius="lg"
      withBorder
      style={{
        background:
          colorScheme === 'dark' ? theme.colors.dark[6] : theme.white,
        borderColor:
          colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2],
      }}
    >
      <Group gap="sm" align="flex-start">
        <ThemeIcon size={36} radius="md" color={color} variant="light">
          {icon}
        </ThemeIcon>
        <div>
          <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={0.5}>
            {label}
          </Text>
          <Text size="sm" fw={700} mt={2}>
            {value}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

// ─── Alignment Bar ───────────────────────────────────────────────────────────
function AlignmentBar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <Stack gap={4}>
      <Group justify="space-between">
        <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts={0.5}>
          {label}
        </Text>
        <Text size="xs" fw={700}>
          {Math.round(value)}%
        </Text>
      </Group>
      <Progress value={value} color={color} radius="xl" size="sm" />
    </Stack>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function CareerGuidanceDetailsPage({
  data,
  loading = false,
  error = null,
}: CareerGuidanceDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  const guidanceId = useMemo(() => (id ? parseInt(id, 10) : null), [id]);
  const {
    data: fetchedData,
    isLoading: pageLoading,
    error: apiError,
  } = useGetCareerGuidance(guidanceId);

  const guidanceData = data || (fetchedData as CareerGuidanceDetail | null | undefined);
  const pageError = error || (apiError instanceof Error ? apiError.message : null);

  const isDark = colorScheme === 'dark';
  const bg = isDark ? theme.colors.dark[7] : theme.white;
  const subBg = isDark ? theme.colors.dark[6] : theme.colors.gray[0];
  const border = isDark ? theme.colors.dark[4] : theme.colors.gray[2];
  const primary = theme.primaryColor;

  const safeNumber = (v: string | number | undefined) =>
    typeof v === 'string' ? parseFloat(v) || 0 : v || 0;

  // ── Loading ──
  if (loading || pageLoading) {
    return (
      <Container
        size="xl"
        py="xl"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}
      >
        <Stack align="center" gap="md">
          <Loader size="lg" color={primary} />
          <Text c="dimmed" size="sm">
            Loading career guidance…
          </Text>
        </Stack>
      </Container>
    );
  }

  // ── Error ──
  if (pageError || !guidanceData) {
    return (
      <Container size="xl" py="xl">
        <Alert color="red" title="Something went wrong" radius="md">
          {pageError || 'Failed to load career guidance details.'}
        </Alert>
        <Button
          mt="md"
          variant="light"
          leftSection={<IconArrowLeft size={14} />}
          onClick={() => navigate(-1)}
        >
          Go Back
        </Button>
      </Container>
    );
  }

  // ── Recharts data helpers ──
  const careerBarData = (guidanceData.careers || []).map((c) => ({
    name: c.career_title?.split(' ').slice(0, 2).join(' '),
    demand: Number(c.job_market_demand_score) || 0,
    growth: Number(c.growth_rate) || 0,
  }));

  const recommendationRadarData = (guidanceData.recommendations || [])
    .slice(0, 1)
    .flatMap((rec) => [
      { subject: 'Personality', value: safeNumber(rec.personality_alignment) },
      { subject: 'Skills', value: safeNumber(rec.skill_alignment) },
      { subject: 'Interest', value: safeNumber(rec.interest_alignment) },
      { subject: 'Overall', value: safeNumber(rec.match_score) },
    ]);

  const COLORS = [
    theme.colors[primary][6],
    theme.colors.cyan[6],
    theme.colors.grape[6],
    theme.colors.teal[6],
    theme.colors.orange[6],
  ];

  return (
    <Container size="xl" py="xl">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">

        {/* ── Page Header ── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
          <Group justify="space-between" align="center">
            <Stack gap={2}>
              <Text size="xs" c="dimmed" fw={600} tt="uppercase" lts={1}>
                Career Guidance
              </Text>
              <Title order={2} fw={800}>
                Guidance Details
              </Title>
            </Stack>
            <Button
              variant="default"
              size="sm"
              leftSection={<IconArrowLeft size={14} />}
              radius="md"
              onClick={() => navigate(-1)}
            >
              Back
            </Button>
          </Group>
        </motion.div>

        {/* ── Profile Card ── */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
          <Paper
            p="xl"
            radius="xl"
            withBorder
            style={{ background: bg, borderColor: border }}
          >
            <Group justify="space-between" align="flex-start" mb="lg" wrap="wrap">
              <Stack gap={4}>
                <Group gap="xs" align="center">
                  <ThemeIcon size={28} radius="md" color={primary} variant="filled">
                    <IconStar size={14} />
                  </ThemeIcon>
                  <Title order={4} fw={700}>
                    Your Profile
                  </Title>
                </Group>
                <Text size="sm" c="dimmed">
                  Code:{' '}
                  <Text component="span" fw={700} c={`${primary}.6`}>
                    {guidanceData.career_guidance_code}
                  </Text>
                </Text>
              </Stack>
              <Badge
                size="lg"
                radius="md"
                color={guidanceData.status === 'active' ? 'green' : 'gray'}
                variant="light"
                leftSection={<IconCheck size={12} />}
              >
                {guidanceData.status?.toUpperCase()}
              </Badge>
            </Group>

            {/* Stats row */}
            <Grid gutter="sm" mb="lg">
              <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
                <StatTile
                  icon={<IconClock size={16} />}
                  label="Created"
                  value={new Date(guidanceData.created_at || '').toLocaleDateString()}
                  color="violet"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
                <StatTile
                  icon={<IconBriefcase size={16} />}
                  label="Careers"
                  value={String((guidanceData.careers || []).length)}
                  color={primary}
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
                <StatTile
                  icon={<IconBulb size={16} />}
                  label="Recommendations"
                  value={String((guidanceData.recommendations || []).length)}
                  color="cyan"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
                <StatTile
                  icon={<IconChartBar size={16} />}
                  label="Skills"
                  value={String((guidanceData.career_skills || []).length)}
                  color="teal"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
                <StatTile
                  icon={<IconBuilding size={16} />}
                  label="Companies"
                  value={String((guidanceData.career_companies || []).length)}
                  color="orange"
                />
              </Grid.Col>
              <Grid.Col span={{ base: 6, sm: 4, md: 2 }}>
                <StatTile
                  icon={<IconTrendingUp size={16} />}
                  label="Trends"
                  value={String((guidanceData.market_trends || []).length)}
                  color="grape"
                />
              </Grid.Col>
            </Grid>

            <Grid gutter="md">
              {(guidanceData.interests || []).length > 0 && (
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Stack gap="xs">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
                      Interests
                    </Text>
                    <Group gap="xs" wrap="wrap">
                      {(guidanceData.interests || []).map((interest) => (
                        <Badge key={interest} size="md" radius="md" variant="filled" color={primary}>
                          {interest}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                </Grid.Col>
              )}
              {(guidanceData.current_skills || []).length > 0 && (
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Stack gap="xs">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
                      Current Skills
                    </Text>
                    <Group gap="xs" wrap="wrap">
                      {(guidanceData.current_skills || []).map((skill) => (
                        <Badge key={skill} size="md" radius="md" variant="dot" color="cyan">
                          {skill}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                </Grid.Col>
              )}
              {guidanceData.experience && (
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Stack gap="xs">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
                      Experience
                    </Text>
                    <Text size="sm" lineClamp={2}>
                      {guidanceData.experience}
                    </Text>
                  </Stack>
                </Grid.Col>
              )}
              {guidanceData.career_goals && (
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Stack gap="xs">
                    <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
                      Career Goals
                    </Text>
                    <Text size="sm" lineClamp={2}>
                      {guidanceData.career_goals}
                    </Text>
                  </Stack>
                </Grid.Col>
              )}
            </Grid>
          </Paper>
        </motion.div>

        {/* ── Tabs ── */}
        <motion.div variants={itemVariants}>
          <Tabs
            value={activeTab}
            onChange={setActiveTab}
            variant="pills"
            radius="md"
          >
            <Paper
              p="xs"
              radius="xl"
              withBorder
              mb="xl"
              style={{ background: subBg, borderColor: border }}
            >
              <Tabs.List style={{ gap: 4, flexWrap: 'wrap' }}>
                <Tabs.Tab value="overview" leftSection={<IconTarget size={14} />}>
                  Careers
                </Tabs.Tab>
                <Tabs.Tab value="recommendations" leftSection={<IconBriefcase size={14} />}>
                  Recommendations
                </Tabs.Tab>
                <Tabs.Tab value="skills" leftSection={<IconTrendingUp size={14} />}>
                  Skills
                </Tabs.Tab>
                <Tabs.Tab value="companies" leftSection={<IconUsers size={14} />}>
                  Companies
                </Tabs.Tab>
                <Tabs.Tab value="trends" leftSection={<IconChartLine size={14} />}>
                  Trends
                </Tabs.Tab>
              </Tabs.List>
            </Paper>

            {/* ══ Tab 1: Recommended Careers ══ */}
            <Tabs.Panel value="overview">
              <Stack gap="lg">
                {/* Bar Chart Overview */}
                {careerBarData.length > 0 && (
                  <motion.div variants={cardVariants}>
                    <Paper p="xl" radius="xl" withBorder style={{ background: bg, borderColor: border }}>
                      <Text fw={700} mb="lg" size="sm" tt="uppercase" lts={0.5} c="dimmed">
                        Market Demand & Growth Rate
                      </Text>
                      <ResponsiveContainer width="100%" height={220}>
                        <BarChart data={careerBarData} barGap={4}>
                          <CartesianGrid
                            strokeDasharray="3 3"
                            stroke={isDark ? theme.colors.dark[4] : theme.colors.gray[2]}
                          />
                          <XAxis
                            dataKey="name"
                            tick={{ fontSize: 11, fill: isDark ? theme.colors.dark[2] : theme.colors.gray[6] }}
                          />
                          <YAxis
                            tick={{ fontSize: 11, fill: isDark ? theme.colors.dark[2] : theme.colors.gray[6] }}
                          />
                          <Tooltip
                            contentStyle={{
                              background: isDark ? theme.colors.dark[7] : theme.white,
                              border: `1px solid ${border}`,
                              borderRadius: 10,
                              fontSize: 12,
                            }}
                          />
                          <Bar dataKey="demand" name="Market Demand %" radius={[6, 6, 0, 0]}>
                            {careerBarData.map((_, i) => (
                              <Cell key={i} fill={COLORS[i % COLORS.length]} />
                            ))}
                          </Bar>
                          <Bar
                            dataKey="growth"
                            name="Growth Rate %"
                            fill={theme.colors.cyan[5]}
                            radius={[6, 6, 0, 0]}
                            opacity={0.7}
                          />
                        </BarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </motion.div>
                )}

                {(guidanceData.careers || []).map((career, index) => (
                  <motion.div key={career.id} variants={cardVariants}>
                    <Paper p="xl" radius="xl" withBorder style={{ background: bg, borderColor: border }}>
                      <Stack gap="lg">
                        {/* Career Header */}
                        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                          <Stack gap={6} style={{ flex: 1 }}>
                            <Group gap="xs" align="center">
                              <ThemeIcon
                                size={32}
                                radius="md"
                                color={COLORS[index % COLORS.length] ? primary : primary}
                                variant="light"
                              >
                                <IconBriefcase size={16} />
                              </ThemeIcon>
                              <Title order={4} fw={700}>
                                {career.career_title}
                              </Title>
                              <Badge size="sm" radius="md" color="green" variant="filled">
                                #{index + 1} Pick
                              </Badge>
                            </Group>
                            <Text size="sm" c="dimmed" style={{ maxWidth: 560 }}>
                              {career.description}
                            </Text>
                          </Stack>
                          <Stack align="center" gap={4}>
                            <RingProgress
                              sections={[
                                {
                                  value: Number(career.job_market_demand_score) || 0,
                                  color: theme.colors[primary][6],
                                },
                              ]}
                              label={
                                <Text fw={800} size="sm" ta="center">
                                  {Math.round(Number(career.job_market_demand_score) || 0)}%
                                </Text>
                              }
                              size={88}
                              thickness={7}
                            />
                            <Text size="xs" c="dimmed" fw={600}>
                              Market Demand
                            </Text>
                          </Stack>
                        </Group>

                        {/* Metrics */}
                        <Grid gutter="sm">
                          <Grid.Col span={{ base: 6, md: 3 }}>
                            <Paper p="sm" radius="lg" style={{ background: subBg }}>
                              <Group gap={6} mb={4}>
                                <IconBuilding size={14} color={theme.colors[primary][5]} />
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts={0.5}>
                                  Industry
                                </Text>
                              </Group>
                              <Badge radius="md" variant="light" color={primary} size="md">
                                {career.industry}
                              </Badge>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={{ base: 6, md: 3 }}>
                            <Paper p="sm" radius="lg" style={{ background: subBg }}>
                              <Group gap={6} mb={4}>
                                <IconBolt size={14} color={theme.colors.yellow[5]} />
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts={0.5}>
                                  Demand
                                </Text>
                              </Group>
                              <Badge
                                radius="md"
                                color={career.demand_level === 'High' ? 'green' : 'yellow'}
                                variant="light"
                                size="md"
                              >
                                {career.demand_level}
                              </Badge>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={{ base: 6, md: 3 }}>
                            <Paper p="sm" radius="lg" style={{ background: subBg }}>
                              <Group gap={6} mb={4}>
                                <IconCoin size={14} color={theme.colors.teal[5]} />
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts={0.5}>
                                  Salary
                                </Text>
                              </Group>
                              <Text size="sm" fw={700}>
                                ${Number(career.salary_min).toLocaleString()} –{' '}
                                ${Number(career.salary_max).toLocaleString()}
                              </Text>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={{ base: 6, md: 3 }}>
                            <Paper p="sm" radius="lg" style={{ background: subBg }}>
                              <Group gap={6} mb={6}>
                                <IconTrendingUp size={14} color={theme.colors.cyan[5]} />
                                <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts={0.5}>
                                  Growth Rate
                                </Text>
                              </Group>
                              <Progress
                                value={Number(career.growth_rate) || 0}
                                color="cyan"
                                radius="xl"
                                size="sm"
                                mb={4}
                              />
                              <Text size="xs" fw={600}>
                                {Number(career.growth_rate).toFixed(1)}%
                              </Text>
                            </Paper>
                          </Grid.Col>
                        </Grid>

                        {/* Responsibilities */}
                        <Stack gap={6}>
                          <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
                            Responsibilities
                          </Text>
                          <Text size="sm">{career.job_responsibilities}</Text>
                        </Stack>

                        {/* Growth Path */}
                        <Stack gap={6}>
                          <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
                            Career Growth Path
                          </Text>
                          <Paper p="md" radius="lg" style={{ background: subBg }}>
                            <Text size="sm">{career.career_growth_path}</Text>
                          </Paper>
                        </Stack>

                        {/* CTA */}
                        <Button
                          leftSection={<IconBook size={16} />}
                          radius="md"
                          color={primary}
                          onClick={() => {
                            sessionStorage.setItem('prefilledCareerGoal', career.career_title);
                            navigate('/guidance');
                          }}
                        >
                          Start Learning Guidance
                        </Button>
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
              </Stack>
            </Tabs.Panel>

            {/* ══ Tab 2: Detailed Recommendations ══ */}
            <Tabs.Panel value="recommendations">
              <Stack gap="lg">
                {/* Radar Chart */}
                {recommendationRadarData.length > 0 && (
                  <motion.div variants={cardVariants}>
                    <Paper p="xl" radius="xl" withBorder style={{ background: bg, borderColor: border }}>
                      <Text fw={700} mb="lg" size="sm" tt="uppercase" lts={0.5} c="dimmed">
                        Top Match Alignment (Rank #1)
                      </Text>
                      <ResponsiveContainer width="100%" height={240}>
                        <RadarChart data={recommendationRadarData}>
                          <PolarGrid stroke={isDark ? theme.colors.dark[4] : theme.colors.gray[3]} />
                          <PolarAngleAxis
                            dataKey="subject"
                            tick={{ fontSize: 12, fill: isDark ? theme.colors.dark[2] : theme.colors.gray[6] }}
                          />
                          <PolarRadiusAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
                          <Radar
                            dataKey="value"
                            stroke={theme.colors[primary][6]}
                            fill={theme.colors[primary][6]}
                            fillOpacity={0.25}
                          />
                          <Tooltip
                            contentStyle={{
                              background: isDark ? theme.colors.dark[7] : theme.white,
                              border: `1px solid ${border}`,
                              borderRadius: 10,
                              fontSize: 12,
                            }}
                          />
                        </RadarChart>
                      </ResponsiveContainer>
                    </Paper>
                  </motion.div>
                )}

                {(guidanceData.recommendations || []).map((rec) => (
                  <motion.div key={rec.id} variants={cardVariants}>
                    <Paper p="xl" radius="xl" withBorder style={{ background: bg, borderColor: border }}>
                      <Stack gap="lg">
                        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                          <Stack gap={4} style={{ flex: 1 }}>
                            <Group gap="xs">
                              <Title order={4} fw={700}>
                                {rec.career_title}
                              </Title>
                              <Badge size="sm" radius="md" color="blue" variant="light">
                                Rank {rec.rank}
                              </Badge>
                            </Group>
                            <Text size="sm" c="dimmed">
                              Match Score
                            </Text>
                          </Stack>
                          <RingProgress
                            sections={[{ value: safeNumber(rec.match_score), color: theme.colors.green[6] }]}
                            label={
                              <Text fw={800} size="sm" ta="center">
                                {Math.round(safeNumber(rec.match_score))}%
                              </Text>
                            }
                            size={88}
                            thickness={7}
                          />
                        </Group>

                        <Stack gap="sm">
                          <AlignmentBar label="Personality Alignment" value={safeNumber(rec.personality_alignment)} color="blue" />
                          <AlignmentBar label="Skill Alignment" value={safeNumber(rec.skill_alignment)} color="cyan" />
                          <AlignmentBar label="Interest Alignment" value={safeNumber(rec.interest_alignment)} color="grape" />
                          <AlignmentBar label="Overall Match" value={safeNumber(rec.match_score)} color="green" />
                        </Stack>

                        <Paper p="md" radius="lg" style={{ background: subBg }}>
                          <Text size="sm">{rec.reasoning}</Text>
                        </Paper>

                        <Stack gap={8}>
                          <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
                            Next Steps
                          </Text>
                          <Stack gap={6}>
                            {rec.next_steps.map((step, i) => (
                              <Group key={i} gap="sm" align="flex-start">
                                <ThemeIcon size={20} radius="xl" color={primary} variant="light">
                                  <Text size="xs" fw={700}>{i + 1}</Text>
                                </ThemeIcon>
                                <Text size="sm" style={{ flex: 1 }}>
                                  {step}
                                </Text>
                              </Group>
                            ))}
                          </Stack>
                        </Stack>
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
              </Stack>
            </Tabs.Panel>

            {/* ══ Tab 3: Skills Development ══ */}
            <Tabs.Panel value="skills">
              <Stack gap="md">
                <Accordion radius="lg" variant="separated">
                  {(guidanceData.career_skills || []).map((skill, index) => (
                    <Accordion.Item
                      key={skill.id}
                      value={`skill-${index}`}
                      style={{
                        background: bg,
                        border: `1px solid ${border}`,
                        borderRadius: 16,
                      }}
                    >
                      <Accordion.Control>
                        <Group justify="space-between" style={{ flex: 1 }} wrap="wrap" gap="sm">
                          <Stack gap={2}>
                            <Text fw={600} size="sm">
                              {skill.skill_name}
                            </Text>
                            {skill.career_title && (
                              <Text size="xs" c="dimmed">
                                for {skill.career_title}
                              </Text>
                            )}
                          </Stack>
                          <Group gap="xs">
                            <Badge size="sm" radius="md" variant="light" color="blue">
                              {skill.importance_level}
                            </Badge>
                            <Badge size="sm" radius="md" variant="light" color="cyan">
                              {skill.proficiency_required}
                            </Badge>
                          </Group>
                        </Group>
                      </Accordion.Control>
                      <Accordion.Panel>
                        <Stack gap="md">
                          <Paper p="md" radius="lg" style={{ background: subBg }}>
                            <Text size="sm">{skill.learning_path}</Text>
                          </Paper>
                          <Group gap="md">
                            <Stack gap={4}>
                              <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts={0.5}>
                                Importance
                              </Text>
                              <Badge color="blue" radius="md" variant="filled">
                                {skill.importance_level}
                              </Badge>
                            </Stack>
                            <Stack gap={4}>
                              <Text size="xs" fw={600} c="dimmed" tt="uppercase" lts={0.5}>
                                Required Proficiency
                              </Text>
                              <Badge color="cyan" radius="md" variant="filled">
                                {skill.proficiency_required}
                              </Badge>
                            </Stack>
                          </Group>
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Stack>
            </Tabs.Panel>

            {/* ══ Tab 4: Companies & Industries ══ */}
            <Tabs.Panel value="companies">
              <Stack gap="lg">
                {(guidanceData.career_companies || []).map((company) => (
                  <motion.div key={company.id} variants={cardVariants}>
                    <Paper p="xl" radius="xl" withBorder style={{ background: bg, borderColor: border }}>
                      <Stack gap="lg">
                        <Group justify="space-between" align="flex-start" wrap="wrap">
                          <Stack gap={4}>
                            <Group gap="xs">
                              <ThemeIcon size={28} radius="md" color="orange" variant="light">
                                <IconBuilding size={14} />
                              </ThemeIcon>
                              <Title order={4} fw={700}>
                                {company.company_name}
                              </Title>
                            </Group>
                            {company.career_title && (
                              <Text size="sm" c="dimmed">
                                {company.career_title}
                              </Text>
                            )}
                          </Stack>
                          <Badge size="lg" radius="md" color="blue" variant="light">
                            {company.hiring_level}
                          </Badge>
                        </Group>

                        <Grid gutter="sm">
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Paper p="sm" radius="lg" style={{ background: subBg }}>
                              <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5} mb={6}>
                                Industry
                              </Text>
                              <Badge radius="md" variant="light" color={primary} size="md">
                                {company.industry}
                              </Badge>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Paper p="sm" radius="lg" style={{ background: subBg }}>
                              <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5} mb={6}>
                                Hiring Level
                              </Text>
                              <Badge radius="md" variant="filled" color="cyan" size="md">
                                {company.hiring_level}
                              </Badge>
                            </Paper>
                          </Grid.Col>
                        </Grid>

                        <Paper p="md" radius="lg" style={{ background: subBg }}>
                          <Text size="sm">{company.job_market_opportunity}</Text>
                        </Paper>
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
              </Stack>
            </Tabs.Panel>

            {/* ══ Tab 5: Market Trends ══ */}
            <Tabs.Panel value="trends">
              <Stack gap="lg">
                {(guidanceData.market_trends || []).map((trend) => (
                  <motion.div key={trend.id} variants={cardVariants}>
                    <Paper p="xl" radius="xl" withBorder style={{ background: bg, borderColor: border }}>
                      <Stack gap="lg">
                        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                          <Stack gap={4} style={{ flex: 1 }}>
                            <Group gap="xs">
                              <ThemeIcon
                                size={28}
                                radius="md"
                                color={trend.impact_level === 'high' ? 'red' : trend.impact_level === 'medium' ? 'yellow' : 'blue'}
                                variant="light"
                              >
                                {trend.impact_level === 'high' ? <IconFlame size={14} /> : <IconTrendingUp size={14} />}
                              </ThemeIcon>
                              <Title order={4} fw={700}>
                                {trend.trend_name}
                              </Title>
                            </Group>
                            <Text size="sm" c="dimmed">
                              {trend.career_title}
                            </Text>
                          </Stack>
                          <Group gap="md" align="center">
                            <Badge
                              size="lg"
                              radius="md"
                              variant="light"
                              color={trend.impact_level === 'high' ? 'red' : trend.impact_level === 'medium' ? 'yellow' : 'blue'}
                            >
                              {trend.impact_level} impact
                            </Badge>
                            <Stack align="center" gap={2}>
                              <RingProgress
                                sections={[
                                  {
                                    value: trend.growth_potential,
                                    color: trend.growth_potential >= 80 ? theme.colors.green[6] : theme.colors.yellow[6],
                                  },
                                ]}
                                label={
                                  <Text fw={800} size="xs" ta="center">
                                    {trend.growth_potential}%
                                  </Text>
                                }
                                size={72}
                                thickness={6}
                              />
                              <Text size="xs" c="dimmed">
                                Growth
                              </Text>
                            </Stack>
                          </Group>
                        </Group>

                        <Text size="sm">{trend.trend_description}</Text>

                        <Grid gutter="sm">
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Paper p="md" radius="lg" style={{ background: subBg }}>
                              <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5} mb={10}>
                                Current Data
                              </Text>
                              <Stack gap={6}>
                                {typeof trend.current_data === 'object' &&
                                  trend.current_data !== null &&
                                  Object.entries(trend.current_data).map(([key, value]) => (
                                    <Group key={key} justify="space-between">
                                      <Text size="xs" c="dimmed" style={{ textTransform: 'capitalize' }}>
                                        {key.replace(/_/g, ' ')}
                                      </Text>
                                      <Text size="xs" fw={700}>
                                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                      </Text>
                                    </Group>
                                  ))}
                              </Stack>
                            </Paper>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Paper p="md" radius="lg" style={{ background: subBg }}>
                              <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5} mb={10}>
                                Forecast
                              </Text>
                              <Stack gap={6}>
                                {typeof trend.forecast === 'object' &&
                                  trend.forecast !== null &&
                                  Object.entries(trend.forecast).map(([key, value]) => (
                                    <Group key={key} justify="space-between">
                                      <Text size="xs" c="dimmed" style={{ textTransform: 'capitalize' }}>
                                        {key.replace(/_/g, ' ')}
                                      </Text>
                                      <Text size="xs" fw={700}>
                                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                      </Text>
                                    </Group>
                                  ))}
                              </Stack>
                            </Paper>
                          </Grid.Col>
                        </Grid>

                        {trend.in_demand_skills && trend.in_demand_skills.length > 0 && (
                          <Stack gap={6}>
                            <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={0.5}>
                              In-Demand Skills
                            </Text>
                            <Group gap="xs" wrap="wrap">
                              {trend.in_demand_skills.map((skill) => (
                                <Badge key={skill} size="sm" radius="md" variant="dot" color={primary}>
                                  {skill}
                                </Badge>
                              ))}
                            </Group>
                          </Stack>
                        )}
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </motion.div>

        {/* ── Summary & Guidance ── */}
        <motion.div variants={itemVariants} style={{ marginTop: 'var(--mantine-spacing-xl)' }}>
          {/* Summary gradient card */}
          <Paper
            p="xl"
            radius="xl"
            mb="lg"
            style={{ backgroundImage: 'var(--gradient-primary)', overflow: 'hidden', position: 'relative' }}
          >
            <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
              <Stack gap="xs" style={{ flex: 1 }}>
                <Text size="xs" fw={700} c="rgba(255,255,255,0.7)" tt="uppercase" lts={1}>
                  Career Potential Summary
                </Text>
                <Title order={3} c="white" fw={800}>
                  Your Path Forward
                </Title>
                <Text c="rgba(255,255,255,0.85)" size="sm" style={{ maxWidth: 560 }}>
                  {guidanceData.summary}
                </Text>
              </Stack>
              <ThemeIcon size={56} radius="xl" color="white" variant="white" style={{ opacity: 0.15 }}>
                <IconBulb size={32} />
              </ThemeIcon>
            </Group>
          </Paper>

          {/* AI Guidance alert */}
          <Alert
            icon={<IconBulb size={16} />}
            color={primary}
            radius="xl"
            title="AI Guidance"
            variant="light"
          >
            {guidanceData.guidance}
          </Alert>
        </motion.div>
      </motion.div>
    </Container>
  );
}