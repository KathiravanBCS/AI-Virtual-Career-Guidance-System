import React from 'react';
import { IconFlame } from '@tabler/icons-react';
import type { UserPoints } from '../types';

interface PointsBadgeProps {
  points: UserPoints | null;
  loading?: boolean;
  compact?: boolean;
}

const PointsBadge: React.FC<PointsBadgeProps> = ({ 
  points, 
  loading = false,
  compact = false 
}) => {
  if (loading) {
    return (
      <div className={`points-badge loading ${compact ? 'compact' : ''}`}>
        <div className="skeleton skeleton-text" style={{ width: '60px' }} />
      </div>
    );
  }

  if (!points) {
    return null;
  }

  return (
    <div className={`points-badge ${compact ? 'compact' : ''}`}>
      <div className="points-content">
        <div className="points-value">
          {points.total_points?.toLocaleString() || 0}
        </div>
        <div className="points-label">Points</div>
      </div>
      
      {points.current_streak > 0 && (
        <div className="streak-info">
          <IconFlame size={20} className="flame-icon" />
          <span className="streak-value">{points.current_streak}</span>
        </div>
      )}
    </div>
  );
};

export default PointsBadge;
