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
import { IconArrowDown, IconArrowUp, IconRobot, IconSparkles, IconTrash } from '@tabler/icons-react';

import { FormHeader } from '@/components/ResumeForm/FormHeader';
import { ResumeAIModal } from '@/components/ResumeForm/ResumeAIModal';
import { useResumeStore } from '@/lib/store/useResumeStore';

export const ProjectsForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { resume, changeProjects, deleteSectionInFormByIdx, moveSectionInForm, addSectionInForm } = useResumeStore();
  const projects = resume.projects ?? [];
  const [aiModalIdx, setAIModalIdx] = useState<number | null>(null);
  const showDelete = projects.length > 1;

  return (
    <Stack gap="lg">
      <FormHeader
        formType="projects"
        title="PROJECTS"
        icon={<IconRobot size={24} color={theme.colors[theme.primaryColor][5]} />}
      >
        <Stack gap="lg">
          {projects.map(({ project, date, descriptions }, idx) => {
            const showMoveUp = idx !== 0;
            const showMoveDown = idx !== projects.length - 1;

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
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Project Name"
                      placeholder="OpenResume"
                      value={project}
                      onChange={(e) => changeProjects(idx, 'project', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Date"
                      placeholder="Winter 2022"
                      value={date}
                      onChange={(e) => changeProjects(idx, 'date', e.currentTarget.value)}
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
                          changeProjects(idx, 'descriptions', lines);
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
                        onClick={() => moveSectionInForm('projects', idx, 'up')}
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
                        onClick={() => moveSectionInForm('projects', idx, 'down')}
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
                        onClick={() => deleteSectionInFormByIdx('projects', idx)}
                        aria-label="Delete project"
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
          <Button onClick={() => addSectionInForm('projects')} variant="outline" color={theme.primaryColor}>
            + Add Project
          </Button>
        </Group>
      </FormHeader>

      {/* AI Modal — per project item */}
      {aiModalIdx !== null && (
        <ResumeAIModal
          opened={aiModalIdx !== null}
          onClose={() => setAIModalIdx(null)}
          fieldType="project"
          context={{ projectName: projects[aiModalIdx]?.project }}
          onApply={(generated) => {
            if (aiModalIdx !== null) {
              const lines = Array.isArray(generated)
                ? generated
                : generated.split('\n').filter((l) => l.trim());
              changeProjects(aiModalIdx, 'descriptions', lines);
            }
          }}
        />
      )}
    </Stack>
  );
};
