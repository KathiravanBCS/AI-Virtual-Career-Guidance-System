import { useState } from 'react';

import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconBriefcase, IconSparkles, IconTrash } from '@tabler/icons-react';

import { FormHeader } from '@/components/ResumeForm/FormHeader';
import { ResumeAIModal } from '@/components/ResumeForm/ResumeAIModal';
import { useResumeStore } from '@/lib/store/useResumeStore';

export const WorkExperiencesForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { resume, changeWorkExperiences, deleteSectionInFormByIdx, moveSectionInForm, addSectionInForm } =
    useResumeStore();
  const workExperiences = resume.workExperiences ?? [];
  const [aiModalIdx, setAIModalIdx] = useState<number | null>(null);

  const showDelete = workExperiences.length > 1;

  return (
    <Stack gap="lg">
      <FormHeader
        formType="workExperiences"
        title="WORK EXPERIENCE"
        icon={<IconBriefcase size={24} color={theme.colors[theme.primaryColor][5]} />}
      >
        <Stack gap="lg">
          {workExperiences.map(({ company, jobTitle, date, descriptions }, idx) => {
            const showMoveUp = idx !== 0;
            const showMoveDown = idx !== workExperiences.length - 1;

            return (
              <Box
                key={idx}
                style={{
                  backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                  borderRadius: '6px',
                  padding: '1rem',
                  border: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 2]}`,
                }}
              >
                <Grid gutter="lg" mb="lg">
                  <Grid.Col span={12}>
                    <TextInput
                      label="Company"
                      placeholder="Khan Academy"
                      value={company}
                      onChange={(e) => changeWorkExperiences(idx, 'company', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Job Title"
                      placeholder="Software Engineer"
                      value={jobTitle}
                      onChange={(e) => changeWorkExperiences(idx, 'jobTitle', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Date"
                      placeholder="Jun 2022 - Present"
                      value={date}
                      onChange={(e) => changeWorkExperiences(idx, 'date', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Box style={{ position: 'relative' }}>
                      <Textarea
                        label="Description"
                        placeholder="Bullet points (one per line)"
                        minRows={3}
                        value={descriptions?.join('\n') || ''}
                        onChange={(e) => {
                          const lines = e.currentTarget.value.split('\n').filter((line) => line.trim());
                          changeWorkExperiences(idx, 'descriptions', lines);
                        }}
                        styles={{ input: { paddingRight: '2.5rem' } }}
                      />
                      <Tooltip label="Generate with AI" position="left" withArrow>
                        <ActionIcon
                          variant="gradient"
                          gradient={{ from: 'violet', to: 'blue', deg: 135 }}
                          size="sm"
                          style={{ position: 'absolute', top: '1.6rem', right: '0.5rem' }}
                          onClick={() => setAIModalIdx(idx)}
                          aria-label="Generate description with AI"
                        >
                          <IconSparkles size={14} />
                        </ActionIcon>
                      </Tooltip>
                    </Box>
                  </Grid.Col>
                </Grid>

                {(showMoveUp || showMoveDown || showDelete) && (
                  <Group justify="flex-end" gap="xs">
                    {showMoveUp && (
                      <Button
                        variant="light"
                        color={theme.primaryColor}
                        size="sm"
                        leftSection={<IconArrowUp size={16} />}
                        onClick={() => moveSectionInForm('workExperiences', idx, 'up')}
                        aria-label="Move up"
                      >
                        Move Up
                      </Button>
                    )}
                    {showMoveDown && (
                      <Button
                        variant="light"
                        color={theme.primaryColor}
                        size="sm"
                        leftSection={<IconArrowDown size={16} />}
                        onClick={() => moveSectionInForm('workExperiences', idx, 'down')}
                        aria-label="Move down"
                      >
                        Move Down
                      </Button>
                    )}
                    {showDelete && (
                      <Button
                        variant="light"
                        color="red"
                        size="sm"
                        leftSection={<IconTrash size={16} />}
                        onClick={() => deleteSectionInFormByIdx('workExperiences', idx)}
                        aria-label="Delete job"
                      >
                        Delete
                      </Button>
                    )}
                  </Group>
                )}
              </Box>
            );
          })}
        </Stack>

        <Group justify="flex-end" mt="lg">
          <Button onClick={() => addSectionInForm('workExperiences')} variant="outline" color={theme.primaryColor}>
            + Add Job
          </Button>
        </Group>
      </FormHeader>

      {/* AI Modal — one instance, controlled by index */}
      {aiModalIdx !== null && (
        <ResumeAIModal
          opened={aiModalIdx !== null}
          onClose={() => setAIModalIdx(null)}
          fieldType="workExperience"
          context={{
            jobTitle: workExperiences[aiModalIdx]?.jobTitle,
            company: workExperiences[aiModalIdx]?.company,
          }}
          onApply={(generated) => {
            if (aiModalIdx !== null) {
              const lines = Array.isArray(generated)
                ? generated
                : generated.split('\n').filter((l) => l.trim());
              changeWorkExperiences(aiModalIdx, 'descriptions', lines);
            }
          }}
        />
      )}
    </Stack>
  );
};
