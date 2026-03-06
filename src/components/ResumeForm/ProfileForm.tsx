import { Box, Grid, Stack, Textarea, TextInput, useMantineColorScheme, useMantineTheme } from '@mantine/core';

import { useResumeStore } from '@/lib/store/useResumeStore';
import type { ResumeProfile } from '@/lib/types';

export const ProfileForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { resume, changeProfile } = useResumeStore();
  const { name, email, phone, url, summary, location } = resume.profile;

  const handleProfileChange = (field: keyof ResumeProfile, value: string) => {
    changeProfile(field, value);
  };

  return (
    <Stack gap="lg">
      <Box
        style={{
          border: `1px solid ${theme.colors.gray[3]}`,
          borderRadius: '8px',
          padding: '1.5rem',
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        }}
      >
        <Grid gutter="lg">
          <Grid.Col span={{ base: 12, sm: 12 }}>
            <TextInput
              label="Name"
              placeholder="Sal Khan"
              value={name}
              onChange={(e) => handleProfileChange('name', e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 12 }}>
            <Textarea
              label="Objective"
              placeholder="Entrepreneur and educator obsessed with making education free for anyone"
              minRows={3}
              value={summary}
              onChange={(e) => handleProfileChange('summary', e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Email"
              placeholder="hello@khanacademy.org"
              value={email}
              onChange={(e) => handleProfileChange('email', e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Phone"
              placeholder="(123)456-7890"
              value={phone}
              onChange={(e) => handleProfileChange('phone', e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Website"
              placeholder="linkedin.com/in/khanacademy"
              value={url}
              onChange={(e) => handleProfileChange('url', e.currentTarget.value)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, sm: 6 }}>
            <TextInput
              label="Location"
              placeholder="NYC, NY"
              value={location}
              onChange={(e) => handleProfileChange('location', e.currentTarget.value)}
            />
          </Grid.Col>
        </Grid>
      </Box>
    </Stack>
  );
};
