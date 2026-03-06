import { Group, Select, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface PathSearchProps {
  searchTerm: string;
  sortBy: string;
  onSearchChange: (term: string) => void;
  onSortChange: (sort: string) => void;
}

export const PathSearch: React.FC<PathSearchProps> = ({ searchTerm, sortBy, onSearchChange, onSortChange }) => {
  return (
    <Group gap="md">
      <TextInput
        placeholder="Search learning paths..."
        leftSection={<IconSearch size={18} />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
        style={{ flex: 1 }}
      />
      <Select
        placeholder="Sort by"
        data={[
          { value: 'progress', label: 'Progress' },
          { value: 'name', label: 'Name' },
          { value: 'recent', label: 'Recently Added' },
        ]}
        value={sortBy}
        onChange={(val) => onSortChange(val || 'progress')}
      />
    </Group>
  );
};
