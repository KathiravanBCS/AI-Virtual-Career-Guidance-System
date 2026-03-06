import { Box, Group, Stack, Text, TextInput, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconSettings } from '@tabler/icons-react';

import type { FontFamily } from '@/components/fonts/constants';
import { FormHeader } from '@/components/ResumeForm/FormHeader';
import { THEME_COLORS } from '@/components/ResumeForm/ThemeForm/constants';
import {
  DocumentSizeSelections,
  FontFamilySelectionsCSR,
  FontSizeSelections,
} from '@/components/ResumeForm/ThemeForm/Selection';
import { DEFAULT_THEME_COLOR, useSettingsStore, type GeneralSetting } from '@/lib/store/useSettingsStore';

export const ThemeForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { fontSize, fontFamily, documentSize, themeColor, changeSettings } = useSettingsStore();

  const handleSettingsChange = (field: GeneralSetting, value: string) => {
    changeSettings(field, value);
  };

  return (
    <Stack gap="lg">
      <FormHeader
        title="RESUME SETTINGS"
        icon={<IconSettings size={24} color={theme.colors[theme.primaryColor][5]} />}
        collapsibleOnly
      >
        <Stack gap="md">
          <Box>
            <Group gap="md" align="flex-end" mb="md">
              <Text fw={500} w="7rem">
                Theme Color
              </Text>
              <TextInput
                value={themeColor}
                placeholder={DEFAULT_THEME_COLOR}
                onChange={(e) => handleSettingsChange('themeColor', e.currentTarget.value)}
                variant="unstyled"
                styles={{
                  input: {
                    width: '5rem',
                    textAlign: 'center',
                    fontWeight: 600,
                    borderBottom: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
                    color: themeColor,
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : 'transparent',
                  },
                }}
              />
            </Group>
            <Group gap="md" wrap="wrap">
              {THEME_COLORS.map((color) => (
                <Box
                  key={color}
                  onClick={() => handleSettingsChange('themeColor', color)}
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '6px',
                    backgroundColor: color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: 'white',
                    fontWeight: 600,
                    border:
                      themeColor === color
                        ? `3px solid ${colorScheme === 'dark' ? theme.colors.gray[0] : 'black'}`
                        : `2px solid ${colorScheme === 'dark' ? theme.colors.gray[7] : theme.colors.gray[2]}`,
                    transition: 'all 150ms ease',
                    boxShadow:
                      themeColor === color
                        ? `0 0 0 2px ${colorScheme === 'dark' ? theme.colors.dark[7] : theme.white}`
                        : 'none',
                  }}
                >
                  {themeColor === color ? '✓' : ''}
                </Box>
              ))}
            </Group>
          </Box>

          <Box>
            <Text fw={500} mb="md">
              Font Family
            </Text>
            <FontFamilySelectionsCSR
              selectedFontFamily={fontFamily}
              themeColor={themeColor}
              handleSettingsChange={handleSettingsChange}
            />
          </Box>

          <Box>
            <Group gap="md" align="flex-end" mb="md">
              <Text fw={500} w="7rem">
                Font Size (pt)
              </Text>
              <TextInput
                value={fontSize}
                placeholder="11"
                onChange={(e) => handleSettingsChange('fontSize', e.currentTarget.value)}
                variant="unstyled"
                styles={{
                  input: {
                    width: '5rem',
                    textAlign: 'center',
                    fontWeight: 600,
                    borderBottom: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : 'transparent',
                    color: colorScheme === 'dark' ? theme.colors.gray[0] : 'inherit',
                  },
                }}
              />
            </Group>
            <FontSizeSelections
              fontFamily={fontFamily as FontFamily}
              themeColor={themeColor}
              selectedFontSize={fontSize}
              handleSettingsChange={handleSettingsChange}
            />
          </Box>

          <Box>
            <Text fw={500} mb="md">
              Document Size
            </Text>
            <DocumentSizeSelections
              themeColor={themeColor}
              selectedDocumentSize={documentSize}
              handleSettingsChange={handleSettingsChange}
            />
          </Box>
        </Stack>
      </FormHeader>
    </Stack>
  );
};
