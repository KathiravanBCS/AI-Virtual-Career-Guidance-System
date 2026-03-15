import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

export const useDeleteChatSession = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sessionId: string) => {
      await api.chat.sessions.delete(sessionId);
    },
    onSuccess: (_, sessionId) => {
      queryClient.invalidateQueries({ queryKey: ['chat', 'sessions'] });
      queryClient.removeQueries({ queryKey: ['chat', 'sessions', sessionId] });
      notifications.show({
        title: 'Success',
        message: 'Chat session deleted successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error deleting chat session',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
