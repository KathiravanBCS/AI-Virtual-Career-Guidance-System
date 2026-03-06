import {
  Box,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconFileText, IconListDetails, IconTrash } from '@tabler/icons-react';

import { FormHeader } from '@/components/ResumeForm/FormHeader';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';

export const CustomForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const form = 'custom';
  const { resume, changeCustom, addCustomSection, deleteCustomSection, moveCustomSection } = useResumeStore();
  const { showBulletPoints, changeShowBulletPoints } = useSettingsStore();

  const sections = resume.custom?.sections || [];
  const showBulletPointsForForm = showBulletPoints[form];

  return (
    <Stack gap="lg">
      <FormHeader
        formType="custom"
        title="CUSTOM SECTIONS"
        icon={<IconFileText size={24} color={theme.colors[theme.primaryColor][5]} />}
      >
        <Stack gap="lg">
          {sections.map(({ title, descriptions }, idx) => {
            const showMoveUp = idx !== 0;
            const showMoveDown = idx !== sections.length - 1;
            const showDelete = sections.length > 1;

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
                {/* Editable Title */}
                <TextInput
                  label="Section Title"
                  placeholder="e.g., Certifications, Languages, Interests"
                  value={title || ''}
                  onChange={(e) => changeCustom(idx, 'title', e.currentTarget.value)}
                  mb="md"
                />

                {/* Content */}
                <Box style={{ position: 'relative' }}>
                  <Textarea
                    label="Content"
                    placeholder="Bullet points (one per line)"
                    minRows={4}
                    value={descriptions?.join('\n') || ''}
                    onChange={(e) => {
                      const lines = e.currentTarget.value.split('\n').filter((line) => line.trim());
                      changeCustom(idx, 'descriptions', lines);
                    }}
                  />
                  <Box
                    style={{
                      position: 'absolute',
                      right: '0.5rem',
                      top: '1.8rem',
                    }}
                  >
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

                {/* Actions */}
                {(showMoveUp || showMoveDown || showDelete) && (
                  <Group justify="flex-end" gap="xs" mt="md">
                    {showMoveUp && (
                      <Button
                        variant="light"
                        color={theme.primaryColor}
                        size="sm"
                        leftSection={<IconArrowUp size={16} />}
                        onClick={() => moveCustomSection(idx, 'up')}
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
                        onClick={() => moveCustomSection(idx, 'down')}
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
                        onClick={() => deleteCustomSection(idx)}
                        aria-label="Delete section"
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
          <Button onClick={() => addCustomSection()} variant="outline" color={theme.primaryColor}>
            + Add Custom Section
          </Button>
        </Group>
      </FormHeader>
    </Stack>
  );
};
