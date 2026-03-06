import { defaultThemeConfig } from './themes/default';
import { forestThemeConfig } from './themes/forest';
import { oceanThemeConfig } from './themes/ocean';
import { sunsetThemeConfig } from './themes/sunset';
import { ThemeConfig, ThemeName } from './types';

export const themes: Record<ThemeName, ThemeConfig> = {
  default: defaultThemeConfig,
  ocean: oceanThemeConfig,
  forest: forestThemeConfig,
  sunset: sunsetThemeConfig,
};

export const themeList = Object.values(themes);

export const getTheme = (name: ThemeName): ThemeConfig => {
  return themes[name] || themes.default;
};
