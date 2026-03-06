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

const ResumePDFWrapper = memo(({ resume, settings }: { resume: any; settings: Settings }) => (
  <ResumePDF resume={resume} settings={settings} isPDF={false} />
));
ResumePDFWrapper.displayName = 'ResumePDFWrapper';

const ResumeContent = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [scale, setScale] = useState(0.8);

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
      <Box h="100%" w="100%" pos="relative" bg={colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0]}>
        {/* Resume Preview Area with scrolling */}
        <ScrollArea h="100%" w="100%" scrollbarSize={8}>
          <Flex w="100%" justify="center" px="md" pt="lg" pb="8rem">
            {/* <Box
              w="100vw"
              maw="90rem"
              style={{
                boxShadow: theme.shadows.lg,
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[5] : 'white',
                overflow: 'hidden',
              }}
            > */}
            <ResumeIframeCSR documentSize={settings.documentSize} scale={scale} enablePDFViewer={DEBUG_RESUME_PDF_FLAG}>
              <ResumePDFWrapper resume={resume} settings={settings} />
            </ResumeIframeCSR>
            {/* </Box> */}
          </Flex>
        </ScrollArea>

        {/* Fixed Footer Control Bar */}
        <Box
          pos="absolute"
          bottom={0}
          left={0}
          right={0}
          bg={colorScheme === 'dark' ? theme.colors.dark[8] : 'white'}
          style={{
            borderTop: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]}`,
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
        >
          <ResumeControlBarCSR
            scale={scale}
            setScale={setScale}
            documentSize={settings.documentSize}
            document={document}
            fileName={resume.profile.name + ' - Resume'}
          />
        </Box>
      </Box>
    </>
  );
};

export const Resume = memo(ResumeContent);
Resume.displayName = 'Resume';
