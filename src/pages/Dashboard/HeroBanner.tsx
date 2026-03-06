import { Box, Button, Card, Group, Image, Text } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import dayjs from 'dayjs';
import { useNavigate } from 'react-router-dom';

import logoImage from '@/assets/dashboard/gmAicgLogowitname.png';
import InfoImage from '@/assets/dashboard/InfoImage.png';
import { useAuth } from '@/lib/auth/useAuth';

export function HeroBanner() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getUserNameWithGreeting = () => {
    if (!user) return 'User';
    const hour = dayjs().hour();
    const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
    return `${greeting} ${user.displayName || user.email},`;
  };

  return (
    <Card
      data-component="hero-banner"
      withBorder
      shadow="0"
      radius="md"
      p={0}
      bg="var(--mantine-color-body)"
      mb="lg"
      bd="none"
    >
      <Group wrap="nowrap" gap={0}>
        <Box p="xl" style={{ flex: 1 }}>
          <Image src={logoImage} alt="GMIACG Logo" w={350} h={120} mb="md" />
          <Text size="lg" fw={500}>
            {getUserNameWithGreeting()}
          </Text>
          <Text size="lg" fw={300} mt="xs" c="dimmed">
            Start your AI-powered career guidance session!
          </Text>
          <Text size="sm" c="dimmed" mt="sm">
            Discover personalized career paths with AI. Create tailored guidance sessions and track your progress.
          </Text>
          <Group mt="lg">
            <Button size="sm" leftSection={<IconPlus size={16} />} onClick={() => navigate('/guidance')}>
              Create Session
            </Button>
            <Button size="sm" variant="default" onClick={() => navigate('/learning-path')}>
              View All
            </Button>
          </Group>
        </Box>
        <Image src={InfoImage} alt="Info-Image" w={600} h="auto" visibleFrom="sm" />
      </Group>
    </Card>
  );
}
