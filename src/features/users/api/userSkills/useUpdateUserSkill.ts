import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { UpdateUserSkillRequest } from '../../types';

interface UpdateUserSkillPayload extends UpdateUserSkillRequest {
  id?: number;
}

export const useUpdateUserSkill = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateUserSkillPayload) => {
      const skillId = data.id || id;
      if (!skillId) throw new Error('Skill ID is required');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _skillId, ...payload } = data;
      return api.userSkills.update(skillId, payload);
    },
    onSuccess: (_, variables) => {
      const skillId = variables.id ?? id;
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
      if (skillId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['userSkill', skillId] });
      }
      notifications.show({
        title: 'Success',
        message: 'Skill updated successfully',
        color: 'green',
      });
    },
    onError: (error) => {
      notifications.show({
        title: 'Error',
        message: error.message || 'Failed to update skill',
        color: 'red',
      });
    },
  });
};
