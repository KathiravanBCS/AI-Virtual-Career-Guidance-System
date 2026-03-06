import { MantineColorScheme, MantineThemeOverride } from '@mantine/core';

export type ThemeName = 'default' | 'ocean' | 'forest' | 'sunset';

export interface CustomTheme extends MantineThemeOverride {
  colorScheme?: MantineColorScheme;
  globalStyles?: (theme: any) => Record<string, any>;
  other?: {
    gradients?: {
      primary: string;
      secondary: string;
      accent: string;
    };
  };
}

export interface ThemeConfig {
  name: ThemeName;
  label: string;
  theme: CustomTheme;
  description: string;
  previewColors: string[];
}
