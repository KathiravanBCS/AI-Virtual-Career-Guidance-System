import { useEffect, useState } from 'react';

import { Alert, Button, Center, Container, Group, Loader, Stack, Stepper, Text } from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { LearningPathResults } from '@/features/learningModules/components/LearningPathResults';
import { useAuth } from '@/lib/auth/useAuth';
import { useLoggedInUser } from '@/lib/auth/useLoggedInUser';

import { generateLearningPath } from '../../../config/groq.config';
import {
  alertVariants,
  containerVariants,
  loadingVariants,
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

export function GuidanceForm() {
   const [step, setStep] = useState(0);
   const { user } = useAuth();
   const { user: loggedInUser } = useLoggedInUser();
   const createLearningGuidance = useCreateLearningGuidance();
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

   // Auto-fill career goal from sessionStorage if available
   useEffect(() => {
     const prefilledGoal = sessionStorage.getItem('prefilledCareerGoal');
     if (prefilledGoal) {
       setFormData((prev) => ({
         ...prev,
         careerGoal: prefilledGoal,
       }));
       // Clear the sessionStorage after reading
       sessionStorage.removeItem('prefilledCareerGoal');
     }
   }, []);

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.currentSkills.includes(skillInput)) {
      setFormData((prev) => ({
        ...prev,
        currentSkills: [...prev.currentSkills, skillInput.trim()],
      }));
      setSkillInput('');
    }
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData((prev) => ({
      ...prev,
      currentSkills: prev.currentSkills.filter((s) => s !== skill),
    }));
  };

  const handleAddInterest = () => {
    if (interestInput.trim() && !formData.interests.includes(interestInput)) {
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

  const handleGenerateLearningPath = async () => {
    if (!formData.careerGoal.trim()) {
      setError('Please enter your career goal');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Prepare payload for API
      const payload: CreateLearningGuidanceRequest = {
        name: formData.name,
        age: Number(formData.age),
        career_goal: formData.careerGoal,
        current_skills: formData.currentSkills,
        interests: formData.interests,
        assessment_answers: formData.assessmentAnswers,
        user_id: loggedInUser?.id || 0,
      };

      // Submit form data to API and get the response with guidance ID
      const guidanceResponse = await createLearningGuidance.mutateAsync(payload);
      const guidanceId = guidanceResponse?.id;

      if (!guidanceId) {
        console.error('Invalid guidance response:', guidanceResponse);
        throw new Error('Failed to create learning guidance');
      }

      // Store the guidance ID for later use
      setLearningGuidanceId(guidanceId);

      // Generate learning path
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

      setLearningPath({
        modules,
        type: 'career',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate learning path');
      console.error('Error generating learning path:', err);
    } finally {
      setLoading(false);
    }
  };

  const canProceedStep1 = formData.name.trim() && formData.age && Number(formData.age) > 0;
  const canProceedStep2 = formData.careerGoal.trim().length > 10;
  const canProceedStep3 = true; // Skills & Interests is optional
  const canProceedStep4 = Object.keys(formData.assessmentAnswers).length >= 5; // At least 5 answers required

  if (learningPath) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Your Personalized Learning Path"
          // description={
          //   <Text>
          //     Based on your career goal: <span style={{ fontWeight: 600 }}>{formData.careerGoal}</span>
          //   </Text>
          // }
        >
          <LearningPathResults
            modules={learningPath.modules}
            careerGoal={formData.careerGoal}
            learningGuidanceId={learningGuidanceId || 0}
            onBack={() => {
              setLearningPath(null);
              setStep(2);
            }}
          />
        </ListPageLayout>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container size="fluid" py="sm">
        <ListPageLayout
          title="Generating Learning Path"
          titleProps={{ fw: 700, size: 'h2' }}
          description="Please wait while we create your personalized learning path..."
        >
          <motion.div initial="hidden" animate="visible" variants={loadingVariants}>
            <Center py="xl">
              <Stack align="center" gap="md">
                <motion.div variants={pulseVariants} animate="animate">
                  <motion.div variants={spinnerVariants} animate="animate">
                    <Loader size="lg" />
                  </motion.div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Text>Generating your personalized learning path...</Text>
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
        description="Let's create a personalized learning path for your career goals"
      >
        <motion.div initial="hidden" animate="visible" variants={containerVariants}>
          <Stack gap="lg">
            <motion.div variants={stepContentVariants}>
              <Alert icon={<IconAlertCircle size={16} />} variant="light" radius="md" mb="lg">
                <Text size="sm">Help us understand your goals. We'll create a personalized learning path for you.</Text>
              </Alert>
            </motion.div>

            <motion.div variants={stepContentVariants}>
              <Stepper active={step} onStepClick={setStep} size="lg">
                <Stepper.Step label="Personal Info" description="Your basic details">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="step-0"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={stepContentVariants}
                    >
                      <PersonalInfoStep
                        name={formData.name}
                        age={formData.age}
                        onNameChange={(value) => setFormData((prev) => ({ ...prev, name: value }))}
                        onAgeChange={(value) => setFormData((prev) => ({ ...prev, age: value || '' }))}
                      />
                    </motion.div>
                  </AnimatePresence>
                </Stepper.Step>

                <Stepper.Step label="Career Goals" description="Your aspirations">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="step-1"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={stepContentVariants}
                    >
                      <CareerGoalStep
                        careerGoal={formData.careerGoal}
                        onCareerGoalChange={(value) => setFormData((prev) => ({ ...prev, careerGoal: value }))}
                      />
                    </motion.div>
                  </AnimatePresence>
                </Stepper.Step>

                <Stepper.Step label="Career Assessment" description="Discover your path">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="step-2"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={stepContentVariants}
                    >
                      <ModernAssessmentStep
                        answers={formData.assessmentAnswers}
                        onAnswersChange={(answers) => setFormData((prev) => ({ ...prev, assessmentAnswers: answers }))}
                      />
                    </motion.div>
                  </AnimatePresence>
                </Stepper.Step>

                <Stepper.Step label="Skills & Interests" description="Customize your path">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key="step-3"
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={stepContentVariants}
                    >
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
                    </motion.div>
                  </AnimatePresence>
                </Stepper.Step>
              </Stepper>
            </motion.div>

            <AnimatePresence>
              {error && (
                <motion.div variants={alertVariants} initial="hidden" animate="visible" exit="exit">
                  <Alert
                    icon={<IconAlertCircle size={16} />}
                    color="red"
                    mb="lg"
                    withCloseButton
                    onClose={() => setError(null)}
                  >
                    {error}
                  </Alert>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={stepContentVariants}>
              <Group justify="space-between" mt="lg">
                <Button variant="default" onClick={() => setStep(step - 1)} disabled={step === 0}>
                  Back
                </Button>

                {step === 3 ? (
                  <Button onClick={handleGenerateLearningPath} loading={loading}>
                    Generate Learning Path
                  </Button>
                ) : (
                  <Button
                    onClick={() => setStep(step + 1)}
                    disabled={(step === 0 && !canProceedStep1) || (step === 1 && !canProceedStep2)}
                  >
                    Next
                  </Button>
                )}
              </Group>
            </motion.div>
          </Stack>
        </motion.div>
      </ListPageLayout>
    </Container>
  );
}
