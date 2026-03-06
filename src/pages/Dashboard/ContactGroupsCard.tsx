import { useMemo } from 'react';

import { Badge, Card, Group, Skeleton, Stack, Text, UnstyledButton } from '@mantine/core';
import { IconChevronRight, IconUsers } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { useGetContactLists } from '@/features/contact-list/api/useGetContactLists';

import classes from './Dashboard.module.css';

export function ContactGroupsCard() {
  const navigate = useNavigate();
  const { data: groups = [], isLoading } = useGetContactLists();

  const totalContacts = useMemo(() => groups.reduce((sum: number, g) => sum + g.contact_count, 0), [groups]);

  const handleGroupClick = (groupId: string) => {
    window.localStorage.setItem('contact-directory-selected-group', JSON.stringify(groupId));
    navigate('/contacts');
  };

  const handleAllContacts = () => {
    window.localStorage.setItem('contact-directory-selected-group', JSON.stringify(null));
    navigate('/contacts');
  };

  return (
    <Card data-component="contact-groups-card" withBorder shadow="0" padding="md" radius="md">
      <Text fz="sm" fw={600} mb="sm">
        Contacts ({totalContacts.toLocaleString()})
      </Text>

      {isLoading ? (
        <Stack gap="xs">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} height={36} radius="sm" />
          ))}
        </Stack>
      ) : groups.length === 0 ? (
        <Text fz="sm" c="dimmed" ta="center" py="md">
          No contact groups yet
        </Text>
      ) : (
        <Stack gap={0}>
          <UnstyledButton className={classes.groupItem} onClick={handleAllContacts}>
            <Group gap="sm">
              <IconUsers size={16} color="var(--mantine-color-dimmed)" />
              <Text fz="sm">All Contacts</Text>
            </Group>
            <IconChevronRight size={14} color="var(--mantine-color-dimmed)" />
          </UnstyledButton>
          {groups.map((group) => (
            <UnstyledButton key={group.id} className={classes.groupItem} onClick={() => handleGroupClick(group.id)}>
              <Group gap="sm" wrap="nowrap" style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                <IconUsers size={16} color="var(--mantine-color-dimmed)" style={{ flexShrink: 0 }} />
                <Text fz="sm" truncate>
                  {group.name}
                </Text>
              </Group>
              <Group gap="xs" wrap="nowrap" style={{ flexShrink: 0 }}>
                <Badge size="sm" variant="light" color="gray">
                  {group.contact_count.toLocaleString()}
                </Badge>
                <IconChevronRight size={14} color="var(--mantine-color-dimmed)" />
              </Group>
            </UnstyledButton>
          ))}
        </Stack>
      )}
    </Card>
  );
}
