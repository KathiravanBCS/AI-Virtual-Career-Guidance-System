/**
 * React Query Hooks for Career Companies API
 */

import { notifications } from '@mantine/notifications';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { getErrorMessage } from '@/lib/utils/errorHandler';

import { CareerCompany, CreateCareerCompanyRequest, UpdateCareerCompanyRequest } from '../types';

const CAREER_COMPANIES_QUERY_KEY = 'career-companies';

// ============= GET HOOKS =============

export function useGetCareerCompanies(filters?: Record<string, any>) {
  return useQuery({
    queryKey: [CAREER_COMPANIES_QUERY_KEY, filters],
    queryFn: () => api.careerCompanies.getAll(),
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetCareerCompany(companyId: number | null) {
  return useQuery({
    queryKey: [CAREER_COMPANIES_QUERY_KEY, companyId],
    queryFn: () => api.careerCompanies.getById(companyId!),
    enabled: companyId !== null,
    staleTime: 5 * 60 * 1000,
  });
}

// ============= MUTATION HOOKS =============

export function useCreateCareerCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateCareerCompanyRequest) => api.careerCompanies.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAREER_COMPANIES_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Career company created successfully',
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

export function useUpdateCareerCompany(companyId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateCareerCompanyRequest) =>
      api.careerCompanies.update(companyId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [CAREER_COMPANIES_QUERY_KEY] });
      queryClient.invalidateQueries({ queryKey: [CAREER_COMPANIES_QUERY_KEY, companyId] });
      queryClient.setQueryData([CAREER_COMPANIES_QUERY_KEY, companyId], data);
      notifications.show({
        title: 'Success',
        message: 'Career company updated successfully',
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

export function useDeleteCareerCompany() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (companyId: number) => {
      await api.careerCompanies.delete(companyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CAREER_COMPANIES_QUERY_KEY] });
      notifications.show({
        title: 'Success',
        message: 'Career company deleted successfully',
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
