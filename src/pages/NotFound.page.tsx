import { Box, Button, Center, Group, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <Center style={{ height: '100%', minHeight: 'calc(100vh - 90px)' }}>
      <Stack align="center" gap="xl" style={{ width: '100%', maxWidth: 600 }}>
        <Title order={2} size="8rem" fw={700} c="gray.3" style={{ fontFamily: 'monospace', lineHeight: 1 }}>
          404
        </Title>

        <Title order={3} mb="md" fw={400} size="2rem">
          Page not found
        </Title>

        <Text c="dimmed" size="lg" ta="center" maw={500}>
          The page you are looking for does not exist. It might have been moved or deleted.
        </Text>

        <Group justify="center">
          <Button variant="default" size="md" onClick={() => navigate(-1)}>
            Go back
          </Button>
          <Button size="md" onClick={() => navigate('/')}>
            Take me home
          </Button>
        </Group>
      </Stack>
    </Center>
  );
}
