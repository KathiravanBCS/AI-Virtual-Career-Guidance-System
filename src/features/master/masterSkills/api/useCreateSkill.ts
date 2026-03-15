import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { CreateSkillRequest, SkillDetail } from '../types';

/**
 * Hook to create a new skill
 * @returns Mutation function and status
 * @example
 * const { mutate: createSkill, isLoading } = useCreateSkill();
 * createSkill({ skill_name: 'React', category: 'Frontend', ... });
 */
export const useCreateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<SkillDetail, Error, CreateSkillRequest>({
    mutationFn: async (data) => {
      return await api.skills.create(data);
    },
    onSuccess: () => {
      // Invalidate skills list to refetch
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      notifications.show({
        title: 'Success',
        message: 'Skill created successfully',
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
