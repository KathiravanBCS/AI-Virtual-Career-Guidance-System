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
import { useNavigate } from 'react-router-dom';

import { Resume } from '@/components/Resume';
import { ResumeForm } from '@/components/ResumeForm';

export const ResumeBuilderPage: React.FC = () => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const navigate = useNavigate();

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
      {/* Header */}
      {/* <Box
        p="md"
        style={{
          borderBottom: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 2]}`,
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        }}
      >
        <Group justify="space-between" align="flex-start">
          <Stack gap={0}>
            <Text fw={700} size="h2" c={colorScheme === 'dark' ? theme.colors.gray[0] : 'black'}>
              Resume Builder
            </Text>
            <Text size="sm" c="dimmed">
              Create and manage your professional resume
            </Text>
          </Stack>
          {actions}
        </Group>
      </Box> */}

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
          <Resume />
        </Container>
      </Box>
    </Box>
  );
};

export default ResumeBuilderPage;
