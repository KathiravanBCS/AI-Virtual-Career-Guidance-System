import { useState } from 'react';

import {
  ActionIcon,
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Group,
  Rating,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconFlame, IconListDetails, IconSparkles } from '@tabler/icons-react';

import { FormHeader } from '@/components/ResumeForm/FormHeader';
import { ResumeAIModal } from '@/components/ResumeForm/ResumeAIModal';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

export const SkillsForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const form = 'skills';
  const { resume, changeSkills } = useResumeStore();
  const { showBulletPoints, themeColor, changeShowBulletPoints } = useSettingsStore();

  const { featuredSkills = [], descriptions = [] } = resume.skills ?? {};
  const showBulletPointsForForm = showBulletPoints[form];
  const [aiModalOpen, setAIModalOpen] = useState(false);

  return (
    <Stack gap="lg">
      <FormHeader
        formType="skills"
        title="SKILLS"
        icon={<IconFlame size={24} color={theme.colors[theme.primaryColor][5]} />}
      >
        <Stack gap="lg">
          <Box style={{ position: 'relative' }}>
            <Textarea
              label="Skills List"
              placeholder="Bullet points (one per line)"
              minRows={4}
              value={descriptions?.join('\n') || ''}
              onChange={(e) => {
                const lines = e.currentTarget.value.split('\n').filter((line) => line.trim());
                changeSkills('descriptions', undefined, undefined, undefined, lines);
              }}
              styles={{ input: { paddingRight: '5rem' } }}
            />
            <Box
              style={{
                position: 'absolute',
                right: '0.5rem',
                top: '1.8rem',
                display: 'flex',
                gap: '0.25rem',
              }}
            >
              <Tooltip label="Generate with AI" position="left" withArrow>
                <ActionIcon
                  variant="gradient"
                  gradient={{ from: 'violet', to: 'blue', deg: 135 }}
                  size="sm"
                  onClick={() => setAIModalOpen(true)}
                  aria-label="Generate skills with AI"
                >
                  <IconSparkles size={14} />
                </ActionIcon>
              </Tooltip>
              <Button
                variant={showBulletPointsForForm ? 'filled' : 'light'}
                color={theme.primaryColor}
                size="xs"
                leftSection={<IconListDetails size={16} />}
                onClick={() => changeShowBulletPoints(form, !showBulletPointsForForm)}
                aria-label="Toggle bullet points"
              />
            </Box>
          </Box>

          <Divider />

          <Box>
            <Text fw={500} mb="xs">
              Featured Skills (Optional)
            </Text>
            <Text size="sm" c="dimmed">
              Highlight top skills with proficiency rating (more circles = higher proficiency)
            </Text>
          </Box>

          <Grid gutter="lg">
            {featuredSkills.map(({ skill, rating }, idx) => (
              <Grid.Col key={idx} span={{ base: 12, sm: 6 }}>
                <Box
                  style={{
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    borderRadius: '6px',
                    padding: '1rem',
                    border: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 2]}`,
                  }}
                >
                  <TextInput
                    label={`Featured Skill ${idx + 1}`}
                    placeholder="e.g., React, TypeScript"
                    value={skill}
                    onChange={(e) => {
                      changeSkills('featuredSkills', idx, e.currentTarget.value, rating);
                    }}
                    mb="md"
                  />
                  <Group gap="xs">
                    <Text size="sm">Proficiency:</Text>
                    <Rating
                      value={rating}
                      onChange={(newRating) => {
                        changeSkills('featuredSkills', idx, skill, newRating);
                      }}
                      color={theme.primaryColor}
                    />
                  </Group>
                </Box>
              </Grid.Col>
            ))}
          </Grid>
        </Stack>
      </FormHeader>

      <ResumeAIModal
        opened={aiModalOpen}
        onClose={() => setAIModalOpen(false)}
        fieldType="skills"
        onApply={(generated) => {
          const lines = Array.isArray(generated)
            ? generated
            : generated.split('\n').filter((l) => l.trim());
          changeSkills('descriptions', undefined, undefined, undefined, lines);
        }}
      />
    </Stack>
  );
};
