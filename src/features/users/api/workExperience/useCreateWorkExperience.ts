import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { CreateWorkExperienceRequest } from '../../types';

export const useCreateWorkExperience = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateWorkExperienceRequest) => api.workExperience.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['workExperiences'] });
      queryClient.invalidateQueries({ queryKey: ['workExperience', 'user', variables.user_id] });
      notifications.show({
        title: 'Success',
        message: 'Work experience added successfully',
        color: 'green',
      });
    },
    onError: (error: any) => {
      notifications.show({
        title: 'Error adding work experience',
        message: error?.message || 'Failed to add work experience',
        color: 'red',
      });
    },
  });
};
