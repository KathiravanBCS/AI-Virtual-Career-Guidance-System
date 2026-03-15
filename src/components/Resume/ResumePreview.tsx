import { memo, useCallback, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Group,
  NumberInput,
  ScrollArea,
  Text,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconArrowLeft,
  IconArrowRight,
  IconDots,
  IconDownload,
  IconMenu2,
  IconMinus,
  IconPlus,
  IconPrinter,
} from '@tabler/icons-react';

import { useRegisterReactPDFFont, useRegisterReactPDFHyphenationCallback } from '@/components/fonts/hooks';
import { NonEnglishFontsCSSLazyLoader } from '@/components/fonts/NonEnglishFontsCSSLoader';
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

const ResumePreviewContent = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const [scale, setScale] = useState(100);
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 1;

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

  useRegisterReactPDFFont();
  useRegisterReactPDFHyphenationCallback(settings.fontFamily);

  const handleZoomIn = useCallback(() => {
    setScale((prev) => Math.min(prev + 10, 200));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale((prev) => Math.max(prev - 10, 50));
  }, []);

  const handleDownload = useCallback(() => {
    console.log('Downloading resume...');
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return (
    <>
      <NonEnglishFontsCSSLazyLoader />
      <Box
        h="80vh"
        display="flex"
        style={{ flexDirection: 'column' }}
        bg={colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0]}
      >
        {/* Toolbar */}
        <Box
          px="md"
          py="sm"
          style={{
            background:
              colorScheme === 'dark'
                ? `linear-gradient(135deg, ${theme.colors.dark[8]} 0%, ${theme.colors.dark[7]} 100%)`
                : `linear-gradient(135deg, ${theme.white} 0%, ${theme.colors.gray[1]} 100%)`,
            borderBottom: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 2]}`,
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            boxShadow: colorScheme === 'dark' ? '0 2px 8px rgba(0, 0, 0, 0.3)' : '0 2px 8px rgba(0, 0, 0, 0.05)',
          }}
        >
          <Tooltip label="Menu">
            <Button
              size="xs"
              variant="subtle"
              p={4}
              style={{
                color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7],
              }}
            >
              <IconMenu2 size={20} />
            </Button>
          </Tooltip>

          <Box style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Text size="sm" c={colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7]} fw={500}>
              {currentPage} / {totalPages}
            </Text>
          </Box>

          <Box
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: theme.colors.gray[colorScheme === 'dark' ? 6 : 3],
            }}
          />

          <Tooltip label="Zoom Out">
            <Button
              size="xs"
              variant="subtle"
              p={4}
              onClick={handleZoomOut}
              style={{
                color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7],
              }}
            >
              <IconMinus size={20} />
            </Button>
          </Tooltip>

          <Tooltip label="Zoom In">
            <Button
              size="xs"
              variant="subtle"
              p={4}
              onClick={handleZoomIn}
              style={{
                color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7],
              }}
            >
              <IconPlus size={20} />
            </Button>
          </Tooltip>

          <Box
            style={{
              width: '1px',
              height: '24px',
              backgroundColor: theme.colors.gray[colorScheme === 'dark' ? 6 : 3],
            }}
          />

          <Box style={{ display: 'flex', alignItems: 'center' }}>
            <Text size="xs" c={colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7]} fw={500}>
              {scale}%
            </Text>
          </Box>

          <Box style={{ flex: 1 }} />

          <Tooltip label="Download">
            <Button
              size="xs"
              variant="subtle"
              p={4}
              onClick={handleDownload}
              style={{
                color: theme.colors[theme.primaryColor][5],
              }}
            >
              <IconDownload size={20} />
            </Button>
          </Tooltip>

          <Tooltip label="Print">
            <Button
              size="xs"
              variant="subtle"
              p={4}
              onClick={handlePrint}
              style={{
                color: theme.colors[theme.primaryColor][5],
              }}
            >
              <IconPrinter size={20} />
            </Button>
          </Tooltip>

          <Tooltip label="More">
            <Button
              size="xs"
              variant="subtle"
              p={4}
              style={{
                color: colorScheme === 'dark' ? theme.colors.gray[0] : theme.colors.dark[7],
              }}
            >
              <IconDots size={20} />
            </Button>
          </Tooltip>
        </Box>

        {/* Resume Preview Container */}
        <ScrollArea
          style={{
            flex: 1,
            width: '100%',
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : 'white',
          }}
          scrollbarSize={8}
        >
          <ResumeIframeCSR
            documentSize={settings.documentSize}
            scale={scale / 100}
            enablePDFViewer={true}
            hideScrollbar={true}
            debounceDelay={250}
          >
            <ResumePDFWrapper resume={resume} settings={settings} isPDF={true} />
          </ResumeIframeCSR>
        </ScrollArea>
      </Box>
    </>
  );
};

export const ResumePreview = memo(ResumePreviewContent);
ResumePreview.displayName = 'ResumePreview';
