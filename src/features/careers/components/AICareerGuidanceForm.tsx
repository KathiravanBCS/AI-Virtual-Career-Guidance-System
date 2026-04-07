import { useState } from 'react';

import {
  ActionIcon,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowRight,
  IconBrain,
  IconBriefcase,
  IconBulb,
  IconCircleCheck,
  IconInfoCircle,
  IconPlus,
  IconSparkles,
  IconStarFilled,
  IconTargetArrow,
  IconTool,
  IconX,
} from '@tabler/icons-react';

import { useGenerateAICareerGuidance } from '../api/useAICareerGuidance';
import type { UserInterests } from '../types';
import { CareerGuidanceResults } from './CareerGuidanceResults';

interface FormData {
  interests: string[];
  skills: string[];
  experience: string;
  goals: string;
}

const SUGGESTED_INTERESTS = ['Technology', 'Design', 'Finance', 'Healthcare', 'Education', 'Marketing'];
const SUGGESTED_SKILLS = ['Python', 'Leadership', 'Data Analysis', 'Communication', 'Project Management'];

/* ─────────────────────────────────────────────────────────────────────────────
   TagInput card
───────────────────────────────────────────────────────────────────────────── */
function TagInput({
  label,
  description,
  icon,
  placeholder,
  tags,
  inputValue,
  suggestions,
  onInputChange,
  onAdd,
  onRemove,
  accentColor,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  placeholder: string;
  tags: string[];
  inputValue: string;
  suggestions: string[];
  onInputChange: (val: string) => void;
  onAdd: (val?: string) => void;
  onRemove: (tag: string) => void;
  accentColor: string;
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const unusedSuggestions = suggestions.filter((s) => !tags.includes(s));

  return (
    <Paper
      p="xl"
      radius="xl"
      style={{
        background: isDark
          ? `${theme.colors[theme.primaryColor][8]}18`
          : theme.colors[theme.primaryColor][0],
        border: `1.5px solid ${
          isDark
            ? `${theme.colors[theme.primaryColor][7]}50`
            : theme.colors[theme.primaryColor][2]
        }`,
        height: '100%',
      }}
    >
      <Stack gap="md" h="100%">
        {/* Header */}
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <ThemeIcon
              size={44}
              radius="xl"
              variant="light"
              color={accentColor}
              style={{
                background: isDark
                  ? `${theme.colors[accentColor][8]}40`
                  : theme.colors[accentColor][1],
              }}
            >
              {icon}
            </ThemeIcon>
            <div>
              <Text fw={700} size="md">
                {label}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {description}
              </Text>
            </div>
          </Group>
          {tags.length > 0 && (
            <Badge
              size="sm"
              radius="xl"
              variant="dot"
              color={accentColor}
              style={{
                background: isDark
                  ? `${theme.colors[accentColor][8]}30`
                  : theme.colors[accentColor][0],
                borderColor: theme.colors[accentColor][4],
              }}
            >
              {tags.length} Added
            </Badge>
          )}
        </Group>

        {/* Input */}
        <Group gap="xs">
          <TextInput
            placeholder={placeholder}
            value={inputValue}
            onChange={(e) => onInputChange(e.currentTarget.value ?? '')}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onAdd();
              }
            }}
            radius="xl"
            size="md"
            style={{ flex: 1 }}
            styles={{
              input: {
                background: isDark
                  ? `${theme.colors[theme.primaryColor][9]}60`
                  : 'white',
                borderColor: isDark
                  ? `${theme.colors[theme.primaryColor][7]}40`
                  : theme.colors[theme.primaryColor][2],
              },
            }}
          />
          <Button
            onClick={() => onAdd()}
            radius="xl"
            size="md"
            color={accentColor}
            disabled={!inputValue.trim()}
            leftSection={<IconPlus size={15} />}
            style={{
              background: inputValue.trim()
                ? `linear-gradient(135deg, ${theme.colors[accentColor][6]}, ${theme.colors[accentColor][4]})`
                : undefined,
              fontWeight: 600,
            }}
          >
            Add
          </Button>
        </Group>

        {/* Quick suggestions */}
        {unusedSuggestions.length > 0 && (
          <Box>
            <Text size="xs" c="dimmed" fw={600} mb={6} tt="uppercase" style={{ letterSpacing: 0.5 }}>
              Quick add
            </Text>
            <Group gap="xs" wrap="wrap">
              {unusedSuggestions.map((s) => (
                <Badge
                  key={s}
                  size="sm"
                  radius="xl"
                  variant="outline"
                  color={accentColor}
                  style={{
                    cursor: 'pointer',
                    borderColor: theme.colors[accentColor][isDark ? 6 : 3],
                    color: theme.colors[accentColor][isDark ? 4 : 6],
                  }}
                  leftSection={<IconPlus size={10} />}
                  onClick={() => onAdd(s)}
                >
                  {s}
                </Badge>
              ))}
            </Group>
          </Box>
        )}

        {/* Tags */}
        {tags.length > 0 && (
          <>
            <Divider
              style={{
                borderColor: isDark
                  ? `${theme.colors[theme.primaryColor][7]}30`
                  : theme.colors[theme.primaryColor][2],
              }}
            />
            <Group gap="xs" wrap="wrap">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  size="lg"
                  radius="xl"
                  variant="filled"
                  color={accentColor}
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors[accentColor][6]}, ${theme.colors[accentColor][5]})`,
                    paddingRight: 6,
                  }}
                  rightSection={
                    <ActionIcon
                      size={16}
                      radius="xl"
                      variant="transparent"
                      onClick={() => onRemove(tag)}
                      style={{ color: 'rgba(255,255,255,0.85)' }}
                    >
                      <IconX size={10} />
                    </ActionIcon>
                  }
                >
                  {tag}
                </Badge>
              ))}
            </Group>
          </>
        )}

        {tags.length === 0 && (
          <Text size="xs" c="dimmed" style={{ fontStyle: 'italic', marginTop: 'auto' }}>
            Nothing added yet — type above or use quick add
          </Text>
        )}
      </Stack>
    </Paper>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   TextareaCard
───────────────────────────────────────────────────────────────────────────── */
function TextareaCard({
  label,
  description,
  icon,
  placeholder,
  value,
  onChange,
  accentColor,
  filled,
}: {
  label: string;
  description: string;
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (val: string) => void;
  accentColor: string;
  filled: boolean;
}) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Paper
      p="xl"
      radius="xl"
      style={{
        background: isDark
          ? `${theme.colors[theme.primaryColor][8]}18`
          : theme.colors[theme.primaryColor][0],
        border: `1.5px solid ${
          isDark
            ? `${theme.colors[theme.primaryColor][7]}50`
            : theme.colors[theme.primaryColor][2]
        }`,
        height: '100%',
      }}
    >
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="flex-start">
          <Group gap="sm">
            <ThemeIcon
              size={44}
              radius="xl"
              variant="light"
              color={accentColor}
              style={{
                background: isDark
                  ? `${theme.colors[accentColor][8]}40`
                  : theme.colors[accentColor][1],
              }}
            >
              {icon}
            </ThemeIcon>
            <div>
              <Text fw={700} size="md">
                {label}
              </Text>
              <Text size="xs" c="dimmed" mt={2}>
                {description}
              </Text>
            </div>
          </Group>
          {filled && (
            <ThemeIcon
              size={26}
              radius="xl"
              color="green"
              variant="light"
              style={{
                background: isDark ? `${theme.colors.green[8]}30` : theme.colors.green[0],
              }}
            >
              <IconCircleCheck size={15} />
            </ThemeIcon>
          )}
        </Group>

        <Textarea
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e?.currentTarget?.value ?? '')}
          minRows={5}
          radius="xl"
          autosize
          styles={{
            input: {
              background: isDark
                ? `${theme.colors[theme.primaryColor][9]}60`
                : 'white',
              borderColor: isDark
                ? `${theme.colors[theme.primaryColor][7]}40`
                : theme.colors[theme.primaryColor][2],
            },
          }}
        />
      </Stack>
    </Paper>
  );
}

/* ─────────────────────────────────────────────────────────────────────────────
   Main Form
───────────────────────────────────────────────────────────────────────────── */
export function AICareerGuidanceForm() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

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

  const handleAddInterest = (val?: string) => {
    const v = (val ?? interestInput).trim();
    if (v && !formData.interests.includes(v))
      setFormData((prev) => ({ ...prev, interests: [...prev.interests, v] }));
    setInterestInput('');
  };

  const handleRemoveInterest = (interest: string) =>
    setFormData((prev) => ({ ...prev, interests: prev.interests.filter((i) => i !== interest) }));

  const handleAddSkill = (val?: string) => {
    const v = (val ?? skillInput).trim();
    if (v && !formData.skills.includes(v))
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, v] }));
    setSkillInput('');
  };

  const handleRemoveSkill = (skill: string) =>
    setFormData((prev) => ({ ...prev, skills: prev.skills.filter((s) => s !== skill) }));

  const handleSubmit = () => {
    if (formData.interests.length === 0) return;
    const payload: UserInterests = {
      interests: formData.interests,
      skills: formData.skills.length > 0 ? formData.skills : undefined,
      experience: formData.experience || undefined,
      goals: formData.goals || undefined,
    };
    mutate(payload, { onSuccess: () => setStep('results') });
  };

  const handleReset = () => {
    setStep('input');
    setFormData({ interests: [], skills: [], experience: '', goals: '' });
    setInterestInput('');
    setSkillInput('');
  };

  if (step === 'results' && data) {
    return <CareerGuidanceResults data={data} onReset={handleReset} />;
  }

  const filledSections = [
    formData.interests.length > 0,
    formData.skills.length > 0,
    formData.experience.trim().length > 0,
    formData.goals.trim().length > 0,
  ].filter(Boolean).length;

  const primary = theme.primaryColor;

  const heroGradient = `linear-gradient(135deg,
    ${theme.colors[primary][7]} 0%,
    ${theme.colors[primary][5]} 55%,
    ${theme.colors.cyan[5]} 100%)`;

  const tipItems = [
    { text: 'Add at least one interest for personalised recommendations', color: primary },
    { text: 'Include current skills for accurate career path matching', color: 'teal' },
    { text: 'Share your experience for better role alignment', color: 'blue' },
    { text: 'Set clear goals to unlock roadmap suggestions', color: 'orange' },
  ];

  return (
    <Box px="xl" py="lg" w="100%">
      <Stack gap="xl">

        {/* ── Hero Header ── */}
        <Paper
          p={0}
          radius="xl"
          style={{ overflow: 'hidden', background: heroGradient, position: 'relative' }}
        >
          {[
            { w: 320, h: 320, top: -100, right: -60, opacity: 0.07 },
            { w: 200, h: 200, bottom: -70, left: 60, opacity: 0.05 },
          ].map((b, i) => (
            <Box
              key={i}
              style={{
                position: 'absolute',
                width: b.w,
                height: b.h,
                borderRadius: '50%',
                background: 'white',
                top: b.top,
                bottom: b.bottom,
                right: b.right,
                left: b.left,
                opacity: b.opacity,
                pointerEvents: 'none',
              }}
            />
          ))}

          <Box p="xl" style={{ position: 'relative', zIndex: 1 }}>
            <Group justify="space-between" align="center" wrap="wrap" gap="md">
              <Group gap="md">
                <ThemeIcon
                  size={62}
                  radius="xl"
                  style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(10px)' }}
                >
                  <IconBrain size={34} color="white" />
                </ThemeIcon>
                <div>
                  <Title order={2} c="white" fw={800} style={{ letterSpacing: -0.5 }}>
                    AI Career Guidance
                  </Title>
                  <Text c="rgba(255,255,255,0.8)" size="sm" mt={4}>
                    Discover your ideal career path based on your interests, skills &amp; goals
                  </Text>
                </div>
              </Group>

              {/* Progress pill */}
              <Paper
                px="lg"
                py="sm"
                radius="xl"
                style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)' }}
              >
                <Group gap="sm">
                  <Text c="white" size="sm" fw={700}>Profile</Text>
                  <Group gap={6}>
                    {[0, 1, 2, 3].map((i) => (
                      <Box
                        key={i}
                        style={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          background: i < filledSections ? 'white' : 'rgba(255,255,255,0.3)',
                          transition: 'background 0.3s ease',
                          boxShadow: i < filledSections ? '0 0 8px rgba(255,255,255,0.7)' : 'none',
                        }}
                      />
                    ))}
                  </Group>
                  <Text c="rgba(255,255,255,0.85)" size="sm" fw={600}>{filledSections}/4</Text>
                </Group>
              </Paper>
            </Group>
          </Box>
        </Paper>

        {/* ── Row 1: Interests + Skills ── */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: theme.spacing.lg,
          }}
        >
          <TagInput
            label="Your Interests"
            description="What are you passionate about?"
            icon={<IconBulb size={20} />}
            placeholder="e.g. Technology, Design, Finance…"
            tags={formData.interests}
            inputValue={interestInput}
            suggestions={SUGGESTED_INTERESTS}
            onInputChange={setInterestInput}
            onAdd={handleAddInterest}
            onRemove={handleRemoveInterest}
            accentColor={primary}
          />

          <TagInput
            label="Current Skills"
            description="What do you already bring to the table?"
            icon={<IconTool size={20} />}
            placeholder="e.g. Python, Leadership…"
            tags={formData.skills}
            inputValue={skillInput}
            suggestions={SUGGESTED_SKILLS}
            onInputChange={setSkillInput}
            onAdd={handleAddSkill}
            onRemove={handleRemoveSkill}
            accentColor="teal"
          />
        </Box>

        {/* ── Row 2: Experience + Goals ── */}
        <Box
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: theme.spacing.lg,
          }}
        >
          <TextareaCard
            label="Experience"
            description="Describe your professional background (optional)"
            icon={<IconBriefcase size={20} />}
            placeholder="e.g. 3 years as a software developer, worked in startups and enterprises…"
            value={formData.experience}
            onChange={(val) => setFormData((prev) => ({ ...prev, experience: val }))}
            accentColor="blue"
            filled={formData.experience.trim().length > 0}
          />

          <TextareaCard
            label="Career Goals"
            description="What are your aspirations? (optional)"
            icon={<IconTargetArrow size={20} />}
            placeholder="e.g. Transition to AI/ML, become a technical leader, start own startup…"
            value={formData.goals}
            onChange={(val) => setFormData((prev) => ({ ...prev, goals: val }))}
            accentColor="orange"
            filled={formData.goals.trim().length > 0}
          />
        </Box>

        {/* ── Submit Bar ── */}
        <Paper
          p="lg"
          radius="xl"
          style={{
            background: isDark
              ? `${theme.colors[primary][8]}25`
              : theme.colors[primary][0],
            border: `1.5px solid ${
              isDark
                ? `${theme.colors[primary][7]}40`
                : theme.colors[primary][2]
            }`,
          }}
        >
          <Group justify="space-between" align="center" wrap="wrap" gap="md">
            <Group gap="xs" wrap="wrap">
              {formData.interests.length === 0 ? (
                <Group gap={6}>
                  <IconInfoCircle size={14} color={theme.colors.gray[5]} />
                  <Text size="xs" c="dimmed">Add at least one interest to continue</Text>
                </Group>
              ) : (
                <Badge
                  size="md"
                  radius="xl"
                  variant="light"
                  color={primary}
                  leftSection={<IconBulb size={12} />}
                  style={{
                    background: isDark
                      ? `${theme.colors[primary][8]}40`
                      : theme.colors[primary][1],
                  }}
                >
                  {formData.interests.length} Interest{formData.interests.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {formData.skills.length > 0 && (
                <Badge
                  size="md"
                  radius="xl"
                  variant="light"
                  color="teal"
                  leftSection={<IconTool size={12} />}
                  style={{
                    background: isDark ? `${theme.colors.teal[8]}40` : theme.colors.teal[0],
                  }}
                >
                  {formData.skills.length} Skill{formData.skills.length !== 1 ? 's' : ''}
                </Badge>
              )}
              {formData.experience && (
                <Badge
                  size="md"
                  radius="xl"
                  variant="light"
                  color="blue"
                  style={{
                    background: isDark ? `${theme.colors.blue[8]}40` : theme.colors.blue[0],
                  }}
                >
                  Experience added
                </Badge>
              )}
              {formData.goals && (
                <Badge
                  size="md"
                  radius="xl"
                  variant="light"
                  color="orange"
                  style={{
                    background: isDark ? `${theme.colors.orange[8]}40` : theme.colors.orange[0],
                  }}
                >
                  Goals added
                </Badge>
              )}
            </Group>

            <Button
              size="md"
              radius="xl"
              onClick={handleSubmit}
              disabled={formData.interests.length === 0 || isPending}
              loading={isPending}
              leftSection={<IconSparkles size={16} />}
              rightSection={!isPending ? <IconArrowRight size={16} /> : null}
              style={{
                background:
                  formData.interests.length === 0
                    ? undefined
                    : heroGradient,
                fontWeight: 700,
                letterSpacing: 0.3,
                minWidth: 220,
                boxShadow:
                  formData.interests.length > 0
                    ? `0 4px 20px ${theme.colors[primary][5]}60`
                    : 'none',
              }}
            >
              {isPending ? 'Analysing your profile…' : 'Generate Guidance'}
            </Button>
          </Group>
        </Paper>

        {/* ── Tips ── */}
        <Paper
          p="lg"
          radius="xl"
          style={{
            background: isDark
              ? `${theme.colors[primary][8]}15`
              : theme.colors[primary][0],
            border: `1.5px solid ${
              isDark
                ? `${theme.colors[primary][7]}30`
                : theme.colors[primary][1]
            }`,
          }}
        >
          <Group gap="sm" mb="md">
            <ThemeIcon
              size={30}
              radius="lg"
              variant="light"
              color={primary}
              style={{
                background: isDark
                  ? `${theme.colors[primary][8]}40`
                  : theme.colors[primary][1],
              }}
            >
              <IconStarFilled size={14} />
            </ThemeIcon>
            <Text fw={700} size="sm">Tips for best results</Text>
          </Group>

          <Box
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: theme.spacing.sm,
            }}
          >
            {tipItems.map((tip, i) => (
              <Group
                key={i}
                gap={8}
                align="flex-start"
                p="sm"
                style={{
                  borderRadius: theme.radius.lg,
                  background: isDark
                    ? `${theme.colors[tip.color][8]}20`
                    : theme.colors[tip.color][0],
                  border: `1px solid ${
                    isDark
                      ? `${theme.colors[tip.color][7]}30`
                      : theme.colors[tip.color][1]
                  }`,
                }}
              >
                <ThemeIcon
                  size={20}
                  radius="xl"
                  color={tip.color}
                  variant="light"
                  mt={1}
                  style={{
                    background: isDark
                      ? `${theme.colors[tip.color][7]}35`
                      : theme.colors[tip.color][1],
                    flexShrink: 0,
                  }}
                >
                  <IconCircleCheck size={12} />
                </ThemeIcon>
                <Text size="xs" c="dimmed" style={{ lineHeight: 1.5, flex: 1 }}>
                  {tip.text}
                </Text>
              </Group>
            ))}
          </Box>
        </Paper>

      </Stack>
    </Box>
  );
}