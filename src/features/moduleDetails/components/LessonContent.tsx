import { Box, Code, Paper, Stack, Text, Title } from '@mantine/core';

import { Lesson } from '../types';

interface LessonContentProps {
  lesson: Lesson;
}

export const LessonContent: React.FC<LessonContentProps> = ({ lesson }) => {
  return (
    <Paper
      p="lg"
      style={{
        background: '#2a2a2a/70',
        border: '1px solid #3a3a3a',
        borderRadius: '16px',
      }}
    >
      <Stack gap="lg">
        <div>
          <Title order={2} c="white" mb="xs">
            {lesson.title}
          </Title>
          <Text c="dimmed">{lesson.content}</Text>
        </div>

        {lesson.videoUrl && (
          <Box
            style={{
              width: '100%',
              paddingTop: '56.25%',
              position: 'relative',
              background: '#1c1b1b',
              borderRadius: '8px',
              overflow: 'hidden',
            }}
          >
            <iframe
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
              src={lesson.videoUrl}
              title={lesson.title}
              allowFullScreen
            />
          </Box>
        )}

        {lesson.resources && lesson.resources.length > 0 && (
          <div>
            <Title order={3} c="white" mb="md">
              Resources
            </Title>
            <Stack gap="sm">
              {lesson.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: '#ff9d54',
                    textDecoration: 'none',
                    padding: '8px',
                    borderBottom: '1px solid #3a3a3a',
                  }}
                >
                  📄 {resource.title}
                </a>
              ))}
            </Stack>
          </div>
        )}
      </Stack>
    </Paper>
  );
};
