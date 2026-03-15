import React from 'react';

import {
  Badge,
  Box,
  Button,
  Center,
  Divider,
  Group,
  Image,
  Modal,
  Paper,
  Stack,
  Text,
  Tooltip,
  useMantineTheme,
} from '@mantine/core';
import { motion } from 'framer-motion';
import { IconBriefcase, IconExternalLink, IconMapPin, IconClock } from '@tabler/icons-react';

import type { Job } from '../api/useJobRecommendations';

interface JobCardProps {
  job: Job;
  index?: number;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index = 0 }) => {
  const [opened, setOpened] = React.useState(false);
  const theme = useMantineTheme();

  const formatSalary = () => {
    if (job.job_min_salary && job.job_max_salary) {
      return `$${(job.job_min_salary / 1000).toFixed(0)}k - $${(job.job_max_salary / 1000).toFixed(0)}k`;
    }
    if (job.job_salary) {
      return `$${(job.job_salary / 1000).toFixed(0)}k`;
    }
    return 'Not disclosed';
  };

  return (
    <>
      <Modal opened={opened} onClose={() => setOpened(false)} size="lg" title={job.job_title}>
        <Stack gap="md">
          <Group justify="space-between">
            <Group gap="md">
              {job.employer_logo ? (
                <Image src={job.employer_logo} alt={job.employer_name} w={60} h={60} fit="contain" />
              ) : (
                <Center w={60} h={60} bg="gray.2" style={{ borderRadius: '8px' }}>
                  <IconBriefcase size={32} color="gray" />
                </Center>
              )}
              <div>
                <Text fw={600}>{job.employer_name}</Text>
                <Text size="sm" c="dimmed">
                  {job.job_location}
                </Text>
              </div>
            </Group>
            <Badge color={job.job_is_remote ? 'blue' : 'gray'}>
              {job.job_is_remote ? 'Remote' : 'On-site'}
            </Badge>
          </Group>

          <Divider />

          {job.job_description && (
            <>
              <div>
                <Text fw={600} mb="xs">
                  Job Description
                </Text>
                <Text size="sm" style={{ whiteSpace: 'pre-wrap', maxHeight: '300px', overflow: 'auto' }}>
                  {job.job_description.substring(0, 1000)}...
                </Text>
              </div>
              <Divider />
            </>
          )}

          {job.job_highlights?.Qualifications && (
            <>
              <div>
                <Text fw={600} mb="xs">
                  Key Qualifications
                </Text>
                <Stack gap="xs">
                  {job.job_highlights.Qualifications.slice(0, 5).map((qual, i) => (
                    <Text key={i} size="sm" c="dimmed">
                      • {qual}
                    </Text>
                  ))}
                </Stack>
              </div>
              <Divider />
            </>
          )}

          {job.job_highlights?.Responsibilities && (
            <>
              <div>
                <Text fw={600} mb="xs">
                  Key Responsibilities
                </Text>
                <Stack gap="xs">
                  {job.job_highlights.Responsibilities.slice(0, 5).map((resp, i) => (
                    <Text key={i} size="sm" c="dimmed">
                      • {resp}
                    </Text>
                  ))}
                </Stack>
              </div>
              <Divider />
            </>
          )}

          <div>
            <Text fw={600} mb="md">
              Apply Now
            </Text>
            <Stack gap="sm">
              {job.apply_options?.slice(0, 5).map((option, i) => (
                <Button
                  key={i}
                  variant="light"
                  rightSection={<IconExternalLink size={16} />}
                  component="a"
                  href={option.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apply via {option.publisher}
                </Button>
              ))}
            </Stack>
          </div>
        </Stack>
      </Modal>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.1 }}
      >
        <Paper
          p="md"
          radius="md"
          withBorder
          style={{
            cursor: 'pointer',
            transition: 'all 200ms ease',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            ':hover': {
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
              transform: 'translateY(-2px)',
            },
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.12)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = '';
            e.currentTarget.style.transform = '';
          }}
        >
          <Stack gap="md" style={{ flex: 1 }}>
            {/* Header */}
            <Group justify="space-between" wrap="wrap" gap="sm">
              <Group gap="sm" style={{ flex: 1 }}>
                {job.employer_logo ? (
                  <Image src={job.employer_logo} alt={job.employer_name} w={48} h={48} fit="contain" />
                ) : (
                  <Center w={48} h={48} bg="gray.2" style={{ borderRadius: '6px' }}>
                    <IconBriefcase size={24} color="gray" />
                  </Center>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={600} size="sm" truncate>
                    {job.job_title}
                  </Text>
                  <Text size="xs" c="dimmed" truncate>
                    {job.employer_name}
                  </Text>
                </div>
              </Group>
              <Badge size="sm" color={job.job_is_remote ? 'blue' : 'gray'}>
                {job.job_is_remote ? 'Remote' : 'Office'}
              </Badge>
            </Group>

            {/* Location & Posted */}
            <Group gap="xs" wrap="wrap">
              <Group gap={4} style={{ color: theme.colors.gray[6], fontSize: '0.85rem' }}>
                <IconMapPin size={14} />
                <Text size="xs">{job.job_location}</Text>
              </Group>
              <Group gap={4} style={{ color: theme.colors.gray[6], fontSize: '0.85rem' }}>
                <IconClock size={14} />
                <Text size="xs">{job.job_posted_human_readable}</Text>
              </Group>
            </Group>

            {/* Salary */}
            <Box>
              <Tooltip label="Salary information">
                <Badge variant="light">{formatSalary()}</Badge>
              </Tooltip>
            </Box>

            {/* Benefits */}
            {job.job_benefits && job.job_benefits.length > 0 && (
              <Group gap="xs" wrap="wrap">
                {job.job_benefits.slice(0, 2).map((benefit, i) => (
                  <Badge key={i} size="sm" variant="dot">
                    {benefit.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </Group>
            )}

            {/* Description Preview */}
            {job.job_description && (
              <Text size="xs" c="dimmed" lineClamp={2}>
                {job.job_description.substring(0, 150)}...
              </Text>
            )}
          </Stack>

          {/* Action Button */}
          <Button
            mt="auto"
            fullWidth
            variant="light"
            onClick={() => setOpened(true)}
            rightSection={<IconExternalLink size={16} />}
          >
            View Details
          </Button>
        </Paper>
      </motion.div>
    </>
  );
};

export default JobCard;
