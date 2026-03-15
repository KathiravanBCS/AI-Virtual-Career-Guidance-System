/**
 * React Query Hooks for Careers API
 */

import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import { Career, CreateCareerRequest, UpdateCareerRequest } from '../types';

const CAREERS_QUERY_KEY = 'careers';

// ============= GET HOOKS =============

export function useGetCareers(filters?: Record<string, any>) {
  return useQuery({
    queryKey: [CAREERS_QUERY_KEY, filters],
    queryFn: () => api.careers.getAll(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useGetCareer(careerId: number | null) {
  return useQuery({
    queryKey: [CAREERS_QUERY_KEY, careerId],
    queryFn: () => api.careers.getById(careerId!),
    enabled: careerId !== null,
    staleTime: 5 * 60 * 1000,
  });
}

// ============= MUTATION HOOKS =============

export function useCreateCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCareerRequest) => api.careers.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAREERS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Career created successfully',
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

export function useUpdateCareer(careerId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCareerRequest) => api.careers.update(careerId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CAREERS_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CAREERS_QUERY_KEY, careerId] });
      queryClient.setQueryData([CAREERS_QUERY_KEY, careerId], data);
      notifications.show({
        title: 'Success',
        message: 'Career updated successfully',
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

export function useDeleteCareer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (careerId: number) => {
      await api.careers.delete(careerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAREERS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Career deleted successfully',
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
