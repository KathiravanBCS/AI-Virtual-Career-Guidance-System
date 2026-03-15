import { useMutation } from '@tanstack/react-query';

import { api } from '@/lib/api';

import type { DocumentConversionResponse } from '../types';

export const useDocumentConversion = () => {
  return useMutation<DocumentConversionResponse, Error, File>({
    mutationFn: async (file: File) => {
      const response = await api.documents.convertToText(file);
      if (!response.success) {
        throw new Error(response.error || 'Failed to convert document');
      }
      return response;
    },
  });
};
