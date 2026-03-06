import { Box, Button, Group, Stack, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';

import {
  FONT_FAMILY_TO_DISPLAY_NAME,
  FONT_FAMILY_TO_STANDARD_SIZE_IN_PT,
  type FontFamily,
} from '@/components/fonts/constants';
import { getAllFontFamiliesToLoad } from '@/components/fonts/lib';
import { PX_PER_PT } from '@/lib/constants';
import type { GeneralSetting } from '@/lib/store/useSettingsStore';

const Selection = ({
  selectedColor,
  isSelected,
  fontStyle = {},
  onClick,
  children,
}: {
  selectedColor: string;
  isSelected: boolean;
  fontStyle?: React.CSSProperties;
  onClick: () => void;
  children: React.ReactNode;
}) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();

  return (
    <Button
      onClick={onClick}
      onKeyDown={(e) => {
        if (['Enter', ' '].includes(e.key)) onClick();
      }}
      variant={isSelected ? 'filled' : 'light'}
      color={isSelected ? selectedColor : 'gray'}
      radius="md"
      w="105px"
      h="auto"
      py="sm"
      fw={500}
      style={fontStyle}
      styles={{
        root: {
          transition: 'all 150ms ease',
          borderColor: colorScheme === 'dark' && !isSelected ? theme.colors.gray[7] : undefined,
        },
        inner: {
          color: colorScheme === 'dark' && !isSelected ? theme.colors.gray[0] : undefined,
        },
      }}
    >
      {children}
    </Button>
  );
};

const SelectionsWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <Group gap="md" wrap="wrap">
      {children}
    </Group>
  );
};

const FontFamilySelections = ({
  selectedFontFamily,
  themeColor,
  handleSettingsChange,
}: {
  selectedFontFamily: string;
  themeColor: string;
  handleSettingsChange: (field: GeneralSetting, value: string) => void;
}) => {
  const allFontFamilies = getAllFontFamiliesToLoad();
  return (
    <SelectionsWrapper>
      {allFontFamilies.map((fontFamily: FontFamily) => {
        const isSelected = selectedFontFamily === fontFamily;
        const standardSizePt = FONT_FAMILY_TO_STANDARD_SIZE_IN_PT[fontFamily];
        return (
          <Selection
            key={fontFamily}
            selectedColor={themeColor}
            isSelected={isSelected}
            fontStyle={{
              fontFamily,
              fontSize: `${standardSizePt * PX_PER_PT}px`,
            }}
            onClick={() => handleSettingsChange('fontFamily', fontFamily)}
          >
            {FONT_FAMILY_TO_DISPLAY_NAME[fontFamily]}
          </Selection>
        );
      })}
    </SelectionsWrapper>
  );
};

/**
 * Export as CSR (Client-Side Render) since it calls getAllFontFamiliesToLoad,
 * which uses navigator object that is only available on client side
 */
export const FontFamilySelectionsCSR = FontFamilySelections;

export const FontSizeSelections = ({
  selectedFontSize,
  fontFamily,
  themeColor,
  handleSettingsChange,
}: {
  fontFamily: FontFamily;
  themeColor: string;
  selectedFontSize: string;
  handleSettingsChange: (field: GeneralSetting, value: string) => void;
}) => {
  const standardSizePt = FONT_FAMILY_TO_STANDARD_SIZE_IN_PT[fontFamily];
  const compactSizePt = standardSizePt - 1;

  return (
    <SelectionsWrapper>
      {['Compact', 'Standard', 'Large'].map((type, idx) => {
        const fontSizePt = String(compactSizePt + idx);
        const isSelected = fontSizePt === selectedFontSize;
        return (
          <Selection
            key={idx}
            selectedColor={themeColor}
            isSelected={isSelected}
            fontStyle={{
              fontFamily,
              fontSize: `${Number(fontSizePt) * PX_PER_PT}px`,
            }}
            onClick={() => handleSettingsChange('fontSize', fontSizePt)}
          >
            {type}
          </Selection>
        );
      })}
    </SelectionsWrapper>
  );
};

export const DocumentSizeSelections = ({
  selectedDocumentSize,
  themeColor,
  handleSettingsChange,
}: {
  themeColor: string;
  selectedDocumentSize: string;
  handleSettingsChange: (field: GeneralSetting, value: string) => void;
}) => {
  return (
    <SelectionsWrapper>
      {['Letter', 'A4'].map((type) => {
        return (
          <Selection
            key={type}
            selectedColor={themeColor}
            isSelected={type === selectedDocumentSize}
            onClick={() => handleSettingsChange('documentSize', type)}
          >
            <Stack gap={0} align="center">
              <Text fw={500}>{type}</Text>
              <Text size="xs" c="dimmed">
                {type === 'Letter' ? '(US, Canada)' : '(other countries)'}
              </Text>
            </Stack>
          </Selection>
        );
      })}
    </SelectionsWrapper>
  );
};
