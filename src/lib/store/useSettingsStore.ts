import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Settings {
  themeColor: string;
  fontFamily: string;
  fontSize: string;
  documentSize: string;
  formToShow: {
    summary: boolean;
    workExperiences: boolean;
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
  formToHeading: {
    summary: string;
    workExperiences: string;
    educations: string;
    projects: string;
    skills: string;
    custom: string;
  };
  formsOrder: ShowForm[];
  showBulletPoints: {
    educations: boolean;
    projects: boolean;
    skills: boolean;
    custom: boolean;
  };
}

export type ShowForm = keyof Settings['formToShow'];
export type FormWithBulletPoints = keyof Settings['showBulletPoints'];
export type GeneralSetting = Exclude<
  keyof Settings,
  'formToShow' | 'formToHeading' | 'formsOrder' | 'showBulletPoints'
>;

export const DEFAULT_THEME_COLOR = '#38bdf8';
export const DEFAULT_FONT_FAMILY = 'Roboto';
export const DEFAULT_FONT_SIZE = '11';
export const DEFAULT_FONT_COLOR = '#171717';

export const initialSettings: Settings = {
  themeColor: DEFAULT_THEME_COLOR,
  fontFamily: DEFAULT_FONT_FAMILY,
  fontSize: DEFAULT_FONT_SIZE,
  documentSize: 'Letter',
  formToShow: {
    summary: true,
    workExperiences: true,
    educations: true,
    projects: true,
    skills: true,
    custom: false,
  },
  formToHeading: {
    summary: 'PROFESSIONAL SUMMARY',
    workExperiences: 'WORK EXPERIENCE',
    educations: 'EDUCATION',
    projects: 'PROJECT',
    skills: 'SKILLS',
    custom: 'CUSTOM SECTION',
  },
  formsOrder: ['summary', 'workExperiences', 'educations', 'projects', 'skills', 'custom'],
  showBulletPoints: {
    educations: true,
    projects: true,
    skills: true,
    custom: true,
  },
};

interface SettingsStore extends Settings {
  changeSettings: (field: GeneralSetting, value: string) => void;
  changeShowForm: (field: ShowForm, value: boolean) => void;
  changeFormHeading: (field: ShowForm, value: string) => void;
  changeFormOrder: (form: ShowForm, type: 'up' | 'down') => void;
  changeShowBulletPoints: (field: FormWithBulletPoints, value: boolean) => void;
  setSettings: (settings: Settings) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      ...initialSettings,

      changeSettings: (field, value) =>
        set((state) => ({
          ...state,
          [field]: value,
        })),

      changeShowForm: (field, value) =>
        set((state) => ({
          ...state,
          formToShow: {
            ...state.formToShow,
            [field]: value,
          },
        })),

      changeFormHeading: (field, value) =>
        set((state) => ({
          ...state,
          formToHeading: {
            ...state.formToHeading,
            [field]: value,
          },
        })),

      changeFormOrder: (form, type) =>
        set((state) => {
          const formsOrder = [...state.formsOrder];
          const lastIdx = formsOrder.length - 1;
          const pos = formsOrder.indexOf(form);
          const newPos = type === 'up' ? pos - 1 : pos + 1;

          if (newPos >= 0 && newPos <= lastIdx) {
            const temp = formsOrder[pos];
            formsOrder[pos] = formsOrder[newPos];
            formsOrder[newPos] = temp;
          }

          return {
            ...state,
            formsOrder,
          };
        }),

      changeShowBulletPoints: (field, value) =>
        set((state) => ({
          ...state,
          showBulletPoints: {
            ...state.showBulletPoints,
            [field]: value,
          },
        })),

      setSettings: (settings) => settings,
    }),
    {
      name: 'settings-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Migrate old settings that don't have summary
          if (!state.formToShow.summary) {
            state.formToShow.summary = true;
          }
          if (!state.formToHeading.summary) {
            state.formToHeading.summary = 'PROFESSIONAL SUMMARY';
          }
          // Ensure summary is in formsOrder if not already there
          if (!state.formsOrder.includes('summary')) {
            state.formsOrder = ['summary', ...state.formsOrder];
          }
        }
      },
    }
  )
);
