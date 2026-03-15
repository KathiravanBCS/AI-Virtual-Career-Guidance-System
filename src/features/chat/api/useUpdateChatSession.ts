import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { ChatSession, UpdateChatSessionRequest } from '../types';

export const useUpdateChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ sessionId, data }: { sessionId: string; data: Partial<UpdateChatSessionRequest> }) =>
      api.chat.sessions.update(sessionId, data),
    onSuccess: (updatedSession: ChatSession, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions', variables.sessionId] });
      notifications.show({
        title: 'Success',
        message: 'Chat session updated successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error updating chat session',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
