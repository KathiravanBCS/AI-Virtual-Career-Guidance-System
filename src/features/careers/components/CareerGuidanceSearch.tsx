import { Group, Select, TextInput } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';

interface CareerGuidanceSearchProps {
  searchTerm: string;
  sortBy: 'recent' | 'oldest' | 'goals';
  onSearchChange: (term: string) => void;
  onSortChange: (sort: string) => void;
}

export const CareerGuidanceSearch: React.FC<CareerGuidanceSearchProps> = ({
  searchTerm,
  sortBy,
  onSearchChange,
  onSortChange,
}) => {
  return (
    <Group gap="md" grow>
      <TextInput
        placeholder="Search career goals..."
        leftSection={<IconSearch size={16} />}
        value={searchTerm}
        onChange={(e) => onSearchChange(e.currentTarget.value)}
      />
      <Select
        placeholder="Sort by"
        data={[
          { value: 'recent', label: 'Most Recent' },
          { value: 'oldest', label: 'Oldest' },
          { value: 'goals', label: 'Career Goals' },
        ]}
        value={sortBy}
        onChange={(value) => onSortChange(value || 'recent')}
        style={{ flex: 0.5 }}
      />
    </Group>
  );
};
