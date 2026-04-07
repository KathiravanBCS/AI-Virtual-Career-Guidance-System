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
  ThemeIcon,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { motion } from 'framer-motion';
import {
  IconBriefcase,
  IconExternalLink,
  IconMapPin,
  IconClock,
  IconCurrencyDollar,
  IconBuilding,
  IconArrowRight,
  IconStar,
} from '@tabler/icons-react';

import type { Job } from '../api/useJobRecommendations';

interface JobCardProps {
  job: Job;
  index?: number;
}

export const JobCard: React.FC<JobCardProps> = ({ job, index = 0 }) => {
  const [opened, setOpened] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const primary = theme.colors[theme.primaryColor];
  const primaryHex = primary?.[6] ?? '#ff9d54';
  const primaryLight = primary?.[0] ?? '#fff4ec';
  const primaryDark = `${primary?.[8] ?? '#c96a1a'}40`;

  const formatSalary = () => {
    if (job.job_min_salary && job.job_max_salary) {
      return `$${(job.job_min_salary / 1000).toFixed(0)}k – $${(job.job_max_salary / 1000).toFixed(0)}k`;
    }
    if (job.job_salary) {
      return `$${(job.job_salary / 1000).toFixed(0)}k`;
    }
    return 'Not disclosed';
  };

  const cardBg = isHovered
    ? isDark ? primaryDark : primaryLight
    : isDark ? theme.colors.dark[6] : '#ffffff';

  return (
    <>
      {/* ── Detail Modal ── */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        size="lg"
        radius="lg"
        title={
          <Group gap="sm">
            <ThemeIcon size={36} radius="md" style={{ background: `${primaryHex}18`, color: primaryHex }}>
              <IconBriefcase size={18} />
            </ThemeIcon>
            <div>
              <Text fw={700} size="md" style={{ lineHeight: 1.2 }}>{job.job_title}</Text>
              <Text size="xs" c="dimmed">{job.employer_name}</Text>
            </div>
          </Group>
        }
        styles={{
          header: { borderBottom: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}` },
          body: { padding: '20px' },
        }}
      >
        <Stack gap="md">
          {/* Company + Remote Badge */}
          <Group justify="space-between" align="center">
            <Group gap="md">
              {job.employer_logo ? (
                <Image src={job.employer_logo} alt={job.employer_name} w={52} h={52} fit="contain" radius="md" />
              ) : (
                <Center
                  w={52} h={52}
                  style={{
                    borderRadius: '10px',
                    background: `${primaryHex}15`,
                    border: `1px solid ${primaryHex}30`,
                  }}
                >
                  <IconBuilding size={26} style={{ color: primaryHex }} />
                </Center>
              )}
              <div>
                <Text fw={600} size="sm">{job.employer_name}</Text>
                <Group gap={4} mt={2}>
                  <IconMapPin size={13} style={{ color: theme.colors.gray[5] }} />
                  <Text size="xs" c="dimmed">{job.job_location}</Text>
                </Group>
              </div>
            </Group>
            <Badge
              variant="light"
              color={job.job_is_remote ? 'teal' : 'gray'}
              style={{ fontWeight: 600 }}
            >
              {job.job_is_remote ? 'Remote' : 'On-site'}
            </Badge>
          </Group>

          <Divider />

          {/* Description */}
          {job.job_description && (
            <div>
              <Text fw={600} size="sm" mb={8}>Job Description</Text>
              <Text
                size="xs"
                c="dimmed"
                style={{
                  whiteSpace: 'pre-wrap',
                  maxHeight: '220px',
                  overflow: 'auto',
                  lineHeight: 1.65,
                  padding: '10px',
                  background: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
                  borderRadius: '8px',
                  border: `1px solid ${isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
                }}
              >
                {job.job_description.substring(0, 1000)}…
              </Text>
            </div>
          )}

          {/* Qualifications */}
          {job.job_highlights?.Qualifications && (
            <div>
              <Text fw={600} size="sm" mb={8}>Key Qualifications</Text>
              <Stack gap={6}>
                {job.job_highlights.Qualifications.slice(0, 5).map((qual, i) => (
                  <Group key={i} gap={8}>
                    <IconStar size={13} style={{ color: primaryHex, flexShrink: 0 }} />
                    <Text size="xs" c="dimmed">{qual}</Text>
                  </Group>
                ))}
              </Stack>
            </div>
          )}

          {/* Responsibilities */}
          {job.job_highlights?.Responsibilities && (
            <div>
              <Text fw={600} size="sm" mb={8}>Key Responsibilities</Text>
              <Stack gap={6}>
                {job.job_highlights.Responsibilities.slice(0, 5).map((resp, i) => (
                  <Group key={i} gap={8}>
                    <IconArrowRight size={13} style={{ color: primaryHex, flexShrink: 0 }} />
                    <Text size="xs" c="dimmed">{resp}</Text>
                  </Group>
                ))}
              </Stack>
            </div>
          )}

          <Divider />

          {/* Apply Options */}
          <div>
            <Text fw={600} size="sm" mb={10}>Apply Now</Text>
            <Stack gap="sm">
              {job.apply_options?.slice(0, 4).map((option, i) => (
                <Button
                  key={i}
                  variant="light"
                  size="sm"
                  rightSection={<IconExternalLink size={14} />}
                  component="a"
                  href={option.apply_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontWeight: 500 }}
                >
                  Apply via {option.publisher}
                </Button>
              ))}
            </Stack>
          </div>
        </Stack>
      </Modal>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ height: '100%' }}
      >
        <Paper
          p="lg"
          radius="md"
          style={{
            cursor: 'pointer',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            background: cardBg,
            border: `1.5px solid ${isHovered ? primaryHex : isDark ? theme.colors.dark[4] : theme.colors.gray[2]}`,
            boxShadow: isHovered
              ? `0 10px 30px ${primaryHex}20, 0 2px 8px rgba(0,0,0,0.08)`
              : '0 2px 8px rgba(0,0,0,0.06)',
            transition: 'all 0.25s ease',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Top accent */}
          <motion.div
            animate={{ scaleX: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '3px',
              background: `linear-gradient(90deg, ${primaryHex}, ${primary?.[4] ?? '#ffb87a'})`,
              transformOrigin: 'left',
            }}
          />

          <Stack gap="md" style={{ flex: 1 }}>
            {/* Header */}
            <Group justify="space-between" wrap="nowrap" gap="sm">
              <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
                {job.employer_logo ? (
                  <Image src={job.employer_logo} alt={job.employer_name} w={44} h={44} fit="contain" radius="md" />
                ) : (
                  <Center
                    w={44} h={44}
                    style={{
                      borderRadius: '10px',
                      background: `${primaryHex}15`,
                      border: `1px solid ${primaryHex}25`,
                      flexShrink: 0,
                    }}
                  >
                    <IconBuilding size={20} style={{ color: primaryHex }} />
                  </Center>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={700} size="sm" truncate style={{ letterSpacing: '-0.01em' }}>
                    {job.job_title}
                  </Text>
                  <Text size="xs" c="dimmed" truncate>{job.employer_name}</Text>
                </div>
              </Group>
              <Badge
                size="sm"
                variant="light"
                color={job.job_is_remote ? 'teal' : 'gray'}
                style={{ flexShrink: 0, fontWeight: 600 }}
              >
                {job.job_is_remote ? 'Remote' : 'Office'}
              </Badge>
            </Group>

            {/* Location & Posted */}
            <Group gap="md" wrap="wrap">
              <Group gap={5} style={{ color: theme.colors.gray[5] }}>
                <IconMapPin size={13} />
                <Text size="xs" c="dimmed">{job.job_location}</Text>
              </Group>
              <Group gap={5} style={{ color: theme.colors.gray[5] }}>
                <IconClock size={13} />
                <Text size="xs" c="dimmed">{job.job_posted_human_readable}</Text>
              </Group>
            </Group>

            {/* Salary */}
            <Box>
              <Tooltip label="Estimated salary" position="top" withArrow>
                <Badge
                  variant="light"
                  leftSection={<IconCurrencyDollar size={12} />}
                  style={{
                    background: `${primaryHex}12`,
                    color: primaryHex,
                    border: `1px solid ${primaryHex}30`,
                    fontWeight: 600,
                  }}
                >
                  {formatSalary()}
                </Badge>
              </Tooltip>
            </Box>

            {/* Benefits */}
            {job.job_benefits && job.job_benefits.length > 0 && (
              <Group gap={6} wrap="wrap">
                {job.job_benefits.slice(0, 3).map((benefit, i) => (
                  <Badge key={i} size="xs" variant="dot" color="gray" style={{ fontWeight: 500 }}>
                    {benefit.replace(/_/g, ' ')}
                  </Badge>
                ))}
              </Group>
            )}

            {/* Description preview */}
            {job.job_description && (
              <Text size="xs" c="dimmed" lineClamp={2} style={{ lineHeight: 1.6 }}>
                {job.job_description.substring(0, 150)}…
              </Text>
            )}
          </Stack>

          {/* CTA */}
          <Button
            mt="md"
            fullWidth
            variant="light"
            size="sm"
            onClick={() => setOpened(true)}
            rightSection={<IconExternalLink size={14} />}
            style={{
              background: isHovered ? `${primaryHex}18` : undefined,
              color: primaryHex,
              border: `1px solid ${primaryHex}30`,
              fontWeight: 600,
              transition: 'background 0.2s ease',
            }}
          >
            View Details
          </Button>
        </Paper>
      </motion.div>
    </>
  );
};

export default JobCard;