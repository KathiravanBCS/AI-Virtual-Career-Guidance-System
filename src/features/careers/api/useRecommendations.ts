/**
 * React Query Hooks for Recommendations API
 */

import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import {
  Recommendation,
  CreateRecommendationRequest,
  UpdateRecommendationRequest,
} from '../types';

const RECOMMENDATIONS_QUERY_KEY = 'recommendations';

// ============= GET HOOKS =============

export function useGetRecommendations(filters?: Record<string, any>) {
  return useQuery({
    queryKey: [RECOMMENDATIONS_QUERY_KEY, filters],
    queryFn: () => api.recommendations.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetRecommendation(recommendationId: number | null) {
  return useQuery({
    queryKey: [RECOMMENDATIONS_QUERY_KEY, recommendationId],
    queryFn: () => api.recommendations.getById(recommendationId!),
    enabled: recommendationId !== null,
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetRecommendationsByUser(userId: number | null) {
  return useQuery({
    queryKey: [RECOMMENDATIONS_QUERY_KEY, 'user', userId],
    queryFn: () => api.recommendations.getByUser(userId!),
    enabled: userId !== null,
    staleTime: 5 * 60 * 1000,
  });
}

// ============= MUTATION HOOKS =============

export function useCreateRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateRecommendationRequest) => api.recommendations.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECOMMENDATIONS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Recommendation created successfully',
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

export function useUpdateRecommendation(recommendationId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateRecommendationRequest) =>
      api.recommendations.update(recommendationId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [RECOMMENDATIONS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [RECOMMENDATIONS_QUERY_KEY, recommendationId] });
      queryClient.setQueryData([RECOMMENDATIONS_QUERY_KEY, recommendationId], data);
      notifications.show({
        title: 'Success',
        message: 'Recommendation updated successfully',
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

export function useDeleteRecommendation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recommendationId: number) => {
      await api.recommendations.delete(recommendationId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [RECOMMENDATIONS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Recommendation deleted successfully',
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
