import {
  Box,
  Button,
  Flex,
  Grid,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconListDetails, IconSchool, IconTrash } from '@tabler/icons-react';

import { FormHeader } from '@/components/ResumeForm/FormHeader';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

export const EducationsForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const form = 'educations';
  const { resume, changeEducations, deleteSectionInFormByIdx, moveSectionInForm, addSectionInForm } = useResumeStore();
  const { showBulletPoints, changeShowBulletPoints } = useSettingsStore();

  const educations = resume.educations;
  const showDelete = educations.length > 1;
  const showBulletPointsForForm = showBulletPoints[form];

  return (
    <Stack gap="lg">
      <FormHeader
        formType="educations"
        title="EDUCATION"
        icon={<IconSchool size={24} color={theme.colors[theme.primaryColor][5]} />}
      >
        <Stack gap="lg">
          {educations.map(({ school, degree, gpa, date, descriptions }, idx) => {
            const showMoveUp = idx !== 0;
            const showMoveDown = idx !== educations.length - 1;

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
                      label="School"
                      placeholder="Cornell University"
                      value={school}
                      onChange={(e) => changeEducations(idx, 'school', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Date"
                      placeholder="May 2018"
                      value={date}
                      onChange={(e) => changeEducations(idx, 'date', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="Degree & Major"
                      placeholder="Bachelor of Science in Computer Engineering"
                      value={degree}
                      onChange={(e) => changeEducations(idx, 'degree', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, sm: 6 }}>
                    <TextInput
                      label="GPA"
                      placeholder="3.81"
                      value={gpa}
                      onChange={(e) => changeEducations(idx, 'gpa', e.currentTarget.value)}
                    />
                  </Grid.Col>
                  <Grid.Col span={12}>
                    <Box style={{ position: 'relative' }}>
                      <Textarea
                        label="Additional Information (Optional)"
                        placeholder="Free paragraph space to list out additional activities, courses, awards etc"
                        minRows={3}
                        value={descriptions?.join('\n') || ''}
                        onChange={(e) => {
                          const lines = e.currentTarget.value.split('\n').filter((line) => line.trim());
                          changeEducations(idx, 'descriptions', lines);
                        }}
                      />
                      {showBulletPointsForForm && (
                        <Box
                          style={{
                            position: 'absolute',
                            right: '0.5rem',
                            top: '1.8rem',
                          }}
                        >
                          <Button
                            variant="light"
                            color={theme.primaryColor}
                            size="xs"
                            leftSection={<IconListDetails size={16} />}
                            onClick={() => changeShowBulletPoints(form, !showBulletPointsForForm)}
                            aria-label="Toggle bullet points"
                          />
                        </Box>
                      )}
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
                        onClick={() => moveSectionInForm(form, idx, 'up')}
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
                        onClick={() => moveSectionInForm(form, idx, 'down')}
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
                        onClick={() => deleteSectionInFormByIdx(form, idx)}
                        aria-label="Delete school"
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
          <Button onClick={() => addSectionInForm(form)} variant="outline" color={theme.primaryColor}>
            + Add School
          </Button>
        </Group>
      </FormHeader>
    </Stack>
  );
};
