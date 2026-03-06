import { Badge, Button, Group, Paper, Stack, Text } from '@mantine/core';

import { Lesson } from '../types';

interface LessonsListProps {
  lessons: Lesson[];
  currentLessonId: string;
  onLessonSelect: (lessonId: string) => void;
}

export const LessonsList: React.FC<LessonsListProps> = ({ lessons, currentLessonId, onLessonSelect }) => {
  return (
    <Stack gap="sm">
      {lessons.map((lesson) => (
        <Paper
          key={lesson.id}
          p="md"
          style={{
            background: currentLessonId === lesson.id ? '#ff9d54/10' : '#2a2a2a/70',
            border: currentLessonId === lesson.id ? '2px solid #ff9d54' : '1px solid #3a3a3a',
            borderRadius: '12px',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
          onClick={() => onLessonSelect(lesson.id)}
        >
          <Group justify="space-between">
            <div>
              <Text fw={500} c="white">
                {lesson.order}. {lesson.title}
              </Text>
            </div>
            <Badge
              size="sm"
              style={{
                background: lesson.completed ? '#10b981' : '#3a3a3a',
                color: lesson.completed ? 'white' : '#ff9d54',
              }}
            >
              {lesson.completed ? '✓' : 'In Progress'}
            </Badge>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
};
