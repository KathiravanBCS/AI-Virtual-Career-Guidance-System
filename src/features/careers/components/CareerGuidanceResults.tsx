import { useState } from 'react';

import {
  Accordion,
  Alert,
  Badge,
  Button,
  Card,
  Container,
  Grid,
  Group,
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
  IconArrowRight,
  IconBriefcase,
  IconBulb,
  IconChartLine,
  IconFlame,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { saveCareerAnalysis } from '../api/careerSaveService';
import type { AICareerGuidance } from '../types';

interface CareerGuidanceResultsProps {
  data: AICareerGuidance;
  onReset: () => void;
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

export function CareerGuidanceResults({ data, onReset }: CareerGuidanceResultsProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSaveAnalysis = async () => {
    setIsSaving(true);
    try {
      const result = await saveCareerAnalysis(data);

      if (result.success) {
        const { notifications } = await import('@mantine/notifications');
        notifications.show({
          title: 'Success',
          message: `Career analysis saved successfully!\n✓ Guidance (ID: ${result.careerGuidanceId})\n✓ ${result.careersCreated} Careers\n✓ ${result.skillsCreated} Skills\n✓ ${result.companiesCreated} Companies\n✓ ${result.recommendationsCreated} Recommendations\n✓ ${result.trendsCreated} Trends`,
          color: 'green',
        });
        setIsSaved(true);
      } else {
        const { notifications } = await import('@mantine/notifications');
        const errorMessage = result.errors?.length
          ? `Partially saved (${result.errors.length} errors):\n${result.errors.slice(0, 3).join('\n')}`
          : 'Failed to save analysis';

        notifications.show({
          title: 'Error',
          message: errorMessage,
          color: 'red',
        });
      }

      setIsSaving(false);
    } catch (error) {
      const { notifications } = await import('@mantine/notifications');
      notifications.show({
        title: 'Error',
        message: error instanceof Error ? error.message : 'An unexpected error occurred',
        color: 'red',
      });
      setIsSaving(false);
    }
  };

  return (
    <Container size="xl" py="xl">
      <motion.div variants={containerVariants} initial="hidden" animate="visible">
        {/* Header */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
          <Group justify="space-between" align="flex-start" mb="md">
            <div>
              <Title order={2}>Your Career Analysis</Title>
              <Text c="dimmed" mt="xs">
                Personalized guidance based on your interests, skills, and goals
              </Text>
            </div>
            <Button onClick={onReset} variant="light">
              Start Over
            </Button>
          </Group>
        </motion.div>

        {/* Summary Card */}
        <motion.div variants={itemVariants} style={{ marginBottom: 'var(--mantine-spacing-xl)' }}>
          <Paper p="xl" radius="md" style={{ backgroundImage: 'var(--gradient-primary)' }}>
            <Stack gap="md">
              <Group justify="space-between" align="flex-start">
                <div>
                  <Title order={3} c="white" mb="xs">
                    Career Potential Summary
                  </Title>
                  <Text c="rgba(255,255,255,0.9)">{data.summary}</Text>
                </div>
                <IconBulb size={40} color="white" />
              </Group>
            </Stack>
          </Paper>
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
              <Title order={4}>Your Profile</Title>

              <Grid gutter="lg">
                <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                  <Stack gap="xs">
                    <Text size="sm" c="dimmed" fw={500}>
                      INTERESTS
                    </Text>
                    <Group gap="xs">
                      {data.userInterests.interests.map((interest) => (
                        <Badge key={interest} size="md" variant="filled">
                          {interest}
                        </Badge>
                      ))}
                    </Group>
                  </Stack>
                </Grid.Col>

                {data.userInterests.skills && (
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed" fw={500}>
                        SKILLS
                      </Text>
                      <Group gap="xs">
                        {data.userInterests.skills.map((skill) => (
                          <Badge key={skill} size="md" variant="dot">
                            {skill}
                          </Badge>
                        ))}
                      </Group>
                    </Stack>
                  </Grid.Col>
                )}

                {data.userInterests.experience && (
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed" fw={500}>
                        EXPERIENCE
                      </Text>
                      <Text size="sm">{data.userInterests.experience.substring(0, 50)}...</Text>
                    </Stack>
                  </Grid.Col>
                )}

                {data.userInterests.goals && (
                  <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                    <Stack gap="xs">
                      <Text size="sm" c="dimmed" fw={500}>
                        GOALS
                      </Text>
                      <Text size="sm">{data.userInterests.goals.substring(0, 50)}...</Text>
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
                {data.recommendedCareers.map((career, index) => (
                  <motion.div key={career.careerTitle} variants={itemVariants}>
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
                              <Title order={4}>{career.careerTitle}</Title>
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
                                  value: career.matchScore,
                                  color:
                                    career.matchScore >= 80 ? 'green' : career.matchScore >= 60 ? 'yellow' : 'orange',
                                },
                              ]}
                              label={
                                <Stack align="center" gap={0}>
                                  <Text fw={700} size="xl">
                                    {career.matchScore}%
                                  </Text>
                                  <Text size="xs" c="dimmed">
                                    Match Score
                                  </Text>
                                </Stack>
                              }
                              size={120}
                              thickness={8}
                            />
                          </Stack>
                        </Group>

                        {/* Alignment */}
                        <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                          {career.reasoningAlignment}
                        </Text>

                        {/* Career Details Grid */}
                        <Grid gutter="md">
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                INDUSTRY
                              </Text>
                              <Badge variant="light" size="lg">
                                {career.industry || 'Not specified'}
                              </Badge>
                            </Stack>
                          </Grid.Col>

                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                DEMAND LEVEL
                              </Text>
                              <Badge
                                color={
                                  career.demandLevel === 'High'
                                    ? 'green'
                                    : career.demandLevel === 'Medium'
                                      ? 'yellow'
                                      : 'orange'
                                }
                                variant="filled"
                                size="lg"
                              >
                                {career.demandLevel || 'Unknown'}
                              </Badge>
                            </Stack>
                          </Grid.Col>

                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                MARKET DEMAND SCORE
                              </Text>
                              <Progress
                                value={career.jobMarketDemandScore || 0}
                                color={
                                  (career.jobMarketDemandScore || 0) >= 80
                                    ? 'green'
                                    : (career.jobMarketDemandScore || 0) >= 60
                                      ? 'yellow'
                                      : 'orange'
                                }
                              />
                              <Text size="sm" fw={700}>
                                {career.jobMarketDemandScore?.toFixed(1) || 0}%
                              </Text>
                            </Stack>
                          </Grid.Col>

                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                GROWTH RATE
                              </Text>
                              <Group gap="xs" align="center">
                                <IconTrendingUp size={20} color="var(--mantine-color-green-6)" />
                                <Text size="lg" fw={700}>
                                  {career.growthRate?.toFixed(1) || 0}%
                                </Text>
                              </Group>
                            </Stack>
                          </Grid.Col>
                        </Grid>

                        {/* Salary Range */}
                        {(career.salaryMin || career.salaryMax) && (
                          <Paper
                            p="sm"
                            radius="md"
                            style={{
                              backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
                            }}
                          >
                            <Group justify="space-between">
                              <div>
                                <Text fw={500} size="sm">
                                  Salary Range
                                </Text>
                              </div>
                              <Text size="sm" fw={700}>
                                {career.salaryCurrency} {career.salaryMin?.toLocaleString() || '0'} -{' '}
                                {career.salaryMax?.toLocaleString() || '0'}
                              </Text>
                            </Group>
                          </Paper>
                        )}

                        {/* Job Responsibilities */}
                        {career.jobResponsibilities && (
                          <Stack gap="xs">
                            <Text fw={500} size="sm">
                              Key Responsibilities
                            </Text>
                            <Paper
                              p="sm"
                              radius="md"
                              style={{
                                backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
                              }}
                            >
                              <Text size="sm">{career.jobResponsibilities}</Text>
                            </Paper>
                          </Stack>
                        )}

                        {/* Career Growth Path */}
                        {career.careerGrowthPath && (
                          <Stack gap="xs">
                            <Text fw={500} size="sm">
                              Career Growth Path
                            </Text>
                            <Paper
                              p="sm"
                              radius="md"
                              style={{
                                backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
                              }}
                            >
                              <Text size="sm">{career.careerGrowthPath}</Text>
                            </Paper>
                          </Stack>
                        )}
                      </Stack>
                    </Card>
                  </motion.div>
                ))}
              </Stack>
            </Tabs.Panel>

            {/* Tab 2: Detailed Recommendations */}
            <Tabs.Panel value="recommendations" pt="xl">
              <Stack gap="lg">
                {data.recommendations.map((rec, index) => (
                  <motion.div key={`${rec.careerTitle}-${index}`} variants={itemVariants}>
                    <Card
                      p="lg"
                      radius="md"
                      withBorder
                      style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                    >
                      <Stack gap="md">
                        <Group justify="space-between">
                          <Title order={4}>{rec.careerTitle}</Title>
                          <RingProgress
                            sections={[
                              {
                                value: rec.matchScore,
                                color: rec.matchScore >= 80 ? 'green' : 'yellow',
                              },
                            ]}
                            label={
                              <Text fw={700} size="sm">
                                {rec.matchScore}%
                              </Text>
                            }
                            size={80}
                            thickness={6}
                          />
                        </Group>

                        <Grid gutter="md">
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                Personality Alignment
                              </Text>
                              <Progress value={rec.personalityAlignment} color="blue" />
                              <Text size="xs">{rec.personalityAlignment}%</Text>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                Skill Alignment
                              </Text>
                              <Progress value={rec.skillAlignment} color="cyan" />
                              <Text size="xs">{rec.skillAlignment}%</Text>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                Interest Alignment
                              </Text>
                              <Progress value={rec.interestAlignment} color="grape" />
                              <Text size="xs">{rec.interestAlignment}%</Text>
                            </Stack>
                          </Grid.Col>
                          <Grid.Col span={{ base: 12, sm: 6, md: 3 }}>
                            <Stack gap="xs">
                              <Text size="xs" fw={500} c="dimmed">
                                Overall Match
                              </Text>
                              <Progress value={rec.matchScore} color="green" />
                              <Text size="xs">{rec.matchScore}%</Text>
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
                            {rec.nextSteps.map((step, i) => (
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
                  {data.skills.map((skill, index) => (
                    <Accordion.Item key={`${skill.skillName}-${index}`} value={skill.skillName}>
                      <Accordion.Control>
                        <Group justify="space-between" style={{ flex: 1 }}>
                          <div>
                            <Text fw={500}>{skill.skillName}</Text>
                            <Text size="sm" c="dimmed">
                              for {skill.careerTitle}
                            </Text>
                          </div>
                          <Group gap="xs">
                            <Badge size="sm" variant="light" color="blue">
                              {skill.importanceLevel}
                            </Badge>
                            <Badge size="sm" variant="light" color="cyan">
                              {skill.proficiencyRequired}
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
                            <Text size="sm">{skill.learningPath}</Text>
                          </Paper>

                          <Stack gap="xs">
                            <Text fw={500} size="sm">
                              Importance Level:
                            </Text>
                            <Badge color="blue">{skill.importanceLevel}</Badge>

                            <Text fw={500} size="sm" mt="md">
                              Required Proficiency:
                            </Text>
                            <Badge color="cyan">{skill.proficiencyRequired}</Badge>
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
                {data.companies.map((company, index) => (
                  <motion.div key={`${company.companyName}-${index}`} variants={itemVariants}>
                    <Card
                      p="lg"
                      radius="md"
                      withBorder
                      style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                    >
                      <Stack gap="md">
                        <Group justify="space-between">
                          <div>
                            <Title order={4}>{company.companyName}</Title>
                            <Text size="sm" c="dimmed">
                              {company.careerTitle}
                            </Text>
                          </div>
                          <Badge size="lg" color="blue">
                            {company.hiringLevel}
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
                                {company.hiringLevel}
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
                          <Text size="sm">{company.jobMarketOpportunity}</Text>
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
                {data.marketTrends.map((trend, index) => (
                  <motion.div key={`${trend.trendName}-${index}`} variants={itemVariants}>
                    <Card
                      p="lg"
                      radius="md"
                      withBorder
                      style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                    >
                      <Stack gap="md">
                        <Group justify="space-between" align="flex-start">
                          <div>
                            <Title order={4}>{trend.trendName}</Title>
                            <Text size="sm" c="dimmed">
                              {trend.careerTitle}
                            </Text>
                          </div>
                          <Group gap="xs">
                            <Badge
                              size="lg"
                              color={
                                trend.impactLevel === 'high'
                                  ? 'red'
                                  : trend.impactLevel === 'medium'
                                    ? 'yellow'
                                    : 'blue'
                              }
                              leftSection={
                                trend.impactLevel === 'high' ? <IconFlame size={14} /> : <IconTrendingUp size={14} />
                              }
                            >
                              {trend.impactLevel} Impact
                            </Badge>
                            <RingProgress
                              sections={[
                                {
                                  value: trend.growthPotential,
                                  color: trend.growthPotential >= 80 ? 'green' : 'yellow',
                                },
                              ]}
                              label={
                                <Text fw={700} size="sm">
                                  {trend.growthPotential}%
                                </Text>
                              }
                              size={80}
                              thickness={6}
                            />
                          </Group>
                        </Group>

                        <Text size="sm">{trend.trendDescription}</Text>

                        <Grid gutter="md">
                          <Grid.Col span={{ base: 12, sm: 6 }}>
                            <Stack gap="xs">
                              <Text fw={500} size="sm">
                                Current Data
                              </Text>
                              <Stack gap="xs">
                                {typeof trend.currentData === 'object' &&
                                  trend.currentData !== null &&
                                  Object.entries(trend.currentData).map(([key, value]) => (
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
          <Alert icon={<IconBulb size={16} />} color="cyan" title="AI Guidance">
            {data.guidance}
          </Alert>
        </motion.div>

        {/* Action Buttons */}
        <motion.div variants={itemVariants} style={{ marginTop: 'var(--mantine-spacing-xl)' }}>
          <Group justify="center" gap="lg">
            <Button size="lg" onClick={onReset} variant="light">
              Analyze Another Profile
            </Button>
            <Button size="lg" color="green" onClick={handleSaveAnalysis} loading={isSaving} disabled={isSaved}>
              {isSaved ? '✓ Saved' : isSaving ? 'Saving...' : 'Save This Analysis'}
            </Button>
          </Group>
        </motion.div>
      </motion.div>
    </Container>
  );
}
