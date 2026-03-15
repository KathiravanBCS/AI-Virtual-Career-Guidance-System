import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { ShowForm } from '@/lib/store/useSettingsStore';
import type {
  FeaturedSkill,
  Resume,
  ResumeEducation,
  ResumeProfile,
  ResumeProject,
  ResumeSkills,
  ResumeWorkExperience,
} from '@/lib/types';

// Export Resume type for use in other components
export type { Resume };

export const initialProfile: ResumeProfile = {
  name: '',
  summary: '',
  email: '',
  phone: '',
  location: '',
  url: '',
};

export const initialWorkExperience: ResumeWorkExperience = {
  company: '',
  jobTitle: '',
  date: '',
  descriptions: [],
};

export const initialEducation: ResumeEducation = {
  school: '',
  degree: '',
  gpa: '',
  date: '',
  descriptions: [],
};

export const initialProject: ResumeProject = {
  project: '',
  date: '',
  descriptions: [],
};

export const initialFeaturedSkill: FeaturedSkill = { skill: '', rating: 4 };
export const initialFeaturedSkills: FeaturedSkill[] = Array(6).fill({
  ...initialFeaturedSkill,
});
export const initialSkills: ResumeSkills = {
  featuredSkills: initialFeaturedSkills,
  descriptions: [],
};

export const initialCustomSection = {
  title: 'Custom Section',
  descriptions: [],
};

export const initialCustom = {
  sections: [initialCustomSection],
};

export const initialSummary = {
  content: '',
};

export const initialResumeState: Resume = {
  profile: initialProfile,
  summary: initialSummary,
  workExperiences: [initialWorkExperience],
  educations: [initialEducation],
  projects: [initialProject],
  skills: initialSkills,
  custom: initialCustom,
};

interface ResumeStore {
  resume: Resume;
  changeProfile: (field: keyof ResumeProfile, value: string) => void;
  changeSummary: (value: string) => void;
  changeWorkExperiences: (idx: number, field: keyof ResumeWorkExperience, value: string | string[]) => void;
  changeEducations: (idx: number, field: keyof ResumeEducation, value: string | string[]) => void;
  changeProjects: (idx: number, field: keyof ResumeProject, value: string | string[]) => void;
  changeSkills: (
    field: 'descriptions' | 'featuredSkills',
    idx?: number,
    skill?: string,
    rating?: number,
    value?: string[]
  ) => void;
  changeCustom: (idx: number, field: 'title' | 'descriptions', value: string | string[]) => void;
  addCustomSection: () => void;
  deleteCustomSection: (idx: number) => void;
  moveCustomSection: (idx: number, direction: 'up' | 'down') => void;
  addSectionInForm: (form: ShowForm) => void;
  moveSectionInForm: (form: ShowForm, idx: number, direction: 'up' | 'down') => void;
  deleteSectionInFormByIdx: (form: ShowForm, idx: number) => void;
  setResume: (resume: Resume) => void;
}

const migrateResume = (resume: any): Resume => {
  const migrated = { ...resume };

  // Initialize summary if it doesn't exist
  if (!migrated.summary) {
    migrated.summary = { ...initialSummary };
  }

  // Migrate old custom format to new format
  if (migrated.custom) {
    if (!Array.isArray(migrated.custom.sections)) {
      // Old format: { descriptions: [] }
      // New format: { sections: [{ title, descriptions }] }
      migrated.custom = {
        sections: [
          {
            title: 'Custom Section',
            descriptions: migrated.custom.descriptions || [],
          },
        ],
      };
    }
  } else {
    // No custom data, initialize with empty
    migrated.custom = {
      sections: [
        {
          title: 'Custom Section',
          descriptions: [],
        },
      ],
    };
  }

  return migrated;
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      resume: initialResumeState,

      changeProfile: (field, value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            profile: {
              ...state.resume.profile,
              [field]: value,
            },
          },
        })),

      changeSummary: (value) =>
        set((state) => ({
          resume: {
            ...state.resume,
            summary: {
              content: value,
            },
          },
        })),

      changeWorkExperiences: (idx, field, value) =>
        set((state) => {
          const workExperiences = structuredClone(state.resume.workExperiences);
          workExperiences[idx] = {
            ...workExperiences[idx],
            [field]: value,
          };
          return {
            resume: {
              ...state.resume,
              workExperiences,
            },
          };
        }),

      changeEducations: (idx, field, value) =>
        set((state) => {
          const educations = structuredClone(state.resume.educations);
          educations[idx] = {
            ...educations[idx],
            [field]: value,
          };
          return {
            resume: {
              ...state.resume,
              educations,
            },
          };
        }),

      changeProjects: (idx, field, value) =>
        set((state) => {
          const projects = structuredClone(state.resume.projects);
          projects[idx] = {
            ...projects[idx],
            [field]: value,
          };
          return {
            resume: {
              ...state.resume,
              projects,
            },
          };
        }),

      changeSkills: (field, idx, skill, rating, value) =>
        set((state) => {
          if (field === 'descriptions') {
            return {
              resume: {
                ...state.resume,
                skills: {
                  ...state.resume.skills,
                  descriptions: value || [],
                },
              },
            };
          } else {
            const featuredSkills = structuredClone(state.resume.skills.featuredSkills);
            if (idx !== undefined) {
              featuredSkills[idx] = {
                skill: skill || '',
                rating: rating || 4,
              };
            }
            return {
              resume: {
                ...state.resume,
                skills: {
                  ...state.resume.skills,
                  featuredSkills,
                },
              },
            };
          }
        }),

      changeCustom: (idx, field, value) =>
        set((state) => {
          const custom = structuredClone(state.resume.custom);
          if (field === 'title') {
            custom.sections[idx].title = value as string;
          } else {
            custom.sections[idx].descriptions = value as string[];
          }
          return {
            resume: {
              ...state.resume,
              custom,
            },
          };
        }),

      addCustomSection: () =>
        set((state) => {
          const custom = structuredClone(state.resume.custom);
          custom.sections.push(structuredClone(initialCustomSection));
          return {
            resume: {
              ...state.resume,
              custom,
            },
          };
        }),

      deleteCustomSection: (idx) =>
        set((state) => {
          const custom = structuredClone(state.resume.custom);
          if (custom.sections.length > 1) {
            custom.sections.splice(idx, 1);
          }
          return {
            resume: {
              ...state.resume,
              custom,
            },
          };
        }),

      moveCustomSection: (idx, direction) =>
        set((state) => {
          const custom = structuredClone(state.resume.custom);
          const sections = custom.sections;

          if ((idx === 0 && direction === 'up') || (idx === sections.length - 1 && direction === 'down')) {
            return state;
          }

          const section = sections[idx];
          if (direction === 'up') {
            sections[idx] = sections[idx - 1];
            sections[idx - 1] = section;
          } else {
            sections[idx] = sections[idx + 1];
            sections[idx + 1] = section;
          }

          return {
            resume: {
              ...state.resume,
              custom,
            },
          };
        }),

      addSectionInForm: (form) =>
        set((state) => {
          const resume = structuredClone(state.resume);
          if (form === 'workExperiences') {
            resume.workExperiences.push(structuredClone(initialWorkExperience));
          } else if (form === 'educations') {
            resume.educations.push(structuredClone(initialEducation));
          } else if (form === 'projects') {
            resume.projects.push(structuredClone(initialProject));
          }
          return { resume };
        }),

      moveSectionInForm: (form, idx, direction) =>
        set((state) => {
          if (form === 'skills' || form === 'custom') return state;

          const resume = structuredClone(state.resume);
          const formArray = resume[form as keyof typeof resume];

          if (Array.isArray(formArray)) {
            if ((idx === 0 && direction === 'up') || (idx === formArray.length - 1 && direction === 'down')) {
              return state;
            }

            const section = formArray[idx];
            if (direction === 'up') {
              formArray[idx] = formArray[idx - 1];
              formArray[idx - 1] = section;
            } else {
              formArray[idx] = formArray[idx + 1];
              formArray[idx + 1] = section;
            }
          }

          return { resume };
        }),

      deleteSectionInFormByIdx: (form, idx) =>
        set((state) => {
          if (form === 'skills' || form === 'custom') return state;

          const resume = structuredClone(state.resume);
          const formArray = resume[form as keyof typeof resume];

          if (Array.isArray(formArray)) {
            formArray.splice(idx, 1);
          }

          return { resume };
        }),

      setResume: (resume) => set({ resume }),
    }),
    {
      name: 'resume-store',
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.resume = migrateResume(state.resume);
        }
      },
    }
  )
);
