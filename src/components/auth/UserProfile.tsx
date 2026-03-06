import { Avatar, Badge, Card, Group, Stack, Text } from '@mantine/core';

import { LogoutButton } from '@/lib/auth/LogoutButton';
import { useAuth } from '@/lib/auth/useAuth';

export function UserProfile() {
  const { user, userRole } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Card>
      <Stack gap="sm">
        <Group>
          <Avatar src={user.photoURL} alt={user.displayName || user.email || 'User'} radius="xl" size="lg" />
          <div>
            <Text fw={500}>{user.displayName || user.email}</Text>
            <Text size="sm" c="dimmed">
              {user.email}
            </Text>
          </div>
        </Group>

        {userRole && (
          <Group>
            <Text size="sm">Role:</Text>
            <Badge size="lg" color="blue">
              {userRole.role.toUpperCase()}
            </Badge>
          </Group>
        )}

        <LogoutButton />
      </Stack>
    </Card>
  );
}
