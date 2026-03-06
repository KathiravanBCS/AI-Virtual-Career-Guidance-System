'use client';

import React, { useState } from 'react';

import { Stack, useMantineColorScheme, useMantineTheme } from '@mantine/core';

import { CustomForm } from '@/components/ResumeForm/CustomForm';
import { EducationsForm } from '@/components/ResumeForm/EducationsForm';
import { ProfileForm } from '@/components/ResumeForm/ProfileForm';
import { ProjectsForm } from '@/components/ResumeForm/ProjectsForm';
import { SkillsForm } from '@/components/ResumeForm/SkillsForm';
import { SummaryForm } from '@/components/ResumeForm/SummaryForm';
import { ThemeForm } from '@/components/ResumeForm/ThemeForm';
import { WorkExperiencesForm } from '@/components/ResumeForm/WorkExperiencesForm';
import { cx } from '@/lib/cx';
import { useSettingsStore, type ShowForm } from '@/lib/store/useSettingsStore';

const formTypeToComponent: { [type in ShowForm]: React.FC } = {
  summary: SummaryForm,
  workExperiences: WorkExperiencesForm,
  educations: EducationsForm,
  projects: ProjectsForm,
  skills: SkillsForm,
  custom: CustomForm,
};

export const ResumeForm = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { formsOrder } = useSettingsStore();
  const [isHover, setIsHover] = useState(false);

  return (
    <div
      className={cx(
        'flex justify-center w-full overflow-y-auto',
        isHover ? 'scrollbar-thumb-gray-300' : 'scrollbar-thumb-gray-200'
      )}
      style={{
        scrollbarWidth: 'thin',
        scrollbarColor: isHover ? '#d0d0d0' : '#e5e5e5',
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      }}
      onMouseOver={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      <section style={{ width: '100%', maxWidth: '100%', padding: '1.5rem' }}>
        <Stack gap="xl">
          <ProfileForm />
          {formsOrder.map((form) => {
            const Component = formTypeToComponent[form];
            return <Component key={form} />;
          })}
          <ThemeForm />
          <div style={{ height: '2rem' }} />
        </Stack>
      </section>
    </div>
  );
};
