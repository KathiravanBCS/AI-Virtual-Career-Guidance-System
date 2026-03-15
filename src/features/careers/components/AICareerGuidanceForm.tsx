import { useState } from 'react';

import {
  Alert,
  Badge,
  Button,
  Container,
  FileInput,
  Grid,
  Group,
  Loader,
  MultiSelect,
  Paper,
  Progress,
  Stack,
  Text,
  Textarea,
  TextInput,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconAlertCircle, IconBrain, IconFileUpload, IconSearch, IconSparkles } from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { useGenerateAICareerGuidance } from '../api/useAICareerGuidance';
import type { UserInterests } from '../types';
import { CareerGuidanceResults } from './CareerGuidanceResults';

interface FormData {
  interests: string[];
  skills: string[];
  experience: string;
  goals: string;
}

export function AICareerGuidanceForm() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [step, setStep] = useState<'input' | 'results'>('input');
  const [formData, setFormData] = useState<FormData>({
    interests: [],
    skills: [],
    experience: '',
    goals: '',
  });

  const [interestInput, setInterestInput] = useState('');
  const [skillInput, setSkillInput] = useState('');

  const { mutate, isPending, data } = useGenerateAICareerGuidance();

  const handleAddInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, interestInput.trim()],
      }));
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((i) => i !== interest),
    }));
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skill),
    }));
  };

  const handleSubmit = () => {
    if (formData.interests.length === 0) {
      alert('Please add at least one interest');
      return;
    }

    const payload: UserInterests = {
      interests: formData.interests,
      skills: formData.skills.length > 0 ? formData.skills : undefined,
      experience: formData.experience || undefined,
      goals: formData.goals || undefined,
    };

    mutate(payload, {
      onSuccess: () => {
        setStep('results');
      },
    });
  };

  const handleReset = () => {
    setStep('input');
    setFormData({
      interests: [],
      skills: [],
      experience: '',
      goals: '',
    });
    setInterestInput('');
    setSkillInput('');
  };

  if (step === 'results' && data) {
    return <CareerGuidanceResults data={data} onReset={handleReset} />;
  }

  const isFormValid = formData.interests.length > 0;

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Paper p="xl" radius="md" style={{ backgroundImage: 'var(--gradient-primary)' }}>
            <Group justify="space-between" align="center" mb="md">
              <div>
                <Title order={2} c="white">
                  <Group gap="sm">
                    <IconBrain size={32} />
                    AI Career Guidance
                  </Group>
                </Title>
                <Text c="rgba(255,255,255,0.8)" mt="sm">
                  Discover your ideal career path based on your interests, skills, and goals
                </Text>
              </div>
              <IconSparkles size={40} color="white" />
            </Group>
          </Paper>
        </motion.div>

        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Grid gutter="lg">
            {/* Left Column */}
            <Grid.Col span={{ base: 12, md: 7 }}>
              <Stack gap="lg">
                {/* Interests Section */}
                <Paper
                  p="md"
                  radius="md"
                  withBorder
                  style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                >
                  <Stack gap="md">
                    <div>
                      <Title order={4} mb="xs">
                        Your Interests
                      </Title>
                      <Text size="sm" c="dimmed">
                        What are you passionate about? Add your interests to get personalized recommendations.
                      </Text>
                    </div>

                    <Group gap="xs">
                      <TextInput
                        placeholder="e.g., Technology, Design, Business..."
                        value={interestInput}
                        onChange={(e) => setInterestInput(e?.currentTarget?.value || '')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddInterest();
                          }
                        }}
                        style={{ flex: 1 }}
                      />
                      <Button onClick={handleAddInterest} variant="light">
                        Add
                      </Button>
                    </Group>

                    <Group gap="xs">
                      {formData.interests.length === 0 ? (
                        <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                          No interests added yet
                        </Text>
                      ) : (
                        formData.interests.map((interest) => (
                          <Badge
                            key={interest}
                            size="lg"
                            variant="filled"
                            rightSection={
                              <Text
                                component="button"
                                c="white"
                                style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
                                onClick={() => handleRemoveInterest(interest)}
                              >
                                ×
                              </Text>
                            }
                          >
                            {interest}
                          </Badge>
                        ))
                      )}
                    </Group>
                  </Stack>
                </Paper>

                {/* Skills Section */}
                <Paper
                  p="md"
                  radius="md"
                  withBorder
                  style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                >
                  <Stack gap="md">
                    <div>
                      <Title order={4} mb="xs">
                        Current Skills
                      </Title>
                      <Text size="sm" c="dimmed">
                        Add your existing skills (optional, but recommended)
                      </Text>
                    </div>

                    <Group gap="xs">
                      <TextInput
                        placeholder="e.g., Python, Leadership, Data Analysis..."
                        value={skillInput}
                        onChange={(e) => setSkillInput(e?.currentTarget?.value || '')}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddSkill();
                          }
                        }}
                        style={{ flex: 1 }}
                      />
                      <Button onClick={handleAddSkill} variant="light">
                        Add
                      </Button>
                    </Group>

                    <Group gap="xs">
                      {formData.skills.length === 0 ? (
                        <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                          No skills added yet
                        </Text>
                      ) : (
                        formData.skills.map((skill) => (
                          <Badge
                            key={skill}
                            size="lg"
                            variant="dot"
                            rightSection={
                              <Text
                                component="button"
                                c="currentColor"
                                style={{ cursor: 'pointer', fontSize: 14, lineHeight: 1 }}
                                onClick={() => handleRemoveSkill(skill)}
                              >
                                ×
                              </Text>
                            }
                          >
                            {skill}
                          </Badge>
                        ))
                      )}
                    </Group>
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>

            {/* Right Column */}
            <Grid.Col span={{ base: 12, md: 5 }}>
              <Stack gap="lg">
                {/* Experience Section */}
                <Paper
                  p="md"
                  radius="md"
                  withBorder
                  style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                >
                  <Stack gap="md">
                    <div>
                      <Title order={4} mb="xs">
                        Experience
                      </Title>
                      <Text size="sm" c="dimmed">
                        Describe your professional background (optional)
                      </Text>
                    </div>

                    <Textarea
                      placeholder="e.g., 3 years as a software developer, worked in startups and enterprises..."
                      value={formData.experience}
                      onChange={(e) => {
                        const value = e?.currentTarget?.value ?? '';
                        setFormData((prev) => ({ ...prev, experience: value }));
                      }}
                      minRows={4}
                    />
                  </Stack>
                </Paper>

                {/* Career Goals Section */}
                <Paper
                  p="md"
                  radius="md"
                  withBorder
                  style={{ backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : 'white' }}
                >
                  <Stack gap="md">
                    <div>
                      <Title order={4} mb="xs">
                        Career Goals
                      </Title>
                      <Text size="sm" c="dimmed">
                        What are your career aspirations? (optional)
                      </Text>
                    </div>

                    <Textarea
                      placeholder="e.g., Transition to AI/ML, become a technical leader, start own startup..."
                      value={formData.goals}
                      onChange={(e) => {
                        const value = e?.currentTarget?.value ?? '';
                        setFormData((prev) => ({ ...prev, goals: value }));
                      }}
                      minRows={4}
                    />
                  </Stack>
                </Paper>
              </Stack>
            </Grid.Col>
          </Grid>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Paper
            p="md"
            radius="md"
            withBorder
            style={{
              backgroundColor: colorScheme === 'dark' ? theme.colors.gray[8] : theme.colors.gray[0],
            }}
          >
            <Group justify="space-between" align="center">
              <div>
                {formData.interests.length > 0 && (
                  <Group gap="xs">
                    <Badge size="lg" variant="light">
                      {formData.interests.length} Interest{formData.interests.length !== 1 ? 's' : ''}
                    </Badge>
                    {formData.skills.length > 0 && (
                      <Badge size="lg" variant="light">
                        {formData.skills.length} Skill{formData.skills.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </Group>
                )}
              </div>

              <Button
                size="lg"
                onClick={handleSubmit}
                disabled={!isFormValid || isPending}
                loading={isPending}
                leftSection={<IconSparkles size={20} />}
                style={{ minWidth: 200 }}
              >
                {isPending ? 'Analyzing...' : 'Generate Guidance'}
              </Button>
            </Group>
          </Paper>
        </motion.div>

        {/* Help Section */}
        <Alert icon={<IconSearch size={16} />} color="blue" title="Tips for best results">
          <Stack gap="xs">
            <Text>• Add at least one interest for personalized recommendations</Text>
            <Text>• Include your current skills to get more accurate guidance</Text>
            <Text>• Share your experience level for better career path alignment</Text>
            <Text>• Our AI will analyze your profile and recommend careers that match you best</Text>
          </Stack>
        </Alert>
      </Stack>
    </Container>
  );
}
