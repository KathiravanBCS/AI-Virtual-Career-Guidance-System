import { useState, useEffect } from 'react';
import {
  Alert,
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Progress,
  RingProgress,
  Stack,
  Text,
  ThemeIcon,
  Timeline,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconAlertCircle,
  IconBriefcase,
  IconCheck,
  IconCircleDashed,
  IconClockHour4,
  IconDownload,
  IconRefresh,
  IconTarget,
  IconTrendingUp,
  IconBrain,
} from '@tabler/icons-react';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

import { SummaryCard } from '../components';
import { CareerSummary as CareerSummaryType, LearningGuidanceData } from '../types';
import { useGetLearningGuidanceData, useGenerateCareerSummaries } from '../api/useCareerSummary';

// ─── Stat Tile ───────────────────────────────────────────────────────────────
interface StatTileProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatTile: React.FC<StatTileProps> = ({ label, value, icon, color }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Paper
      p="lg"
      radius="xl"
      withBorder
      style={{
        background:
          colorScheme === 'dark'
            ? theme.colors.dark[7]
            : theme.colors.gray[0],
        flex: 1,
      }}
    >
      <Group gap="md" align="flex-start">
        <ThemeIcon size={44} radius="xl" color={color} variant="light">
          {icon}
        </ThemeIcon>
        <div>
          <Text size="xs" tt="uppercase" fw={700} c="dimmed" lts={1}>
            {label}
          </Text>
          <Text size="xl" fw={800} lh={1.2}>
            {value}
          </Text>
        </div>
      </Group>
    </Paper>
  );
};

// ─── Module Row ───────────────────────────────────────────────────────────────
interface ModuleRowProps {
  module: LearningGuidanceData['learning_modules'][number];
  isLast: boolean;
}

const statusMeta = {
  completed: { color: 'teal', icon: <IconCheck size={14} />, label: 'Completed' },
  active: { color: 'blue', icon: <IconTrendingUp size={14} />, label: 'In Progress' },
  pending: { color: 'gray', icon: <IconCircleDashed size={14} />, label: 'Pending' },
};

const ModuleRow: React.FC<ModuleRowProps> = ({ module, isLast }) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const meta = statusMeta[module.status as keyof typeof statusMeta] ?? statusMeta.pending;

  return (
    <Paper
      p="md"
      style={{
        borderBottom: isLast
          ? 'none'
          : `1px solid ${
              colorScheme === 'dark'
                ? theme.colors.dark[5]
                : theme.colors.gray[2]
            }`,
        borderRadius: 0,
        background: 'transparent',
      }}
    >
      <Group justify="space-between" mb="xs" wrap="nowrap">
        <div style={{ flex: 1, minWidth: 0 }}>
          <Text fw={600} size="sm" truncate>
            {module.title}
          </Text>
          <Text size="xs" c="dimmed" truncate>
            {module.description}
          </Text>
        </div>
        <Badge
          size="sm"
          variant={module.status === 'completed' ? 'filled' : 'light'}
          color={meta.color}
          leftSection={meta.icon}
          style={{ flexShrink: 0 }}
        >
          {meta.label}
        </Badge>
      </Group>

      <Group gap="xs" align="center">
        <ThemeIcon size={18} radius="xl" variant="transparent" c="dimmed">
          <IconClockHour4 size={13} />
        </ThemeIcon>
        <Text size="xs" c="dimmed" style={{ flexShrink: 0 }}>
          {module.estimated_time}
        </Text>
        <Progress
          value={module.completion_percentage}
          size="xs"
          radius="xl"
          color={meta.color}
          style={{ flex: 1 }}
        />
        <Text size="xs" fw={700} style={{ flexShrink: 0, width: 32, textAlign: 'right' }}>
          {module.completion_percentage}%
        </Text>
      </Group>
    </Paper>
  );
};

// ─── Main Page ────────────────────────────────────────────────────────────────
export const CareerSummaryPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [summary, setSummary] = useState<any>(null);
  const [localSummaryText, setLocalSummaryText] = useState<string>('');

  const { data: learningData, isLoading: isFetchingData, error: fetchError } =
    useGetLearningGuidanceData();

  const {
    data: generatedSummary,
    isLoading: isGeneratingSummary,
    error: generationError,
  } = useGenerateCareerSummaries(learningData || null);

  useEffect(() => {
    if (generatedSummary) {
      setSummary(generatedSummary);
      setLocalSummaryText(generatedSummary.summaryText || '');
    }
  }, [generatedSummary]);

  const handleDownload = (filename: string) => {
    if (!localSummaryText) return;
    const el = document.createElement('a');
    el.href = URL.createObjectURL(new Blob([localSummaryText], { type: 'text/plain' }));
    el.download = filename;
    document.body.appendChild(el);
    el.click();
    document.body.removeChild(el);
  };

  const isLoading = isFetchingData || isGeneratingSummary;
  const hasError = fetchError || generationError;

  const surfaceBg =
    colorScheme === 'dark' ? theme.colors.dark[7] : theme.white;

  const ringData = summary
    ? [
        {
          name: 'Completed',
          value: summary.modulesData.completed,
          fill: theme.colors.teal[6],
        },
        {
          name: 'Active',
          value: summary.modulesData.active,
          fill: theme.colors.blue[5],
        },
        {
          name: 'Pending',
          value:
            summary.modulesData.total -
            summary.modulesData.completed -
            summary.modulesData.active,
          fill:
            colorScheme === 'dark'
              ? theme.colors.dark[4]
              : theme.colors.gray[3],
        },
      ]
    : [];

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">

        {/* ── Header ── */}
        <Paper
          p="xl"
          radius="xl"
          withBorder
          style={{ background: surfaceBg }}
        >
          <Group gap="md" mb="xs">
            <ThemeIcon size={48} radius="xl" variant="gradient"
              gradient={{ from: theme.primaryColor, to: 'cyan', deg: 135 }}>
              <IconBriefcase size={24} />
            </ThemeIcon>
            <div>
              <Title order={2} fw={800} lh={1.1}>
                Career Summary Report
              </Title>
              <Text size="sm" c="dimmed">
                AI-powered analysis of your learning progress &amp; personalised career guidance
              </Text>
            </div>
          </Group>
        </Paper>

        {/* ── Loading ── */}
        {isLoading && (
          <Paper p="xl" radius="xl" withBorder ta="center" style={{ background: surfaceBg }}>
            <Center mb="md">
              <Loader size="lg" />
            </Center>
            <Text c="dimmed" size="sm">
              {isFetchingData
                ? 'Loading your learning data…'
                : 'Generating your personalised career summary…'}
            </Text>
          </Paper>
        )}

        {/* ── Error ── */}
        {hasError && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="red"
            radius="xl"
            title="Failed to load summary"
          >
            Something went wrong. Please try refreshing the page.
          </Alert>
        )}

        {/* ── Empty ── */}
        {!isLoading && !learningData && !hasError && (
          <Alert
            icon={<IconAlertCircle size={16} />}
            color="yellow"
            radius="xl"
            title="No learning data found"
          >
            Start a learning path first, then come back to see your report.
          </Alert>
        )}

        {/* ── Main Content ── */}
        {!isLoading && learningData && summary && (
          <>

            {/* ── Profile + Ring ── */}
            <Paper p="xl" radius="xl" withBorder style={{ background: surfaceBg }}>
              <Group justify="space-between" align="flex-start" wrap="wrap" gap="lg">

                {/* Left: Profile info */}
                <Stack gap="xs" style={{ flex: 1, minWidth: 200 }}>
                  <Group gap="xs">
                    <ThemeIcon size={32} radius="xl" variant="light" color={theme.primaryColor}>
                      <IconTarget size={16} />
                    </ThemeIcon>
                    <div>
                      <Text size="xs" c="dimmed" tt="uppercase" fw={700} lts={1}>
                        Learner
                      </Text>
                      <Text fw={800} size="lg" lh={1.1}>
                        {learningData.name}
                      </Text>
                    </div>
                  </Group>

                  <Text size="sm" c="dimmed">
                    {learningData.career_goal}
                  </Text>

                  <Stack gap={4} mt="xs">
                    <Group justify="space-between">
                      <Text size="xs" c="dimmed">Overall progress</Text>
                      <Text size="xs" fw={700}>{learningData.completion_percentage}%</Text>
                    </Group>
                    <Progress
                      value={learningData.completion_percentage}
                      size="md"
                      radius="xl"
                      color={theme.primaryColor}
                    />
                  </Stack>
                </Stack>

                {/* Right: RadialBar chart */}
                <div style={{ width: 160, height: 160 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                      cx="50%"
                      cy="50%"
                      innerRadius={28}
                      outerRadius={72}
                      data={ringData}
                      startAngle={90}
                      endAngle={-270}
                    >
                      <RadialBar dataKey="value" cornerRadius={6} background={false} />
                      <Tooltip
                        formatter={(value, name) => [
                          `${Number(value ?? 0)} modules`,
                          String(name),
                        ]}
                        contentStyle={{
                          background: surfaceBg,
                          border: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[3]}`,
                          borderRadius: theme.radius.md,
                          fontSize: 12,
                        }}
                      />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>
              </Group>
            </Paper>

            {/* ── Stat tiles ── */}
            <Group grow gap="md" wrap="wrap">
              <StatTile
                label="Total Modules"
                value={summary.modulesData.total}
                icon={<IconBrain size={20} />}
                color={theme.primaryColor}
              />
              <StatTile
                label="Completed"
                value={summary.modulesData.completed}
                icon={<IconCheck size={20} />}
                color="teal"
              />
              <StatTile
                label="In Progress"
                value={summary.modulesData.active}
                icon={<IconTrendingUp size={20} />}
                color="blue"
              />
            </Group>

            {/* ── AI Career Summary ── */}
            <Paper p="xl" radius="xl" withBorder style={{ background: surfaceBg }}>
              <Group justify="space-between" mb="lg">
                <Group gap="sm">
                  <ThemeIcon size={36} radius="xl" variant="light" color={theme.primaryColor}>
                    <IconBriefcase size={18} />
                  </ThemeIcon>
                  <Title order={4} fw={700}>
                    Your Career Summary
                  </Title>
                </Group>
                <Button
                  size="xs"
                  radius="xl"
                  variant="light"
                  leftSection={<IconDownload size={14} />}
                  onClick={() =>
                    handleDownload(`${learningData.name}_Career_Summary.txt`)
                  }
                >
                  Download
                </Button>
              </Group>

              <Text
                size="sm"
                lh={1.9}
                c={colorScheme === 'dark' ? 'dimmed' : 'dark.6'}
                style={{ whiteSpace: 'pre-wrap' }}
              >
                {localSummaryText || 'Generating summary…'}
              </Text>
            </Paper>

            {/* ── Module timeline ── */}
            <Paper p="xl" radius="xl" withBorder style={{ background: surfaceBg }}>
              <Group gap="sm" mb="lg">
                <ThemeIcon size={36} radius="xl" variant="light" color="violet">
                  <IconTarget size={18} />
                </ThemeIcon>
                <Title order={4} fw={700}>
                  Learning Path Modules
                </Title>
              </Group>

              <Stack gap={0}>
                {learningData.learning_modules.map((module, idx) => (
                  <ModuleRow
                    key={module.id}
                    module={module}
                    isLast={idx === learningData.learning_modules.length - 1}
                  />
                ))}
              </Stack>
            </Paper>

            {/* ── Actions ── */}
            <Group grow gap="md">
              <Button
                size="md"
                radius="xl"
                variant="default"
                leftSection={<IconRefresh size={16} />}
                onClick={() => window.location.reload()}
              >
                Refresh
              </Button>
              <Button
                size="md"
                radius="xl"
                leftSection={<IconDownload size={16} />}
                onClick={() =>
                  handleDownload(
                    `${learningData.name}_Career_Summary_${
                      new Date().toISOString().split('T')[0]
                    }.txt`
                  )
                }
              >
                Download Full Report
              </Button>
            </Group>
          </>
        )}
      </Stack>
    </Container>
  );
};

export default CareerSummaryPage;