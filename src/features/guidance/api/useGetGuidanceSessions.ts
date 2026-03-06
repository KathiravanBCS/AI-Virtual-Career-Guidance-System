import { useQuery } from '@tanstack/react-query';

import { GuidanceSession } from '../types';

export function useGetGuidanceSessions() {
  return useQuery<GuidanceSession[]>({
    queryKey: ['guidanceSessions'],
    queryFn: async () => {
      // TODO: Implement actual API call
      return [];
    },
  });
}
