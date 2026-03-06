import { useEffect } from 'react';

import {
  Box,
  Button,
  Container,
  Group,
  ScrollArea,
  Stack,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconDownload, IconEye } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Resume as ResumeComponent } from '@/components/Resume';
import { ResumeForm } from '@/components/ResumeForm';
import { useResumeStore, type Resume } from '@/lib/store/useResumeStore';

export const ResumeBuilderPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { setResume } = useResumeStore();

  // Load imported resume data when component mounts
  useEffect(() => {
    const state = location.state as { importedData?: Resume } | null;
    if (state?.importedData) {
      setResume(state.importedData);
    }
  }, [location.state, setResume]);

  const handleExportPDF = () => {
    // Export to PDF logic
    console.log('Exporting resume to PDF');
  };

  const handlePreview = () => {
    navigate('/resume-preview');
  };

  const actions = (
    <Group>
      <Button leftSection={<IconEye size={18} />} variant="default" onClick={handlePreview}>
        Preview
      </Button>
      <Button
        leftSection={<IconDownload size={18} />}
        variant="light"
        color={theme.primaryColor}
        onClick={handleExportPDF}
      >
        Export PDF
      </Button>
    </Group>
  );

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '82vh',
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
      }}
    >
      {/* Content Grid */}
      <Box
        style={{
          display: 'grid',
          gridTemplateColumns: '45% 55%',
          gap: 0,
          flex: 1,
          overflow: 'hidden',
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        }}
      >
        {/* Left: Form (Scrollable) */}
        <ScrollArea
          style={{
            height: '100%',
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
            borderRight: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 6 : 2]}`,
          }}
          scrollbarSize={8}
        >
          <div style={{ padding: '2rem' }}>
            <ResumeForm />
          </div>
        </ScrollArea>

        {/* Right: Resume Preview (Full Height) */}
        <Container
          size="fluid"
          h="100%"
          p={0}
          style={{
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <ResumeComponent />
        </Container>
      </Box>
    </Box>
  );
};

export default ResumeBuilderPage;
