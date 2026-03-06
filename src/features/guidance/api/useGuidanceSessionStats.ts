import { useQuery } from '@tanstack/react-query';

export interface GuidanceSessionStats {
  totalSessions?: number;
  completedSessions?: number;
  inProgressSessions?: number;
  scheduledSessions?: number;
  total?: number;
  open_rate?: number;
  click_rate?: number;
}

export function useGuidanceSessionStats(sessionId?: string) {
  return useQuery<GuidanceSessionStats>({
    queryKey: ['guidance-session-stats', sessionId],
    queryFn: async () => {
      // TODO: Implement API call to fetch guidance session stats
      return {
        totalSessions: 0,
        completedSessions: 0,
        inProgressSessions: 0,
        scheduledSessions: 0,
        total: 0,
        open_rate: 0,
        click_rate: 0,
      };
    },
    enabled: !!sessionId,
  });
}
