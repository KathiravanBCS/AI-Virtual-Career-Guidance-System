/**
 * React Query Hooks for In Demand Skills API
 */

import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import { InDemandSkill, CreateInDemandSkillRequest, UpdateInDemandSkillRequest } from '../types';

const IN_DEMAND_SKILLS_QUERY_KEY = 'in-demand-skills';

// ============= GET HOOKS =============

export function useGetInDemandSkills(filters?: Record<string, any>) {
  return useQuery({
    queryKey: [IN_DEMAND_SKILLS_QUERY_KEY, filters],
    queryFn: () => api.inDemandSkills.getAll(),
    staleTime: 10 * 60 * 1000, // 10 minutes - market data is less volatile
  });
}

export function useGetInDemandSkill(skillId: number | null) {
  return useQuery({
    queryKey: [IN_DEMAND_SKILLS_QUERY_KEY, skillId],
    queryFn: () => api.inDemandSkills.getById(skillId!),
    enabled: skillId !== null,
    staleTime: 10 * 60 * 1000,
  });
}

// ============= MUTATION HOOKS =============

export function useCreateInDemandSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateInDemandSkillRequest) => api.inDemandSkills.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [IN_DEMAND_SKILLS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'In-demand skill created successfully',
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
}

export function useUpdateInDemandSkill(skillId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateInDemandSkillRequest) =>
      api.inDemandSkills.update(skillId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [IN_DEMAND_SKILLS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [IN_DEMAND_SKILLS_QUERY_KEY, skillId] });
      queryClient.setQueryData([IN_DEMAND_SKILLS_QUERY_KEY, skillId], data);
      notifications.show({
        title: 'Success',
        message: 'In-demand skill updated successfully',
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
}

export function useDeleteInDemandSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: number) => {
      await api.inDemandSkills.delete(skillId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [IN_DEMAND_SKILLS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'In-demand skill deleted successfully',
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
}
