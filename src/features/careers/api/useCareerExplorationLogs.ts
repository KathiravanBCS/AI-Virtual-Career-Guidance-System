/**
 * React Query Hooks for Career Exploration Logs API
 */

import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import {
  CareerExplorationLog,
  CreateCareerExplorationLogRequest,
  UpdateCareerExplorationLogRequest,
} from '../types';

const CAREER_EXPLORATION_LOGS_QUERY_KEY = 'career-exploration-logs';

// ============= GET HOOKS =============

export function useGetCareerExplorationLogs(filters?: Record<string, any>) {
  return useQuery({
    queryKey: [CAREER_EXPLORATION_LOGS_QUERY_KEY, filters],
    queryFn: () => api.careerExplorationLogs.getAll(),
    staleTime: 2 * 60 * 1000, // 2 minutes - logs update frequently
  });
}

export function useGetCareerExplorationLog(logId: number | null) {
  return useQuery({
    queryKey: [CAREER_EXPLORATION_LOGS_QUERY_KEY, logId],
    queryFn: () => api.careerExplorationLogs.getById(logId!),
    enabled: logId !== null,
    staleTime: 2 * 60 * 1000,
  });
}

export function useGetLogsByUser(userId: number | null) {
  return useQuery({
    queryKey: [CAREER_EXPLORATION_LOGS_QUERY_KEY, 'user', userId],
    queryFn: () => api.careerExplorationLogs.getByUser(userId!),
    enabled: userId !== null,
    staleTime: 2 * 60 * 1000,
  });
}

// ============= MUTATION HOOKS =============

export function useCreateCareerExplorationLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCareerExplorationLogRequest) =>
      api.careerExplorationLogs.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAREER_EXPLORATION_LOGS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Career exploration logged successfully',
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

export function useUpdateCareerExplorationLog(logId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCareerExplorationLogRequest) =>
      api.careerExplorationLogs.update(logId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CAREER_EXPLORATION_LOGS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CAREER_EXPLORATION_LOGS_QUERY_KEY, logId] });
      queryClient.setQueryData([CAREER_EXPLORATION_LOGS_QUERY_KEY, logId], data);
      notifications.show({
        title: 'Success',
        message: 'Career exploration log updated successfully',
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

export function useDeleteCareerExplorationLog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (logId: number) => {
      await api.careerExplorationLogs.delete(logId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAREER_EXPLORATION_LOGS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Career exploration log deleted successfully',
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
