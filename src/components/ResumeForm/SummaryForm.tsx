import { useState } from 'react';

import { ActionIcon, Box, Stack, Text, Textarea, Tooltip, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconBriefcase, IconSparkles } from '@tabler/icons-react';

import { FormHeader } from '@/components/ResumeForm/FormHeader';
import { ResumeAIModal } from '@/components/ResumeForm/ResumeAIModal';
import { useResumeStore } from '@/lib/store/useResumeStore';

export const SummaryForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { resume, changeSummary } = useResumeStore();
  const [aiModalOpen, setAIModalOpen] = useState(false);

  const { content = '' } = resume.summary ?? {};

  return (
    <Stack gap="lg">
      <FormHeader
        formType="summary"
        title="PROFESSIONAL SUMMARY"
        icon={<IconBriefcase size={24} color={theme.colors[theme.primaryColor][5]} />}
      >
        <Box>
          <Text size="sm" c="dimmed" mb="md">
            Write a brief professional summary about yourself, including your role, position, designation, key
            achievements, and career objectives.
          </Text>
          <Box style={{ position: 'relative' }}>
            <Textarea
              label="Summary"
              placeholder="e.g., Experienced Software Engineer with 5+ years in full-stack development. Specialized in React, Node.js, and cloud technologies. Proven track record of delivering high-impact projects..."
              minRows={6}
              value={content || ''}
              onChange={(e) => changeSummary(e.currentTarget.value)}
              styles={{
                input: {
                  minHeight: '150px',
                  paddingRight: '2.5rem',
                },
              }}
            />
            <Tooltip label="Generate with AI" position="left" withArrow>
              <ActionIcon
                variant="gradient"
                gradient={{ from: 'violet', to: 'blue', deg: 135 }}
                size="sm"
                style={{ position: 'absolute', top: '1.6rem', right: '0.5rem' }}
                onClick={() => setAIModalOpen(true)}
                aria-label="Generate summary with AI"
              >
                <IconSparkles size={14} />
              </ActionIcon>
            </Tooltip>
          </Box>
        </Box>

        <ResumeAIModal
          opened={aiModalOpen}
          onClose={() => setAIModalOpen(false)}
          fieldType="professionalSummary"
          context={{ existingContent: content }}
          onApply={(generated) => changeSummary(typeof generated === 'string' ? generated : generated.join('\n'))}
        />
      </FormHeader>
    </Stack>
  );
};
