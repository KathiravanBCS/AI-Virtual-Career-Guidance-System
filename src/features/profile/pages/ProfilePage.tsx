import { useState } from 'react';

import { Button, Container, Group, MultiSelect, Paper, Stack, Textarea, TextInput, Title } from '@mantine/core';

import { ProfileFormData, UserProfile } from '../types';

const INTERESTS = [
  { value: 'web-dev', label: 'Web Development' },
  { value: 'mobile', label: 'Mobile Development' },
  { value: 'data-science', label: 'Data Science' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'devops', label: 'DevOps' },
  { value: 'design', label: 'Design' },
];

const SKILLS = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'python', label: 'Python' },
  { value: 'react', label: 'React' },
  { value: 'nodejs', label: 'Node.js' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'sql', label: 'SQL' },
];

export const ProfilePage: React.FC = () => {
  const [formData, setFormData] = useState<ProfileFormData>({
    name: 'John Doe',
    email: 'john@example.com',
    careerGoal: 'Full Stack Developer',
    interests: ['web-dev'],
    skills: ['javascript', 'react'],
    bio: 'Passionate learner',
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock save - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setIsEditing(false);
    } catch (err) {
      console.error('Error saving profile:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container
      size="md"
      style={{
        background: 'linear-gradient(135deg, #1c1b1b 0%, #252525 100%)',
        minHeight: '100vh',
        borderRadius: '16px',
      }}
      py="xl"
    >
      <Stack gap="lg">
        {/* Header */}
        <Paper
          p="lg"
          style={{
            background: '#2a2a2a/70',
            border: '1px solid #3a3a3a',
            borderRadius: '16px',
          }}
        >
          <Group justify="space-between">
            <Title order={1} style={{ color: '#ff9d54' }}>
              Your Profile
            </Title>
            <Button
              onClick={() => setIsEditing(!isEditing)}
              variant={isEditing ? 'filled' : 'default'}
              style={{
                background: isEditing ? '#ff9d54' : '#3a3a3a',
                color: isEditing ? 'white' : '#ff9d54',
              }}
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </Button>
          </Group>
        </Paper>

        {/* Form */}
        <Paper
          p="lg"
          style={{
            background: '#2a2a2a/70',
            border: '1px solid #3a3a3a',
            borderRadius: '16px',
          }}
        >
          <Stack gap="md">
            <TextInput
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.currentTarget.value })}
              readOnly={!isEditing}
              disabled={!isEditing}
            />

            <TextInput
              label="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.currentTarget.value })}
              readOnly={!isEditing}
              disabled={!isEditing}
            />

            <TextInput
              label="Career Goal"
              value={formData.careerGoal}
              onChange={(e) => setFormData({ ...formData, careerGoal: e.currentTarget.value })}
              readOnly={!isEditing}
              disabled={!isEditing}
            />

            <MultiSelect
              label="Interests"
              data={INTERESTS}
              value={formData.interests}
              onChange={(val) => setFormData({ ...formData, interests: val })}
              disabled={!isEditing}
            />

            <MultiSelect
              label="Skills"
              data={SKILLS}
              value={formData.skills}
              onChange={(val) => setFormData({ ...formData, skills: val })}
              disabled={!isEditing}
            />

            <Textarea
              label="Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.currentTarget.value })}
              readOnly={!isEditing}
              disabled={!isEditing}
            />

            {isEditing && (
              <Button
                onClick={handleSave}
                loading={isSaving}
                style={{
                  background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
                  color: 'white',
                }}
                fullWidth
              >
                Save Changes
              </Button>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
};

export default ProfilePage;
