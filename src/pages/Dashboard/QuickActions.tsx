import { Card, Group, Stack, Text, ThemeIcon, UnstyledButton } from '@mantine/core';
import { IconArrowUpRight, IconDownload, IconFileText } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import classes from './Dashboard.module.css';

export function QuickActions() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: IconFileText,
      label: 'Create Resume',
      description: 'Build your professional resume',
      color: 'blue',
      onClick: () => navigate('/resume-builder'),
    },
    {
      icon: IconDownload,
      label: 'Import Resume',
      description: 'Upload existing resume file',
      color: 'teal',
      onClick: () => navigate('/resume-import'),
    },
  ];

  return (
    <Card data-component="quick-actions" withBorder={false} shadow="0" padding="md" radius="md">
      <Text fz="sm" fw={600} mb="md">
        Quick Actions
      </Text>
      <Stack gap="xs">
        {actions.map(({ icon: Icon, label, description, color, onClick }) => (
          <UnstyledButton key={label} className={classes.actionButton} onClick={onClick}>
            <Group gap="sm">
              <ThemeIcon size={32} radius="md" variant="light" color={color}>
                <Icon size={20} />
              </ThemeIcon>
              <div>
                <Text fz="sm" fw={500}>
                  {label}
                </Text>
                <Text fz="xs" c="dimmed">
                  {description}
                </Text>
              </div>
            </Group>
            <IconArrowUpRight size={14} color="var(--mantine-color-dimmed)" />
          </UnstyledButton>
        ))}
      </Stack>
    </Card>
  );
}
