import { Alert, Stack, Text, Textarea, useMantineTheme } from '@mantine/core';
import { IconBulb, IconTarget } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { containerVariants, itemVariants } from '../../animations/formAnimations';

interface CareerGoalStepProps {
  careerGoal: string;
  onCareerGoalChange: (value: string) => void;
}

export function CareerGoalStep({ careerGoal, onCareerGoalChange }: CareerGoalStepProps) {
  const theme = useMantineTheme();
  const primaryColor = theme.colors[theme.primaryColor][6];
  const accentColor = theme.colors[theme.primaryColor][2];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Stack gap="lg">
        <motion.div variants={itemVariants}>
          <Text fw={700} size="lg" mb="md" c={theme.primaryColor}>
            What are your career goals?
          </Text>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Textarea
            label="Career Goal"
            placeholder="e.g., I want to become a full-stack developer and join a tech company..."
            leftSection={<IconTarget size={16} color={primaryColor} />}
            minRows={4}
            value={careerGoal}
            onChange={(e) => onCareerGoalChange(e.target.value)}
            radius="md"
            styles={{
              input: {
                '&:focus': {
                  borderColor: primaryColor,
                },
              },
            }}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Alert
            icon={<IconBulb size={16} />}
            variant="light"
            radius="md"
            style={{ backgroundColor: `${accentColor}20`, borderColor: primaryColor }}
            title={
              <Text fw={600} c={theme.primaryColor}>
                Tip
              </Text>
            }
          >
            <Text size="sm">The more detail you provide, the better we can tailor your learning path.</Text>
          </Alert>
        </motion.div>
      </Stack>
    </motion.div>
  );
}
