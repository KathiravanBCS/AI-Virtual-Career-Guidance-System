import { ReactNode } from 'react';

import { Group, Stack, Text, Title } from '@mantine/core';

interface ListPageLayoutProps {
  title: string;
  titleProps?: { fw?: number; size?: string };
  description?: string;
  actions?: ReactNode;
  filters?: ReactNode;
  children?: ReactNode;
}

export function ListPageLayout({ title, titleProps, description, actions, filters, children }: ListPageLayoutProps) {
  return (
    <Stack data-component="list-page-layout" gap="md">
      {/* Header */}
      <Group data-section="page-header" justify="space-between" align="flex-start">
        <div>
          <Title order={4} fw={titleProps?.fw ?? 400} size={titleProps?.size}>
            {title}
          </Title>
          {description && (
            <Text c="dimmed" size="sm" mt={4}>
              {description}
            </Text>
          )}
        </div>
        {actions && <Group gap="sm">{actions}</Group>}
      </Group>

      {/* Filters */}
      {filters}

      {/* Content */}
      {children}
    </Stack>
  );
}
