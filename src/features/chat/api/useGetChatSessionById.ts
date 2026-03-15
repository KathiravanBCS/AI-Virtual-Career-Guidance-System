import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { ChatSession } from '../types';

export const useGetChatSessionById = (sessionId: number | null) => {
  return useQuery<ChatSession>({
    queryKey: ['chat', 'sessions', sessionId],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID is required');
      return api.chat.sessions.getById(sessionId.toString());
    },
    enabled: !!sessionId, // Only run query if sessionId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
