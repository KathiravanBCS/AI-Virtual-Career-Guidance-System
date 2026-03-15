import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { ChatMessage } from '../types';

export const useGetChatMessage = (messageId: string | null) => {
  return useQuery<ChatMessage>({
    queryKey: ['chat', 'messages', messageId],
    queryFn: async () => {
      if (!messageId) throw new Error('Message ID is required');
      return api.chat.messages.getById(messageId);
    },
    enabled: !!messageId, // Only run query if messageId is provided
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
