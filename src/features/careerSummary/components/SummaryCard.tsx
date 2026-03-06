import { useRef } from 'react';

import { Box, Button, Grid, Group, Paper, Progress, Text, Title } from '@mantine/core';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import { CareerSummary } from '../types';

interface SummaryCardProps {
  summary: CareerSummary;
  onDownload: (ref: React.RefObject<HTMLDivElement | null>, filename: string) => void;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ summary, onDownload }) => {
  const pieData = [
    { name: 'Completed', value: summary.data.completed },
    { name: 'Remaining', value: summary.data.total - summary.data.completed },
  ];

  return (
    <Paper p="lg" radius="lg" withBorder>
      <Group justify="space-between" mb="lg" wrap="nowrap">
        <div>
          <Title order={2}>Career Summary for {summary.data.goal}</Title>
          <Group gap="md" mt="xs">
            <Text size="sm" c="dimmed">
              ✓ Modules: {summary.data.completed}/{summary.data.total}
            </Text>
            <Text size="sm" c="dimmed">
              🚀 Progress: {summary.data.progress}%
            </Text>
          </Group>
        </div>
      </Group>

      {/* PDF Content */}
      <Box ref={summary.ref} p="lg">
        {/* Header */}
        <Group gap="sm" mb="lg">
          <Box
            p="sm"
            bg="orange"
            style={{
              borderRadius: '8px',
            }}
          >
            👤
          </Box>
          <Title order={2}>Career Summary Report for {summary.data.name}</Title>
        </Group>

        {/* Stats Grid */}
        <Grid mb="lg">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" radius="md" withBorder>
              <Text c="dimmed" size="sm">
                Career Goal
              </Text>
              <Text fw={500}>{summary.data.goal}</Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" radius="md" withBorder>
              <Text c="dimmed" size="sm">
                Modules Completed
              </Text>
              <Text fw={500}>
                {summary.data.completed}/{summary.data.total}
              </Text>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Paper p="md" radius="md" withBorder>
              <Text c="dimmed" size="sm">
                Overall Progress
              </Text>
              <Text fw={500}>{summary.data.progress}%</Text>
            </Paper>
          </Grid.Col>
        </Grid>

        {/* Chart Section */}
        <Paper p="md" mb="lg" radius="md" withBorder>
          <Grid>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Box style={{ height: '200px', display: 'flex', justifyContent: 'center' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={40}
                      paddingAngle={2}
                      label
                    >
                      <Cell fill="var(--mantine-color-orange-6)" />
                      <Cell fill="var(--mantine-color-gray-3)" />
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </Grid.Col>
            <Grid.Col span={{ base: 12, md: 6 }}>
              <Title order={4} mb="md">
                Learning Progress
              </Title>
              <div style={{ marginBottom: '16px' }}>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Completed Modules</Text>
                  <Text size="sm" fw={500}>
                    {summary.data.completed}
                  </Text>
                </Group>
                <Progress value={summary.data.progress} />
              </div>
              <div>
                <Group justify="space-between" mb="xs">
                  <Text size="sm">Remaining Modules</Text>
                  <Text size="sm" fw={500} c="dimmed">
                    {summary.data.total - summary.data.completed}
                  </Text>
                </Group>
                <Progress value={100 - summary.data.progress} color="gray" />
              </div>
            </Grid.Col>
          </Grid>
        </Paper>

        {/* Analysis */}
        <Paper p="md" radius="md" withBorder>
          <Title order={4} mb="md">
            AI Career Analysis
          </Title>
          <Box
            dangerouslySetInnerHTML={{
              __html: summary.summaryText
                .split('\n\n')
                .map((block: string) =>
                  block
                    .replace(
                      /\*\*(.*?)\*\*/g,
                      "<span style='color: var(--mantine-color-orange-6); font-weight: 600;'>$1</span>"
                    )
                    .replace(/\n/g, '<br/>')
                )
                .join('<p style="margin-bottom: 12px;"></p>'),
            }}
          />
        </Paper>
      </Box>

      <Button
        onClick={() => onDownload(summary.ref, `${summary.data.goal.replace(/\s/g, '_')}_Summary.pdf`)}
        variant="default"
        mt="lg"
        fullWidth
      >
        Download PDF
      </Button>
    </Paper>
  );
};
