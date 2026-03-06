import { useState } from 'react';

import { Button, Checkbox, Container, Divider, Group, Paper, Select, Stack, Title } from '@mantine/core';

import { SettingsData } from '../types';

export const SettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SettingsData>({
    notifications: {
      email: true,
      push: false,
      dailyReminder: true,
    },
    theme: 'dark',
    language: 'en',
    privacy: {
      profilePublic: false,
      showInLeaderboard: true,
    },
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Mock save - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (err) {
      console.error('Error saving settings:', err);
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
          <Title order={1} style={{ color: '#ff9d54' }}>
            Settings
          </Title>
        </Paper>

        {/* Notifications */}
        <Paper
          p="lg"
          style={{
            background: '#2a2a2a/70',
            border: '1px solid #3a3a3a',
            borderRadius: '16px',
          }}
        >
          <Title order={3} style={{ color: '#ff9d54' }} mb="md">
            Notifications
          </Title>
          <Stack gap="sm">
            <Checkbox
              label="Email Notifications"
              checked={settings.notifications.email}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    email: e.currentTarget.checked,
                  },
                })
              }
            />
            <Checkbox
              label="Push Notifications"
              checked={settings.notifications.push}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    push: e.currentTarget.checked,
                  },
                })
              }
            />
            <Checkbox
              label="Daily Learning Reminder"
              checked={settings.notifications.dailyReminder}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  notifications: {
                    ...settings.notifications,
                    dailyReminder: e.currentTarget.checked,
                  },
                })
              }
            />
          </Stack>
        </Paper>

        {/* Preferences */}
        <Paper
          p="lg"
          style={{
            background: '#2a2a2a/70',
            border: '1px solid #3a3a3a',
            borderRadius: '16px',
          }}
        >
          <Title order={3} style={{ color: '#ff9d54' }} mb="md">
            Preferences
          </Title>
          <Stack gap="md">
            <Select
              label="Language"
              data={[
                { value: 'en', label: 'English' },
                { value: 'es', label: 'Spanish' },
                { value: 'fr', label: 'French' },
              ]}
              value={settings.language}
              onChange={(val) => setSettings({ ...settings, language: val || 'en' })}
            />
          </Stack>
        </Paper>

        {/* Privacy */}
        <Paper
          p="lg"
          style={{
            background: '#2a2a2a/70',
            border: '1px solid #3a3a3a',
            borderRadius: '16px',
          }}
        >
          <Title order={3} style={{ color: '#ff9d54' }} mb="md">
            Privacy
          </Title>
          <Stack gap="sm">
            <Checkbox
              label="Make profile public"
              checked={settings.privacy.profilePublic}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  privacy: {
                    ...settings.privacy,
                    profilePublic: e.currentTarget.checked,
                  },
                })
              }
            />
            <Checkbox
              label="Show in leaderboard"
              checked={settings.privacy.showInLeaderboard}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  privacy: {
                    ...settings.privacy,
                    showInLeaderboard: e.currentTarget.checked,
                  },
                })
              }
            />
          </Stack>
        </Paper>

        {/* Save Button */}
        <Button
          onClick={handleSave}
          loading={isSaving}
          style={{
            background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
            color: 'white',
          }}
          fullWidth
        >
          Save Settings
        </Button>
      </Stack>
    </Container>
  );
};

export default SettingsPage;
