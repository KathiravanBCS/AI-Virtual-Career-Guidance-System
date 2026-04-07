import { useState } from 'react';

import { Alert, Button, Group, Loader, Modal, Stack, Text, Textarea, useMantineTheme } from '@mantine/core';
import { IconAlertCircle, IconSparkles } from '@tabler/icons-react';

import {
  generateCustomSectionContent,
  generateProfileObjective,
  generateProfessionalSummary,
  generateProjectDescriptions,
  generateSkillsList,
  generateWorkExperienceDescriptions,
  RESUME_AI_PROMPTS,
  type ResumeAIContext,
  type ResumeFieldType,
} from '@/config/resume-ai.config';

// ==================== TYPES ====================

interface ResumeAIModalProps {
  /** Whether the modal is open */
  opened: boolean;
  /** Close callback */
  onClose: () => void;
  /** Which resume field type to generate content for */
  fieldType: ResumeFieldType;
  /** Optional contextual data (job title, company, project name, etc.) */
  context?: ResumeAIContext;
  /**
   * Called with the generated content when the user clicks "Apply".
   * Receives a string for single-value fields (objective, summary)
   * or string[] for bullet-point fields (work exp, projects, skills, custom).
   */
  onApply: (content: string | string[]) => void;
}

// ==================== COMPONENT ====================

export const ResumeAIModal = ({ opened, onClose, fieldType, context, onApply }: ResumeAIModalProps) => {
  const theme = useMantineTheme();
  const [userInput, setUserInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const promptConfig = RESUME_AI_PROMPTS[fieldType];

  const handleGenerate = async () => {
    if (!userInput.trim()) {
      setError('Please provide some input before generating.');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      let result: string | string[];

      switch (fieldType) {
        case 'profileObjective':
          result = await generateProfileObjective(userInput);
          break;

        case 'professionalSummary':
          result = await generateProfessionalSummary(userInput, context?.existingContent);
          break;

        case 'workExperience':
          result = await generateWorkExperienceDescriptions(userInput, context?.jobTitle, context?.company);
          break;

        case 'project':
          result = await generateProjectDescriptions(userInput, context?.projectName);
          break;

        case 'skills':
          result = await generateSkillsList(userInput);
          break;

        case 'custom':
          result = await generateCustomSectionContent(userInput, context?.sectionTitle);
          break;

        default:
          result = [];
      }

      onApply(result);
      setUserInput('');
      onClose();
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      setError(
        msg.includes('GROQ_API_KEY') || msg.includes('401')
          ? 'API key is missing or invalid. Check VITE_GROQ_API_KEY in your .env file.'
          : 'Failed to generate content. Please try again.'
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    if (isGenerating) return;
    setUserInput('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Group gap="xs">
          <IconSparkles size={18} color={theme.colors[theme.primaryColor][5]} />
          <Text fw={600} size="md">
            {promptConfig.modalTitle}
          </Text>
        </Group>
      }
      size="lg"
      centered
      closeOnClickOutside={!isGenerating}
      closeOnEscape={!isGenerating}
    >
      <Stack gap="md">
        {/* Description */}
        <Text size="sm" c="dimmed">
          {promptConfig.description}
        </Text>

        {/* Error alert */}
        {error && (
          <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" radius="md">
            {error}
          </Alert>
        )}

        {/* User input */}
        <Textarea
          label={promptConfig.inputLabel}
          placeholder={promptConfig.inputPlaceholder}
          minRows={5}
          autosize
          maxRows={12}
          value={userInput}
          onChange={(e) => {
            setUserInput(e.currentTarget.value);
            if (error) setError(null);
          }}
          disabled={isGenerating}
        />

        {/* Actions */}
        <Group justify="flex-end" gap="sm">
          <Button variant="subtle" color="gray" onClick={handleClose} disabled={isGenerating}>
            Cancel
          </Button>

          <Button
            leftSection={
              isGenerating ? (
                <Loader size={14} color="white" type="dots" />
              ) : (
                <IconSparkles size={16} />
              )
            }
            onClick={handleGenerate}
            disabled={isGenerating || !userInput.trim()}
            variant="gradient"
            gradient={{ from: 'violet', to: 'blue', deg: 135 }}
          >
            {isGenerating ? 'Generating…' : 'Generate with AI'}
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
