import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { ChatMessage, UpdateChatMessageRequest } from '../types';

export const useUpdateChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, data }: { messageId: string; data: Partial<UpdateChatMessageRequest> }) =>
      api.chat.messages.update(messageId, data),
    onSuccess: (updatedMessage: ChatMessage, variables) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages'] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages', variables.messageId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
      notifications.show({
        title: 'Success',
        message: 'Message updated successfully',
        color: 'green',
        autoClose: 2000,
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error updating message',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
