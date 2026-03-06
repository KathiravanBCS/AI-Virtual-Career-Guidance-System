import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

export const useDeleteUserSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.userSkills.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
      notifications.show({
        title: 'Success',
        message: 'Skill deleted successfully',
        color: 'green',
      });
    },
    onError: (error: Error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to delete skill',
        color: 'red',
      });
    },
  });
};
