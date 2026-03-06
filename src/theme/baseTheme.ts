import { MantineThemeComponents } from '@mantine/core';

import { FONT_FAMILY, RADIUS_SCALE, SPACING_SCALE } from './constants';
import menuClasses from './Menu.module.css';

// Common component configurations shared across all themes
export const baseComponents: MantineThemeComponents = {
  Button: {
    defaultProps: {
      radius: 'md',
    },
  },
  Paper: {
    defaultProps: {
      radius: 'md',
      shadow: 'xs',
    },
  },
  Card: {
    defaultProps: {
      radius: 'md',
      shadow: 'sm',
    },
  },
  Badge: {
    styles: {
      label: {
        fontWeight: 600,
        letterSpacing: '0.01em',
      },
    },
  },
  ThemeIcon: {
    defaultProps: {
      radius: 'md',
    },
  },
  Menu: {
    defaultProps: {
      shadow: 'md',
      radius: 'md',
    },
    classNames: menuClasses,
  },
  Input: {
    defaultProps: {
      radius: 'md',
    },
  },
  Select: {
    defaultProps: {
      radius: 'md',
    },
  },
  Modal: {
    defaultProps: {
      radius: 'md',
      centered: true,
    },
  },
  Notification: {
    defaultProps: {
      radius: 'md',
    },
  },
};

// Common theme configuration
export const baseTheme = {
  fontFamily: FONT_FAMILY.sans,
  fontFamilyMonospace: FONT_FAMILY.mono,
  fontSmoothing: true,
  spacing: SPACING_SCALE,
  radius: RADIUS_SCALE,
  defaultRadius: 'md' as const,
  fontSizes: {
    xs: '0.75rem',
    sm: '0.8125rem',
    md: '0.9375rem',
    lg: '1.0625rem',
    xl: '1.25rem',
  },
  lineHeights: {
    xs: '1.4',
    sm: '1.45',
    md: '1.5',
    lg: '1.55',
    xl: '1.6',
  },
  headings: {
    fontWeight: '700',
    sizes: {
      h1: { fontSize: '2.5rem', lineHeight: '1.2' },
      h2: { fontSize: '2rem', lineHeight: '1.25' },
      h3: { fontSize: '1.75rem', lineHeight: '1.3' },
      h4: { fontSize: '1.5rem', lineHeight: '1.35' },
      h5: { fontSize: '1.25rem', lineHeight: '1.4' },
      h6: { fontSize: '1rem', lineHeight: '1.45' },
    },
  },
};
