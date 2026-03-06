import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

export const useDeleteWorkExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.workExperience.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workExperiences'] });
      notifications.show({
        title: 'Success',
        message: 'Work experience deleted successfully',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete work experience',
        color: 'red',
      });
    },
  });
};
