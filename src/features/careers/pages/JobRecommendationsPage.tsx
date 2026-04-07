import React, { useState } from 'react';

import {
  Box,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { motion } from 'framer-motion';
import {
  IconSearch,
  IconAlertCircle,
  IconBriefcase,
  IconAdjustments,
  IconX,
} from '@tabler/icons-react';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { useJobRecommendations } from '../api/useJobRecommendations';
import { JobCard } from '../components/JobCard';

const PRESET_SEARCHES = [
  { label: 'Developer Jobs in Chennai', value: 'developer jobs in chennai' },
  { label: 'Software Engineer', value: 'software engineer' },
  { label: 'Frontend Developer', value: 'frontend developer' },
  { label: 'Backend Developer', value: 'backend developer' },
  { label: 'Full Stack Developer', value: 'full stack developer' },
  { label: 'Data Scientist', value: 'data scientist' },
  { label: 'DevOps Engineer', value: 'devops engineer' },
  { label: 'Product Manager', value: 'product manager' },
];

export const JobRecommendationsPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const primary = theme.colors[theme.primaryColor];
  const primaryHex = primary?.[6] ?? '#ff9d54';

  const [inputQuery, setInputQuery] = useState('');
  const [submittedQuery, setSubmittedQuery] = useState('developer jobs in Chennai');
  const [selectedPreset, setSelectedPreset] = useState('developer jobs in Chennai');

  const { data: jobsData, isLoading, error } = useJobRecommendations({
    query: submittedQuery,
    page: 1,
    num_pages: 1,
    country: 'us',
    date_posted: 'all',
  });

  const handleSearch = () => {
    if (inputQuery.trim()) setSubmittedQuery(inputQuery.trim());
  };

  const handlePresetSelect = (preset: string | null) => {
    if (preset) {
      setSelectedPreset(preset);
      setInputQuery(preset);
      setSubmittedQuery(preset);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const jobs = jobsData?.data ?? [];

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title="Job Recommendations"
        titleProps={{ fw: 700, size: 'h2' }}
        description="Discover opportunities tailored to your career goals"
        filters={
          <Stack gap="sm" style={{ width: '100%' }}>
            {/* Row 1: Preset */}
            <Group gap="sm" wrap="wrap" align="flex-end">
              <Box style={{ flex: 1, minWidth: '200px' }}>
                <Select
                  label="Quick Search"
                  placeholder="Select a role"
                  data={PRESET_SEARCHES}
                  value={selectedPreset}
                  onChange={handlePresetSelect}
                  searchable
                  allowDeselect={false}
                  leftSection={<IconAdjustments size={16} style={{ color: primaryHex }} />}
                  styles={{
                    label: { fontWeight: 600, fontSize: '13px', marginBottom: '4px' },
                    input: {
                      border: `1.5px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                      borderRadius: '10px',
                      '&:focus': { borderColor: primaryHex },
                    },
                  }}
                />
              </Box>
            </Group>

            {/* Row 2: Custom search */}
            <Group gap="sm" wrap="wrap" align="flex-end">
              <TextInput
                placeholder="Search any role, skill, or location…"
                leftSection={<IconSearch size={16} style={{ color: primaryHex }} />}
                value={inputQuery}
                onChange={(e) => setInputQuery(e.currentTarget.value)}
                onKeyDown={handleKeyDown}
                style={{ flex: 1, minWidth: '200px' }}
                styles={{
                  input: {
                    border: `1.5px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                    borderRadius: '10px',
                    '&:focus': { borderColor: primaryHex },
                  },
                }}
                rightSection={
                  inputQuery ? (
                    <IconX
                      size={14}
                      style={{ color: theme.colors.gray[5], cursor: 'pointer' }}
                      onClick={() => setInputQuery('')}
                    />
                  ) : null
                }
              />
              <Button
                onClick={handleSearch}
                style={{
                  background: `linear-gradient(135deg, ${primaryHex}, ${primary?.[4] ?? '#ffb87a'})`,
                  color: 'white',
                  fontWeight: 600,
                  borderRadius: '10px',
                  border: 'none',
                  boxShadow: `0 4px 14px ${primaryHex}40`,
                }}
              >
                Search
              </Button>
            </Group>
          </Stack>
        }
      >
        <Stack gap="xl">
          {/* Loading */}
          {isLoading && (
            <Center style={{ minHeight: '360px' }}>
              <Stack align="center" gap="md">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                >
                  <ThemeIcon size={48} radius="xl" style={{ background: `${primaryHex}18`, color: primaryHex }}>
                    <IconBriefcase size={24} />
                  </ThemeIcon>
                </motion.div>
                <Text size="sm" c="dimmed" fw={500}>Finding job opportunities…</Text>
              </Stack>
            </Center>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Box
                p="lg"
                style={{
                  background: isDark ? 'rgba(255,59,59,0.06)' : 'rgba(255,59,59,0.04)',
                  border: '1px solid rgba(255,59,59,0.25)',
                  borderRadius: '12px',
                }}
              >
                <Group gap="md">
                  <ThemeIcon size={40} radius="md" color="red" variant="light">
                    <IconAlertCircle size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={700} size="sm" c="red">Error Loading Jobs</Text>
                    <Text size="xs" c="dimmed" mt={2}>
                      {error.message ?? 'Failed to load job recommendations. Please try again.'}
                    </Text>
                  </div>
                </Group>
              </Box>
            </motion.div>
          )}

          {/* Results */}
          {!isLoading && !error && jobs.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <Group justify="space-between" align="center" mb="md">
                <Text size="sm" c="dimmed" fw={500}>
                  <Text span fw={700} style={{ color: primaryHex }}>{jobs.length}</Text>
                  {' '}opportunit{jobs.length !== 1 ? 'ies' : 'y'} for{' '}
                  <Text span fw={600}>"{submittedQuery}"</Text>
                </Text>
              </Group>
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
                {jobs.map((job, index) => (
                  <JobCard key={job.job_id} job={job} index={index} />
                ))}
              </SimpleGrid>
            </motion.div>
          )}

          {/* Empty state */}
          {!isLoading && !error && jobs.length === 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: isDark ? theme.colors.dark[6] : '#fafafa',
                border: `1.5px dashed ${isDark ? theme.colors.dark[4] : theme.colors.gray[3]}`,
                borderRadius: '16px',
                padding: '64px 24px',
                textAlign: 'center',
              }}
            >
              <ThemeIcon
                size={56}
                radius="xl"
                style={{
                  background: `${primaryHex}15`,
                  color: primaryHex,
                  margin: '0 auto 20px',
                }}
              >
                <IconBriefcase size={28} />
              </ThemeIcon>
              <Title order={3} mb={6} style={{ color: primaryHex, fontWeight: 700 }}>
                No Jobs Found
              </Title>
              <Text size="sm" c="dimmed">
                Try a different search term or select a preset role above
              </Text>
            </motion.div>
          )}
        </Stack>
      </ListPageLayout>
    </Container>
  );
};

export default JobRecommendationsPage;