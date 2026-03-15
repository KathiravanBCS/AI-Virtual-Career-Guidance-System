import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { CreateUserSkillRequest } from '../../types';

export const useCreateUserSkill = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateUserSkillRequest) => api.userSkills.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['userSkills'] });
      queryClient.invalidateQueries({ queryKey: ['userSkills', 'user', variables.user_id] });
      notifications.show({
        title: 'Success',
        message: 'Skill added successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error adding skill',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
