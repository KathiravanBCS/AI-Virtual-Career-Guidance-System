import { useRef, useState } from 'react';

import { Alert, Button, Center, Container, Loader, Paper, Stack, Text, Title } from '@mantine/core';

import { SummaryCard } from '../components';
import { CareerSummary as CareerSummaryType } from '../types';

export const CareerSummaryPage: React.FC = () => {
  const [careerSummaries, setCareerSummaries] = useState<CareerSummaryType[]>([]);
  const [generatingSummary, setGeneratingSummary] = useState(false);

  const mockData = {
    user: { name: 'John Doe' },
    paths: [
      {
        $id: '1',
        careerName: 'Full Stack Developer',
        modules: ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Database'],
        completedModules: ['HTML', 'CSS', 'JavaScript'],
        progress: 50,
      },
      {
        $id: '2',
        careerName: 'Data Scientist',
        modules: ['Python', 'Statistics', 'ML', 'Deep Learning'],
        completedModules: ['Python'],
        progress: 25,
      },
    ],
  };

  const handleGenerateSummaries = async () => {
    setGeneratingSummary(true);

    try {
      // Mock summary generation - replace with actual API call
      const mockSummaries: CareerSummaryType[] = mockData.paths.map((career: any) => ({
        ref: useRef<HTMLDivElement>(null),
        data: {
          name: mockData.user.name,
          goal: career.careerName,
          progress: career.progress,
          completed: career.completedModules?.length || 0,
          total: career.modules?.length || 0,
        },
        summaryText: `
          <p><strong>Career Path Overview</strong></p>
          <p>You are progressing well in ${career.careerName}. Based on your current progress, 
          you have completed ${career.completedModules?.length || 0} out of ${career.modules?.length || 0} modules.</p>
          
          <p><strong>Strengths</strong></p>
          <p>Your performance shows strong dedication to learning. Continue building on your momentum.</p>
          
          <p><strong>Recommendations</strong></p>
          <p>Focus on completing remaining modules and applying knowledge through practical projects.</p>
        `,
      }));

      setCareerSummaries(mockSummaries);
    } catch (err) {
      console.error('Error generating summaries:', err);
    } finally {
      setGeneratingSummary(false);
    }
  };

  const handleDownload = async (ref: React.RefObject<HTMLDivElement | null>, filename: string) => {
    if (!ref.current) return;
    // PDF download would be implemented with html2pdf when added to dependencies
    console.log(`Downloading ${filename}`);
  };

  return (
    <Container size="lg" py="xl">
      <Stack gap="lg">
        {/* Generate Button Section */}
        {careerSummaries.length === 0 && (
          <Paper p="xl" radius="lg" withBorder ta="center">
            <Title order={1} mb="md">
              Career Summary
            </Title>
            <Text c="dimmed" mb="lg">
              Generate detailed summaries of your progress in each career path.
            </Text>
            <Button
              onClick={handleGenerateSummaries}
              loading={generatingSummary}
              disabled={generatingSummary || !mockData?.paths || mockData.paths.length === 0}
            >
              {generatingSummary ? 'Generating Summaries...' : 'Generate Career Summaries'}
            </Button>

            {(!mockData?.paths || mockData.paths.length === 0) && (
              <Alert color="red" mt="lg">
                No career paths found. Please create learning paths first.
              </Alert>
            )}
          </Paper>
        )}

        {/* Summaries Display */}
        {careerSummaries.map((summary, index) => (
          <SummaryCard key={index} summary={summary} onDownload={handleDownload} />
        ))}

        {/* Regenerate Button */}
        {careerSummaries.length > 0 && (
          <Button onClick={handleGenerateSummaries} loading={generatingSummary} variant="default" fullWidth>
            {generatingSummary ? 'Regenerating...' : 'Regenerate Summaries'}
          </Button>
        )}
      </Stack>
    </Container>
  );
};

export default CareerSummaryPage;
