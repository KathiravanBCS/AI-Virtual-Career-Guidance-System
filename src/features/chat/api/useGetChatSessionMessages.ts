import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { ChatMessagesListResponse } from '../types';

export const useGetChatSessionMessages = (sessionId: number | null) => {
  return useQuery<ChatMessagesListResponse>({
    queryKey: ['chat', 'sessions', sessionId, 'messages'],
    queryFn: async () => {
      if (!sessionId) throw new Error('Session ID is required');
      return api.chat.sessions.messages.getAll(sessionId.toString());
    },
    enabled: !!sessionId, // Only run query if sessionId is provided
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
