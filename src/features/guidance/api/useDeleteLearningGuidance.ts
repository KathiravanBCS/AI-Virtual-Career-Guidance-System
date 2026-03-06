import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

export const useDeleteLearningGuidance = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.learningGuidance.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningGuidances'] });
      notifications.show({
        title: 'Success',
        message: 'Learning guidance deleted successfully',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete learning guidance',
        color: 'red',
      });
    },
  });
};
