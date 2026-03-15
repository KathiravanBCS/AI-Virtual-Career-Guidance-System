/**
 * React Query Hooks for Career Skills API
 */

import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import { CareerSkill, CreateCareerSkillRequest, UpdateCareerSkillRequest } from '../types';

const CAREER_SKILLS_QUERY_KEY = 'career-skills';

// ============= GET HOOKS =============

export function useGetCareerSkills(filters?: Record<string, any>) {
  return useQuery({
    queryKey: [CAREER_SKILLS_QUERY_KEY, filters],
    queryFn: () => api.careerSkills.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetCareerSkill(skillId: number | null) {
  return useQuery({
    queryKey: [CAREER_SKILLS_QUERY_KEY, skillId],
    queryFn: () => api.careerSkills.getById(skillId!),
    enabled: skillId !== null,
    staleTime: 5 * 60 * 1000,
  });
}

// ============= MUTATION HOOKS =============

export function useCreateCareerSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCareerSkillRequest) => api.careerSkills.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAREER_SKILLS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Career skill created successfully',
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

export function useUpdateCareerSkill(skillId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCareerSkillRequest) => api.careerSkills.update(skillId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CAREER_SKILLS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CAREER_SKILLS_QUERY_KEY, skillId] });
      queryClient.setQueryData([CAREER_SKILLS_QUERY_KEY, skillId], data);
      notifications.show({
        title: 'Success',
        message: 'Career skill updated successfully',
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

export function useDeleteCareerSkill() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (skillId: number) => {
      await api.careerSkills.delete(skillId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAREER_SKILLS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Career skill deleted successfully',
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
