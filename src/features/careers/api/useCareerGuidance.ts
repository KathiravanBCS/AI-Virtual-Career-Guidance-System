/**
 * React Query Hooks for Career Guidance API
 */

import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import {
  CareerGuidance,
  CareerGuidanceListResponse,
  CareerGuidanceResponse,
  CreateCareerGuidanceRequest,
  UpdateCareerGuidanceRequest,
} from '../types';

const CAREER_GUIDANCE_QUERY_KEY = 'careerGuidance';

// ============= GET HOOKS =============

export function useGetCareerGuidances(filters?: Record<string, any>) {
  return useQuery({
    queryKey: [CAREER_GUIDANCE_QUERY_KEY, filters],
    queryFn: () => api.careerGuidance.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetCareerGuidance(guidanceId: number | null) {
  return useQuery({
    queryKey: [CAREER_GUIDANCE_QUERY_KEY, guidanceId],
    queryFn: () => api.careerGuidance.getById(guidanceId!),
    enabled: guidanceId !== null,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetCareerGuidanceByUser(userId: number | null) {
  return useQuery({
    queryKey: [CAREER_GUIDANCE_QUERY_KEY, 'user', userId],
    queryFn: () => api.careerGuidance.getByUser(userId!),
    enabled: userId !== null,
    staleTime: 5 * 60 * 1000,
  });
}

// ============= MUTATION HOOKS =============

export function useCreateCareerGuidance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCareerGuidanceRequest) => api.careerGuidance.create(data),
    onSuccess: (response: CareerGuidanceResponse) => {
      queryClient.invalidateQueries({ queryKey: [CAREER_GUIDANCE_QUERY_KEY] });
      if (response.data?.user_id) {
        queryClient.invalidateQueries({
          queryKey: [CAREER_GUIDANCE_QUERY_KEY, 'user', response.data.user_id],
        });
      }
      notifications.show({
        title: 'Success',
        message: 'Career Guidance created successfully',
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

export function useUpdateCareerGuidance(guidanceId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCareerGuidanceRequest) => api.careerGuidance.update(guidanceId, data),
    onSuccess: (response: CareerGuidanceResponse) => {
      queryClient.invalidateQueries({ queryKey: [CAREER_GUIDANCE_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [CAREER_GUIDANCE_QUERY_KEY, guidanceId],
      });
      if (response.data?.user_id) {
        queryClient.invalidateQueries({
          queryKey: [CAREER_GUIDANCE_QUERY_KEY, 'user', response.data.user_id],
        });
      }
      queryClient.setQueryData([CAREER_GUIDANCE_QUERY_KEY, guidanceId], response);
      notifications.show({
        title: 'Success',
        message: 'Career Guidance updated successfully',
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

export function useDeleteCareerGuidance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (guidanceId: number) => {
      await api.careerGuidance.delete(guidanceId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAREER_GUIDANCE_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Career Guidance deleted successfully',
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
