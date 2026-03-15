import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

/**
 * Hook to delete a skill
 * @returns Mutation function and status
 * @example
 * const { mutate: deleteSkill, isLoading } = useDeleteSkill();
 * deleteSkill('1');
 */
export const useDeleteSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: async (skillId) => {
      await api.skills.delete(skillId);
    },
    onSuccess: (_, skillId) => {
      // Invalidate both the specific skill and the skills list
      queryClient.invalidateQueries({ queryKey: ['skill', skillId] });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      notifications.show({
        title: 'Success',
        message: 'Skill deleted successfully',
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
