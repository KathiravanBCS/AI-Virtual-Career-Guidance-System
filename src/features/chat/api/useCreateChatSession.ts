import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { ChatSession, CreateChatSessionRequest } from '../types';

export const useCreateChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateChatSessionRequest) => api.chat.sessions.create(data),
    onSuccess: (_newSession: ChatSession) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error creating chat session',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
