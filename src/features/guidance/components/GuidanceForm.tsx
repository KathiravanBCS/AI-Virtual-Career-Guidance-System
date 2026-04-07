import { useEffect, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  Center,
  Container,
  Group,
  Loader,
  Paper,
  Stack,
  Stepper,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconAlertCircle, IconBriefcase, IconBulb, IconSparkles, IconUser } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { LearningPathResults } from '@/features/learningModules/components/LearningPathResults';
import { useAuth } from '@/lib/auth/useAuth';
import { useLoggedInUser } from '@/lib/auth/useLoggedInUser';

import { generateLearningPath } from '../../../config/groq.config';
import {
  alertVariants,
  containerVariants,
  pulseVariants,
  spinnerVariants,
  stepContentVariants,
} from '../animations/formAnimations';
import { useCreateLearningGuidance } from '../api/useCreateLearningGuidance';
import type { CreateLearningGuidanceRequest } from '../types';
import { CareerGoalStep } from './steppers/CareerGoalStep';
import { ModernAssessmentStep } from './steppers/ModernAssessmentStep';
import { PersonalInfoStep } from './steppers/PersonalInfoStep';
import { SkillsAndInterestsStep } from './steppers/SkillsAndInterestsStep';

interface LearningModule {
  title: string;
  description?: string;
  estimatedTime?: string;
  content?: string;
}

interface FormData {
  name: string;
  age: number | string;
  careerGoal: string;
  currentSkills: string[];
  interests: string[];
  assessmentAnswers: { [key: number]: string };
}

interface LearningPathResult {
  modules: (LearningModule | string)[];
  type: 'career' | 'topic';
}

const STEPS = [
  { label: 'Personal Info', description: 'Your basic details', icon: IconUser },
  { label: 'Career Goals', description: 'Your aspirations', icon: IconBriefcase },
  { label: 'Assessment', description: 'Discover your path', icon: IconBulb },
  { label: 'Skills', description: 'Customise your path', icon: IconSparkles },
];

export function GuidanceForm() {
  const [step, setStep] = useState(0);
  const { user } = useAuth();
  const { user: loggedInUser } = useLoggedInUser();
  const createLearningGuidance = useCreateLearningGuidance();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const primary6 = theme.colors[theme.primaryColor][6];

  const [formData, setFormData] = useState<FormData>({
    name: user?.displayName || '',
    age: '',
    careerGoal: '',
    currentSkills: [],
    interests: [],
    assessmentAnswers: {},
  });

  const [skillInput, setSkillInput] = useState('');
  const [interestInput, setInterestInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [learningPath, setLearningPath] = useState<LearningPathResult | null>(null);
  const [learningGuidanceId, setLearningGuidanceId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const prefilledGoal = sessionStorage.getItem('prefilledCareerGoal');
    if (prefilledGoal) {
      setFormData((prev) => ({ ...prev, careerGoal: prefilledGoal }));
      sessionStorage.removeItem('prefilledCareerGoal');
    }
  }, []);

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.currentSkills.includes(skillInput)) {
      setFormData((prev) => ({ ...prev, currentSkills: [...prev.currentSkills, skillInput.trim()] }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) =>
    setFormData((prev) => ({ ...prev, currentSkills: prev.currentSkills.filter((s) => s !== skill) }));

  const handleAddInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput)) {
      setFormData((prev) => ({ ...prev, interests: [...prev.interests, interestInput.trim()] }));
      setInterestInput('');
    }
  };

  const handleRemoveInterest = (interest: string) =>
    setFormData((prev) => ({ ...prev, interests: prev.interests.filter((i) => i !== interest) }));

  const handleGenerateLearningPath = async () => {
    if (!formData.careerGoal.trim()) { setError('Please enter your career goal'); return; }
    setLoading(true);
    setError(null);
    try {
      const payload: CreateLearningGuidanceRequest = {
        name: formData.name,
        age: Number(formData.age),
        career_goal: formData.careerGoal,
        current_skills: formData.currentSkills,
        interests: formData.interests,
        assessment_answers: formData.assessmentAnswers,
        user_id: loggedInUser?.id || 0,
      };
      const guidanceResponse = await createLearningGuidance.mutateAsync(payload);
      const guidanceId = guidanceResponse?.id;
      if (!guidanceId) throw new Error('Failed to create learning guidance');
      setLearningGuidanceId(guidanceId);

      const modules = await generateLearningPath(formData.careerGoal, {
        type: 'career',
        detailed: true,
        userData: {
          name: formData.name,
          age: Number(formData.age),
          careerGoal: formData.careerGoal,
          currentSkills: formData.currentSkills,
          interests: formData.interests,
          assessmentAnswers: formData.assessmentAnswers,
        },
      });
      setLearningPath({ modules, type: 'career' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate learning path');
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 = formData.name.trim() && formData.age && Number(formData.age) > 0;
  const canProceedStep2 = formData.careerGoal.trim().length > 10;
  const canProceedStep4 = Object.keys(formData.assessmentAnswers).length >= 5;

  const isNextDisabled =
    (step === 0 && !canProceedStep1) ||
    (step === 1 && !canProceedStep2);

  if (learningPath) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout title="Your Personalised Learning Path">
          <LearningPathResults
            modules={learningPath.modules}
            careerGoal={formData.careerGoal}
            learningGuidanceId={learningGuidanceId || 0}
            onBack={() => { setLearningPath(null); setStep(2); }}
          />
        </ListPageLayout>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Generating your path…"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Hang tight while we craft your personalised learning journey."
        >
          <motion.div initial="hidden" animate="visible" variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}>
            <Center py={80}>
              <Stack align="center" gap="md">
                <motion.div variants={pulseVariants} animate="animate">
                  <motion.div variants={spinnerVariants} animate="animate">
                    <Loader size="lg" color={theme.primaryColor} />
                  </motion.div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Text c="dimmed" size="sm">Generating your personalised learning path…</Text>
                </motion.div>
              </Stack>
            </Center>
          </motion.div>
        </ListPageLayout>
      </Container>
    );
  }

  return (
    <Container size="fluid" py="sm">
      <ListPageLayout
        title="Career Guidance"
        titleProps={{ fw: 700, size: 'h2' }}
      >
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Stack gap="xl">

            {/* Stepper + content */}
            <motion.div variants={stepContentVariants}>
              <Paper
                withBorder
                radius="xl"
                p="xl"
                style={{
                  borderColor: isDark ? theme.colors.gray[7] : theme.colors.gray[2],
                  backgroundColor: isDark ? theme.colors.dark[8] : theme.white,
                }}
              >
                <Stack gap="xl">
                  <Stepper
                    active={step}
                    onStepClick={setStep}
                    size="sm"
                    radius="md"
                    color={theme.primaryColor}
                    styles={{
                      stepLabel: { fontWeight: 600, fontSize: 13 },
                      stepDescription: { fontSize: 11 },
                    }}
                  >
                    {STEPS.map((s, i) => (
                      <Stepper.Step key={i} label={s.label} description={s.description} icon={<s.icon size={16} />}>
                        <Box pt="lg">
                          <AnimatePresence mode="wait">
                            <motion.div
                              key={`step-${i}`}
                              initial="hidden"
                              animate="visible"
                              exit="exit"
                              variants={stepContentVariants}
                            >
                              {i === 0 && (
                                <PersonalInfoStep
                                  name={formData.name}
                                  age={formData.age}
                                  onNameChange={(v) => setFormData((p) => ({ ...p, name: v }))}
                                  onAgeChange={(v) => setFormData((p) => ({ ...p, age: v || '' }))}
                                />
                              )}
                              {i === 1 && (
                                <CareerGoalStep
                                  careerGoal={formData.careerGoal}
                                  onCareerGoalChange={(v) => setFormData((p) => ({ ...p, careerGoal: v }))}
                                />
                              )}
                              {i === 2 && (
                                <ModernAssessmentStep
                                  answers={formData.assessmentAnswers}
                                  onAnswersChange={(a) => setFormData((p) => ({ ...p, assessmentAnswers: a }))}
                                />
                              )}
                              {i === 3 && (
                                <SkillsAndInterestsStep
                                  currentSkills={formData.currentSkills}
                                  interests={formData.interests}
                                  skillInput={skillInput}
                                  interestInput={interestInput}
                                  onSkillInputChange={setSkillInput}
                                  onInterestInputChange={setInterestInput}
                                  onAddSkill={handleAddSkill}
                                  onRemoveSkill={handleRemoveSkill}
                                  onAddInterest={handleAddInterest}
                                  onRemoveInterest={handleRemoveInterest}
                                />
                              )}
                            </motion.div>
                          </AnimatePresence>
                        </Box>
                      </Stepper.Step>
                    ))}
                  </Stepper>

                  {/* Error */}
                  <AnimatePresence>
                    {error && (
                      <motion.div variants={alertVariants} initial="hidden" animate="visible" exit="exit">
                        <Alert
                          icon={<IconAlertCircle size={16} />}
                          color="red"
                          radius="md"
                          withCloseButton
                          onClose={() => setError(null)}
                        >
                          {error}
                        </Alert>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Navigation */}
                  <Group justify="space-between" pt="sm"
                    style={{
                      borderTop: `1px solid ${isDark ? theme.colors.gray[8] : theme.colors.gray[1]}`,
                    }}
                  >
                    <Button
                      variant="default"
                      radius="md"
                      onClick={() => setStep(step - 1)}
                      disabled={step === 0}
                    >
                      Back
                    </Button>

                    {step === 3 ? (
                      <Button
                        radius="md"
                        color={theme.primaryColor}
                        onClick={handleGenerateLearningPath}
                        loading={loading}
                        rightSection={<IconSparkles size={16} />}
                        fw={600}
                      >
                        Generate Learning Path
                      </Button>
                    ) : (
                      <Button
                        radius="md"
                        color={theme.primaryColor}
                        onClick={() => setStep(step + 1)}
                        disabled={isNextDisabled}
                        fw={600}
                      >
                        Continue
                      </Button>
                    )}
                  </Group>
                </Stack>
              </Paper>
            </motion.div>
          </Stack>
        </motion.div>
      </ListPageLayout>
    </Container>
  );
}