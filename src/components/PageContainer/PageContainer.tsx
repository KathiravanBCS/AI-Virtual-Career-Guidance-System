import { ReactNode } from 'react';

import { Card, Group, ScrollArea, Stack, Text, Title } from '@mantine/core';

interface ListPageLayoutProps {
  title: string;
  description?: string | ReactNode;
  actions?: ReactNode;
  filters?: ReactNode;
  rightSection?: ReactNode;
  children: ReactNode;
}

export function PageContainer({ title, description, actions, filters, rightSection, children }: ListPageLayoutProps) {
  return (
    <ScrollArea style={{ height: '100vh' }} type="auto">
      <Stack gap="lg" p="xl">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <div>
            <Title order={2}>{title}</Title>
            {description && (
              <Text c="dimmed" size="sm" mt={4}>
                {description}
              </Text>
            )}
          </div>
          <Group gap="sm">
            {actions}
            {rightSection}
          </Group>
        </Group>

        {/* Filters */}
        {filters}

        {/* Content */}
        {children}
      </Stack>
    </ScrollArea>
  );
}
