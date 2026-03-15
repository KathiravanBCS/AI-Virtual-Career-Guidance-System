import {
  Badge,
  Box,
  Center,
  Group,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconClock } from '@tabler/icons-react';

interface RecentlyCreatedItem {
  id?: number;
  title: string;
  code: string;
  status: string;
  count: number;
  createdAt?: string;
}

interface RecentlyCreatedListProps {
  title: string;
  items: RecentlyCreatedItem[];
  onItemClick: (item: RecentlyCreatedItem) => void;
  icon: React.ComponentType<{ size: number }>;
  getStatusColor?: (status: string) => string;
  countLabel?: string;
  emptyMessage?: string;
  showTitleIcon?: boolean;
}

export const RecentlyCreatedList: React.FC<RecentlyCreatedListProps> = ({
  title,
  items,
  onItemClick,
  icon: IconComponent,
  getStatusColor = (status) => (status === 'active' ? 'green' : status === 'draft' ? 'yellow' : 'gray'),
  countLabel = 'Items',
  emptyMessage = 'No items created yet',
  showTitleIcon = true,
}) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  if (!items || items.length === 0) {
    return (
      <Paper
        p="lg"
        radius="lg"
        withBorder
        style={{
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          borderColor: theme.colors.gray[colorScheme === 'dark' ? 7 : 2],
        }}
      >
        <Stack gap="md">
          <Text fw={600} size="lg">
            {title}
          </Text>
          <Text c="dimmed" py="lg">
            {emptyMessage}
          </Text>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper
      p="lg"
      radius="lg"
      withBorder
      style={{
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        borderColor: theme.colors.gray[colorScheme === 'dark' ? 7 : 2],
      }}
    >
      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Group gap="sm">
            {showTitleIcon && (
              <ThemeIcon size="lg" radius="md" variant="light" color={theme.primaryColor}>
                <IconComponent size={20} />
              </ThemeIcon>
            )}
            <Text fw={600} size="lg">
              {title}
            </Text>
          </Group>
          <Badge size="lg" variant="light">
            {items.length}
          </Badge>
        </Group>

        {/* Items List */}
        <Stack gap={0}>
          {items.slice(0, 5).map((item) => {
            const statusColor = getStatusColor(item.status);
            return (
              <Box
                key={item.id}
                onClick={() => onItemClick(item)}
                style={{
                  display: 'flex',
                  gap: '12px',
                  padding: '12px',
                  borderBottom: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]}`,
                  cursor: 'pointer',
                  transition: 'background-color 0.2s',
                  '&:hover': {
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[1],
                  },
                }}
              >
                {/* Icon */}
                <ThemeIcon size={40} radius="md" variant="light" color={statusColor}>
                  <IconComponent size={20} />
                </ThemeIcon>

                {/* Content */}
                <Box style={{ flex: 1 }}>
                  <Group justify="space-between" align="flex-start">
                    <Box style={{ flex: 1 }}>
                      <Text fw={500} size="sm" lineClamp={1}>
                        {item.title}
                      </Text>
                      <Text size="xs" c="dimmed" lineClamp={1}>
                        {item.code}
                      </Text>
                    </Box>
                    <Badge size="xs" color={statusColor} variant="light" style={{ whiteSpace: 'nowrap' }}>
                      {item.status}
                    </Badge>
                  </Group>

                  {/* Stats Row */}
                  <Group gap="md" mt="xs">
                    <Group gap={4}>
                      <Text fw={500} size="xs">
                        {item.count}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {countLabel}
                      </Text>
                    </Group>
                    {item.createdAt && (
                      <Group gap={4}>
                        <IconClock size={14} color="var(--mantine-color-dimmed)" />
                        <Text size="xs" c="dimmed">
                          {new Date(item.createdAt).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </Text>
                      </Group>
                    )}
                  </Group>
                </Box>
              </Box>
            );
          })}
        </Stack>
      </Stack>
    </Paper>
  );
};

export default RecentlyCreatedList;
