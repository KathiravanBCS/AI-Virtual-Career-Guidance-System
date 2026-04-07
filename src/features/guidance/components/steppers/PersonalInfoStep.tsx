import { Alert, Box, NumberInput, Stack, Text, TextInput, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconBulb, IconCalendar, IconUser } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { containerVariants, itemVariants } from '../../animations/formAnimations';

interface PersonalInfoStepProps {
  name: string;
  age: number | string;
  onNameChange: (value: string) => void;
  onAgeChange: (value: number | null) => void;
}

export function PersonalInfoStep({ name, age, onNameChange, onAgeChange }: PersonalInfoStepProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const primary6 = theme.colors[theme.primaryColor][6];
  const primary1 = theme.colors[theme.primaryColor][isDark ? 9 : 0];
  const primary3 = theme.colors[theme.primaryColor][isDark ? 7 : 2];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Stack gap="xl" pt="sm">
        {/* Section header */}
        <motion.div variants={itemVariants}>
          <Box
            style={{
              borderLeft: `3px solid ${primary6}`,
              paddingLeft: 14,
            }}
          >
            <Text fw={700} size="xl" c={`${theme.primaryColor}.6`}>
              Tell us about yourself
            </Text>
            <Text size="sm" c="dimmed" mt={2}>
              We'll personalise your experience based on your profile.
            </Text>
          </Box>
        </motion.div>

        {/* Inputs */}
        <motion.div variants={itemVariants}>
          <Stack gap="md">
            <TextInput
              label="Your Name"
              placeholder="Enter your name"
              leftSection={<IconUser size={16} color={primary6} />}
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              radius="md"
              size="md"
              styles={{
                label: { fontWeight: 600, marginBottom: 6 },
                input: {
                  borderColor: isDark ? theme.colors.gray[7] : theme.colors.gray[3],
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
                  '&:focus': { borderColor: primary6 },
                },
              }}
            />

            <NumberInput
              label="Your Age"
              placeholder="Enter your age"
              leftSection={<IconCalendar size={16} color={primary6} />}
              value={age ? Number(age) : undefined}
              onChange={(value) => onAgeChange(typeof value === 'number' ? value : null)}
              min={13}
              max={120}
              radius="md"
              size="md"
              styles={{
                label: { fontWeight: 600, marginBottom: 6 },
                input: {
                  borderColor: isDark ? theme.colors.gray[7] : theme.colors.gray[3],
                  backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
                  '&:focus': { borderColor: primary6 },
                },
              }}
            />
          </Stack>
        </motion.div>

        {/* Tip alert */}
        <motion.div variants={itemVariants}>
          <Alert
            icon={<IconBulb size={16} />}
            radius="md"
            variant="light"
            color={theme.primaryColor}
            style={{
              backgroundColor: primary1,
              borderColor: primary3,
            }}
            title={
              <Text fw={600} size="sm" c={`${theme.primaryColor}.6`}>
                Why we ask
              </Text>
            }
          >
            <Text size="sm" c={isDark ? theme.colors.gray[3] : theme.colors.gray[7]}>
              Accurate information helps us personalise your learning experience and recommend age-appropriate content.
            </Text>
          </Alert>
        </motion.div>
      </Stack>
    </motion.div>
  );
}