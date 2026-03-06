import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

export const useDeleteLearningModule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (moduleId: number) => {
      await api.learningModules.delete(moduleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['learningModules'] });
      notifications.show({
        title: 'Success',
        message: 'Learning module deleted successfully',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error deleting learning module',
        message: error?.message || 'Failed to delete learning module',
        color: 'red',
      });
    },
  });
};
