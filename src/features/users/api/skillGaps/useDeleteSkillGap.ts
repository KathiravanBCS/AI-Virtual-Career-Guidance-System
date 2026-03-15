import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

export const useDeleteSkillGap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      await api.skillGaps.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['skillGaps'] });
      notifications.show({
        title: 'Success',
        message: 'Skill gap deleted successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
