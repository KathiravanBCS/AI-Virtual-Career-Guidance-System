import { memo, useMemo, useState } from 'react';

import { Box, Flex, ScrollArea, useMantineColorScheme, useMantineTheme } from '@mantine/core';

import { useRegisterReactPDFFont, useRegisterReactPDFHyphenationCallback } from '@/components/fonts/hooks';
import { NonEnglishFontsCSSLazyLoader } from '@/components/fonts/NonEnglishFontsCSSLoader';
import { ResumeControlBarCSR } from '@/components/Resume/ResumeControlBar';
import { ResumeIframeCSR } from '@/components/Resume/ResumeIFrame';
import { ResumePDF } from '@/components/Resume/ResumePDF';
import { DEBUG_RESUME_PDF_FLAG } from '@/lib/constants';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { useSettingsStore } from '@/lib/store/useSettingsStore';
import type { Settings } from '@/lib/store/useSettingsStore';

const ResumePDFWrapper = memo(
  ({ resume, settings, isPDF = false }: { resume: any; settings: Settings; isPDF?: boolean }) => (
    <ResumePDF resume={resume} settings={settings} isPDF={isPDF} />
  )
);
ResumePDFWrapper.displayName = 'ResumePDFWrapper';

const ResumeContent = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [scale, setScale] = useState(1);

  const resume = useResumeStore((state) => state.resume);
  const themeColor = useSettingsStore((state) => state.themeColor);
  const fontFamily = useSettingsStore((state) => state.fontFamily);
  const fontSize = useSettingsStore((state) => state.fontSize);
  const documentSize = useSettingsStore((state) => state.documentSize);
  const formToShow = useSettingsStore((state) => state.formToShow);
  const formToHeading = useSettingsStore((state) => state.formToHeading);
  const formsOrder = useSettingsStore((state) => state.formsOrder);
  const showBulletPoints = useSettingsStore((state) => state.showBulletPoints);

  const settings = useMemo(
    () => ({
      themeColor,
      fontFamily,
      fontSize,
      documentSize,
      formToShow,
      formToHeading,
      formsOrder,
      showBulletPoints,
    }),
    [themeColor, fontFamily, fontSize, documentSize, formToShow, formToHeading, formsOrder, showBulletPoints]
  ) as Settings;

  const document = useMemo(() => <ResumePDF resume={resume} settings={settings} isPDF={false} />, [resume, settings]);

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <ResumeControlBarCSR
        scale={scale}
        setScale={setScale}
        documentSize={settings.documentSize}
        document={document}
        fileName={(resume.profile?.name || 'Resume') + ' - Resume'}
      />
      <ResumeIframeCSR documentSize={settings.documentSize} scale={scale} enablePDFViewer={true} debounceDelay={0}>
        <ResumePDFWrapper resume={resume} settings={settings} isPDF={true} />
      </ResumeIframeCSR>
    </>
  );
};

export const Resume = memo(ResumeContent);
Resume.displayName = 'Resume';
