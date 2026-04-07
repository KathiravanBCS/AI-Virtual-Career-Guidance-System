import { useMemo, useState } from 'react';

import {
  Button,
  Center,
  Container,
  Group,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { IconSparkles, IconPlus, IconAlertTriangle } from '@tabler/icons-react';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { useDeleteCareerGuidance, useGetCareerGuidances } from '../api/useCareerGuidance';
import { CareerGuidanceCard } from '../components/CareerGuidanceCard';
import { CareerGuidanceSearch } from '../components/CareerGuidanceSearch';
import type { CareerGuidance } from '../types';

interface CareerFilters {
  searchTerm: string;
  sortBy: 'recent' | 'oldest' | 'goals';
}

export const CareerGuidanceListPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const navigate = useNavigate();

  const primary = theme.colors[theme.primaryColor];
  const primaryHex = primary?.[6] ?? '#ff9d54';

  const { data: guidancesData, isLoading } = useGetCareerGuidances();
  const { mutate: deleteGuidance } = useDeleteCareerGuidance();

  const [filters, setFilters] = useState<CareerFilters>({ searchTerm: '', sortBy: 'recent' });
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedGuidanceId, setSelectedGuidanceId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredGuidances = useMemo(() => {
    if (!guidancesData || !Array.isArray(guidancesData)) return [];

    let filtered = [...guidancesData] as CareerGuidance[];

    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (g) =>
          g.career_goals?.toLowerCase().includes(term) ||
          g.guidance?.toLowerCase().includes(term) ||
          g.summary?.toLowerCase().includes(term)
      );
    }

    switch (filters.sortBy) {
      case 'oldest':
        filtered.sort((a, b) => (a.created_at ?? '').localeCompare(b.created_at ?? ''));
        break;
      case 'goals':
        filtered.sort((a, b) => (a.career_goals ?? '').localeCompare(b.career_goals ?? ''));
        break;
      default:
        filtered.sort((a, b) => (b.created_at ?? '').localeCompare(a.created_at ?? ''));
    }

    return filtered;
  }, [guidancesData, filters]);

  const handleDeleteGuidance = (id: number) => {
    setSelectedGuidanceId(id);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedGuidanceId) return;
    setIsDeleting(true);
    deleteGuidance(selectedGuidanceId, {
      onSuccess: () => { setIsDeleting(false); setDeleteModalOpened(false); setSelectedGuidanceId(null); },
      onError: () => { setIsDeleting(false); setDeleteModalOpened(false); setSelectedGuidanceId(null); },
    });
  };

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Stack align="center" gap="md">
          <Loader size="lg" color={theme.primaryColor} />
          <Text size="sm" c="dimmed">Loading your career analyses…</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <>
      {/* ── Delete Confirm Modal ── */}
      <Modal
        opened={deleteModalOpened}
        onClose={() => !isDeleting && setDeleteModalOpened(false)}
        title={
          <Group gap="sm">
            <ThemeIcon size={34} radius="md" color="red" variant="light">
              <IconAlertTriangle size={18} />
            </ThemeIcon>
            <Text fw={700} size="sm">Delete Career Guidance</Text>
          </Group>
        }
        centered
        radius="lg"
        styles={{
          body: { padding: '20px' },
          header: {
            borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
            paddingBottom: '12px',
          },
        }}
      >
        <Stack gap="lg">
          <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
            Are you sure you want to delete this career guidance analysis?
            This action <Text span fw={700} c="red">cannot be undone</Text>.
          </Text>
          <Group justify="flex-end" gap="sm">
            <Button
              variant="light"
              onClick={() => setDeleteModalOpened(false)}
              disabled={isDeleting}
              style={{ borderRadius: '10px' }}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleConfirmDelete}
              loading={isDeleting}
              style={{ borderRadius: '10px', fontWeight: 600 }}
            >
              Delete
            </Button>
          </Group>
        </Stack>
      </Modal>

      {/* ── Page ── */}
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Career Guidance Analysis"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Review and manage your AI-powered career guidance analyses"
          filters={
            <CareerGuidanceSearch
              searchTerm={filters.searchTerm}
              sortBy={filters.sortBy}
              onSearchChange={(term) => setFilters({ ...filters, searchTerm: term })}
              onSortChange={(sort) =>
                setFilters({ ...filters, sortBy: sort as 'recent' | 'oldest' | 'goals' })
              }
            />
          }
        >
          <Stack gap="xl">
            {filteredGuidances.length > 0 ? (
              <>
                <Group justify="space-between" align="center">
                  <Text size="sm" c="dimmed" fw={500}>
                    <Text span fw={700} style={{ color: primaryHex }}>{filteredGuidances.length}</Text>
                    {' '}guidance{filteredGuidances.length !== 1 ? 's' : ''} found
                  </Text>
                  <Button
                    size="xs"
                    leftSection={<IconPlus size={14} />}
                    onClick={() => navigate('/ai-career-guidance')}
                    style={{
                      background: `linear-gradient(135deg, ${primaryHex}, ${primary?.[4] ?? '#ffb87a'})`,
                      color: 'white',
                      fontWeight: 600,
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: `0 4px 12px ${primaryHex}35`,
                    }}
                  >
                    New Analysis
                  </Button>
                </Group>

                <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
                  {filteredGuidances.map((guidance, index) => (
                    <CareerGuidanceCard
                      key={guidance.id}
                      guidance={guidance}
                      onDelete={handleDeleteGuidance}
                      index={index}
                    />
                  ))}
                </SimpleGrid>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                style={{
                  background: isDark ? theme.colors.dark[6] : '#fafafa',
                  border: `1.5px dashed ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                  borderRadius: '16px',
                  padding: '72px 24px',
                  textAlign: 'center',
                }}
              >
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                >
                  <ThemeIcon
                    size={60}
                    radius="xl"
                    style={{
                      background: `${primaryHex}15`,
                      color: primaryHex,
                      margin: '0 auto 20px',
                    }}
                  >
                    <IconSparkles size={30} />
                  </ThemeIcon>

                  <Title
                    order={3}
                    mb={8}
                    style={{ color: primaryHex, fontWeight: 700, letterSpacing: '-0.02em' }}
                  >
                    {filters.searchTerm ? 'No Results Found' : 'No Career Guidance Yet'}
                  </Title>

                  <Text size="sm" c="dimmed" mb="xl" style={{ maxWidth: 320, margin: '0 auto 24px' }}>
                    {filters.searchTerm
                      ? 'Try a different search term to find your analyses.'
                      : 'Create your first AI-powered career guidance to unlock personalised insights.'}
                  </Text>

                  {!filters.searchTerm && (
                    <motion.div
                      whileHover={{ scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      style={{ display: 'inline-block' }}
                    >
                      <Button
                        leftSection={<IconPlus size={16} />}
                        onClick={() => navigate('/ai-career-guidance')}
                        style={{
                          background: `linear-gradient(135deg, ${primaryHex}, ${primary?.[4] ?? '#ffb87a'})`,
                          color: 'white',
                          fontWeight: 600,
                          borderRadius: '10px',
                          border: 'none',
                          boxShadow: `0 6px 20px ${primaryHex}40`,
                          padding: '10px 24px',
                        }}
                      >
                        Create Career Guidance
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </Stack>
        </ListPageLayout>
      </Container>
    </>
  );
};

export default CareerGuidanceListPage;