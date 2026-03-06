import { Alert, NumberInput, Stack, Text, TextInput, useMantineTheme } from '@mantine/core';
import { IconBulb, IconCalendar, IconUser } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { containerVariants, inputFocusVariants, itemVariants } from '../../animations/formAnimations';

interface PersonalInfoStepProps {
  name: string;
  age: number | string;
  onNameChange: (value: string) => void;
  onAgeChange: (value: number | null) => void;
}

export function PersonalInfoStep({ name, age, onNameChange, onAgeChange }: PersonalInfoStepProps) {
  const theme = useMantineTheme();
  const primaryColor = theme.colors[theme.primaryColor][6];
  const accentColor = theme.colors[theme.primaryColor][2];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Stack gap="lg">
        <motion.div variants={itemVariants}>
          <Text fw={700} size="lg" mb="md" c={theme.primaryColor}>
            Tell us about yourself
          </Text>
        </motion.div>

        <motion.div variants={itemVariants}>
          <TextInput
            label="Your Name"
            placeholder="Enter your name"
            leftSection={<IconUser size={16} color={primaryColor} />}
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
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
          <NumberInput
            label="Your Age"
            placeholder="Enter your age"
            leftSection={<IconCalendar size={16} color={primaryColor} />}
            value={age ? Number(age) : undefined}
            onChange={(value) => onAgeChange(typeof value === 'number' ? value : null)}
            min={13}
            max={120}
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
            <Text size="sm">Providing accurate information helps us personalize your learning experience.</Text>
          </Alert>
        </motion.div>
      </Stack>
    </motion.div>
  );
}
