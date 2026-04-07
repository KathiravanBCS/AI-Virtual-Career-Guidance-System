import { useState } from 'react';

import {
  ActionIcon,
  Box,
  Button,
  Flex,
  Group,
  Stack,
  Text,
  Textarea,
  TextInput,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconFileText, IconListDetails, IconSparkles, IconTrash } from '@tabler/icons-react';

import { FormHeader } from '@/components/ResumeForm/FormHeader';
import { ResumeAIModal } from '@/components/ResumeForm/ResumeAIModal';
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
  const [aiModalIdx, setAIModalIdx] = useState<number | null>(null);

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
                        onClick={() => setAIModalIdx(idx)}
                        aria-label="Generate content with AI"
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

      {/* AI Modal — per custom section */}
      {aiModalIdx !== null && (
        <ResumeAIModal
          opened={aiModalIdx !== null}
          onClose={() => setAIModalIdx(null)}
          fieldType="custom"
          context={{ sectionTitle: sections[aiModalIdx]?.title }}
          onApply={(generated) => {
            if (aiModalIdx !== null) {
              const lines = Array.isArray(generated)
                ? generated
                : generated.split('\n').filter((l) => l.trim());
              changeCustom(aiModalIdx, 'descriptions', lines);
            }
          }}
        />
      )}
    </Stack>
  );
};
