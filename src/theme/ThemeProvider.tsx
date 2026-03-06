import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

import { MantineProvider } from '@mantine/core';

import { getTheme } from './themeRegistry';
import { ThemeName } from './types';

interface ThemeContextType {
  themeName: ThemeName;
  setThemeName: (name: ThemeName) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'vstn-theme';

interface ThemeProviderProps {
  children: ReactNode;
  defaultTheme?: ThemeName;
}

export function ThemeProvider({ children, defaultTheme = 'default' }: ThemeProviderProps) {
  // Initialize theme from localStorage or defaults
  const [themeName, setThemeNameState] = useState<ThemeName>(() => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return (stored as ThemeName) || defaultTheme;
  });

  // Persist theme changes to localStorage
  const setThemeName = (name: ThemeName) => {
    setThemeNameState(name);
    localStorage.setItem(THEME_STORAGE_KEY, name);
  };

  // Get the current theme configuration
  const currentTheme = getTheme(themeName);

  // Apply theme-specific CSS variables
  useEffect(() => {
    const root = document.documentElement;

    // Apply custom gradients if available
    if (currentTheme.theme.other?.gradients) {
      const { primary, secondary, accent } = currentTheme.theme.other.gradients;
      root.style.setProperty('--gradient-primary', primary);
      root.style.setProperty('--gradient-secondary', secondary);
      root.style.setProperty('--gradient-accent', accent);
    }

    // Add theme name as data attribute for CSS targeting
    root.setAttribute('data-theme', themeName);
  }, [themeName, currentTheme]);

  const contextValue: ThemeContextType = {
    themeName,
    setThemeName,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      <MantineProvider theme={currentTheme.theme}>{children}</MantineProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
