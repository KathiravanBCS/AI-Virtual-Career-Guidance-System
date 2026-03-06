import { Alert, Badge, Button, Group, Input, Stack, Text, Tooltip, useMantineTheme } from '@mantine/core';
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
  'JavaScript',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'SQL',
  'AWS',
  'Docker',
  'HTML/CSS',
  'Java',
  'C++',
  'Database Design',
];

const interestSuggestions = [
  'Web Development',
  'Data Science',
  'Mobile Apps',
  'Machine Learning',
  'Cybersecurity',
  'Cloud Computing',
  'UI/UX Design',
  'Game Development',
  'DevOps',
  'Blockchain',
  'AI/ML',
  'Backend Development',
];

export function SkillsAndInterestsStep({
  currentSkills,
  interests,
  skillInput,
  interestInput,
  onSkillInputChange,
  onInterestInputChange,
  onAddSkill,
  onRemoveSkill,
  onAddInterest,
  onRemoveInterest,
}: SkillsAndInterestsStepProps) {
  const theme = useMantineTheme();
  const primaryColor = theme.colors[theme.primaryColor][6];
  const accentColor = theme.colors[theme.primaryColor][2];

  return (
    <motion.div initial="hidden" animate="visible" variants={containerVariants}>
      <Stack gap="lg">
        <motion.div variants={itemVariants}>
          <Text fw={700} size="lg" mb="md" c={theme.primaryColor}>
            What skills and interests do you have?
          </Text>
        </motion.div>

        {/* Skills Section */}
        <motion.div variants={itemVariants}>
          <div>
            <Text fw={600} size="sm" mb="md">
              Current Skills
            </Text>

            <Group mb="md" gap="xs">
              <Input
                placeholder="Add a skill"
                value={skillInput}
                onChange={(e) => onSkillInputChange(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddSkill();
                  }
                }}
                style={{ flex: 1 }}
                radius="md"
              />
              <Button size="sm" onClick={onAddSkill} leftSection={<IconPlus size={16} />} color={theme.primaryColor}>
                Add
              </Button>
            </Group>

            <Group gap="xs" mb="md">
              <AnimatePresence>
                {currentSkills.map((skill) => (
                  <motion.div key={skill} variants={badgeVariants} initial="hidden" animate="visible" exit="exit">
                    <Badge
                      size="lg"
                      color={theme.primaryColor}
                      rightSection={
                        <button
                          onClick={() => onRemoveSkill(skill)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconX size={10} />
                        </button>
                      }
                    >
                      {skill}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Group>

            <Text size="sm" c="dimmed" mb="sm">
              Suggestions:
            </Text>
            <Group gap="xs" mb="lg">
              {skillSuggestions.map((skill, index) => (
                <motion.div
                  key={skill}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Tooltip label="Click to add" position="top" withArrow>
                    <Badge
                      variant="dot"
                      color={theme.primaryColor}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (!currentSkills.includes(skill)) {
                          onSkillInputChange(skill);
                        }
                      }}
                    >
                      + {skill}
                    </Badge>
                  </Tooltip>
                </motion.div>
              ))}
            </Group>
          </div>
        </motion.div>

        {/* Interests Section */}
        <motion.div variants={itemVariants}>
          <div>
            <Text fw={600} size="sm" mb="md">
              Interests
            </Text>

            <Group mb="md" gap="xs">
              <Input
                placeholder="Add an interest"
                value={interestInput}
                onChange={(e) => onInterestInputChange(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    onAddInterest();
                  }
                }}
                style={{ flex: 1 }}
                radius="md"
              />
              <Button size="sm" onClick={onAddInterest} leftSection={<IconPlus size={16} />} color={theme.primaryColor}>
                Add
              </Button>
            </Group>

            <Group gap="xs" mb="md">
              <AnimatePresence>
                {interests.map((interest) => (
                  <motion.div key={interest} variants={badgeVariants} initial="hidden" animate="visible" exit="exit">
                    <Badge
                      size="lg"
                      color={theme.primaryColor}
                      rightSection={
                        <button
                          onClick={() => onRemoveInterest(interest)}
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <IconX size={10} />
                        </button>
                      }
                    >
                      {interest}
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Group>

            <Text size="sm" c="dimmed" mb="sm">
              Suggestions:
            </Text>
            <Group gap="xs">
              {interestSuggestions.map((interest, index) => (
                <motion.div
                  key={interest}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Tooltip label="Click to add" position="top" withArrow>
                    <Badge
                      variant="dot"
                      color={theme.primaryColor}
                      style={{ cursor: 'pointer' }}
                      onClick={() => {
                        if (!interests.includes(interest)) {
                          onInterestInputChange(interest);
                        }
                      }}
                    >
                      + {interest}
                    </Badge>
                  </Tooltip>
                </motion.div>
              ))}
            </Group>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Alert
            icon={<IconBulb size={16} />}
            style={{ backgroundColor: `${accentColor}20`, borderColor: primaryColor }}
            title={
              <Text fw={600} c={theme.primaryColor}>
                Tip
              </Text>
            }
            radius="md"
          >
            <Text size="sm">This helps us understand your current level and recommend relevant content.</Text>
          </Alert>
        </motion.div>
      </Stack>
    </motion.div>
  );
}
