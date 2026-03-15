import { useMemo, useState } from 'react';

import {
  Button,
  Center,
  Container,
  Loader,
  Modal,
  SimpleGrid,
  Stack,
  Text,
  Title,
  useMantineTheme,
} from '@mantine/core';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { useDeleteCareerGuidance } from '../api/useCareerGuidance';
import { useGetCareerGuidances } from '../api/useCareerGuidance';
import { CareerGuidanceCard } from '../components/CareerGuidanceCard';
import { CareerGuidanceSearch } from '../components/CareerGuidanceSearch';
import type { CareerGuidance } from '../types';

interface CareerFilters {
  searchTerm: string;
  sortBy: 'recent' | 'oldest' | 'goals';
}

export const CareerGuidanceListPage: React.FC = () => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { data: guidancesData, isLoading } = useGetCareerGuidances();
  const { mutate: deleteGuidance } = useDeleteCareerGuidance();

  const [filters, setFilters] = useState<CareerFilters>({
    searchTerm: '',
    sortBy: 'recent',
  });

  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedGuidanceId, setSelectedGuidanceId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Filter and sort guidances
  const filteredGuidances = useMemo(() => {
    if (!guidancesData || !Array.isArray(guidancesData)) return [];

    let filtered = [...guidancesData];

    // Search filter
    if (filters.searchTerm) {
      filtered = filtered.filter(
        (g: CareerGuidance) =>
          g.career_goals?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          g.guidance?.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          g.summary?.toLowerCase().includes(filters.searchTerm.toLowerCase())
      );
    }

    // Sort
    switch (filters.sortBy) {
      case 'oldest':
        filtered.sort((a: CareerGuidance, b: CareerGuidance) =>
          (a.created_at || '').localeCompare(b.created_at || '')
        );
        break;
      case 'goals':
        filtered.sort((a: CareerGuidance, b: CareerGuidance) =>
          (a.career_goals || '').localeCompare(b.career_goals || '')
        );
        break;
      case 'recent':
      default:
        filtered.sort((a: CareerGuidance, b: CareerGuidance) =>
          (b.created_at || '').localeCompare(a.created_at || '')
        );
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
      onSuccess: () => {
        setIsDeleting(false);
        setDeleteModalOpened(false);
        setSelectedGuidanceId(null);
      },
      onError: () => {
        setIsDeleting(false);
        setDeleteModalOpened(false);
        setSelectedGuidanceId(null);
      },
    });
  };

  const handleCreateGuidance = () => {
    navigate('/ai-career-guidance');
  };

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <Loader size="lg" />
      </Center>
    );
  }

  return (
    <>
      <Modal
        opened={deleteModalOpened}
        onClose={() => !isDeleting && setDeleteModalOpened(false)}
        title="Delete Career Guidance"
        centered
      >
        <Stack gap="md">
          <Text>Are you sure you want to delete this career guidance analysis? This action cannot be undone.</Text>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
            <Button variant="light" onClick={() => setDeleteModalOpened(false)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button color="red" onClick={handleConfirmDelete} loading={isDeleting}>
              Delete
            </Button>
          </div>
        </Stack>
      </Modal>

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
              onSortChange={(sort) => setFilters({ ...filters, sortBy: sort as 'recent' | 'oldest' | 'goals' })}
            />
          }
        >
          <Stack gap="lg">
            {filteredGuidances.length > 0 ? (
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
                {filteredGuidances.map((guidance: CareerGuidance, index: number) => (
                  <CareerGuidanceCard
                    key={guidance.id}
                    guidance={guidance}
                    onDelete={handleDeleteGuidance}
                    index={index}
                  />
                ))}
              </SimpleGrid>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                style={{
                  background: `rgba(255, 255, 255, 0.05)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(255, 255, 255, 0.1)`,
                  borderRadius: '16px',
                  padding: '48px 24px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
                }}
              >
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Title
                    order={3}
                    mb="xs"
                    style={{
                      color: theme.colors[theme.primaryColor]?.[6] || theme.primaryColor,
                    }}
                  >
                    No Career Guidance Found
                  </Title>
                  <Text mb="lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Create your first career guidance analysis to get started
                  </Text>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleCreateGuidance}
                      style={{
                        backgroundColor: theme.colors[theme.primaryColor]?.[6] || theme.primaryColor,
                        color: 'white',
                      }}
                    >
                      Create Career Guidance
                    </Button>
                  </motion.div>
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
