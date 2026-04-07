import React, { useState } from 'react';

import {
    Badge,
    Box,
    Button,
    Code,
    Container,
    Divider,
    Grid,
    Group,
    List,
    Loader,
    Modal,
    Paper,
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
    IconArrowRight,
    IconBook2,
    IconBulb,
    IconCheck,
    IconChevronRight,
    IconClock,
    IconCode,
    IconExternalLink,
    IconPlayerPlay,
    IconSparkles,
    IconVideo,
    IconX,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import {
    generateModuleContent,
    generateTopicElaboration,
    generateVideoRecommendations,
} from '../../../config/groq.config';
import { useGetLearningModules } from '../../learningModules/api/useGetLearningModules';
import { useUpdateLearningModule } from '../../learningModules/api/useUpdateLearningModule';
import { useGetGuidanceWithModulesById } from '../api';
import useActivityLogger from '@/hooks/useActivityLogger';
import { useNotification } from '@/features/gamification/context/NotificationContext';
import { useLoggedInUser } from '@/lib/auth/useLoggedInUser';

interface CodeExample {
    language: string;
    code: string;
    explanation: string;
}

interface ModuleSection {
    title: string;
    content: string;
    keyPoints?: string[];
    codeExample?: CodeExample | null;
    isAdvanced?: boolean;
    isNew?: boolean;
}

interface ModuleContentResponse {
    title: string;
    type: 'technical' | 'general';
    sections: ModuleSection[];
}

const ModuleContentPage: React.FC = () => {
    const navigate = useNavigate();
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const { id, moduleIndex } = useParams<{ id: string; moduleIndex: string }>();
    const guidanceId = id ? parseInt(id, 10) : 0;
    const moduleIdx = moduleIndex ? parseInt(moduleIndex, 10) : 0;

    const [loading, setLoading] = useState(false);
    const [sections, setSections] = useState<ModuleSection[]>([]);
    const [error, setError] = useState('');
    const [expanded, setExpanded] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [elaborationTopic, setElaborationTopic] = useState('');
    const [elaborationContent, setElaborationContent] = useState<any>(null);
    const [elaborationLoading, setElaborationLoading] = useState(false);
    const [videoRecommendations, setVideoRecommendations] = useState<any>(null);
    const [videosLoading, setVideosLoading] = useState(false);

    const { data: guidance } = useGetGuidanceWithModulesById(guidanceId);
    const { refetch: refetchModules } = useGetLearningModules();
    const { mutate: updateModule, isPending } = useUpdateLearningModule();
    const { showNotification } = useNotification();
    const { logModuleComplete } = useActivityLogger({ showNotification });
    const { user: loggedInUser } = useLoggedInUser();

    const module = guidance?.learning_modules?.[moduleIdx];
    const moduleTitle = module?.title || 'Module';
    const moduleId = module?.id || 0;
    const primaryColor = theme.colors[theme.primaryColor]?.[6] || theme.primaryColor;

    // Recharts data for section progress visualization
    const sectionChartData = sections.map((s, i) => ({
        name: `S${i + 1}`,
        label: s.title.length > 20 ? s.title.slice(0, 20) + '…' : s.title,
        points: s.keyPoints?.length || 0,
    }));

    const handleLoadContent = async () => {
        setLoading(true);
        setError('');
        try {
            const response = (await generateModuleContent(moduleTitle, { detailed: expanded })) as ModuleContentResponse;
            if (response?.sections?.length > 0) {
                setSections(response.sections);
            } else {
                setError('Failed to load content. Please try again.');
            }
        } catch (err) {
            console.error('Content generation error:', err);
            setError('Unable to generate content. Please check your connection and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleElaborate = async (topic: string) => {
        setElaborationTopic(topic);
        setIsPopupOpen(true);
        setElaborationLoading(true);
        setElaborationContent(null);
        try {
            const elaboration = await generateTopicElaboration(topic, moduleTitle, { detailed: true, includeExamples: true });
            setElaborationContent(elaboration);
        } catch (err) {
            setElaborationContent({ title: topic, error: 'Failed to generate elaboration. Please try again.', sections: [] });
        } finally {
            setElaborationLoading(false);
        }
    };

    const closeElaborationPopup = () => {
        setIsPopupOpen(false);
        setTimeout(() => { setElaborationContent(null); setElaborationTopic(''); }, 300);
    };

    const handleLoadVideos = async () => {
        setVideosLoading(true);
        try {
            const contentText = sections.map((s) => `${s.title}: ${s.content}`).join('\n') || moduleTitle;
            const videos = await generateVideoRecommendations(moduleTitle, contentText, { limit: 6 });
            setVideoRecommendations(videos);
        } catch (err) {
            setVideoRecommendations({ moduleName: moduleTitle, topicSummary: `Learn ${moduleTitle} through video tutorials`, videos: [], searchSuggestions: [] });
        } finally {
            setVideosLoading(false);
        }
    };

    const markdownRenderers = {
        code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
                <div style={{ margin: '1rem 0', borderRadius: 10, overflow: 'hidden' }}>
                    <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            ) : (
                <Code {...props}>{children}</Code>
            );
        },
    };

    const handleBack = () => navigate(`/learning-path/${id}`);

    return (
        <Box style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
            {/* Header */}
            <Box
                style={{
                    borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                    padding: '14px 24px',
                    background: isDark ? theme.colors.dark[7] : 'white',
                }}
            >
                <Group justify="space-between" align="center">
                    <Group gap="md">
                        <ThemeIcon size={40} radius="md" variant="light" color={theme.primaryColor}>
                            <IconBook2 size={20} />
                        </ThemeIcon>
                        <Box>
                            <Text size="xs" c="dimmed">Module {moduleIdx + 1}</Text>
                            <Text fw={600} size="sm" lineClamp={1} style={{ maxWidth: 320 }}>{moduleTitle}</Text>
                        </Box>
                        {module?.completion_percentage === 100 && (
                            <Badge color="teal" variant="light" leftSection={<IconCheck size={12} />}>Completed</Badge>
                        )}
                    </Group>
                    <Button variant="subtle" color="gray" leftSection={<IconArrowLeft size={16} />} onClick={handleBack} radius="md">
                        Back
                    </Button>
                </Group>
            </Box>

            {/* Main content */}
            <ScrollArea style={{ flex: 1 }}>
                <Container size="lg" py="xl">
                    <Stack gap="lg">
                        {/* Empty state */}
                        {sections.length === 0 && !error && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                <Paper
                                    radius="xl"
                                    p={60}
                                    style={{
                                        background: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                                        border: `2px dashed ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                                        textAlign: 'center',
                                    }}
                                >
                                    {loading ? (
                                        <Stack align="center" gap="md">
                                            <Loader size="lg" color={primaryColor} />
                                            <Text c="dimmed">Preparing your learning materials with AI...</Text>
                                        </Stack>
                                    ) : (
                                        <Stack align="center" gap="md">
                                            <ThemeIcon size={72} radius="xl" variant="light" color={theme.primaryColor}>
                                                <IconSparkles size={36} />
                                            </ThemeIcon>
                                            <Box>
                                                <Text fw={600} size="xl" mb={6}>Ready to learn?</Text>
                                                <Text c="dimmed" size="sm" maw={380} mx="auto">
                                                    Click below to generate AI-powered content tailored for this module.
                                                </Text>
                                            </Box>
                                            <Button
                                                onClick={handleLoadContent}
                                                loading={loading}
                                                rightSection={<IconArrowRight size={16} />}
                                                size="lg"
                                                radius="xl"
                                                style={{ background: primaryColor }}
                                            >
                                                Generate Content
                                            </Button>
                                        </Stack>
                                    )}
                                </Paper>
                            </motion.div>
                        )}

                        {/* Error state */}
                        {error && (
                            <Paper radius="xl" p="xl" style={{ border: `1.5px solid ${theme.colors.red[4]}`, background: isDark ? theme.colors.dark[6] : theme.colors.red[0] }}>
                                <Group justify="space-between">
                                    <Box>
                                        <Text fw={600} c="red" mb={4}>Error loading content</Text>
                                        <Text size="sm" c="dimmed">{error}</Text>
                                    </Box>
                                    <Button onClick={handleLoadContent} loading={loading} size="sm" color="red" radius="md">
                                        Try Again
                                    </Button>
                                </Group>
                            </Paper>
                        )}

                        {/* Content */}
                        {sections.length > 0 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <Stack gap="lg">
                                    {/* Overview card with chart */}
                                    <Paper radius="xl" p="xl" withBorder>
                                        <Group justify="space-between" mb="md">
                                            <Box>
                                                <Text fw={600} size="lg">{moduleTitle}</Text>
                                                <Group gap={6} mt={4} c="dimmed">
                                                    <IconClock size={14} />
                                                    <Text size="sm">Estimated: 15–20 min</Text>
                                                    <Text size="sm">•</Text>
                                                    <Text size="sm">{sections.length} sections</Text>
                                                </Group>
                                            </Box>
                                            <Badge size="lg" variant="light" color={theme.primaryColor}>
                                                {sections.filter(s => s.isAdvanced).length} Advanced
                                            </Badge>
                                        </Group>

                                        {sectionChartData.some(d => d.points > 0) && (
                                            <Box mt="md">
                                                <Text size="xs" c="dimmed" mb="sm" fw={500} style={{ textTransform: 'uppercase', letterSpacing: '0.06em' }}>Key points per section</Text>
                                                <ResponsiveContainer width="100%" height={80}>
                                                    <BarChart data={sectionChartData} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                                                        <XAxis dataKey="name" tick={{ fontSize: 11, fill: isDark ? theme.colors.gray[5] : theme.colors.gray[6] }} axisLine={false} tickLine={false} />
                                                        <YAxis tick={{ fontSize: 11, fill: isDark ? theme.colors.gray[5] : theme.colors.gray[6] }} axisLine={false} tickLine={false} allowDecimals={false} />
                                                        <Tooltip
                                                            cursor={{ fill: `${primaryColor}15` }}
                                                            contentStyle={{ borderRadius: 10, border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`, background: isDark ? theme.colors.dark[7] : 'white', fontSize: 12 }}
                                                            formatter={(value: any, name: any, props: any) => [value + ' points', props.payload.label]}
                                                        />
                                                        <Bar dataKey="points" radius={[6, 6, 0, 0]}>
                                                            {sectionChartData.map((entry, index) => (
                                                                <Cell key={`cell-${index}`} fill={primaryColor} fillOpacity={0.7 + (index / sectionChartData.length) * 0.3} />
                                                            ))}
                                                        </Bar>
                                                    </BarChart>
                                                </ResponsiveContainer>
                                            </Box>
                                        )}
                                    </Paper>

                                    {/* Sections */}
                                    {sections.map((section, idx) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, y: 16 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: idx * 0.07 }}
                                        >
                                            <Paper radius="xl" p="xl" withBorder>
                                                <Group justify="space-between" align="flex-start" mb="md">
                                                    <Group gap="md" align="flex-start" style={{ flex: 1 }}>
                                                        <Box
                                                            style={{
                                                                minWidth: 32,
                                                                height: 32,
                                                                borderRadius: '50%',
                                                                background: `${primaryColor}18`,
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                justifyContent: 'center',
                                                                flexShrink: 0,
                                                            }}
                                                        >
                                                            <Text fw={700} size="xs" style={{ color: primaryColor }}>{idx + 1}</Text>
                                                        </Box>
                                                        <Title order={4}>{section.title}</Title>
                                                    </Group>
                                                    <Group gap="xs">
                                                        {section.isAdvanced && <Badge size="sm" color="orange" variant="light">Advanced</Badge>}
                                                        {section.isNew && <Badge size="sm" color="blue" variant="light">New</Badge>}
                                                    </Group>
                                                </Group>

                                                <Box
                                                    ml={48}
                                                    style={{ fontSize: '0.95rem', lineHeight: 1.75, color: isDark ? theme.colors.gray[4] : theme.colors.gray[8] }}
                                                >
                                                    <ReactMarkdown components={markdownRenderers}>{section.content}</ReactMarkdown>
                                                </Box>

                                                {section.keyPoints && section.keyPoints.length > 0 && (
                                                    <Box
                                                        mt="lg"
                                                        ml={48}
                                                        p="md"
                                                        style={{
                                                            borderRadius: 12,
                                                            background: isDark ? `${primaryColor}15` : theme.colors[theme.primaryColor][0],
                                                            borderLeft: `3px solid ${primaryColor}`,
                                                        }}
                                                    >
                                                        <Group gap={6} mb="xs">
                                                            <IconBulb size={14} style={{ color: primaryColor }} />
                                                            <Text fw={600} size="sm" style={{ color: primaryColor }}>Key Points</Text>
                                                        </Group>
                                                        <List spacing={6} ml="sm">
                                                            {section.keyPoints.map((point, pidx) => (
                                                                <List.Item key={pidx} style={{ fontSize: 13 }}>
                                                                    {point}
                                                                </List.Item>
                                                            ))}
                                                        </List>
                                                    </Box>
                                                )}

                                                {section.codeExample && (
                                                    <Box mt="lg" ml={48}>
                                                        <Group gap="sm" mb="sm">
                                                            <ThemeIcon size="sm" radius="sm" variant="light" color={theme.primaryColor}>
                                                                <IconCode size={12} />
                                                            </ThemeIcon>
                                                            <Text fw={600} size="sm">Code Example ({section.codeExample.language})</Text>
                                                        </Group>
                                                        <Box style={{ borderRadius: 10, overflow: 'hidden' }}>
                                                            <SyntaxHighlighter style={vscDarkPlus} language={section.codeExample.language} PreTag="div">
                                                                {section.codeExample.code}
                                                            </SyntaxHighlighter>
                                                        </Box>
                                                        <Text size="sm" c="dimmed" mt="xs" style={{ fontStyle: 'italic' }}>{section.codeExample.explanation}</Text>
                                                    </Box>
                                                )}

                                                <Box mt="lg" ml={48}>
                                                    <Button
                                                        variant="light"
                                                        size="xs"
                                                        radius="md"
                                                        leftSection={<IconSparkles size={12} />}
                                                        rightSection={<IconChevronRight size={12} />}
                                                        color={theme.primaryColor}
                                                        onClick={() => handleElaborate(section.title)}
                                                    >
                                                        Learn More About This
                                                    </Button>
                                                </Box>
                                            </Paper>
                                        </motion.div>
                                    ))}

                                    {/* Video Recommendations */}
                                    <Paper radius="xl" p="xl" withBorder>
                                        <Group justify="space-between" mb="md">
                                            <Group gap="sm">
                                                <ThemeIcon size="md" radius="md" variant="light" color={theme.primaryColor}>
                                                    <IconVideo size={16} />
                                                </ThemeIcon>
                                                <Text fw={600}>Recommended Videos</Text>
                                            </Group>
                                            {!videoRecommendations && (
                                                <Button
                                                    size="sm"
                                                    radius="md"
                                                    variant="light"
                                                    color={theme.primaryColor}
                                                    onClick={handleLoadVideos}
                                                    loading={videosLoading}
                                                    rightSection={<IconArrowRight size={14} />}
                                                >
                                                    Load Videos
                                                </Button>
                                            )}
                                        </Group>

                                        {videoRecommendations?.videos?.length > 0 ? (
                                            <Grid>
                                                {videoRecommendations.videos.map((video: any, vidIdx: number) => (
                                                    <Grid.Col key={vidIdx} span={{ base: 12, sm: 6, md: 4 }}>
                                                        <Paper
                                                            radius="lg"
                                                            withBorder
                                                            style={{ overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
                                                        >
                                                            <Box style={{ position: 'relative', paddingTop: '56.25%', background: isDark ? theme.colors.dark[5] : theme.colors.gray[1] }}>
                                                                {video.imageUrl && (
                                                                    <img
                                                                        src={video.imageUrl}
                                                                        alt={video.title}
                                                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                                                                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                                                    />
                                                                )}
                                                                {video.duration && (
                                                                    <Badge size="xs" style={{ position: 'absolute', bottom: 8, right: 8, background: 'rgba(0,0,0,0.7)', color: 'white' }}>
                                                                        {video.duration}
                                                                    </Badge>
                                                                )}
                                                            </Box>

                                                            <Stack gap="xs" p="sm" style={{ flex: 1 }}>
                                                                <Text fw={600} size="sm" lineClamp={2}>{video.title}</Text>
                                                                <Text size="xs" c="dimmed" lineClamp={1}>{video.channel}</Text>
                                                                {video.difficulty && (
                                                                    <Badge size="xs" variant="light" color={video.difficulty === 'beginner' ? 'blue' : video.difficulty === 'intermediate' ? 'grape' : 'orange'}>
                                                                        {video.difficulty}
                                                                    </Badge>
                                                                )}
                                                            </Stack>

                                                            <Button
                                                                size="xs"
                                                                fullWidth
                                                                radius={0}
                                                                rightSection={<IconExternalLink size={12} />}
                                                                style={{ background: primaryColor }}
                                                                onClick={() => video.link && window.open(video.link, '_blank')}
                                                            >
                                                                Watch on YouTube
                                                            </Button>
                                                        </Paper>
                                                    </Grid.Col>
                                                ))}
                                            </Grid>
                                        ) : videoRecommendations && (
                                            <Text size="sm" c="dimmed">No videos found. Try searching "{moduleTitle} tutorial" on YouTube.</Text>
                                        )}
                                    </Paper>

                                    {/* Load Advanced */}
                                    {!expanded && (
                                        <Paper radius="xl" p="xl" withBorder style={{ borderStyle: 'dashed' }}>
                                            <Group justify="space-between">
                                                <Box>
                                                    <Text fw={600} mb={4}>Want more depth?</Text>
                                                    <Text size="sm" c="dimmed">Load advanced content with additional examples and explanations.</Text>
                                                </Box>
                                                <Button
                                                    variant="light"
                                                    color={theme.primaryColor}
                                                    radius="md"
                                                    rightSection={<IconArrowRight size={16} />}
                                                    loading={loading}
                                                    onClick={() => { setExpanded(true); handleLoadContent(); }}
                                                >
                                                    Load Advanced
                                                </Button>
                                            </Group>
                                        </Paper>
                                    )}

                                    {/* Actions */}
                                    <Paper radius="xl" p="xl" withBorder>
                                        <Group justify="flex-end" gap="md">
                                            <Button
                                                variant="light"
                                                color={theme.primaryColor}
                                                radius="md"
                                                onClick={() => navigate(`/quiz`, { state: { selectedPathId: id, selectedModuleIndex: moduleIdx, from: { pathname: window.location.pathname, hash: window.location.hash } } })}
                                            >
                                                Take Quiz
                                            </Button>
                                            <Button
                                                variant="light"
                                                color={theme.primaryColor}
                                                radius="md"
                                                onClick={() => navigate(`/flashcards/generate`, { state: { selectedPathId: id, selectedModuleIndex: moduleIdx, from: { pathname: window.location.pathname, hash: window.location.hash } } })}
                                            >
                                                Generate Flashcards
                                            </Button>
                                            <Button
                                                radius="md"
                                                style={{ background: primaryColor }}
                                                leftSection={module?.completion_percentage === 100 ? <IconCheck size={16} /> : undefined}
                                                disabled={module?.completion_percentage === 100}
                                                loading={isPending}
                                                onClick={async () => {
                                                    await logModuleComplete(moduleId);
                                                    updateModule(
                                                        { moduleId, data: { completion_percentage: 100, status: 'completed' } },
                                                        { onSuccess: async () => { await refetchModules(); handleBack(); } }
                                                    );
                                                }}
                                            >
                                                {module?.completion_percentage === 100 ? 'Completed' : 'Mark as Complete'}
                                            </Button>
                                        </Group>
                                    </Paper>
                                </Stack>
                            </motion.div>
                        )}
                    </Stack>
                </Container>
            </ScrollArea>

            {/* Elaboration Modal */}
            <Modal
                opened={isPopupOpen}
                onClose={closeElaborationPopup}
                title={<Text fw={600}>{elaborationTopic}</Text>}
                size="lg"
                radius="xl"
                styles={{ header: { borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`, paddingBottom: 12 }, body: { paddingTop: 20 } }}
            >
                <ScrollArea mah={480}>
                    {elaborationLoading ? (
                        <Stack align="center" gap="lg" py="xl">
                            <Loader color={primaryColor} />
                            <Text c="dimmed" size="sm">Generating detailed explanation...</Text>
                        </Stack>
                    ) : elaborationContent?.error ? (
                        <Stack gap="md">
                            <Text c="red">{elaborationContent.error}</Text>
                            <Button onClick={() => handleElaborate(elaborationTopic)} loading={elaborationLoading} size="sm" radius="md">Try Again</Button>
                        </Stack>
                    ) : elaborationContent?.sections ? (
                        <Stack gap="lg">
                            {elaborationContent.sections.map((section: any, idx: number) => (
                                <Box key={idx}>
                                    <Text fw={600} mb="xs" style={{ color: primaryColor }}>{section.title}</Text>
                                    <Box style={{ fontSize: '0.9rem', lineHeight: 1.7 }}>
                                        <ReactMarkdown components={markdownRenderers}>{section.content}</ReactMarkdown>
                                    </Box>
                                    {section.keyPoints?.length > 0 && (
                                        <List spacing={4} mt="sm" mb="md">
                                            {section.keyPoints.map((point: string, pidx: number) => (
                                                <List.Item key={pidx} style={{ fontSize: 13 }}>{point}</List.Item>
                                            ))}
                                        </List>
                                    )}
                                    {idx < elaborationContent.sections.length - 1 && <Divider mt="lg" />}
                                </Box>
                            ))}
                        </Stack>
                    ) : null}
                </ScrollArea>
            </Modal>
        </Box>
    );
};

export default ModuleContentPage;