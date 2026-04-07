import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Input,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconBulb, IconPlus, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { badgeVariants, containerVariants, itemVariants } from '../../animations/formAnimations';

interface SkillsAndInterestsStepProps {
  currentSkills: string[];
  interests: string[];
  skillInput: string;
  interestInput: string;
  onSkillInputChange: (value: string) => void;
  onInterestInputChange: (value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (skill: string) => void;
  onAddInterest: () => void;
  onRemoveInterest: (interest: string) => void;
}

const skillSuggestions = [
  'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python',
  'SQL', 'AWS', 'Docker', 'HTML/CSS', 'Java', 'C++', 'Database Design',
];

const interestSuggestions = [
  'Web Development', 'Data Science', 'Mobile Apps', 'Machine Learning',
  'Cybersecurity', 'Cloud Computing', 'UI/UX Design', 'Game Development',
  'DevOps', 'Blockchain', 'AI/ML', 'Backend Development',
];

function TagSection({
  label,
  description,
  inputValue,
  onInputChange,
  onAdd,
  items,
  onRemove,
  suggestions,
  primaryColor,
  primary6,
  primary1,
  isDark,
  theme,
}: {
  label: string;
  description: string;
  inputValue: string;
  onInputChange: (v: string) => void;
  onAdd: () => void;
  items: string[];
  onRemove: (v: string) => void;
  suggestions: string[];
  primaryColor: string;
  primary6: string;
  primary1: string;
  isDark: boolean;
  theme: ReturnType<typeof useMantineTheme>;
}) {
  return (
    <Stack gap="sm">
      <div>
        <Text fw={600} size="sm">{label}</Text>
        <Text size="xs" c="dimmed">{description}</Text>
      </div>

      {/* Input row */}
      <Group gap="xs">
        <Input
          placeholder={`Add a ${label.toLowerCase().replace(/s$/, '')}`}
          value={inputValue}
          onChange={(e) => onInputChange(e.currentTarget.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); onAdd(); } }}
          radius="md"
          size="sm"
          style={{ flex: 1 }}
          styles={{
            input: {
              borderColor: isDark ? theme.colors.gray[7] : theme.colors.gray[3],
              backgroundColor: isDark ? theme.colors.dark[6] : theme.white,
              '&:focus': { borderColor: primary6 },
            },
          }}
        />
        <Button
          size="sm"
          onClick={onAdd}
          leftSection={<IconPlus size={14} />}
          color={primaryColor}
          radius="md"
          variant="filled"
        >
          Add
        </Button>
      </Group>

      {/* Added tags */}
      {items.length > 0 && (
        <Group gap="xs" wrap="wrap">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div key={item} variants={badgeVariants} initial="hidden" animate="visible" exit="exit">
                <Badge
                  size="md"
                  radius="sm"
                  color={primaryColor}
                  variant="filled"
                  rightSection={
                    <ActionIcon
                      size={14}
                      variant="transparent"
                      color="white"
                      onClick={() => onRemove(item)}
                      style={{ marginLeft: 2 }}
                    >
                      <IconX size={10} />
                    </ActionIcon>
                  }
                >
                  {item}
                </Badge>
              </motion.div>
            ))}
          </AnimatePresence>
        </Group>
      )}

      {/* Suggestions */}
      <Box>
        <Text size="xs" c="dimmed" mb={6} fw={500}>
          Quick add:
        </Text>
        <Group gap={6} wrap="wrap">
          {suggestions
            .filter((s) => !items.includes(s))
            .map((s, i) => (
              <motion.div
                key={s}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.03 }}
              >
                <Tooltip label="Click to add" withArrow position="top">
                  <Badge
                    variant="outline"
                    color={primaryColor}
                    radius="sm"
                    size="sm"
                    style={{
                      cursor: 'pointer',
                      backgroundColor: primary1,
                      transition: 'all 0.15s ease',
                    }}
                    onClick={() => { onInputChange(s); }}
                  >
                    + {s}
                  </Badge>
                </Tooltip>
              </motion.div>
            ))}
        </Group>
      </Box>
    </Stack>
  );
}

export function SkillsAndInterestsStep({
  currentSkills, interests, skillInput, interestInput,
  onSkillInputChange, onInterestInputChange,
  onAddSkill, onRemoveSkill, onAddInterest, onRemoveInterest,
}: SkillsAndInterestsStepProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const primary6 = theme.colors[theme.primaryColor][6];
  const primary1 = theme.colors[theme.primaryColor][isDark ? 9 : 0];
  const primary3 = theme.colors[theme.primaryColor][isDark ? 7 : 2];

  const sharedProps = { primaryColor: theme.primaryColor, primary6, primary1, isDark, theme };

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Stack gap="xl" pt="sm">
        {/* Header */}
        <motion.div variants={itemVariants}>
          <Box style={{ borderLeft: `3px solid ${primary6}`, paddingLeft: 14 }}>
            <Text fw={700} size="xl" c={`${theme.primaryColor}.6`}>
              Skills &amp; Interests
            </Text>
            <Text size="sm" c="dimmed" mt={2}>
              Optional — but helps us recommend content at the right level.
            </Text>
          </Box>
        </motion.div>

        {/* Skills */}
        <motion.div variants={itemVariants}>
          <TagSection
            label="Current Skills"
            description="Technologies and tools you already know"
            inputValue={skillInput}
            onInputChange={onSkillInputChange}
            onAdd={onAddSkill}
            items={currentSkills}
            onRemove={onRemoveSkill}
            suggestions={skillSuggestions}
            {...sharedProps}
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <Divider
            labelPosition="center"
            label={<Text size="xs" c="dimmed">and</Text>}
          />
        </motion.div>

        {/* Interests */}
        <motion.div variants={itemVariants}>
          <TagSection
            label="Interests"
            description="Areas you want to explore or deepen"
            inputValue={interestInput}
            onInputChange={onInterestInputChange}
            onAdd={onAddInterest}
            items={interests}
            onRemove={onRemoveInterest}
            suggestions={interestSuggestions}
            {...sharedProps}
          />
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
                This step is optional
              </Text>
            }
          >
            <Text size="sm" c={isDark ? theme.colors.gray[3] : theme.colors.gray[7]}>
              Adding skills and interests helps us understand your current level and recommend relevant content that
              aligns with your goals.
            </Text>
          </Alert>
        </motion.div>
      </Stack>
    </motion.div>
  );
}