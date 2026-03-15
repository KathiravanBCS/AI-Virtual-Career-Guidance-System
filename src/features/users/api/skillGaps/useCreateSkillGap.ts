import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { CreateSkillGapRequest } from '../../types';

export const useCreateSkillGap = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateSkillGapRequest) => api.skillGaps.create(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['skillGaps'] });
      queryClient.invalidateQueries({ queryKey: ['skillGaps', 'user', variables.user_id] });
      queryClient.invalidateQueries({
        queryKey: ['skillGaps', 'user', variables.user_id, 'career', variables.career_id],
      });
      notifications.show({
        title: 'Success',
        message: 'Skill gap created successfully',
        color: 'green',
      });
    },
    onError: (error: unknown) => {
      notifications.show({
        title: 'Error creating skill gap',
        message: getErrorMessage(error),
        color: 'red',
      });
    },
  });
};
