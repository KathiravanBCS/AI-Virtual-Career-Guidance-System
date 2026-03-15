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
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowRight,
  IconBook,
  IconBriefcase,
  IconBulb,
  IconChartLine,
  IconFlame,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';

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
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
};

export function CareerGuidanceDetailsPage({ data, loading = false, error = null }: CareerGuidanceDetailsPageProps) {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const guidanceId = useMemo(() => (id ? parseInt(id, 10) : null), [id]);
  const { data: fetchedData, isLoading: pageLoading, error: apiError } = useGetCareerGuidance(guidanceId);

  const guidanceData = data || (fetchedData as CareerGuidanceDetail | null | undefined);
  const pageError = error || (apiError instanceof Error ? apiError.message : null);

  if (pageLoading) {
    return (
      <Container
        size="xl"
        py="xl"
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}
      >
        <Stack align="center" gap="md">
          <Loader size="lg" />
          <Text c="dimmed">Loading career guidance details...</Text>
        </Stack>
      </Container>
    );
  }

  if (pageError || !guidanceData) {
    return (
      <Container size="xl" py="xl">
        <Alert color="red" title="Error">
          {pageError || 'Failed to load career guidance details'}
        </Alert>
        <Button mt="md" onClick={() => navigate(-1)} leftSection={<IconArrowLeft size={14} />}>
          Go Back
        </Button>
      </Container>
    );
  }

  const safeNumber = (value: string | number | undefined) => {
    if (typeof value === 'string') {
      return parseFloat(value) || 0;
    }
    return value || 0;
  };

  return (
    <Container size="xl" py="xl">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
          <Group justify="space-between" align="flex-start" mb="md">
            <div>
              <Group gap="md" mb="md">
                <Title order={2}>Career Guidance Details</Title>
              </Group>
            </div>
            <Button variant="light" size="sm" onClick={() => navigate(-1)} leftSection={<IconArrowLeft size={16} />}>
              Back
            </Button>
          </Group>
        </motion.div>

        {/* User Profile Summary */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
          <Paper
            p="md"
            radius="md"
            withBorder
            style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
          >
            <Stack gap="md">
              <Group justify="space-between" align="center">
                <div>
                  <Title order={4}>Your Profile</Title>
                  <Text size="sm" c="dimmed" mt="xs">
                    Code:{' '}
                    <Text component="span" fw={600}>
                      {guidanceData.career_guidance_code}
                    </Text>
                  </Text>
                </div>
                <Badge size="lg" color={guidanceData.status === 'active' ? 'green' : 'gray'} radius="sm">
                  {guidanceData.status?.toUpperCase()}
                </Badge>
              </Group>

              <Group gap="lg" align="center">
                <Group gap={4} align="flex-end">
                  <Text size="xs" c="dimmed" fw={500}>
                    CREATED
                  </Text>
                  <Text size="sm" fw={500}>
                    {new Date(guidanceData.created_at || '').toLocaleDateString()}
                  </Text>
                </Group>
                <Text c="dimmed">•</Text>
                <Group gap={4} align="flex-end">
                  <Text size="xs" c="dimmed" fw={500}>
                    CAREERS
                  </Text>
                  <Text size="sm" fw={500}>
                    {(guidanceData.careers || []).length}
                  </Text>
                </Group>
                <Text c="dimmed">•</Text>
                <Group gap={4} align="flex-end">
                  <Text size="xs" c="dimmed" fw={500}>
                    RECOMMENDATIONS
                  </Text>
                  <Text size="sm" fw={500}>
                    {(guidanceData.recommendations || []).length}
                  </Text>
                </Group>
              </Group>

              <Grid gutter="lg">
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed" fw={500}>
                      INTERESTS
                    </Text>
                    <Group gap="xs">
                      {(guidanceData.interests || []).map((interest) => (
                        <Badge key={interest} size="md" variant="filled">
                          {interest}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                </Grid.Col>

                {guidanceData.current_skills && guidanceData.current_skills.length > 0 && (
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed" fw={500}>
                        SKILLS
                      </Text>
                      <Group gap="xs">
                        {(guidanceData.current_skills || []).map((skill) => (
                          <Badge key={skill} size="md" variant="dot">
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
                      <Text size="sm" c="dimmed" fw={500}>
                        EXPERIENCE
                      </Text>
                      <Text size="sm">{guidanceData.experience.substring(0, 50)}...</Text>
                    </Stack>
                  </Grid.Col>
                )}

                {guidanceData.career_goals && (
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed" fw={500}>
                        GOALS
                      </Text>
                      <Text size="sm">{guidanceData.career_goals.substring(0, 50)}...</Text>
                    </Stack>
                  </Grid.Col>
                )}
              </Grid>
            </Stack>
          </Paper>
        </motion.div>

        {/* Main Tabs */}
        <motion.div variants={itemVariants}>
          <Tabs value={activeTab} onChange={setActiveTab} defaultValue="overview">
            <Tabs.List>
              <Tabs.Tab value="overview" leftSection={<IconTarget size={14} />}>
                Recommended Careers
              </Tabs.Tab>
              <Tabs.Tab value="recommendations" leftSection={<IconBriefcase size={14} />}>
                Detailed Recommendations
              </Tabs.Tab>
              <Tabs.Tab value="skills" leftSection={<IconTrendingUp size={14} />}>
                Skills Development
              </Tabs.Tab>
              <Tabs.Tab value="companies" leftSection={<IconUsers size={14} />}>
                Companies & Industries
              </Tabs.Tab>
              <Tabs.Tab value="trends" leftSection={<IconChartLine size={14} />}>
                Market Trends
              </Tabs.Tab>
            </Tabs.List>

            {/* Tab 1: Recommended Careers Overview */}
            <Tabs.Panel value="overview" pt="xl">
              <Stack gap="lg">
                {(guidanceData.careers || []).map((career, index) => (
                  <motion.div key={career.id} variants={itemVariants}>
                    <Card
                      p="lg"
                      radius="md"
                      withBorder
                      style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                    >
                      <Stack gap="md">
                        {/* Header */}
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Group gap="xs" mb="xs">
                              <Title order={4}>{career.career_title}</Title>
                              <Badge size="lg" color="green">
                                Top {index + 1}
                              </Badge>
                            </Group>
                            <Text c="dimmed" mt="xs">
                              {career.description}
                            </Text>
                          </div>
                          <Stack align="center" gap="sm">
                            <RingProgress
                              sections={[
                                {
                                  value: Number(career.job_market_demand_score) || 0,
                                  color: 'green',
                                },
                              ]}
                              label={
                                <Text fw={700} size="sm">
                                  {Math.round(Number(career.job_market_demand_score) || 0)}%
                                </Text>
                              }
                              size={90}
                              thickness={6}
                            />
                            <Text size="xs" c="dimmed">
                              Market Demand
                            </Text>
                          </Stack>
                        </Group>

                        {/* Details Grid */}
                        <Grid gutter="md">
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                INDUSTRY
                              </Text>
                              <Badge size="lg" variant="light">
                                {career.industry}
                              </Badge>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                DEMAND LEVEL
                              </Text>
                              <Badge size="lg" color={career.demand_level === 'High' ? 'green' : 'yellow'}>
                                {career.demand_level}
                              </Badge>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                SALARY RANGE
                              </Text>
                              <Text size="sm" fw={500}>
                                ${Number(career.salary_min).toLocaleString()} - $
                                {Number(career.salary_max).toLocaleString()}
                              </Text>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                GROWTH RATE
                              </Text>
                              <Progress value={Number(career.growth_rate) || 0} color="cyan" />
                              <Text size="xs">{Number(career.growth_rate).toFixed(2)}%</Text>
                            </Stack>
                          </Grid.Col>
                        </Grid>

                        {/* Responsibilities */}
                        <Stack gap="xs">
                          <Text fw={500} size="sm">
                            Job Responsibilities:
                          </Text>
                          <Text size="sm" c="dimmed">
                            {career.job_responsibilities}
                          </Text>
                        </Stack>

                        {/* Growth Path */}
                         <Stack gap="xs">
                           <Text fw={500} size="sm">
                             Career Growth Path:
                           </Text>
                           <Paper
                             p="sm"
                             radius="md"
                             style={{
                               backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
                             }}
                           >
                             <Text size="sm">{career.career_growth_path}</Text>
                           </Paper>
                         </Stack>

                         {/* Learning Guidance Button */}
                         <Button
                           fullWidth
                           leftSection={<IconBook size={18} />}
                           onClick={() => {
                             sessionStorage.setItem('prefilledCareerGoal', career.career_title);
                             navigate('/guidance');
                           }}
                         >
                           Start Learning Guidance
                         </Button>
                        </Stack>
                        </Card>
                        </motion.div>
                        ))}
              </Stack>
            </Tabs.Panel>

            {/* Tab 2: Detailed Recommendations */}
            <Tabs.Panel value="recommendations" pt="xl">
              <Stack gap="lg">
                {(guidanceData.recommendations || []).map((rec) => (
                  <motion.div key={rec.id} variants={itemVariants}>
                    <Card
                      p="lg"
                      radius="md"
                      withBorder
                      style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                    >
                      <Stack gap="md">
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Group gap="xs" mb="xs">
                              <Title order={4}>{rec.career_title}</Title>
                              <Badge size="md" color="blue">
                                Rank {rec.rank}
                              </Badge>
                            </Group>
                          </div>
                          <RingProgress
                            sections={[
                              {
                                value: safeNumber(rec.match_score),
                                color: 'green',
                              },
                            ]}
                            label={
                              <Text fw={700} size="sm">
                                {Math.round(safeNumber(rec.match_score))}%
                              </Text>
                            }
                            size={100}
                            thickness={6}
                          />
                        </Group>

                        <Grid gutter="md">
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                Personality Alignment
                              </Text>
                              <Progress value={safeNumber(rec.personality_alignment)} color="blue" />
                              <Text size="xs">{safeNumber(rec.personality_alignment)}%</Text>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                Skill Alignment
                              </Text>
                              <Progress value={safeNumber(rec.skill_alignment)} color="cyan" />
                              <Text size="xs">{safeNumber(rec.skill_alignment)}%</Text>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                Interest Alignment
                              </Text>
                              <Progress value={safeNumber(rec.interest_alignment)} color="grape" />
                              <Text size="xs">{safeNumber(rec.interest_alignment)}%</Text>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                Overall Match
                              </Text>
                              <Progress value={safeNumber(rec.match_score)} color="green" />
                              <Text size="xs">{safeNumber(rec.match_score)}%</Text>
                            </Stack>
                          </Grid.Col>
                        </Grid>

                        <Paper
                          p="sm"
                          radius="md"
                          style={{
                            backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
                          }}
                        >
                          <Text size="sm">{rec.reasoning}</Text>
                        </Paper>

                        <Stack gap="xs">
                          <Text fw={500} size="sm">
                            Next Steps:
                          </Text>
                          <ol style={{ marginLeft: 20, marginTop: 8 }}>
                            {rec.next_steps.map((step, i) => (
                              <li key={i}>
                                <Text size="sm">{step}</Text>
                              </li>
                            ))}
                          </ol>
                        </Stack>
                      </Stack>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </Tabs.Panel>

            {/* Tab 3: Skills Development */}
            <Tabs.Panel value="skills" pt="xl">
              <Stack gap="lg">
                <Accordion>
                  {(guidanceData.career_skills || []).map((skill, index) => (
                    <Accordion.Item key={skill.id} value={`skill-${index}`}>
                      <Accordion.Control>
                        <Group justify="space-between" style={{ flex: 1 }}>
                          <div>
                            <Text fw={500}>{skill.skill_name}</Text>
                            {skill.career_title && (
                              <Text size="sm" c="dimmed">
                                for {skill.career_title}
                              </Text>
                            )}
                          </div>
                          <Group gap="xs">
                            <Badge size="sm" variant="light" color="blue">
                              {skill.importance_level}
                            </Badge>
                            <Badge size="sm" variant="light" color="cyan">
                              {skill.proficiency_required}
                            </Badge>
                          </Group>
                        </Group>
                      </Accordion.Control>

                      <Accordion.Panel>
                        <Stack gap="md">
                          <Paper
                            p="md"
                            radius="md"
                            style={{
                              backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
                            }}
                          >
                            <Text size="sm">{skill.learning_path}</Text>
                          </Paper>

                          <Stack gap="xs">
                            <Text fw={500} size="sm">
                              Importance Level:
                            </Text>
                            <Badge color="blue">{skill.importance_level}</Badge>

                            <Text fw={500} size="sm" mt="md">
                              Required Proficiency:
                            </Text>
                            <Badge color="cyan">{skill.proficiency_required}</Badge>
                          </Stack>
                        </Stack>
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </Stack>
            </Tabs.Panel>

            {/* Tab 4: Companies & Industries */}
            <Tabs.Panel value="companies" pt="xl">
              <Stack gap="lg">
                {(guidanceData.career_companies || []).map((company, index) => (
                  <motion.div key={company.id} variants={itemVariants}>
                    <Card
                      p="lg"
                      radius="md"
                      withBorder
                      style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                    >
                      <Stack gap="md">
                        <Group justify="space-between">
                          <div>
                            <Title order={4}>{company.company_name}</Title>
                            {company.career_title && (
                              <Text size="sm" c="dimmed">
                                {company.career_title}
                              </Text>
                            )}
                          </div>
                          <Badge size="lg" color="blue">
                            {company.hiring_level}
                          </Badge>
                        </Group>

                        <Grid gutter="md">
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Stack gap="xs">
                              <Text fw={500} size="sm">
                                Industry
                              </Text>
                              <Badge size="lg" variant="light">
                                {company.industry}
                              </Badge>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Stack gap="xs">
                              <Text fw={500} size="sm">
                                Hiring Level
                              </Text>
                              <Badge size="lg" color="cyan">
                                {company.hiring_level}
                              </Badge>
                            </Stack>
                          </Grid.Col>
                        </Grid>

                        <Paper
                          p="md"
                          radius="md"
                          style={{
                            backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
                          }}
                        >
                          <Text size="sm">{company.job_market_opportunity}</Text>
                        </Paper>
                      </Stack>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </Tabs.Panel>

            {/* Tab 5: Market Trends */}
            <Tabs.Panel value="trends" pt="xl">
              <Stack gap="lg">
                {(guidanceData.market_trends || []).map((trend, index) => (
                  <motion.div key={trend.id} variants={itemVariants}>
                    <Card
                      p="lg"
                      radius="md"
                      withBorder
                      style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                    >
                      <Stack gap="md">
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Title order={4}>{trend.trend_name}</Title>
                            <Text size="sm" c="dimmed">
                              {trend.career_title}
                            </Text>
                          </div>
                          <Group gap="xs">
                            <Badge
                              size="lg"
                              color={
                                trend.impact_level === 'high'
                                  ? 'red'
                                  : trend.impact_level === 'medium'
                                    ? 'yellow'
                                    : 'blue'
                              }
                              leftSection={
                                trend.impact_level === 'high' ? <IconFlame size={14} /> : <IconTrendingUp size={14} />
                              }
                            >
                              {trend.impact_level} Impact
                            </Badge>
                            <RingProgress
                              sections={[
                                {
                                  value: trend.growth_potential,
                                  color: trend.growth_potential >= 80 ? 'green' : 'yellow',
                                },
                              ]}
                              label={
                                <Text fw={700} size="sm">
                                  {trend.growth_potential}%
                                </Text>
                              }
                              size={80}
                              thickness={6}
                            />
                          </Group>
                        </Group>

                        <Text size="sm">{trend.trend_description}</Text>

                        <Grid gutter="md">
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Stack gap="xs">
                              <Text fw={500} size="sm">
                                Current Data
                              </Text>
                              <Stack gap="xs">
                                {typeof trend.current_data === 'object' &&
                                  trend.current_data !== null &&
                                  Object.entries(trend.current_data).map(([key, value]) => (
                                    <Group key={key} justify="space-between" align="flex-start">
                                      <Text size="sm" fw={500} c="dimmed" style={{ textTransform: 'capitalize' }}>
                                        {key.replace(/_/g, ' ')}:
                                      </Text>
                                      <Text size="sm" fw={600}>
                                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                      </Text>
                                    </Group>
                                  ))}
                              </Stack>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Stack gap="xs">
                              <Text fw={500} size="sm">
                                Forecast
                              </Text>
                              <Stack gap="xs">
                                {typeof trend.forecast === 'object' &&
                                  trend.forecast !== null &&
                                  Object.entries(trend.forecast).map(([key, value]) => (
                                    <Group key={key} justify="space-between" align="flex-start">
                                      <Text size="sm" fw={500} c="dimmed" style={{ textTransform: 'capitalize' }}>
                                        {key.replace(/_/g, ' ')}:
                                      </Text>
                                      <Text size="sm" fw={600}>
                                        {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                      </Text>
                                    </Group>
                                  ))}
                              </Stack>
                            </Stack>
                          </Grid.Col>
                        </Grid>

                        {trend.in_demand_skills && trend.in_demand_skills.length > 0 && (
                          <Stack gap="xs">
                            <Text fw={500} size="sm">
                              In-Demand Skills:
                            </Text>
                            <Group gap="xs">
                              {(trend.in_demand_skills || []).map((skill) => (
                                <Badge key={skill} size="sm" variant="dot">
                                  {skill}
                                </Badge>
                              ))}
                            </Group>
                          </Stack>
                        )}
                      </Stack>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </motion.div>

        {/* Guidance Message */}
        <motion.div variants={itemVariants} style={{ marginTop: 'var(--mantine-spacing-xl)' }}>
          {/* Summary Card */}
          <motion.div variants={itemVariants} style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
            <Paper
              p="xl"
              radius="md"
              style={{
                backgroundImage: 'var(--gradient-primary)',
              }}
            >
              <Stack gap="md">
                <Group justify="space-between" align="flex-start">
                  <div>
                    <Title order={3} c="white" mb="xs">
                      Career Potential Summary
                    </Title>
                    <Text c="rgba(255,255,255,0.9)">{guidanceData.summary}</Text>
                  </div>
                  <IconBulb size={40} color="white" />
                </Group>
              </Stack>
            </Paper>
          </motion.div>
          <Alert icon={<IconBulb size={16} />} color="cyan" title="AI Guidance">
            {guidanceData.guidance}
          </Alert>
        </motion.div>
      </motion.div>
    </Container>
  );
}
