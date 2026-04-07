import { useState } from 'react';

import { ActionIcon, Box, Grid, Stack, Textarea, TextInput, Tooltip, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconSparkles } from '@tabler/icons-react';

import { ResumeAIModal } from '@/components/ResumeForm/ResumeAIModal';
import { useResumeStore } from '@/lib/store/useResumeStore';
import type { ResumeProfile } from '@/lib/types';

export const ProfileForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { resume, changeProfile } = useResumeStore();
  const [aiModalOpen, setAIModalOpen] = useState(false);
  const { name = '', email = '', phone = '', url = '', summary = '', location = '' } = resume.profile ?? {};

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
            <Box style={{ position: 'relative' }}>
              <Textarea
                label="Objective"
                placeholder="Entrepreneur and educator obsessed with making education free for anyone"
                minRows={3}
                value={summary}
                onChange={(e) => handleProfileChange('summary', e.currentTarget.value)}
                styles={{ input: { paddingRight: '2.5rem' } }}
              />
              <Tooltip label="Generate with AI" position="left" withArrow>
                <ActionIcon
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'blue', deg: 135 }}
                  size="sm"
                  style={{ position: 'absolute', top: '1.6rem', right: '0.5rem' }}
                  onClick={() => setAIModalOpen(true)}
                  aria-label="Generate objective with AI"
                >
                  <IconSparkles size={14} />
                </ActionIcon>
              </Tooltip>
            </Box>
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

      <ResumeAIModal
        opened={aiModalOpen}
        onClose={() => setAIModalOpen(false)}
        fieldType="profileObjective"
        onApply={(generated) => handleProfileChange('summary', typeof generated === 'string' ? generated : generated.join(' '))}
      />
    </Stack>
  );
};
