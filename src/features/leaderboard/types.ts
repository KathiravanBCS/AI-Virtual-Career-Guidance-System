export interface LeaderboardUser {
  rank: number;
  name: string;
  points: number;
  streak: number;
  accuracy: number | string;
}

export interface LeaderboardData {
  topUsers: LeaderboardUser[];
  currentUserRank?: number;
  currentUserPoints?: number;
}
