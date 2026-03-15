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
  Title,
  useMantineTheme,
} from '@mantine/core';
import { motion } from 'framer-motion';
import { IconSearch, IconAlertCircle } from '@tabler/icons-react';

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
    setSubmittedQuery(inputQuery);
  };

  const handlePresetSelect = (preset: string | null) => {
    if (preset) {
      setSelectedPreset(preset);
      setInputQuery(preset);
      setSubmittedQuery(preset);
    }
  };

  const handleInputChange = (query: string) => {
    setInputQuery(query);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const jobs = jobsData?.data || [];

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title="Job Recommendations"
        titleProps={{ fw: 700, size: 'h2' }}
        description="Discover job opportunities tailored to your career goals"
        filters={
          <Stack gap="md" style={{ width: '100%' }}>
            <Group gap="md" wrap="wrap">
              <Select
                label="Quick Search"
                placeholder="Select a role"
                data={PRESET_SEARCHES}
                value={selectedPreset}
                onChange={handlePresetSelect}
                searchable
                allowDeselect={false}
                style={{ flex: 1, minWidth: '200px' }}
              />
            </Group>
            <Group gap="md" wrap="wrap">
              <TextInput
                placeholder="Search jobs..."
                leftSection={<IconSearch size={18} />}
                value={inputQuery}
                onChange={(e) => handleInputChange(e.currentTarget.value)}
                onKeyPress={handleKeyPress}
                style={{ flex: 1, minWidth: '200px' }}
              />
              <Button onClick={handleSearch}>Search</Button>
            </Group>
          </Stack>
        }
      >
        <Stack gap="lg">
          {isLoading && (
            <Center style={{ minHeight: '400px' }}>
              <Stack gap="md" align="center">
                <Loader size="lg" />
                <Text c="dimmed">Loading job opportunities...</Text>
              </Stack>
            </Center>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Box
                p="md"
                style={{
                  background: `rgba(255, 0, 0, 0.05)`,
                  border: `1px solid rgba(255, 0, 0, 0.3)`,
                  borderRadius: '8px',
                }}
              >
                <Group gap="md">
                  <IconAlertCircle size={24} color="red" />
                  <Stack gap={0}>
                    <Text fw={600} c="red">
                      Error Loading Jobs
                    </Text>
                    <Text size="sm" c="dimmed">
                      {error.message ||
                        'Failed to load job recommendations. Please try again or check your API key.'}
                    </Text>
                  </Stack>
                </Group>
              </Box>
            </motion.div>
          )}

          {!isLoading && !error && jobs.length > 0 && (
            <>
              <Text c="dimmed" size="sm">
                Found {jobs.length} job opportunity
                {jobs.length !== 1 ? 'ies' : ''} for "{submittedQuery}"
              </Text>
              <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
                {jobs.map((job, index) => (
                  <JobCard key={job.job_id} job={job} index={index} />
                ))}
              </SimpleGrid>
            </>
          )}

          {!isLoading && !error && jobs.length === 0 && (
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
                  No Jobs Found
                </Title>
                <Text mb="lg" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Try a different search or select a preset job title
                </Text>
              </motion.div>
            </motion.div>
          )}
        </Stack>
      </ListPageLayout>
    </Container>
  );
};

export default JobRecommendationsPage;
