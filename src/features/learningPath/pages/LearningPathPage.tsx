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

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { useDeleteLearningGuidance } from '@/features/guidance/api/useDeleteLearningGuidance';
import type { GuidanceWithLearningModules } from '@/features/guidance/types';
import { useDeleteLearningModule } from '@/features/learningModules/api/useDeleteLearningModule';

import { useGetGuidancesWithModules } from '../api';
import { PathCard, PathSearch } from '../components';
import { CareerPath, PathFilters } from '../types';

export const LearningPathPage: React.FC = () => {
  const theme = useMantineTheme();
  const { data: guidancesData, isLoading } = useGetGuidancesWithModules();
  const [filters, setFilters] = useState<PathFilters>({
    searchTerm: '',
    sortBy: 'progress',
  });
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [selectedGuidanceId, setSelectedGuidanceId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { mutate: deleteGuidance } = useDeleteLearningGuidance();
  const { mutate: deleteModule } = useDeleteLearningModule();

  // Transform guidance data to CareerPath format
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

      const totalProgress =
        modules.length > 0 ? Math.round(modules.reduce((sum, m) => sum + m.progress, 0) / modules.length) : 0;

      const path: CareerPath = {
        $id: guidance.id.toString(),
        careerName: guidance.career_goal,
        description: `${guidance.name} - Age ${guidance.age}`,
        modules,
        completedModules,
        progress: totalProgress,
      };

      return path;
    });
  }, [guidancesData]);

  const filteredPaths = paths.filter((path) =>
    path.careerName.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );

  const handleDeletePath = (id: string) => {
    setSelectedGuidanceId(parseInt(id));
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedGuidanceId) return;

    setIsDeleting(true);

    const guidanceToDelete = guidancesData?.find((g: any) => g.id === selectedGuidanceId);

    if (!guidanceToDelete) {
      setIsDeleting(false);
      setDeleteModalOpened(false);
      return;
    }

    // Delete all modules first
    const modules = guidanceToDelete.learning_modules || [];
    let modulesDeleted = 0;

    const deleteNextModule = () => {
      if (modulesDeleted < modules.length) {
        deleteModule(modules[modulesDeleted].id, {
          onSuccess: () => {
            modulesDeleted++;
            deleteNextModule();
          },
          onError: () => {
            modulesDeleted++;
            deleteNextModule();
          },
        });
      } else {
        // All modules deleted, now delete the guidance
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
      }
    };

    deleteNextModule();
  };

  const handleCreatePath = () => {
    // TODO: Implement create path navigation/modal
    console.log('Create new path');
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
        title="Delete Learning Path"
        centered
      >
        <Stack gap="md">
          <Text>
            Are you sure you want to delete this learning path and all its modules? This action cannot be undone.
          </Text>
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
          <Stack gap="lg">
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
                    No Learning Paths Found
                  </Title>
                  <Text mb="lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                    Create your first learning path to get started
                  </Text>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleCreatePath}
                      style={{
                        backgroundColor: theme.colors[theme.primaryColor]?.[6] || theme.primaryColor,
                        color: 'white',
                      }}
                    >
                      Create Path
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

export default LearningPathPage;
