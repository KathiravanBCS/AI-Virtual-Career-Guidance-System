import { baseComponents, baseTheme } from '../baseTheme';
import { CustomTheme, ThemeConfig } from '../types';

const defaultTheme: CustomTheme = {
  ...baseTheme,
  primaryColor: 'grape',
  colors: {
    grape: [
      '#f8f3fc',
      '#ede5f5',
      '#d8c6e8',
      '#c3a6db',
      '#b18bcf',
      '#a47bc7',
      '#9e72c5',
      '#8961ae',
      '#7a569c',
      '#6b4a8a',
    ],
    indigo: [
      '#eef2ff',
      '#e0e7ff',
      '#c7d2fe',
      '#a5b4fc',
      '#818cf8',
      '#6366f1',
      '#667eea',
      '#5a67d8',
      '#4c51bf',
      '#434190',
    ],
    purple: [
      '#faf5ff',
      '#f3e8ff',
      '#e9d5ff',
      '#d8b4fe',
      '#c084fc',
      '#a855f7',
      '#764ba2',
      '#7c3aed',
      '#6d28d9',
      '#5b21b6',
    ],
  },
  other: {
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
      accent: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
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
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          }),
        },
      }),
    },
  },
};

export const defaultThemeConfig: ThemeConfig = {
  name: 'default',
  label: 'Default',
  theme: defaultTheme,
  description: 'Modern purple and indigo gradient theme with vibrant colors',
  previewColors: ['#667eea', '#764ba2', '#6366f1', '#a855f7'],
};

export default defaultTheme;
