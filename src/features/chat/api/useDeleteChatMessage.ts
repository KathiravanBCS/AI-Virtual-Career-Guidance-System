import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

export const useDeleteChatMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (messageId: string) => {
      await api.chat.messages.delete(messageId);
    },
    onSuccess: (_, messageId) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'messages'] });
      queryClient.removeQueries({ queryKey: ['chat', 'messages', messageId] });
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
      notifications.show({
        title: 'Success',
        message: 'Message deleted successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error deleting message',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
