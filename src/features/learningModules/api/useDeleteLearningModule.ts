import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

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
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error deleting learning module',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
