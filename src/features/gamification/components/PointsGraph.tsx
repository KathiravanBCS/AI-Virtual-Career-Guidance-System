import React, { useMemo } from 'react';
import {
  Box,
  Text,
  Group,
  Skeleton,
  ThemeIcon,
  Badge,
  Paper,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconChartLine, IconTrendingUp } from '@tabler/icons-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { PointsHistory } from '../types';

interface PointsGraphProps {
  history: PointsHistory[] | null;
  loading?: boolean;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: ReadonlyArray<{ value?: number | string }>;
  label?: string | number;
  dark: boolean;
  theme: ReturnType<typeof useMantineTheme>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, dark, theme }) => {
  if (!active || !payload?.length) return null;
  const pointValue = Number(payload[0]?.value ?? 0);
  const bg     = dark ? theme.colors.dark[6]  : theme.white;
  const border = dark ? theme.colors.dark[4]  : theme.colors.gray[2];
  const valClr = dark ? theme.colors.gray[0]  : theme.colors.dark[7];
  const subClr = dark ? theme.colors.gray[4]  : theme.colors.gray[5];
  return (
    <Box
      p="sm"
      style={{
        background: bg,
        border: `1px solid ${border}`,
        borderRadius: theme.radius.md,
        boxShadow: dark ? '0 4px 16px rgba(0,0,0,0.4)' : '0 4px 16px rgba(0,0,0,0.1)',
      }}
    >
      <Text size="xs" c={subClr} mb={2}>{label}</Text>
      <Text size="sm" fw={700} c={valClr} style={{ fontVariantNumeric: 'tabular-nums' }}>
        {pointValue.toLocaleString()} pts
      </Text>
    </Box>
  );
};

const PointsGraph: React.FC<PointsGraphProps> = ({
  history,
  loading = false,
  className = '',
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();
  const dark = colorScheme === 'dark';
  const primary = theme.primaryColor;

  const cardBg      = dark ? theme.colors.dark[7]  : theme.white;
  const borderClr   = dark ? theme.colors.dark[5]  : theme.colors.gray[2];
  const gridClr     = dark ? theme.colors.dark[4]  : theme.colors.gray[2];
  const axisClr     = dark ? theme.colors.gray[5]  : theme.colors.gray[5];
  const subText     = dark ? theme.colors.gray[5]  : theme.colors.gray[5];
  const titleClr    = dark ? theme.colors.gray[0]  : theme.colors.dark[7];
  const fillStart   = theme.colors[primary][6];
  const fillEnd     = dark ? `${theme.colors[primary][9]}00` : `${theme.colors[primary][0]}`;

  const chartData = useMemo(
    () =>
      history?.map((h) => ({
        date: h.date,
        points: h.cumulative_points,
        daily: h.points_earned,
      })) ?? [],
    [history]
  );

  const totalPts  = history?.at(-1)?.cumulative_points ?? 0;
  const prevPts   = history?.at(-2)?.cumulative_points ?? 0;
  const delta     = totalPts - prevPts;

  if (loading) {
    return (
      <Paper radius="lg" withBorder p="lg" className={className} style={{ backgroundColor: cardBg, borderColor: borderClr }}>
        <Skeleton height={14} width="40%" mb="md" radius="sm" />
        <Skeleton height={220} radius="md" />
      </Paper>
    );
  }

  if (!history?.length) {
    return (
      <Paper
        radius="lg"
        withBorder
        p="xl"
        ta="center"
        className={className}
        style={{ backgroundColor: cardBg, borderColor: borderClr }}
      >
        <ThemeIcon size={56} radius="xl" variant="light" color={primary} mb="md">
          <IconChartLine size={28} stroke={1.5} />
        </ThemeIcon>
        <Text fw={600} size="md" c={titleClr} mb={4}>No points history yet</Text>
        <Text size="sm" c={subText}>
          Complete activities and quizzes to build your points history.
        </Text>
      </Paper>
    );
  }

  return (
    <Paper
      radius="lg"
      withBorder
      p="lg"
      className={className}
      style={{ backgroundColor: cardBg, borderColor: borderClr }}
    >
      {/* Header */}
      <Group justify="space-between" align="center" mb="lg">
        <Box>
          <Group gap="xs" mb={4}>
            <ThemeIcon size={28} radius="md" variant="light" color={primary}>
              <IconChartLine size={14} stroke={2} />
            </ThemeIcon>
            <Text fw={700} size="md" c={titleClr}>Points Progress</Text>
          </Group>
          <Text size="xs" c={subText}>Last 30 days · cumulative</Text>
        </Box>
        <Box ta="right">
          <Text fw={800} size="xl" c={titleClr} style={{ fontVariantNumeric: 'tabular-nums' }}>
            {totalPts.toLocaleString()}
          </Text>
          {delta !== 0 && (
            <Badge
              size="sm"
              color={delta > 0 ? 'green' : 'red'}
              variant="light"
              leftSection={<IconTrendingUp size={12} />}
            >
              {delta > 0 ? '+' : ''}{delta.toLocaleString()} today
            </Badge>
          )}
        </Box>
      </Group>

      {/* Chart */}
      <Box style={{ height: 220 }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -12 }}>
            <defs>
              <linearGradient id="pgGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={fillStart} stopOpacity={0.35} />
                <stop offset="95%" stopColor={fillEnd}   stopOpacity={0}    />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridClr}
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: axisClr, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: string) => {
                const d = new Date(v);
                return `${d.getMonth() + 1}/${d.getDate()}`;
              }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fill: axisClr, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v: number) => v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)}
            />
            <Tooltip
              content={(props) => (
                <CustomTooltip {...props} dark={dark} theme={theme} />
              )}
              cursor={{ stroke: theme.colors[primary][5], strokeWidth: 1.5, strokeDasharray: '4 2' }}
            />
            <Area
              type="monotone"
              dataKey="points"
              stroke={theme.colors[primary][6]}
              strokeWidth={2.5}
              fill="url(#pgGradient)"
              dot={false}
              activeDot={{
                r: 5,
                fill: theme.colors[primary][6],
                stroke: cardBg,
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};

export default PointsGraph;