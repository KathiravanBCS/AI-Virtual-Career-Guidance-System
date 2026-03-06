import { Box, Paper, Title } from '@mantine/core';
import { Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import { LearningPath, QuizScore } from '../types';

interface ProgressChartProps {
  title: string;
  type: 'line' | 'bar';
  data: any[];
  dataKey: string;
}

export const ProgressChart: React.FC<ProgressChartProps> = ({ title, type, data, dataKey }) => {
  if (data.length === 0) {
    return (
      <Paper
        p="lg"
        style={{
          background: '#2a2a2a/70',
          border: '1px solid #3a3a3a',
          borderRadius: '16px',
        }}
      >
        <p style={{ color: '#a0a0a0' }}>No {title.toLowerCase()} data available.</p>
      </Paper>
    );
  }

  return (
    <Paper
      p="lg"
      style={{
        background: '#2a2a2a/70',
        border: '1px solid #3a3a3a',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
      }}
    >
      <Title
        order={2}
        style={{
          color: '#ff9d54',
          marginBottom: '16px',
        }}
      >
        {title}
      </Title>

      <Box style={{ height: '300px', width: '100%' }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
              <XAxis dataKey="topic" tick={{ fill: '#ffffff' }} />
              <YAxis tick={{ fill: '#ffffff' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2a2a2a',
                  borderColor: '#3a3a3a',
                  color: '#ffffff',
                }}
              />
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#ff9d54"
                strokeWidth={3}
                dot={{ fill: '#ff9d54', r: 5 }}
              />
            </LineChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3a3a3a" />
              <XAxis dataKey="topic" tick={{ fill: '#ffffff' }} />
              <YAxis
                tick={{ fill: '#ffffff' }}
                domain={type === 'bar' && dataKey === 'accuracy' ? [0, 100] : undefined}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2a2a2a',
                  borderColor: '#3a3a3a',
                  color: '#ffffff',
                }}
              />
              <Bar dataKey={dataKey} fill="#ff9d54" barSize={50} />
            </BarChart>
          )}
        </ResponsiveContainer>
      </Box>
    </Paper>
  );
};
