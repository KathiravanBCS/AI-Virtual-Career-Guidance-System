import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { SkillDetail, UpdateSkillRequest } from '../types';

/**
 * Hook to update a skill
 * @returns Mutation function and status
 * @example
 * const { mutate: updateSkill, isLoading } = useUpdateSkill();
 * updateSkill({ skillId: '1', data: { skill_name: 'React JS', ... } });
 */
export const useUpdateSkill = () => {
  const queryClient = useQueryClient();

  return useMutation<SkillDetail, Error, { skillId: string; data: Partial<UpdateSkillRequest> }>({
    mutationFn: async ({ skillId, data }) => {
      return await api.skills.update(skillId, data);
    },
    onSuccess: (_, { skillId }) => {
      // Invalidate both the specific skill and the skills list
      queryClient.invalidateQueries({ queryKey: ['skill', skillId] });
      queryClient.invalidateQueries({ queryKey: ['skills'] });
      notifications.show({
        title: 'Success',
        message: 'Skill updated successfully',
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
