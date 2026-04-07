import { useMemo, useState } from 'react';

import {
    Badge,
    Box,
    Button,
    Center,
    Container,
    Grid,
    Group,
    Loader,
    Modal,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
    useMantineColorScheme,
    useMantineTheme,
} from '@mantine/core';
import {
    IconBooks,
    IconChartBar,
    IconCheck,
    IconPlus,
    IconSearch,
    IconTrophy,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';
import {
    Bar,
    BarChart,
    Cell,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { useDeleteLearningGuidance } from '@/features/guidance/api/useDeleteLearningGuidance';
import type { GuidanceWithLearningModules } from '@/features/guidance/types';
import { useDeleteLearningModule } from '@/features/learningModules/api/useDeleteLearningModule';

import { useGetGuidancesWithModules } from '../api';
import { PathCard, PathSearch } from '../components';
import { CareerPath, PathFilters } from '../types';

export const LearningPathPage: React.FC = () => {
    const theme = useMantineTheme();
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';
    const primaryColor = theme.colors[theme.primaryColor]?.[6] || theme.primaryColor;

    const { data: guidancesData, isLoading } = useGetGuidancesWithModules();
    const [filters, setFilters] = useState<PathFilters>({ searchTerm: '', sortBy: 'progress' });
    const [deleteModalOpened, setDeleteModalOpened] = useState(false);
    const [selectedGuidanceId, setSelectedGuidanceId] = useState<number | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const { mutate: deleteGuidance } = useDeleteLearningGuidance();
    const { mutate: deleteModule } = useDeleteLearningModule();

    const paths = useMemo(() => {
        if (!guidancesData || !Array.isArray(guidancesData)) return [];
        return guidancesData.map((guidance: GuidanceWithLearningModules) => {
            const modules = guidance.learning_modules.map((module) => ({
                id: module.id.toString(),
                title: module.title,
                completed: module.completion_percentage === 100,
                progress: module.completion_percentage,
            }));
            const completedModules = modules.filter((m) => m.completed).map((m) => m.id);
            const totalProgress = modules.length > 0
                ? Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length)
                : 0;
            return {
                $id: guidance.id.toString(),
                careerName: guidance.career_goal,
                description: `${guidance.name} - Age ${guidance.age}`,
                modules,
                completedModules,
                progress: totalProgress,
            } as CareerPath;
        });
    }, [guidancesData]);

    const filteredPaths = paths.filter((path) =>
        path.careerName.toLowerCase().includes(filters.searchTerm.toLowerCase())
    );

    // Stats for the overview chart
    const chartData = filteredPaths
        .slice(0, 8)
        .map((p) => ({
            name: p.careerName.length > 14 ? p.careerName.slice(0, 14) + '…' : p.careerName,
            progress: p.progress,
        }));

    const totalPaths = paths.length;
    const completedPaths = paths.filter((p) => p.progress === 100).length;
    const avgProgress = paths.length > 0 ? Math.round(paths.reduce((s, p) => s + p.progress, 0) / paths.length) : 0;

    const handleDeletePath = (id: string) => {
        setSelectedGuidanceId(parseInt(id));
        setDeleteModalOpened(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedGuidanceId) return;
        setIsDeleting(true);
        const guidanceToDelete = guidancesData?.find((g: any) => g.id === selectedGuidanceId);
        if (!guidanceToDelete) { setIsDeleting(false); setDeleteModalOpened(false); return; }

        const modules = guidanceToDelete.learning_modules || [];
        let modulesDeleted = 0;

        const deleteNextModule = () => {
            if (modulesDeleted < modules.length) {
                deleteModule(modules[modulesDeleted].id, {
                    onSuccess: () => { modulesDeleted++; deleteNextModule(); },
                    onError: () => { modulesDeleted++; deleteNextModule(); },
                });
            } else {
                deleteGuidance(selectedGuidanceId, {
                    onSuccess: () => { setIsDeleting(false); setDeleteModalOpened(false); setSelectedGuidanceId(null); },
                    onError: () => { setIsDeleting(false); setDeleteModalOpened(false); setSelectedGuidanceId(null); },
                });
            }
        };
        deleteNextModule();
    };

    if (isLoading) {
        return (
            <Center style={{ minHeight: '100vh' }}>
                <Stack align="center" gap="md">
                    <Loader size="lg" color={primaryColor} />
                    <Text size="sm" c="dimmed">Loading your learning paths...</Text>
                </Stack>
            </Center>
        );
    }

    return (
        <>
            <Modal
                opened={deleteModalOpened}
                onClose={() => !isDeleting && setDeleteModalOpened(false)}
                title={<Text fw={600}>Delete Learning Path</Text>}
                centered
                radius="xl"
                styles={{ body: { paddingTop: 12 } }}
            >
                <Stack gap="lg">
                    <Text size="sm" c="dimmed">
                        Are you sure you want to delete this learning path and all its modules? This action cannot be undone.
                    </Text>
                    <Group justify="flex-end" gap="sm">
                        <Button variant="subtle" color="gray" radius="md" onClick={() => setDeleteModalOpened(false)} disabled={isDeleting}>
                            Cancel
                        </Button>
                        <Button color="red" radius="md" onClick={handleConfirmDelete} loading={isDeleting}>
                            Delete Path
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            <Container size="fluid" py="sm">
                <ListPageLayout
                    title="Your Learning Paths"
                    titleProps={{ fw: 700, size: 'h2' }}
                    description="Explore AI-crafted learning content based on your interests"
                    filters={
                        <PathSearch
                            searchTerm={filters.searchTerm}
                            sortBy={filters.sortBy}
                            onSearchChange={(term) => setFilters({ ...filters, searchTerm: term })}
                            onSortChange={(sort) => setFilters({ ...filters, sortBy: sort as 'name' | 'progress' | 'recent' })}
                        />
                    }
                >
                    <Stack gap="xl">
                        {/* Stats Row */}
                        {paths.length > 0 && (
                            <Grid gutter="md">
                                {/* Overview chart */}
                                <Grid.Col span={{ base: 12, md: 7 }}>
                                    <Paper radius="xl" p="xl" withBorder style={{ height: '100%' }}>
                                        <Group justify="space-between" mb="md">
                                            <Group gap="sm">
                                                <ThemeIcon size="md" radius="md" variant="light" color={theme.primaryColor}>
                                                    <IconChartBar size={16} />
                                                </ThemeIcon>
                                                <Text fw={600}>Progress Overview</Text>
                                            </Group>
                                            <Badge variant="light" color={theme.primaryColor}>{filteredPaths.length} paths</Badge>
                                        </Group>
                                        <ResponsiveContainer width="100%" height={140}>
                                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                <XAxis
                                                    dataKey="name"
                                                    tick={{ fontSize: 11, fill: isDark ? theme.colors.gray[5] : theme.colors.gray[6] }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                />
                                                <YAxis
                                                    domain={[0, 100]}
                                                    tick={{ fontSize: 11, fill: isDark ? theme.colors.gray[5] : theme.colors.gray[6] }}
                                                    axisLine={false}
                                                    tickLine={false}
                                                    tickFormatter={(v) => v + '%'}
                                                />
                                                <Tooltip
                                                    cursor={{ fill: `${primaryColor}15`, radius: 6 }}
                                                    contentStyle={{
                                                        borderRadius: 12,
                                                        border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                                                        background: isDark ? theme.colors.dark[7] : 'white',
                                                        fontSize: 12,
                                                    }}
                                                    formatter={(value: any) => [value + '%', 'Progress']}
                                                />
                                                <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                                                    {chartData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={entry.progress === 100 ? theme.colors.teal[6] : primaryColor}
                                                            fillOpacity={0.85}
                                                        />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </Paper>
                                </Grid.Col>

                                {/* Stat cards */}
                                <Grid.Col span={{ base: 12, md: 5 }}>
                                    <Stack gap="md" style={{ height: '100%' }}>
                                        <Paper
                                            radius="xl"
                                            p="lg"
                                            style={{
                                                background: `linear-gradient(135deg, ${primaryColor}, ${theme.colors[theme.primaryColor][4]})`,
                                                border: 'none',
                                                flex: 1,
                                            }}
                                        >
                                            <Group gap="md" align="center">
                                                <ThemeIcon size={48} radius="md" style={{ background: 'rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.3)' }}>
                                                    <IconBooks size={24} color="white" />
                                                </ThemeIcon>
                                                <Box>
                                                    <Text size="xs" style={{ color: 'rgba(255,255,255,0.75)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 600 }}>
                                                        Total Paths
                                                    </Text>
                                                    <Title order={2} style={{ color: 'white', lineHeight: 1 }}>{totalPaths}</Title>
                                                </Box>
                                            </Group>
                                        </Paper>

                                        <Grid gutter="md" style={{ flex: 1 }}>
                                            <Grid.Col span={6}>
                                                <Paper radius="xl" p="md" withBorder style={{ height: '100%' }}>
                                                    <ThemeIcon size={36} radius="md" color="teal" variant="light" mb="xs">
                                                        <IconTrophy size={18} />
                                                    </ThemeIcon>
                                                    <Text fw={700} size="xl">{completedPaths}</Text>
                                                    <Text size="xs" c="dimmed">Completed</Text>
                                                </Paper>
                                            </Grid.Col>
                                            <Grid.Col span={6}>
                                                <Paper radius="xl" p="md" withBorder style={{ height: '100%' }}>
                                                    <ThemeIcon size={36} radius="md" color={theme.primaryColor} variant="light" mb="xs">
                                                        <IconChartBar size={18} />
                                                    </ThemeIcon>
                                                    <Text fw={700} size="xl">{avgProgress}%</Text>
                                                    <Text size="xs" c="dimmed">Avg. Progress</Text>
                                                </Paper>
                                            </Grid.Col>
                                        </Grid>
                                    </Stack>
                                </Grid.Col>
                            </Grid>
                        )}

                        {/* Path Cards Grid */}
                        {filteredPaths.length > 0 ? (
                            <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
                                {filteredPaths.map((path, index) => {
                                    const guidance = guidancesData?.find((g: any) => g.id.toString() === path.$id);
                                    return (
                                        <PathCard
                                            key={path.$id}
                                            path={path}
                                            onDelete={handleDeletePath}
                                            index={index}
                                            guidance={guidance}
                                        />
                                    );
                                })}
                            </SimpleGrid>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.97 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                            >
                                <Paper
                                    radius="xl"
                                    p={60}
                                    style={{
                                        textAlign: 'center',
                                        border: `2px dashed ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                                        background: isDark ? theme.colors.dark[6] : theme.colors.gray[0],
                                    }}
                                >
                                    <ThemeIcon
                                        size={72}
                                        radius="xl"
                                        variant="light"
                                        color={theme.primaryColor}
                                        mx="auto"
                                        mb="lg"
                                    >
                                        <IconBooks size={36} />
                                    </ThemeIcon>
                                    <Title order={3} mb="xs">
                                        {filters.searchTerm ? 'No paths found' : 'No Learning Paths Yet'}
                                    </Title>
                                    <Text c="dimmed" size="sm" mb="xl" maw={360} mx="auto">
                                        {filters.searchTerm
                                            ? `No paths match "${filters.searchTerm}". Try a different search.`
                                            : 'Create your first learning path to start your journey.'}
                                    </Text>
                                    {!filters.searchTerm && (
                                        <Button
                                            leftSection={<IconPlus size={16} />}
                                            radius="md"
                                            size="md"
                                            style={{ background: primaryColor }}
                                        >
                                            Create First Path
                                        </Button>
                                    )}
                                </Paper>
                            </motion.div>
                        )}
                    </Stack>
                </ListPageLayout>
            </Container>
        </>
    );
};

export default LearningPathPage;