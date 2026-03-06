import { Box, Button, Grid, NumberInput, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';

import { useCreateUserProfile, useUpdateUserProfile } from '../../api/userProfiles';
import type { UserProfile } from '../../types';

interface UserProfileTabProps {
  userId?: number;
  profile?: UserProfile;
}

export const UserProfileTab = ({ userId, profile }: UserProfileTabProps) => {
  const { mutate: createProfile, isPending: createLoading } = useCreateUserProfile();
  const { mutate: updateProfile, isPending: updateLoading } = useUpdateUserProfile(profile?.id);

  const isLoading = createLoading || updateLoading;

  const form = useForm({
    initialValues: {
      degree: profile?.degree || '',
      stream: profile?.stream || '',
      gpa: profile?.gpa || 0,
      college_name: profile?.college_name || '',
      graduation_year: profile?.graduation_year || new Date().getFullYear(),
      years_of_experience: profile?.years_of_experience || 0,
      bio: profile?.bio || '',
      resume_url: profile?.resume_url || '',
      personality_type: profile?.personality_type || '',
      personality_score: profile?.personality_score || 0,
      career_goal: profile?.career_goal || '',
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    if (profile?.id) {
      updateProfile({ id: profile.id, ...values });
    } else if (userId) {
      createProfile({ user_id: userId, ...values });
    }
  });

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Box>
          <Text fw={600} mb="md">
            User Profile
          </Text>
          <Text size="sm" color="dimmed" mb="lg">
            Educational and professional background information
          </Text>
        </Box>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Degree" placeholder="e.g., Bachelor of Technology" {...form.getInputProps('degree')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Stream/Branch" placeholder="e.g., Computer Science" {...form.getInputProps('stream')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="GPA"
              placeholder="Enter GPA"
              min={0}
              max={10}
              step={0.1}
              {...form.getInputProps('gpa')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="College Name" placeholder="Enter college name" {...form.getInputProps('college_name')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Graduation Year"
              placeholder="Enter graduation year"
              min={1900}
              max={2100}
              {...form.getInputProps('graduation_year')}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Years of Experience"
              placeholder="Enter years of experience"
              min={0}
              {...form.getInputProps('years_of_experience')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Personality Type" placeholder="e.g., INTJ" {...form.getInputProps('personality_type')} />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <NumberInput
              label="Personality Score"
              placeholder="Enter personality score"
              min={0}
              {...form.getInputProps('personality_score')}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <Textarea label="Bio" placeholder="Enter your bio" rows={3} {...form.getInputProps('bio')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <TextInput label="Resume URL" placeholder="Enter resume URL" {...form.getInputProps('resume_url')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <Textarea
              label="Career Goal"
              placeholder="Enter your career goal"
              rows={3}
              {...form.getInputProps('career_goal')}
            />
          </Grid.Col>
        </Grid>

        <Box display="flex" style={{ justifyContent: 'flex-end', gap: '16px' }}>
          <Button type="submit" loading={isLoading}>
            Save Profile
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default UserProfileTab;
