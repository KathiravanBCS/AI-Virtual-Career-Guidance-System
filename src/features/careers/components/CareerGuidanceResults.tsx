import { useState } from 'react';

import {
  Accordion,
  ActionIcon,
  Badge,
  Box,
  Button,
  Card,
  Group,
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
  IconBriefcase,
  IconBuildingSkyscraper,
  IconBulb,
  IconChartBar,
  IconChartLine,
  IconCheck,
  IconCircleCheck,
  IconDeviceFloppy,
  IconFlame,
  IconListDetails,
  IconRocket,
  IconSparkles,
  IconStarFilled,
  IconTarget,
  IconTrendingUp,
  IconUsers,
} from '@tabler/icons-react';

import { saveCareerAnalysis } from '../api/careerSaveService';
import type { AICareerGuidance } from '../types';

interface CareerGuidanceResultsProps {
  data: AICareerGuidance;
  onReset: () => void;
}

/* ─────────────────────────────────────────────────────────────────────────────
   Helpers
───────────────────────────────────────────────────────────────────────────── */
function matchColor(score: number) {
  if (score >= 80) return 'green';
  if (score >= 60) return 'yellow';
  return 'orange';
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Component
───────────────────────────────────────────────────────────────────────────── */
export function CareerGuidanceResults({ data, onReset }: CareerGuidanceResultsProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const [activeTab, setActiveTab] = useState<string | null>('overview');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  /* ── derived styles ── */
  const heroGradient = `linear-gradient(135deg,
    ${theme.colors[primary][7]} 0%,
    ${theme.colors[primary][5]} 55%,
    ${theme.colors.cyan[5]} 100%)`;

  const cardBg = isDark
    ? `${theme.colors[primary][8]}18`
    : theme.colors[primary][0];

  const cardBorder = isDark
    ? `${theme.colors[primary][7]}50`
    : theme.colors[primary][2];

  const innerBg = isDark
    ? `${theme.colors[primary][9]}60`
    : 'white';

  const sectionBg = isDark
    ? `${theme.colors[primary][8]}25`
    : theme.colors[primary][0];

  /* ── save handler ── */
  const handleSaveAnalysis = async () => {
    setIsSaving(true);
    try {
      const result = await saveCareerAnalysis(data);
      const { notifications } = await import('@mantine/notifications');
      if (result.success) {
        notifications.show({
          title: 'Saved!',
          message: `Analysis saved — ${result.careersCreated} careers, ${result.skillsCreated} skills`,
          color: 'green',
        });
        setIsSaved(true);
      } else {
        notifications.show({
          title: 'Error',
          message: result.errors?.slice(0, 2).join('\n') ?? 'Failed to save',
          color: 'red',
        });
      }
    } catch (err) {
      const { notifications } = await import('@mantine/notifications');
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Unexpected error',
        color: 'red',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const tabs = [
    { value: 'overview', label: 'Recommended Careers', icon: <IconTarget size={15} /> },
    { value: 'recommendations', label: 'Detailed Recs', icon: <IconBriefcase size={15} /> },
    { value: 'skills', label: 'Skills', icon: <IconTrendingUp size={15} /> },
    { value: 'companies', label: 'Companies', icon: <IconUsers size={15} /> },
    { value: 'trends', label: 'Market Trends', icon: <IconChartLine size={15} /> },
  ];

  return (
    <Box px="xl" py="lg" w="100%">
      <Stack gap="xl">

        {/* ── Hero Header ── */}
        <Paper
          p={0}
          radius="xl"
          style={{ overflow: 'hidden', background: heroGradient, position: 'relative' }}
        >
          {[
            { w: 340, h: 340, top: -110, right: -70, opacity: 0.07 },
            { w: 200, h: 200, bottom: -60, left: 50, opacity: 0.05 },
          ].map((b, i) => (
            <Box key={i} style={{
              position: 'absolute', width: b.w, height: b.h, borderRadius: '50%',
              background: 'white', top: b.top, bottom: b.bottom, right: b.right, left: b.left,
              opacity: b.opacity, pointerEvents: 'none',
            }} />
          ))}

          <Box p="xl" style={{ position: 'relative', zIndex: 1 }}>
            <Group justify="space-between" align="center" wrap="wrap" gap="md">
              <Group gap="md">
                <ThemeIcon size={62} radius="xl"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)' }}
                >
                  <IconSparkles size={32} color="white" />
                </ThemeIcon>
                <div>
                  <Title order={2} c="white" fw={800} style={{ letterSpacing: -0.5 }}>
                    Your Career Analysis
                  </Title>
                  <Text c="rgba(255,255,255,0.8)" size="sm" mt={4}>
                    Personalised guidance based on your interests, skills &amp; goals
                  </Text>
                </div>
              </Group>

              <Button
                onClick={onReset}
                radius="xl"
                leftSection={<IconArrowLeft size={15} />}
                style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', fontWeight: 600 }}
              >
                Start Over
              </Button>
            </Group>
          </Box>
        </Paper>

        {/* ── Summary Banner ── */}
        <Paper
          p="xl"
          radius="xl"
          style={{
            background: isDark
              ? `${theme.colors[primary][8]}20`
              : theme.colors[primary][0],
            border: `1.5px solid ${cardBorder}`,
          }}
        >
          <Group gap="md" align="flex-start">
            <ThemeIcon size={44} radius="xl" variant="light" color={primary}
              style={{ background: isDark ? `${theme.colors[primary][8]}40` : theme.colors[primary][1], flexShrink: 0 }}
            >
              <IconBulb size={22} />
            </ThemeIcon>
            <div style={{ flex: 1 }}>
              <Text fw={700} size="lg" mb={4}>Career Potential Summary</Text>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>{data.summary}</Text>
            </div>
          </Group>
        </Paper>

        {/* ── Profile Summary ── */}
        <Paper
          p="xl"
          radius="xl"
          style={{ background: cardBg, border: `1.5px solid ${cardBorder}` }}
        >
          <Group gap="sm" mb="lg">
            <ThemeIcon size={32} radius="lg" variant="light" color={primary}
              style={{ background: isDark ? `${theme.colors[primary][8]}40` : theme.colors[primary][1] }}
            >
              <IconListDetails size={16} />
            </ThemeIcon>
            <Text fw={700} size="md">Your Profile</Text>
          </Group>

          <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: theme.spacing.lg }}>
            {/* Interests */}
            <Box>
              <Text size="xs" fw={700} c="dimmed" mb={8} tt="uppercase" style={{ letterSpacing: 0.5 }}>Interests</Text>
              <Group gap="xs" wrap="wrap">
                {data.userInterests.interests.map((i) => (
                  <Badge key={i} size="md" radius="xl" variant="filled" color={primary}
                    style={{ background: `linear-gradient(135deg, ${theme.colors[primary][6]}, ${theme.colors[primary][5]})` }}
                  >{i}</Badge>
                ))}
              </Group>
            </Box>

            {data.userInterests.skills && (
              <Box>
                <Text size="xs" fw={700} c="dimmed" mb={8} tt="uppercase" style={{ letterSpacing: 0.5 }}>Skills</Text>
                <Group gap="xs" wrap="wrap">
                  {data.userInterests.skills.map((s) => (
                    <Badge key={s} size="md" radius="xl" variant="dot" color="teal"
                      style={{ background: isDark ? `${theme.colors.teal[8]}30` : theme.colors.teal[0] }}
                    >{s}</Badge>
                  ))}
                </Group>
              </Box>
            )}

            {data.userInterests.experience && (
              <Box>
                <Text size="xs" fw={700} c="dimmed" mb={8} tt="uppercase" style={{ letterSpacing: 0.5 }}>Experience</Text>
                <Text size="sm" style={{ lineHeight: 1.6 }}>{data.userInterests.experience.substring(0, 80)}…</Text>
              </Box>
            )}

            {data.userInterests.goals && (
              <Box>
                <Text size="xs" fw={700} c="dimmed" mb={8} tt="uppercase" style={{ letterSpacing: 0.5 }}>Goals</Text>
                <Text size="sm" style={{ lineHeight: 1.6 }}>{data.userInterests.goals.substring(0, 80)}…</Text>
              </Box>
            )}
          </Box>
        </Paper>

        {/* ── Tabs ── */}
        <Paper
          p={0}
          radius="xl"
          style={{ background: cardBg, border: `1.5px solid ${cardBorder}`, overflow: 'hidden' }}
        >
          <Tabs value={activeTab} onChange={setActiveTab}>
            <Tabs.List
              style={{
                background: isDark ? `${theme.colors[primary][9]}60` : theme.colors[primary][1],
                borderBottom: `1.5px solid ${cardBorder}`,
                padding: '0 16px',
                gap: 4,
              }}
            >
              {tabs.map((t) => (
                <Tabs.Tab
                  key={t.value}
                  value={t.value}
                  leftSection={t.icon}
                  style={{ fontWeight: 600, fontSize: 13 }}
                >
                  {t.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>

            {/* ── Tab 1: Recommended Careers ── */}
            <Tabs.Panel value="overview" p="xl">
              <Stack gap="lg">
                {data.recommendedCareers.map((career, index) => (
                  <Paper
                    key={career.careerTitle}
                    p="xl"
                    radius="xl"
                    style={{
                      background: isDark
                        ? `${theme.colors[primary][8]}15`
                        : 'white',
                      border: `1.5px solid ${cardBorder}`,
                    }}
                  >
                    <Stack gap="md">
                      {/* Card header */}
                      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                        <Box style={{ flex: 1 }}>
                          <Group gap="sm" mb="xs">
                            <Badge
                              size="sm"
                              radius="xl"
                              style={{ background: heroGradient, color: 'white', border: 'none', fontWeight: 700 }}
                            >
                              #{index + 1} Match
                            </Badge>
                            {career.industry && (
                              <Badge size="sm" radius="xl" variant="light" color={primary}>
                                {career.industry}
                              </Badge>
                            )}
                          </Group>
                          <Title order={4} fw={800}>{career.careerTitle}</Title>
                          <Text size="sm" c="dimmed" mt={4} style={{ lineHeight: 1.6 }}>{career.description}</Text>
                        </Box>

                        <RingProgress
                          sections={[{ value: career.matchScore, color: matchColor(career.matchScore) }]}
                          label={
                            <Stack align="center" gap={0}>
                              <Text fw={800} size="lg">{career.matchScore}%</Text>
                              <Text size="10px" c="dimmed">Match</Text>
                            </Stack>
                          }
                          size={110}
                          thickness={8}
                          style={{ flexShrink: 0 }}
                        />
                      </Group>

                      {career.reasoningAlignment && (
                        <Paper p="sm" radius="lg"
                          style={{ background: isDark ? `${theme.colors[primary][8]}25` : theme.colors[primary][0], border: `1px solid ${cardBorder}` }}
                        >
                          <Text size="xs" c="dimmed" style={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                            {career.reasoningAlignment}
                          </Text>
                        </Paper>
                      )}

                      {/* Stats row */}
                      <Box style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: theme.spacing.sm }}>
                        {/* Demand */}
                        <Paper p="sm" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                          <Text size="xs" fw={700} c="dimmed" mb={6} tt="uppercase" style={{ letterSpacing: 0.4 }}>Demand</Text>
                          <Badge
                            size="lg"
                            radius="xl"
                            color={career.demandLevel === 'High' ? 'green' : career.demandLevel === 'Medium' ? 'yellow' : 'orange'}
                            variant="filled"
                          >
                            {career.demandLevel ?? 'Unknown'}
                          </Badge>
                        </Paper>

                        {/* Market score */}
                        <Paper p="sm" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                          <Text size="xs" fw={700} c="dimmed" mb={6} tt="uppercase" style={{ letterSpacing: 0.4 }}>Market Score</Text>
                          <Progress
                            value={career.jobMarketDemandScore ?? 0}
                            color={matchColor(career.jobMarketDemandScore ?? 0)}
                            radius="xl"
                            size="sm"
                            mb={4}
                          />
                          <Text size="sm" fw={700}>{(career.jobMarketDemandScore ?? 0).toFixed(1)}%</Text>
                        </Paper>

                        {/* Growth */}
                        <Paper p="sm" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                          <Text size="xs" fw={700} c="dimmed" mb={6} tt="uppercase" style={{ letterSpacing: 0.4 }}>Growth Rate</Text>
                          <Group gap="xs" align="center">
                            <ThemeIcon size={22} radius="xl" color="green" variant="light">
                              <IconTrendingUp size={12} />
                            </ThemeIcon>
                            <Text size="lg" fw={800}>{(career.growthRate ?? 0).toFixed(1)}%</Text>
                          </Group>
                        </Paper>

                        {/* Salary */}
                        {(career.salaryMin || career.salaryMax) && (
                          <Paper p="sm" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                            <Text size="xs" fw={700} c="dimmed" mb={6} tt="uppercase" style={{ letterSpacing: 0.4 }}>Salary Range</Text>
                            <Text size="sm" fw={700}>
                              {career.salaryCurrency} {career.salaryMin?.toLocaleString()} – {career.salaryMax?.toLocaleString()}
                            </Text>
                          </Paper>
                        )}
                      </Box>

                      {/* Responsibilities + Growth path side-by-side */}
                      {(career.jobResponsibilities || career.careerGrowthPath) && (
                        <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.sm }}>
                          {career.jobResponsibilities && (
                            <Paper p="md" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                              <Group gap="xs" mb={8}>
                                <ThemeIcon size={20} radius="xl" color={primary} variant="light">
                                  <IconListDetails size={11} />
                                </ThemeIcon>
                                <Text fw={700} size="xs" tt="uppercase" style={{ letterSpacing: 0.4 }}>Responsibilities</Text>
                              </Group>
                              <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>{career.jobResponsibilities}</Text>
                            </Paper>
                          )}
                          {career.careerGrowthPath && (
                            <Paper p="md" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                              <Group gap="xs" mb={8}>
                                <ThemeIcon size={20} radius="xl" color="teal" variant="light">
                                  <IconRocket size={11} />
                                </ThemeIcon>
                                <Text fw={700} size="xs" tt="uppercase" style={{ letterSpacing: 0.4 }}>Growth Path</Text>
                              </Group>
                              <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>{career.careerGrowthPath}</Text>
                            </Paper>
                          )}
                        </Box>
                      )}
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Tabs.Panel>

            {/* ── Tab 2: Detailed Recommendations ── */}
            <Tabs.Panel value="recommendations" p="xl">
              <Stack gap="lg">
                {data.recommendations.map((rec, index) => (
                  <Paper
                    key={`${rec.careerTitle}-${index}`}
                    p="xl"
                    radius="xl"
                    style={{ background: isDark ? `${theme.colors[primary][8]}15` : 'white', border: `1.5px solid ${cardBorder}` }}
                  >
                    <Stack gap="md">
                      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                        <div style={{ flex: 1 }}>
                          <Title order={4} fw={800}>{rec.careerTitle}</Title>
                        </div>
                        <RingProgress
                          sections={[{ value: rec.matchScore, color: matchColor(rec.matchScore) }]}
                          label={<Text fw={800} size="sm">{rec.matchScore}%</Text>}
                          size={80}
                          thickness={6}
                        />
                      </Group>

                      {/* Alignment bars 2x2 */}
                      <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.sm }}>
                        {[
                          { label: 'Personality Alignment', value: rec.personalityAlignment, color: primary },
                          { label: 'Skill Alignment', value: rec.skillAlignment, color: 'teal' },
                          { label: 'Interest Alignment', value: rec.interestAlignment, color: 'blue' },
                          { label: 'Overall Match', value: rec.matchScore, color: 'green' },
                        ].map((item) => (
                          <Paper key={item.label} p="sm" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                            <Text size="xs" fw={600} c="dimmed" mb={6}>{item.label}</Text>
                            <Progress value={item.value} color={item.color} radius="xl" size="sm" mb={4} />
                            <Text size="xs" fw={700}>{item.value}%</Text>
                          </Paper>
                        ))}
                      </Box>

                      <Paper p="md" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>{rec.reasoning}</Text>
                      </Paper>

                      <Box>
                        <Group gap="xs" mb={8}>
                          <ThemeIcon size={22} radius="xl" color={primary} variant="light">
                            <IconCircleCheck size={13} />
                          </ThemeIcon>
                          <Text fw={700} size="sm">Next Steps</Text>
                        </Group>
                        <Stack gap="xs">
                          {rec.nextSteps.map((step, i) => (
                            <Group key={i} gap="sm" align="flex-start">
                              <ThemeIcon size={20} radius="xl" color={primary} variant="light" mt={1} style={{ flexShrink: 0 }}>
                                <Text size="10px" fw={800}>{i + 1}</Text>
                              </ThemeIcon>
                              <Text size="sm" c="dimmed" style={{ flex: 1, lineHeight: 1.6 }}>{step}</Text>
                            </Group>
                          ))}
                        </Stack>
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Tabs.Panel>

            {/* ── Tab 3: Skills ── */}
            <Tabs.Panel value="skills" p="xl">
              <Accordion
                radius="xl"
                styles={{
                  item: {
                    background: isDark ? `${theme.colors[primary][8]}15` : 'white',
                    border: `1.5px solid ${cardBorder}`,
                    marginBottom: theme.spacing.sm,
                    borderRadius: theme.radius.xl,
                  },
                  control: { borderRadius: theme.radius.xl },
                  panel: { paddingTop: 0 },
                }}
              >
                {data.skills.map((skill, index) => (
                  <Accordion.Item key={`${skill.skillName}-${index}`} value={skill.skillName}>
                    <Accordion.Control>
                      <Group justify="space-between" style={{ flex: 1, paddingRight: 12 }}>
                        <Group gap="sm">
                          <ThemeIcon size={32} radius="lg" variant="light" color={primary}
                            style={{ background: isDark ? `${theme.colors[primary][8]}40` : theme.colors[primary][1] }}
                          >
                            <IconTrendingUp size={16} />
                          </ThemeIcon>
                          <div>
                            <Text fw={700} size="sm">{skill.skillName}</Text>
                            <Text size="xs" c="dimmed">for {skill.careerTitle}</Text>
                          </div>
                        </Group>
                        <Group gap="xs">
                          <Badge size="sm" radius="xl" variant="light" color={primary}>{skill.importanceLevel}</Badge>
                          <Badge size="sm" radius="xl" variant="light" color="teal">{skill.proficiencyRequired}</Badge>
                        </Group>
                      </Group>
                    </Accordion.Control>
                    <Accordion.Panel>
                      <Box
                        style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: theme.spacing.md, padding: `0 ${theme.spacing.md} ${theme.spacing.md}` }}
                      >
                        <Paper p="md" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                          <Text size="xs" fw={700} c="dimmed" mb={6} tt="uppercase" style={{ letterSpacing: 0.4 }}>Learning Path</Text>
                          <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>{skill.learningPath}</Text>
                        </Paper>
                        <Stack gap="xs" style={{ minWidth: 120 }}>
                          <Paper p="sm" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                            <Text size="xs" fw={600} c="dimmed" mb={4}>Importance</Text>
                            <Badge color={primary} radius="xl" size="sm">{skill.importanceLevel}</Badge>
                          </Paper>
                          <Paper p="sm" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                            <Text size="xs" fw={600} c="dimmed" mb={4}>Proficiency</Text>
                            <Badge color="teal" radius="xl" size="sm">{skill.proficiencyRequired}</Badge>
                          </Paper>
                        </Stack>
                      </Box>
                    </Accordion.Panel>
                  </Accordion.Item>
                ))}
              </Accordion>
            </Tabs.Panel>

            {/* ── Tab 4: Companies ── */}
            <Tabs.Panel value="companies" p="xl">
              <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.lg }}>
                {data.companies.map((company, index) => (
                  <Paper
                    key={`${company.companyName}-${index}`}
                    p="xl"
                    radius="xl"
                    style={{ background: isDark ? `${theme.colors[primary][8]}15` : 'white', border: `1.5px solid ${cardBorder}` }}
                  >
                    <Stack gap="md">
                      <Group justify="space-between" align="flex-start">
                        <Group gap="sm">
                          <ThemeIcon size={42} radius="xl" variant="light" color={primary}
                            style={{ background: isDark ? `${theme.colors[primary][8]}40` : theme.colors[primary][1] }}
                          >
                            <IconBuildingSkyscraper size={20} />
                          </ThemeIcon>
                          <div>
                            <Text fw={800} size="md">{company.companyName}</Text>
                            <Text size="xs" c="dimmed">{company.careerTitle}</Text>
                          </div>
                        </Group>
                        <Badge
                          size="md"
                          radius="xl"
                          style={{ background: heroGradient, color: 'white', border: 'none' }}
                        >
                          {company.hiringLevel}
                        </Badge>
                      </Group>

                      <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.xs }}>
                        <Paper p="sm" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                          <Text size="xs" fw={600} c="dimmed" mb={4}>Industry</Text>
                          <Badge size="sm" radius="xl" variant="light" color={primary}>{company.industry}</Badge>
                        </Paper>
                        <Paper p="sm" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                          <Text size="xs" fw={600} c="dimmed" mb={4}>Hiring Level</Text>
                          <Badge size="sm" radius="xl" color="teal">{company.hiringLevel}</Badge>
                        </Paper>
                      </Box>

                      <Paper p="md" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                        <Text size="xs" fw={700} c="dimmed" mb={6} tt="uppercase" style={{ letterSpacing: 0.4 }}>Opportunity</Text>
                        <Text size="xs" c="dimmed" style={{ lineHeight: 1.6 }}>{company.jobMarketOpportunity}</Text>
                      </Paper>
                    </Stack>
                  </Paper>
                ))}
              </Box>
            </Tabs.Panel>

            {/* ── Tab 5: Market Trends ── */}
            <Tabs.Panel value="trends" p="xl">
              <Stack gap="lg">
                {data.marketTrends.map((trend, index) => (
                  <Paper
                    key={`${trend.trendName}-${index}`}
                    p="xl"
                    radius="xl"
                    style={{ background: isDark ? `${theme.colors[primary][8]}15` : 'white', border: `1.5px solid ${cardBorder}` }}
                  >
                    <Stack gap="md">
                      <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
                        <Group gap="sm">
                          <ThemeIcon
                            size={44}
                            radius="xl"
                            variant="light"
                            color={trend.impactLevel === 'high' ? 'red' : trend.impactLevel === 'medium' ? 'yellow' : 'blue'}
                            style={{
                              background: isDark
                                ? `${theme.colors[trend.impactLevel === 'high' ? 'red' : trend.impactLevel === 'medium' ? 'yellow' : 'blue'][8]}40`
                                : theme.colors[trend.impactLevel === 'high' ? 'red' : trend.impactLevel === 'medium' ? 'yellow' : 'blue'][1],
                            }}
                          >
                            {trend.impactLevel === 'high' ? <IconFlame size={22} /> : <IconChartBar size={22} />}
                          </ThemeIcon>
                          <div>
                            <Text fw={800} size="md">{trend.trendName}</Text>
                            <Text size="xs" c="dimmed">{trend.careerTitle}</Text>
                          </div>
                        </Group>

                        <Group gap="sm">
                          <Badge
                            size="md"
                            radius="xl"
                            color={trend.impactLevel === 'high' ? 'red' : trend.impactLevel === 'medium' ? 'yellow' : 'blue'}
                            leftSection={trend.impactLevel === 'high' ? <IconFlame size={11} /> : <IconTrendingUp size={11} />}
                          >
                            {trend.impactLevel} Impact
                          </Badge>
                          <RingProgress
                            sections={[{ value: trend.growthPotential, color: trend.growthPotential >= 80 ? 'green' : 'yellow' }]}
                            label={<Text fw={800} size="sm">{trend.growthPotential}%</Text>}
                            size={72}
                            thickness={6}
                          />
                        </Group>
                      </Group>

                      <Paper p="md" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                        <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>{trend.trendDescription}</Text>
                      </Paper>

                      {/* Current data + forecast side by side */}
                      <Box style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: theme.spacing.sm }}>
                        {[
                          { label: 'Current Data', obj: trend.currentData, color: primary },
                          { label: 'Forecast', obj: trend.forecast, color: 'teal' },
                        ].map((col) => (
                          typeof col.obj === 'object' && col.obj !== null && (
                            <Paper key={col.label} p="md" radius="lg" style={{ background: sectionBg, border: `1px solid ${cardBorder}` }}>
                              <Group gap="xs" mb={8}>
                                <ThemeIcon size={20} radius="xl" color={col.color} variant="light">
                                  <IconChartLine size={11} />
                                </ThemeIcon>
                                <Text size="xs" fw={700} tt="uppercase" style={{ letterSpacing: 0.4 }}>{col.label}</Text>
                              </Group>
                              <Stack gap={4}>
                                {Object.entries(col.obj as Record<string, unknown>).map(([key, value]) => (
                                  <Group key={key} justify="space-between">
                                    <Text size="xs" c="dimmed" style={{ textTransform: 'capitalize' }}>{key.replace(/_/g, ' ')}</Text>
                                    <Text size="xs" fw={700}>
                                      {typeof value === 'number' ? value.toLocaleString() : String(value)}
                                    </Text>
                                  </Group>
                                ))}
                              </Stack>
                            </Paper>
                          )
                        ))}
                      </Box>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Paper>

        {/* ── AI Guidance Banner ── */}
        <Paper
          p="xl"
          radius="xl"
          style={{
            background: isDark ? `${theme.colors.cyan[8]}15` : theme.colors.cyan[0],
            border: `1.5px solid ${isDark ? `${theme.colors.cyan[7]}40` : theme.colors.cyan[2]}`,
          }}
        >
          <Group gap="md" align="flex-start">
            <ThemeIcon size={44} radius="xl" variant="light" color="cyan"
              style={{ background: isDark ? `${theme.colors.cyan[8]}40` : theme.colors.cyan[1], flexShrink: 0 }}
            >
              <IconStarFilled size={20} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="md" mb={4}>AI Guidance</Text>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.7 }}>{data.guidance}</Text>
            </div>
          </Group>
        </Paper>

        {/* ── Action Buttons ── */}
        <Paper
          p="lg"
          radius="xl"
          style={{
            background: isDark ? `${theme.colors[primary][8]}20` : theme.colors[primary][0],
            border: `1.5px solid ${cardBorder}`,
          }}
        >
          <Group justify="center" gap="lg">
            <Button
              size="md"
              radius="xl"
              variant="light"
              onClick={onReset}
              leftSection={<IconArrowLeft size={15} />}
              color={primary}
              style={{
                background: isDark ? `${theme.colors[primary][8]}40` : theme.colors[primary][1],
                fontWeight: 600,
              }}
            >
              Analyse Another Profile
            </Button>

            <Button
              size="md"
              radius="xl"
              onClick={handleSaveAnalysis}
              loading={isSaving}
              disabled={isSaved}
              leftSection={isSaved ? <IconCheck size={15} /> : <IconDeviceFloppy size={15} />}
              style={{
                background: isSaved
                  ? `linear-gradient(135deg, ${theme.colors.green[6]}, ${theme.colors.green[4]})`
                  : heroGradient,
                fontWeight: 700,
                boxShadow: `0 4px 20px ${theme.colors[primary][5]}50`,
                color: 'white',
                minWidth: 180,
              }}
            >
              {isSaved ? 'Analysis Saved' : isSaving ? 'Saving…' : 'Save This Analysis'}
            </Button>
          </Group>
        </Paper>

      </Stack>
    </Box>
  );
}