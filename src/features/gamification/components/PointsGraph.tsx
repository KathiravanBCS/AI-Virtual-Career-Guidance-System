import React from 'react';
import { useMantineColorScheme, useMantineTheme } from '@mantine/core';
import type { PointsHistory } from '../types';

interface PointsGraphProps {
  history: PointsHistory[] | null;
  loading?: boolean;
  className?: string;
}

const PointsGraph: React.FC<PointsGraphProps> = ({
  history,
  loading = false,
  className = '',
}) => {
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const emptyTextColor = colorScheme === 'dark'
    ? theme.colors.gray[4]
    : theme.colors.gray[5];

  const emptySubTextColor = colorScheme === 'dark'
    ? theme.colors.gray[5]
    : theme.colors.gray[4];

  if (loading) {
    return (
      <div className={`points-graph loading ${className}`}>
        <div className="skeleton skeleton-graph" style={{ height: '300px' }} />
      </div>
    );
  }

  // Show a message if no history is available yet
  if (!history || history.length === 0) {
    return (
      <div className={`points-graph empty ${className}`}>
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p className="empty-message" style={{ marginBottom: '0.5rem', color: emptyTextColor }}>No points history available yet</p>
          <p style={{ fontSize: '0.875rem', color: emptySubTextColor }}>Complete activities and quizzes to build your points history</p>
        </div>
      </div>
    );
  }

  // Simple text-based graph for now
  // In production, use Chart.js, Recharts, or similar library
  const maxPoints = Math.max(...history.map((h) => h.cumulative_points), 1);
  const chartHeight = 200;
  const barWidth = Math.max(100 / history.length, 20);

  return (
    <div className={`points-graph ${className}`}>
      <div className="graph-header">
        <h3 className="graph-title">Points Progress (Last 30 Days)</h3>
        {history.length > 0 && (
          <p className="graph-subtitle">
            Total: {history[history.length - 1].cumulative_points?.toLocaleString() || 0} points
          </p>
        )}
      </div>

      <div className="graph-container">
        <div className="graph-y-axis">
          <div className="y-label">{Math.round(maxPoints)}</div>
          <div className="y-label">{Math.round(maxPoints / 2)}</div>
          <div className="y-label">0</div>
        </div>

        <div className="graph-bars">
          {history.map((entry, index) => {
            const heightPercent = (entry.cumulative_points / maxPoints) * 100;
            return (
              <div key={index} className="graph-bar-wrapper" style={{ width: `${barWidth}%` }}>
                <div
                  className="graph-bar"
                  style={{ height: `${heightPercent}%` }}
                  title={`${entry.date}: ${entry.cumulative_points} points`}
                />
              </div>
            );
          })}
        </div>
      </div>

      <div className="graph-x-axis">
        <div className="x-label">{history[0].date}</div>
        <div className="x-label">{history[Math.floor(history.length / 2)]?.date}</div>
        <div className="x-label">{history[history.length - 1].date}</div>
      </div>

      <div className="graph-legend">
        <span className="legend-item">
          <span className="legend-box" />
          Cumulative Points
        </span>
      </div>
    </div>
  );
};

export default PointsGraph;
