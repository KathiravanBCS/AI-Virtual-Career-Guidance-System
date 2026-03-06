import { useEffect } from 'react';

import {
  Avatar,
  Box,
  Card,
  ColorSwatch,
  Container,
  Group,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
  UnstyledButton,
  useMantineColorScheme,
} from '@mantine/core';
import { IconCheck, IconLogout, IconMoon, IconSun } from '@tabler/icons-react';
import { getAuth } from 'firebase/auth';

import { LogoutButton } from '@/lib/auth/LogoutButton';
import { useAuth } from '@/lib/auth/useAuth';
import { useTheme } from '@/theme/ThemeProvider';
import { themeList } from '@/theme/themeRegistry';

export function SettingsPage() {
  const { themeName, setThemeName } = useTheme();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { user } = useAuth();

  useEffect(() => {
    // Refresh user data to ensure photoURL is loaded
    if (user) {
      user.reload().catch((error) => console.error('Error reloading user:', error));
    }
  }, [user]);

  const getPhotoUrl = () => {
    const currentUser = getAuth().currentUser;
    return currentUser?.photoURL || user?.photoURL;
  };

  const getUserInitials = () => {
    if (!user) return 'U';
    const name = user.displayName || user.email;
    return (
      name
        ?.split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'U'
    );
  };

  return (
    <Container size="sm" py="xl" data-component="settings-page">
      <Stack gap="xl">
        <Title order={4} fw={400}>
          Settings
        </Title>
        <Stack data-section="account" gap="md">
          <Text fw={500} size="sm" c="dimmed">
            Account
          </Text>

          <Card withBorder padding="lg">
            <Stack gap="lg">
              <Group>
                <Avatar size={48} radius="xl" variant="filled" src={getPhotoUrl()}>
                  {getUserInitials()}
                </Avatar>
                <div>
                  <Text fw={500}>{user?.displayName || user?.email || 'User'}</Text>
                  <Text size="sm" c="dimmed">
                    {user?.email || ''}
                  </Text>
                </div>
              </Group>

              <LogoutButton />
            </Stack>
          </Card>
        </Stack>
        <Stack data-section="appearance" gap="md">
          <Text fw={500} size="sm" c="dimmed">
            Appearance
          </Text>

          <Card withBorder padding="lg">
            <Stack gap="lg">
              <Group justify="space-between">
                <div>
                  <Text fw={500}>Color Scheme</Text>
                  <Text size="sm" c="dimmed">
                    Choose light or dark mode
                  </Text>
                </div>
                <SegmentedControl
                  value={colorScheme}
                  onChange={(value) => setColorScheme(value as 'light' | 'dark')}
                  data={[
                    {
                      value: 'light',
                      label: (
                        <Group gap={6} wrap="nowrap">
                          <IconSun size={14} />
                          <span>Light</span>
                        </Group>
                      ),
                    },
                    {
                      value: 'dark',
                      label: (
                        <Group gap={6} wrap="nowrap">
                          <IconMoon size={14} />
                          <span>Dark</span>
                        </Group>
                      ),
                    },
                  ]}
                />
              </Group>

              <Box>
                <Text fw={500} mb="xs">
                  Theme
                </Text>
                <Text size="sm" c="dimmed" mb="md">
                  Select a color theme for the application
                </Text>
                <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="sm">
                  {themeList.map((theme) => {
                    const isSelected = themeName === theme.name;
                    return (
                      <UnstyledButton key={theme.name} onClick={() => setThemeName(theme.name)}>
                        <Card
                          withBorder
                          padding="sm"
                          style={{
                            borderColor: isSelected ? 'var(--mantine-primary-color-filled)' : undefined,
                            borderWidth: isSelected ? 2 : 1,
                          }}
                        >
                          <Stack gap="xs" align="center">
                            <Group gap={4}>
                              {theme.previewColors.map((color, index) => (
                                <ColorSwatch key={index} color={color} size={20} />
                              ))}
                            </Group>
                            <Group gap={4} align="center">
                              <Text size="sm" fw={isSelected ? 600 : 400}>
                                {theme.label}
                              </Text>
                              {isSelected && <IconCheck size={14} color="var(--mantine-primary-color-filled)" />}
                            </Group>
                          </Stack>
                        </Card>
                      </UnstyledButton>
                    );
                  })}
                </SimpleGrid>
              </Box>
            </Stack>
          </Card>
        </Stack>
      </Stack>
    </Container>
  );
}
