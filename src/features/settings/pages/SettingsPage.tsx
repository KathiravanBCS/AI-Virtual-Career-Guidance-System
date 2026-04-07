import { useState } from 'react';

import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  Group,
  Select,
  Stack,
  Switch,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconBell,
  IconCheck,
  IconDeviceDesktop,
  IconGlobe,
  IconLanguage,
  IconLock,
  IconMail,
  IconSettings,
  IconShield,
  IconSun,
  IconMoon,
  IconUsers,
  IconTrophy,
  IconDeviceMobile,
  IconClockHour4,
} from '@tabler/icons-react';
import { motion } from 'framer-motion';

import { SettingsData } from '../types';

// ─── Section Card ─────────────────────────────────────────────────────────────
interface SectionCardProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
  delay?: number;
  primaryHex: string;
  isDark: boolean;
}

const SectionCard: React.FC<SectionCardProps> = ({
  icon: Icon,
  title,
  children,
  delay = 0,
  primaryHex,
  isDark,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <Box
        style={{
          background: isDark ? 'rgba(255,255,255,0.03)' : '#ffffff',
          border: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : '#ebebeb'}`,
          borderRadius: '14px',
          overflow: 'hidden',
        }}
      >
        {/* Section header */}
        <Group
          gap="sm"
          px="lg"
          py="md"
          style={{
            borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.06)' : '#f0f0f0'}`,
            background: isDark ? 'rgba(255,255,255,0.02)' : `${primaryHex}08`,
          }}
        >
          <ThemeIcon
            size={32}
            radius="md"
            style={{
              background: `${primaryHex}18`,
              color: primaryHex,
            }}
          >
            <Icon size={16} />
          </ThemeIcon>
          <Text fw={700} size="sm" style={{ letterSpacing: '-0.01em' }}>
            {title}
          </Text>
        </Group>

        {/* Content */}
        <Box px="lg" py="md">
          {children}
        </Box>
      </Box>
    </motion.div>
  );
};

// ─── Setting Row ──────────────────────────────────────────────────────────────
interface SettingRowProps {
  icon: React.ElementType;
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  primaryHex: string;
  isDark: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
  primaryHex,
  isDark,
}) => {
  return (
    <Group justify="space-between" align="center" wrap="nowrap">
      <Group gap="sm" style={{ flex: 1, minWidth: 0 }}>
        <ThemeIcon
          size={30}
          radius="sm"
          style={{
            background: isDark ? 'rgba(255,255,255,0.06)' : '#f5f5f5',
            color: isDark ? '#aaa' : '#666',
            flexShrink: 0,
          }}
        >
          <Icon size={15} />
        </ThemeIcon>
        <div style={{ minWidth: 0 }}>
          <Text size="sm" fw={500} style={{ lineHeight: 1.3 }}>
            {label}
          </Text>
          {description && (
            <Text size="xs" c="dimmed" mt={1}>
              {description}
            </Text>
          )}
        </div>
      </Group>
      <Switch
        checked={checked}
        onChange={(e) => onChange(e.currentTarget.checked)}
        color={primaryHex}
        size="sm"
        styles={{
          thumb: { cursor: 'pointer' },
          track: {
            cursor: 'pointer',
            background: checked ? `${primaryHex}` : undefined,
          },
        }}
      />
    </Group>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export const SettingsPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  const primary = theme.colors[theme.primaryColor];
  const primaryHex = primary?.[6] ?? '#ff9d54';

  const [settings, setSettings] = useState<SettingsData>({
    notifications: { email: true, push: false, dailyReminder: true },
    theme: 'dark',
    language: 'en',
    privacy: { profilePublic: false, showInLeaderboard: true },
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    setSaved(false);
    try {
      await new Promise((resolve) => setTimeout(resolve, 900));
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const pageBg = isDark
    ? 'linear-gradient(145deg, #141414 0%, #1e1e1e 100%)'
    : 'linear-gradient(145deg, #f8f8f8 0%, #f0f0f0 100%)';

  return (
    <Box
      style={{
        background: pageBg,
        minHeight: '100vh',
        padding: '0',
      }}
    >
      <Container size="sm" py="xl">
        <Stack gap="lg">
          {/* ── Page Header ── */}
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Group gap="sm" mb={4}>
              <ThemeIcon
                size={44}
                radius="xl"
                style={{
                  background: `linear-gradient(135deg, ${primaryHex}, ${primary?.[4] ?? '#ffb87a'})`,
                  color: 'white',
                  boxShadow: `0 6px 20px ${primaryHex}40`,
                }}
              >
                <IconSettings size={22} />
              </ThemeIcon>
              <div>
                <Title order={2} style={{ color: primaryHex, fontWeight: 800, letterSpacing: '-0.03em' }}>
                  Settings
                </Title>
                <Text size="xs" c="dimmed">Manage your account preferences</Text>
              </div>
            </Group>
          </motion.div>

          {/* ── Notifications ── */}
          <SectionCard
            icon={IconBell}
            title="Notifications"
            delay={0.05}
            primaryHex={primaryHex}
            isDark={isDark}
          >
            <Stack gap="lg">
              <SettingRow
                icon={IconMail}
                label="Email Notifications"
                description="Receive updates and reports via email"
                checked={settings.notifications.email}
                onChange={(checked) =>
                  setSettings({ ...settings, notifications: { ...settings.notifications, email: checked } })
                }
                primaryHex={primaryHex}
                isDark={isDark}
              />
              <Divider style={{ opacity: 0.5 }} />
              <SettingRow
                icon={IconDeviceMobile}
                label="Push Notifications"
                description="Get real-time alerts on your device"
                checked={settings.notifications.push}
                onChange={(checked) =>
                  setSettings({ ...settings, notifications: { ...settings.notifications, push: checked } })
                }
                primaryHex={primaryHex}
                isDark={isDark}
              />
              <Divider style={{ opacity: 0.5 }} />
              <SettingRow
                icon={IconClockHour4}
                label="Daily Learning Reminder"
                description="A gentle nudge to stay on track each day"
                checked={settings.notifications.dailyReminder}
                onChange={(checked) =>
                  setSettings({
                    ...settings,
                    notifications: { ...settings.notifications, dailyReminder: checked },
                  })
                }
                primaryHex={primaryHex}
                isDark={isDark}
              />
            </Stack>
          </SectionCard>

          {/* ── Preferences ── */}
          <SectionCard
            icon={IconDeviceDesktop}
            title="Preferences"
            delay={0.1}
            primaryHex={primaryHex}
            isDark={isDark}
          >
            <Stack gap="md">
              <div>
                <Text size="xs" fw={600} c="dimmed" mb={8} style={{ textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Language
                </Text>
                <Select
                  data={[
                    { value: 'en', label: '🇬🇧  English' },
                    { value: 'es', label: '🇪🇸  Spanish' },
                    { value: 'fr', label: '🇫🇷  French' },
                    { value: 'de', label: '🇩🇪  German' },
                    { value: 'ja', label: '🇯🇵  Japanese' },
                  ]}
                  value={settings.language}
                  onChange={(val) => setSettings({ ...settings, language: val ?? 'en' })}
                  leftSection={<IconLanguage size={16} style={{ color: primaryHex }} />}
                  styles={{
                    input: {
                      border: `1.5px solid ${isDark ? 'rgba(255,255,255,0.1)' : '#e0e0e0'}`,
                      borderRadius: '10px',
                      background: isDark ? 'rgba(255,255,255,0.04)' : '#fafafa',
                      '&:focus': { borderColor: primaryHex },
                    },
                  }}
                />
              </div>
            </Stack>
          </SectionCard>

          {/* ── Privacy ── */}
          <SectionCard
            icon={IconShield}
            title="Privacy"
            delay={0.15}
            primaryHex={primaryHex}
            isDark={isDark}
          >
            <Stack gap="lg">
              <SettingRow
                icon={IconUsers}
                label="Public Profile"
                description="Let others discover and view your profile"
                checked={settings.privacy.profilePublic}
                onChange={(checked) =>
                  setSettings({ ...settings, privacy: { ...settings.privacy, profilePublic: checked } })
                }
                primaryHex={primaryHex}
                isDark={isDark}
              />
              <Divider style={{ opacity: 0.5 }} />
              <SettingRow
                icon={IconTrophy}
                label="Show in Leaderboard"
                description="Appear in community achievement rankings"
                checked={settings.privacy.showInLeaderboard}
                onChange={(checked) =>
                  setSettings({ ...settings, privacy: { ...settings.privacy, showInLeaderboard: checked } })
                }
                primaryHex={primaryHex}
                isDark={isDark}
              />
            </Stack>
          </SectionCard>

          {/* ── Save ── */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Button
              onClick={handleSave}
              loading={isSaving}
              fullWidth
              size="md"
              leftSection={saved ? <IconCheck size={18} /> : null}
              style={{
                background: saved
                  ? 'linear-gradient(135deg, #22c55e, #16a34a)'
                  : `linear-gradient(135deg, ${primaryHex}, ${primary?.[4] ?? '#ffb87a'})`,
                color: 'white',
                fontWeight: 700,
                fontSize: '15px',
                borderRadius: '12px',
                border: 'none',
                boxShadow: saved
                  ? '0 6px 20px rgba(34,197,94,0.4)'
                  : `0 6px 20px ${primaryHex}45`,
                transition: 'background 0.4s ease, box-shadow 0.4s ease',
                height: '48px',
              }}
            >
              {saved ? 'Saved!' : 'Save Settings'}
            </Button>
          </motion.div>
        </Stack>
      </Container>
    </Box>
  );
};

export default SettingsPage;