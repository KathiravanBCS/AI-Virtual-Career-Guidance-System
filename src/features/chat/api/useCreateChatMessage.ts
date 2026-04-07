import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { ChatMessage, CreateChatMessageRequest } from '../types';

export const useCreateChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: CreateChatMessageRequest }) =>
      api.chat.sessions.messages.create(sessionId, data),
    onSuccess: (_newMessage: ChatMessage, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions', variables.sessionId, 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions', variables.sessionId] });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error sending message',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
