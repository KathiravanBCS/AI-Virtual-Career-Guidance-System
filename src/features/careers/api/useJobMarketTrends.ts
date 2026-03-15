/**
 * React Query Hooks for Job Market Trends API
 */

import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import {
  JobMarketTrend,
  CreateJobMarketTrendRequest,
  UpdateJobMarketTrendRequest,
  JobMarketTrendListResponse,
  JobMarketTrendResponse,
} from '../types';

const JOB_MARKET_TRENDS_QUERY_KEY = 'job-market-trends';

// ============= GET HOOKS =============

export function useGetJobMarketTrends(filters?: Record<string, any>) {
  return useQuery({
    queryKey: [JOB_MARKET_TRENDS_QUERY_KEY, filters],
    queryFn: () => api.jobMarketTrends.getAll(),
    staleTime: 30 * 60 * 1000, // 30 minutes - trends change slowly
  });
}

export function useGetJobMarketTrend(trendId: number | null) {
  return useQuery({
    queryKey: [JOB_MARKET_TRENDS_QUERY_KEY, trendId],
    queryFn: () => api.jobMarketTrends.getById(trendId!),
    enabled: trendId !== null,
    staleTime: 30 * 60 * 1000,
  });
}

export function useGetTrendsByCareer(careerId: number | null) {
  return useQuery({
    queryKey: [JOB_MARKET_TRENDS_QUERY_KEY, 'career', careerId],
    queryFn: () => api.jobMarketTrends.getByCareer(careerId!),
    enabled: careerId !== null,
    staleTime: 30 * 60 * 1000,
  });
}

// ============= MUTATION HOOKS =============

export function useCreateJobMarketTrend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateJobMarketTrendRequest) => api.jobMarketTrends.create(data),
    onSuccess: (response: JobMarketTrendResponse) => {
      queryClient.invalidateQueries({ queryKey: [JOB_MARKET_TRENDS_QUERY_KEY] });
      if (response.data?.career_id) {
        queryClient.invalidateQueries({
          queryKey: [JOB_MARKET_TRENDS_QUERY_KEY, 'career', response.data.career_id],
        });
      }
      notifications.show({
        title: 'Success',
        message: 'Job market trend created successfully',
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

export function useUpdateJobMarketTrend(trendId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateJobMarketTrendRequest) =>
      api.jobMarketTrends.update(trendId, data),
    onSuccess: (response: JobMarketTrendResponse) => {
      queryClient.invalidateQueries({ queryKey: [JOB_MARKET_TRENDS_QUERY_KEY] });
      queryClient.invalidateQueries({
        queryKey: [JOB_MARKET_TRENDS_QUERY_KEY, trendId],
      });
      if (response.data?.career_id) {
        queryClient.invalidateQueries({
          queryKey: [JOB_MARKET_TRENDS_QUERY_KEY, 'career', response.data.career_id],
        });
      }
      queryClient.setQueryData([JOB_MARKET_TRENDS_QUERY_KEY, trendId], response);
      notifications.show({
        title: 'Success',
        message: 'Job market trend updated successfully',
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

export function useDeleteJobMarketTrend() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (trendId: number) => {
      await api.jobMarketTrends.delete(trendId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [JOB_MARKET_TRENDS_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Job market trend deleted successfully',
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
