import { baseComponents, baseTheme } from '../baseTheme';
import { CustomTheme, ThemeConfig } from '../types';

const sunsetTheme: CustomTheme = {
  ...baseTheme,
  primaryColor: 'orange',
  colors: {
    orange: [
      '#fff7ed',
      '#ffedd5',
      '#fed7aa',
      '#fdba74',
      '#fb923c',
      '#f97316',
      '#ea580c',
      '#c2410c',
      '#9a3412',
      '#7c2d12',
    ],
    pink: [
      '#fef2f2',
      '#fee2e2',
      '#fecaca',
      '#fca5a5',
      '#f87171',
      '#ef4444',
      '#dc2626',
      '#b91c1c',
      '#991b1b',
      '#7f1d1d',
    ],
    red: ['#fff5f5', '#ffe3e3', '#ffc9c9', '#ffa8a8', '#ff8787', '#ff6b6b', '#fa5252', '#f03e3e', '#e03131', '#c92a2a'],
  },
  other: {
    gradients: {
      primary: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
      secondary: 'linear-gradient(135deg, #fb923c 0%, #f87171 100%)',
      accent: 'linear-gradient(135deg, #fdba74 0%, #fca5a5 100%)',
    },
  },
  components: {
    ...baseComponents,
    Button: {
      defaultProps: {
        radius: 'md',
      },
      styles: (theme: any, props: any) => ({
        root: {
          fontWeight: 600,
          ...(props.variant === 'gradient' && {
            backgroundImage: 'linear-gradient(135deg, #f97316 0%, #ef4444 100%)',
          }),
        },
      }),
    },
  },
};

export const sunsetThemeConfig: ThemeConfig = {
  name: 'sunset',
  label: 'Sunset',
  theme: sunsetTheme,
  description: 'Warm orange and pink theme inspired by sunset skies',
  previewColors: ['#f97316', '#ef4444', '#fb923c', '#f87171'],
};

export default sunsetTheme;
