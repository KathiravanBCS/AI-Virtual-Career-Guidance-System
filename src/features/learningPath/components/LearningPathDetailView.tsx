import React, { useState } from 'react';

import {
    Badge,
    Box,
    Button,
    Container,
    Grid,
    Group,
    Paper,
    RingProgress,
    ScrollArea,
    Stack,
    Text,
    ThemeIcon,
    Title,
    useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import {
    IconArrowLeft,
    IconCheck,
    IconClock,
    IconFiles,
    IconFileText,
    IconHelpCircle,
    IconLock,
    IconPlayerPlay,
    IconQuestionMark,
    IconSparkles,
    IconTrophy,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Cell, RadialBar, RadialBarChart, ResponsiveContainer, Tooltip } from 'recharts';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { useGetFlashcardsByModule } from '@/features/flashcards/api';
import { RecentlyCreatedList } from '@/features/flashcards/components';
import type { GuidanceWithLearningModules } from '@/features/guidance/types';
import { useGetLearningModules } from '@/features/learningModules/api/useGetLearningModules';
import { useUpdateLearningModule } from '@/features/learningModules/api/useUpdateLearningModule';
import { useGetQuizzesByModule } from '@/features/quiz/api';
import { RecentlyCreatedList as QuizRecentlyCreatedList } from '@/features/quiz/components';
import useActivityLogger from '@/hooks/useActivityLogger';
import { useNotification } from '@/features/gamification/context/NotificationContext';

interface LearningPathDetailViewProps {
    guidance: GuidanceWithLearningModules;
    onBack?: () => void;
}

export const LearningPathDetailView: React.FC<LearningPathDetailViewProps> = ({ guidance, onBack }) => {
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const navigate = useNavigate();
    const primaryColor = theme.colors[theme.primaryColor]?.[6] || theme.primaryColor;

    const [selectedModuleId, setSelectedModuleId] = useState<number>(guidance.learning_modules[0]?.id || 0);
    const [modules, setModules] = useState(guidance.learning_modules);

    const { refetch: refetchModules } = useGetLearningModules();
    const { mutate: updateModule, isPending } = useUpdateLearningModule();
    const { showNotification } = useNotification();
    const { logModuleComplete } = useActivityLogger({ showNotification });

    const { data: flashcardsResponse } = useGetFlashcardsByModule(selectedModuleId);
    const flashcardsList = Array.isArray(flashcardsResponse) ? flashcardsResponse : flashcardsResponse?.data || [];

    const { data: quizzesResponse } = useGetQuizzesByModule(selectedModuleId);
    const quizzesList = Array.isArray(quizzesResponse) ? quizzesResponse : quizzesResponse?.data || [];

    const selectedModule = modules.find((m) => m.id === selectedModuleId);

    const totalProgress =
        modules.length > 0
            ? Math.round(modules.reduce((sum, m) => sum + m.completion_percentage, 0) / modules.length)
            : 0;

    const completedCount = modules.filter((m) => m.completion_percentage === 100).length;

    // Recharts data for overall progress
    const progressData = [
        { name: 'Completed', value: totalProgress, fill: primaryColor },
        { name: 'Remaining', value: 100 - totalProgress, fill: isDark ? theme.colors.dark[5] : theme.colors.gray[1] },
    ];

    return (
        <Container size="fluid" py="sm">
            <ListPageLayout
                title={guidance.career_goal}
                titleProps={{ fw: 700, size: 'h2' }}
                description={`By ${guidance.name} • Age ${guidance.age}`}
                actions={
                    onBack && (
                        <Button variant="light" size="sm" leftSection={<IconArrowLeft size={16} />} onClick={onBack}>
                            Back
                        </Button>
                    )
                }
            >
                {/* Stats Row */}
                <Grid gutter="md" mb="lg">
                    <Grid.Col span={{ base: 12, sm: 4 }}>
                        <Paper
                            radius="xl"
                            p="lg"
                            style={{
                                background: isDark
                                    ? `linear-gradient(135deg, ${theme.colors[theme.primaryColor][9]}, ${theme.colors.dark[7]})`
                                    : `linear-gradient(135deg, ${primaryColor}, ${theme.colors[theme.primaryColor][4]})`,
                                border: 'none',
                                height: '100%',
                            }}
                        >
                            <Group gap="lg" align="center">
                                <ResponsiveContainer width={72} height={72}>
                                    <RadialBarChart cx="50%" cy="50%" innerRadius="55%" outerRadius="100%" data={progressData} startAngle={90} endAngle={-270}>
                                        <RadialBar dataKey="value" cornerRadius={4} background={{ fill: 'rgba(255,255,255,0.15)' }}>
                                            {progressData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)'} />
                                            ))}
                                        </RadialBar>
                                    </RadialBarChart>
                                </ResponsiveContainer>
                                <Box>
                                    <Text size="xs" style={{ color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                                        Overall Progress
                                    </Text>
                                    <Title order={2} style={{ color: 'white', lineHeight: 1.1 }}>{totalProgress}%</Title>
                                    <Text size="xs" style={{ color: 'rgba(255,255,255,0.6)' }}>{completedCount} of {modules.length} done</Text>
                                </Box>
                            </Group>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, sm: 4 }}>
                        <Paper radius="xl" p="lg" withBorder style={{ height: '100%' }}>
                            <Group gap="md" align="center">
                                <ThemeIcon size={48} radius="md" variant="light" color={theme.primaryColor}>
                                    <IconTrophy size={24} />
                                </ThemeIcon>
                                <Box>
                                    <Text size="xs" c="dimmed" fw={600} style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Completed</Text>
                                    <Title order={2}>{completedCount}</Title>
                                    <Text size="xs" c="dimmed">Modules done</Text>
                                </Box>
                            </Group>
                        </Paper>
                    </Grid.Col>

                    <Grid.Col span={{ base: 6, sm: 4 }}>
                        <Paper radius="xl" p="lg" withBorder style={{ height: '100%' }}>
                            <Group gap="md" align="center">
                                <ThemeIcon size={48} radius="md" variant="light" color="orange">
                                    <IconSparkles size={24} />
                                </ThemeIcon>
                                <Box>
                                    <Text size="xs" c="dimmed" fw={600} style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Remaining</Text>
                                    <Title order={2}>{modules.length - completedCount}</Title>
                                    <Text size="xs" c="dimmed">To complete</Text>
                                </Box>
                            </Group>
                        </Paper>
                    </Grid.Col>
                </Grid>

                <Grid gutter="lg">
                    {/* Left Sidebar - Module List */}
                    <Grid.Col span={{ base: 12, md: 4 }}>
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4 }}
                        >
                            <Paper radius="xl" p="lg" withBorder>
                                <Text fw={600} size="xs" c="dimmed" mb="md" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                    Career Modules
                                </Text>

                                <ScrollArea>
                                    <Stack gap="xs">
                                        {modules.map((module, index) => {
                                            const isSelected = selectedModuleId === module.id;
                                            const isDone = module.completion_percentage === 100;

                                            return (
                                                <motion.div key={module.id} whileHover={{ x: 3 }}>
                                                    <Paper
                                                        onClick={() => setSelectedModuleId(module.id)}
                                                        radius="lg"
                                                        p="sm"
                                                        style={{
                                                            background: isSelected
                                                                ? isDark
                                                                    ? `${theme.colors[theme.primaryColor][8]}50`
                                                                    : theme.colors[theme.primaryColor][0]
                                                                : 'transparent',
                                                            border: `1.5px solid ${isSelected ? primaryColor + '70' : isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                                                            cursor: 'pointer',
                                                            transition: 'all 0.18s ease',
                                                        }}
                                                    >
                                                        <Group gap="sm" wrap="nowrap">
                                                            <Box
                                                                style={{
                                                                    minWidth: 32,
                                                                    height: 32,
                                                                    borderRadius: '50%',
                                                                    background: isDone
                                                                        ? theme.colors.teal[6]
                                                                        : isSelected
                                                                        ? primaryColor
                                                                        : isDark
                                                                        ? theme.colors.dark[4]
                                                                        : theme.colors.gray[1],
                                                                    display: 'flex',
                                                                    alignItems: 'center',
                                                                    justifyContent: 'center',
                                                                    flexShrink: 0,
                                                                    transition: 'background 0.18s',
                                                                }}
                                                            >
                                                                {isDone ? (
                                                                    <IconCheck size={14} color="white" />
                                                                ) : (
                                                                    <Text fw={700} size="xs" style={{ color: isSelected ? 'white' : theme.colors.gray[6], lineHeight: 1 }}>
                                                                        {index + 1}
                                                                    </Text>
                                                                )}
                                                            </Box>

                                                            <Box style={{ flex: 1, minWidth: 0 }}>
                                                                <Text size="sm" fw={isSelected ? 600 : 400} lineClamp={2} c={isSelected ? undefined : 'dimmed'}>
                                                                    {module.title}
                                                                </Text>
                                                                {module.completion_percentage > 0 && module.completion_percentage < 100 && (
                                                                    <Text size="xs" style={{ color: primaryColor }}>{module.completion_percentage}%</Text>
                                                                )}
                                                            </Box>

                                                            {isDone && (
                                                                <Badge size="xs" color="teal" variant="light" style={{ flexShrink: 0 }}>Done</Badge>
                                                            )}
                                                        </Group>
                                                    </Paper>
                                                </motion.div>
                                            );
                                        })}
                                    </Stack>
                                </ScrollArea>
                            </Paper>
                        </motion.div>
                    </Grid.Col>

                    {/* Right Content */}
                    <Grid.Col span={{ base: 12, md: 8 }}>
                        {selectedModule && (
                            <Stack gap="md">
                                {/* Module Header */}
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                                    <Paper radius="xl" p="xl" withBorder>
                                        <Group justify="space-between" align="flex-start" wrap="nowrap">
                                            <Box style={{ flex: 1 }}>
                                                <Group gap="xs" mb="xs">
                                                    <Badge size="sm" variant="light" color={theme.primaryColor}>
                                                        Module {selectedModule.module_order + 1}
                                                    </Badge>
                                                    <Badge
                                                        size="sm"
                                                        variant="light"
                                                        color={selectedModule.completion_percentage === 100 ? 'teal' : 'gray'}
                                                    >
                                                        {selectedModule.status}
                                                    </Badge>
                                                </Group>
                                                <Title order={3} mb="xs">{selectedModule.title}</Title>
                                                <Group gap="sm">
                                                    <Group gap={4} c="dimmed">
                                                        <IconClock size={14} />
                                                        <Text size="sm">{selectedModule.estimated_time}</Text>
                                                    </Group>
                                                    {selectedModule.completion_percentage > 0 && (
                                                        <Badge variant="dot" size="sm" color={theme.primaryColor}>
                                                            {selectedModule.completion_percentage}% Complete
                                                        </Badge>
                                                    )}
                                                </Group>
                                            </Box>

                                            <Group gap="sm" wrap="nowrap">
                                                <Button
                                                    variant="light"
                                                    size="sm"
                                                    radius="md"
                                                    leftSection={<IconPlayerPlay size={14} />}
                                                    onClick={() => {
                                                        const moduleIndex = guidance.learning_modules.findIndex((m) => m.id === selectedModuleId);
                                                        navigate(`/learning-path/${guidance.id}/module/${moduleIndex}`);
                                                    }}
                                                >
                                                    View Content
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    radius="md"
                                                    leftSection={selectedModule.completion_percentage === 100 ? <IconCheck size={14} /> : undefined}
                                                    onClick={async () => {
                                                        if (selectedModule) {
                                                            updateModule(
                                                                {
                                                                    moduleId: selectedModule.id,
                                                                    data: { completion_percentage: 100, status: 'completed' },
                                                                },
                                                                {
                                                                    onSuccess: async () => {
                                                                        setModules(modules.map((m) =>
                                                                            m.id === selectedModule.id
                                                                                ? { ...m, completion_percentage: 100, status: 'completed' }
                                                                                : m
                                                                        ));
                                                                        await refetchModules();
                                                                        await logModuleComplete(selectedModule.id);
                                                                    },
                                                                }
                                                            );
                                                        }
                                                    }}
                                                    disabled={selectedModule.completion_percentage === 100}
                                                    loading={isPending}
                                                    style={{ background: selectedModule.completion_percentage === 100 ? theme.colors.teal[6] : primaryColor }}
                                                    color={selectedModule.completion_percentage === 100 ? 'teal' : theme.primaryColor}
                                                >
                                                    {selectedModule.completion_percentage === 100 ? 'Completed' : 'Mark Complete'}
                                                </Button>
                                            </Group>
                                        </Group>
                                    </Paper>
                                </motion.div>

                                {/* Module Meta Grid */}
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}>
                                    <Grid gutter="md">
                                        {[
                                            { label: 'Module Code', value: selectedModule.learning_module_code },
                                            { label: 'Order', value: `#${selectedModule.module_order + 1}` },
                                            { label: 'Progress', value: `${selectedModule.completion_percentage}%` },
                                            { label: 'Status', value: selectedModule.status },
                                        ].map((item) => (
                                            <Grid.Col key={item.label} span={{ base: 6, sm: 3 }}>
                                                <Paper radius="lg" p="md" style={{ background: isDark ? theme.colors.dark[6] : theme.colors.gray[0], border: 'none' }}>
                                                    <Text size="xs" c="dimmed" fw={500} mb={4} style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                                                        {item.label}
                                                    </Text>
                                                    <Text fw={700} size="sm" style={{ color: primaryColor }}>{item.value}</Text>
                                                </Paper>
                                            </Grid.Col>
                                        ))}
                                    </Grid>
                                </motion.div>

                                {/* Description */}
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                                    <Paper radius="xl" p="xl" withBorder>
                                        <Group gap="sm" mb="md">
                                            <ThemeIcon size="md" radius="md" variant="light" color={theme.primaryColor}>
                                                <IconFileText size={16} />
                                            </ThemeIcon>
                                            <Text fw={600}>Description</Text>
                                        </Group>
                                        <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-wrap', lineHeight: 1.7 }}>
                                            {selectedModule.description}
                                        </Text>
                                        {Boolean(selectedModule.content?.content) && (
                                            <Box mt="md" p="md" style={{
                                                background: isDark ? theme.colors.dark[5] : theme.colors.gray[0],
                                                borderRadius: 10,
                                                borderLeft: `3px solid ${primaryColor}`,
                                            }}>
                                                <Text size="sm" c="dimmed" style={{ whiteSpace: 'pre-wrap' }}>
                                                    {(() => {
                                                        const c = selectedModule.content?.content as any;
                                                        return typeof c === 'string' ? c : JSON.stringify(c);
                                                    })()}
                                                </Text>
                                            </Box>
                                        )}
                                    </Paper>
                                </motion.div>

                                {/* Knowledge Check */}
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
                                    <Paper radius="xl" p="xl" withBorder>
                                        <Group gap="sm" mb="xs">
                                            <ThemeIcon size="md" radius="md" variant="light" color={theme.primaryColor}>
                                                <IconQuestionMark size={16} />
                                            </ThemeIcon>
                                            <Text fw={600}>Knowledge Check</Text>
                                        </Group>
                                        <Text size="sm" c="dimmed" mb="lg">
                                            Test your knowledge of this module with a quick quiz or generate flashcards.
                                        </Text>
                                        <Group gap="md">
                                            <Button
                                                radius="md"
                                                leftSection={<IconHelpCircle size={16} />}
                                                style={{ background: primaryColor }}
                                                onClick={() => {
                                                    const moduleIndex = guidance.learning_modules.findIndex((m) => m.id === selectedModuleId);
                                                    navigate(`/quiz`, { state: { selectedPathId: guidance.id, selectedModuleIndex: moduleIndex, from: { pathname: window.location.pathname, hash: window.location.hash } } });
                                                }}
                                            >
                                                Take Quiz
                                            </Button>
                                            <Button
                                                radius="md"
                                                variant="light"
                                                color={theme.primaryColor}
                                                leftSection={<IconFiles size={16} />}
                                                onClick={() => {
                                                    const moduleIndex = guidance.learning_modules.findIndex((m) => m.id === selectedModuleId);
                                                    navigate(`/flashcards/generate`, { state: { selectedPathId: guidance.id, selectedModuleIndex: moduleIndex, from: { pathname: window.location.pathname, hash: window.location.hash } } });
                                                }}
                                            >
                                                Generate Flashcards
                                            </Button>
                                        </Group>
                                    </Paper>
                                </motion.div>

                                {/* Flashcards */}
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
                                    <RecentlyCreatedList
                                        title="Flashcards"
                                        items={flashcardsList.map((fc) => ({
                                            id: fc.id,
                                            title: fc.title,
                                            code: fc.flashcard_code,
                                            status: fc.status,
                                            count: fc.items_count,
                                            createdAt: fc.created_at,
                                        }))}
                                        onItemClick={(item) => navigate(`/flashcards/view/${item.id}`, { state: { from: { pathname: window.location.pathname, hash: window.location.hash } } })}
                                        icon={IconFiles}
                                        countLabel="Items"
                                        emptyMessage="No flashcards yet. Click 'Generate Flashcards' to create some."
                                    />
                                </motion.div>

                                {/* Quizzes */}
                                <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.25 }}>
                                    <QuizRecentlyCreatedList
                                        title="Quizzes"
                                        items={quizzesList.map((quiz) => ({
                                            id: quiz.id,
                                            title: quiz.title,
                                            code: quiz.quiz_code,
                                            status: quiz.status,
                                            count: quiz.questions_count,
                                            createdAt: quiz.created_at,
                                        }))}
                                        onItemClick={(item) => navigate(`/quiz/view/${item.id}`, { state: { from: { pathname: window.location.pathname, hash: window.location.hash } } })}
                                        icon={IconHelpCircle}
                                        countLabel="Questions"
                                        emptyMessage="No quizzes yet. Click 'Take Quiz' to create one."
                                    />
                                </motion.div>
                            </Stack>
                        )}
                    </Grid.Col>
                </Grid>
            </ListPageLayout>
        </Container>
    );
};

export default LearningPathDetailView;