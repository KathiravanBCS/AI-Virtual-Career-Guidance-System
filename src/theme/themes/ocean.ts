import { baseComponents, baseTheme } from '../baseTheme';
import { CustomTheme, ThemeConfig } from '../types';

const oceanTheme: CustomTheme = {
  ...baseTheme,
  primaryColor: 'blue',
  colors: {
    blue: [
      '#e6f4ff',
      '#bae0ff',
      '#91caff',
      '#69b1ff',
      '#4096ff',
      '#1677ff',
      '#0958d9',
      '#003eb3',
      '#002c8c',
      '#001d66',
    ],
    teal: [
      '#e6fffb',
      '#b5f5ec',
      '#87e8de',
      '#5cdbd3',
      '#36cfc9',
      '#13c2c2',
      '#08979c',
      '#006d75',
      '#00474f',
      '#002329',
    ],
    cyan: [
      '#e6fffb',
      '#b5f5ec',
      '#87e8de',
      '#5cdbd3',
      '#36cfc9',
      '#13c2c2',
      '#08979c',
      '#006d75',
      '#00474f',
      '#002329',
    ],
  },
  other: {
    gradients: {
      primary: 'linear-gradient(135deg, #1677ff 0%, #13c2c2 100%)',
      secondary: 'linear-gradient(135deg, #4096ff 0%, #36cfc9 100%)',
      accent: 'linear-gradient(135deg, #69b1ff 0%, #5cdbd3 100%)',
    },
  },
  components: {
    ...baseComponents,
    Button: {
      ...baseComponents.Button,
      styles: (theme: any, props: any) => ({
        root: {
          fontWeight: 600,
          ...(props.variant === 'gradient' && {
            backgroundImage: 'linear-gradient(135deg, #1677ff 0%, #13c2c2 100%)',
          }),
        },
      }),
    },
  },
};

export const oceanThemeConfig: ThemeConfig = {
  name: 'ocean',
  label: 'Ocean',
  theme: oceanTheme,
  description: 'Professional blue and teal theme inspired by ocean depths',
  previewColors: ['#1677ff', '#13c2c2', '#4096ff', '#36cfc9'],
};

export default oceanTheme;
