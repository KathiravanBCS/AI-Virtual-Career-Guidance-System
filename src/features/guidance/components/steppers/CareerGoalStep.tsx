import { Alert, Box, Stack, Text, Textarea, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconBulb, IconTarget } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { containerVariants, itemVariants } from '../../animations/formAnimations';

interface CareerGoalStepProps {
  careerGoal: string;
  onCareerGoalChange: (value: string) => void;
}

export function CareerGoalStep({ careerGoal, onCareerGoalChange }: CareerGoalStepProps) {
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
          <Box style={{ borderLeft: `3px solid ${primary6}`, paddingLeft: 14 }}>
            <Text fw={700} size="xl" c={`${theme.primaryColor}.6`}>
              What are your career goals?
            </Text>
            <Text size="sm" c="dimmed" mt={2}>
              Be as specific as possible — we'll build your learning path around this.
            </Text>
          </Box>
        </motion.div>

        {/* Textarea */}
        <motion.div variants={itemVariants}>
          <Textarea
            label="Career Goal"
            placeholder="e.g., I want to become a full-stack developer specialising in React and Node.js, and join a product-led startup within 18 months…"
            leftSection={<IconTarget size={16} color={primary6} />}
            minRows={5}
            autosize
            value={careerGoal}
            onChange={(e) => onCareerGoalChange(e.target.value)}
            radius="md"
            size="md"
            styles={{
              label: { fontWeight: 600, marginBottom: 6 },
              input: {
                borderColor: isDark ? theme.colors.gray[7] : theme.colors.gray[3],
                backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
                lineHeight: 1.65,
                '&:focus': { borderColor: primary6 },
              },
            }}
          />

          {/* Live char count */}
          <Text size="xs" c="dimmed" ta="right" mt={4}>
            {careerGoal.length} characters
          </Text>
        </motion.div>

        {/* Tip */}
        <motion.div variants={itemVariants}>
          <Alert
            icon={<IconBulb size={16} />}
            radius="md"
            variant="light"
            color={theme.primaryColor}
            style={{ backgroundColor: primary1, borderColor: primary3 }}
            title={
              <Text fw={600} size="sm" c={`${theme.primaryColor}.6`}>
                Pro tip
              </Text>
            }
          >
            <Text size="sm" c={isDark ? theme.colors.gray[3] : theme.colors.gray[7]}>
              The more detail you provide — including your timeline, preferred tech stack, and dream role — the better
              we can tailor your learning path.
            </Text>
          </Alert>
        </motion.div>
      </Stack>
    </motion.div>
  );
}