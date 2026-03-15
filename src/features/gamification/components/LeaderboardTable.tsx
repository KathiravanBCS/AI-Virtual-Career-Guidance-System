import React from 'react';
import { IconFlame } from '@tabler/icons-react';
import type { LeaderboardResponse } from '../types';

interface LeaderboardTableProps {
  leaderboard: LeaderboardResponse | null;
  loading?: boolean;
  className?: string;
}

const LeaderboardTable: React.FC<LeaderboardTableProps> = ({
  leaderboard,
  loading = false,
  className = '',
}) => {
  if (loading) {
    return (
      <div className={`leaderboard-table loading ${className}`}>
        <div className="skeleton skeleton-table" />
      </div>
    );
  }

  if (!leaderboard || !leaderboard.entries || leaderboard.entries.length === 0) {
    return (
      <div className={`leaderboard-table empty ${className}`}>
        <p className="empty-message">No leaderboard data available</p>
      </div>
    );
  }

  return (
    <div className={`leaderboard-table ${className}`}>
      <table className="leaderboard-table-element">
        <thead>
          <tr>
            <th className="rank-col">Rank</th>
            <th className="player-col">Player</th>
            <th className="points-col">Points</th>
            <th className="streak-col">Streak</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.entries.map((entry) => (
            <tr
              key={entry.user_id}
              className={`leaderboard-row ${entry.is_current_user ? 'current-user' : ''}`}
            >
              <td className="rank-col">
                <span className="rank-badge">#{entry.rank}</span>
              </td>
              <td className="player-col">
                <div className="player-info">
                  {entry.user_photo && (
                    <img
                      src={entry.user_photo}
                      alt={entry.user_name}
                      className="player-photo"
                    />
                  )}
                  <span className="player-name">{entry.user_name}</span>
                </div>
              </td>
              <td className="points-col">
                <span className="points-value">{entry.total_points?.toLocaleString() || 0}</span>
              </td>
              <td className="streak-col">
                <span className="streak-value">
                  {entry.streak > 0 ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <IconFlame size={16} />
                      {entry.streak}
                    </div>
                  ) : (
                    '-'
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="leaderboard-footer">
        <p className="footer-text">
          Total Users: {leaderboard.total_users}
          {leaderboard.current_user_rank && ` • Your Rank: #${leaderboard.current_user_rank}`}
        </p>
      </div>
    </div>
  );
};

export default LeaderboardTable;
