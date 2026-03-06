import { baseComponents, baseTheme } from '../baseTheme';
import { CustomTheme, ThemeConfig } from '../types';

const forestTheme: CustomTheme = {
  ...baseTheme,
  primaryColor: 'green',
  colors: {
    green: [
      '#e6ffed',
      '#b7f5d0',
      '#95e8b7',
      '#73d99f',
      '#52c987',
      '#31b96f',
      '#10a85a',
      '#00874a',
      '#006b3a',
      '#004e2a',
    ],
    lime: [
      '#fcffe6',
      '#eaff8f',
      '#d3f261',
      '#bae637',
      '#a0d911',
      '#7cb305',
      '#5b8c00',
      '#3f6600',
      '#254000',
      '#092b00',
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
  },
  other: {
    gradients: {
      primary: 'linear-gradient(135deg, #31b96f 0%, #7cb305 100%)',
      secondary: 'linear-gradient(135deg, #52c987 0%, #a0d911 100%)',
      accent: 'linear-gradient(135deg, #73d99f 0%, #bae637 100%)',
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
            backgroundImage: 'linear-gradient(135deg, #31b96f 0%, #7cb305 100%)',
          }),
        },
      }),
    },
  },
};

export const forestThemeConfig: ThemeConfig = {
  name: 'forest',
  label: 'Forest',
  theme: forestTheme,
  description: 'Nature-inspired green theme with fresh and vibrant tones',
  previewColors: ['#31b96f', '#7cb305', '#52c987', '#a0d911'],
};

export default forestTheme;
