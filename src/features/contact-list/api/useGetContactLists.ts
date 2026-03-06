import { useQuery } from '@tanstack/react-query';

export interface ContactList {
  id: string;
  name: string;
  contact_count: number;
  createdAt: string;
  updatedAt: string;
}

export function useGetContactLists() {
  return useQuery<ContactList[]>({
    queryKey: ['contact-lists'],
    queryFn: async () => {
      // TODO: Implement API call to fetch contact lists
      return [];
    },
  });
}
