import { notifications } from '@mantine/notifications';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import type { UpdateSkillGapRequest } from '../../types';

interface UpdateSkillGapPayload extends UpdateSkillGapRequest {
  id?: number;
}

export const useUpdateSkillGap = (id?: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateSkillGapPayload) => {
      const gapId = data.id || id;
      if (!gapId) throw new Error('Gap ID is required');

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _gapId, ...payload } = data;
      return api.skillGaps.update(gapId, payload);
    },
    onSuccess: (_, variables) => {
      const gapId = variables.id ?? id;
      queryClient.invalidateQueries({ queryKey: ['skillGaps'] });
      if (gapId !== undefined) {
        queryClient.invalidateQueries({ queryKey: ['skillGap', gapId] });
      }
      notifications.show({
        title: 'Success',
        message: 'Skill gap updated successfully',
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
