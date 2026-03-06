import { Box, Stack, Text, Textarea, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconBriefcase } from '@tabler/icons-react';

import { FormHeader } from '@/components/ResumeForm/FormHeader';
import { useResumeStore } from '@/lib/store/useResumeStore';

export const SummaryForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { resume, changeSummary } = useResumeStore();

  const { content } = resume.summary;

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
          <Textarea
            label="Summary"
            placeholder="e.g., Experienced Software Engineer with 5+ years in full-stack development. Specialized in React, Node.js, and cloud technologies. Proven track record of delivering high-impact projects..."
            minRows={6}
            value={content || ''}
            onChange={(e) => changeSummary(e.currentTarget.value)}
            styles={{
              input: {
                minHeight: '150px',
              },
            }}
          />
        </Box>
      </FormHeader>
    </Stack>
  );
};
