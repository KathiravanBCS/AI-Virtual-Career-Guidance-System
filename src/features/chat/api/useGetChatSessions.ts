import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { ChatSessionsListResponse } from '../types';

export const useGetChatSessions = () => {
  return useQuery<ChatSessionsListResponse>({
    queryKey: ['chat', 'sessions'],
    queryFn: async () => {
      return api.chat.sessions.getAll();
    },
    staleTime: 0, // Always consider data stale so invalidateQueries forces refetch
    gcTime: 0, // Don't cache after unmount
  });
};
