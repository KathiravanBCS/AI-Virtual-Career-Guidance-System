import { Center, Container, Loader, useMantineTheme } from '@mantine/core';
import { motion } from 'framer-motion';
import { useParams } from 'react-router-dom';

import { useGetGuidanceWithModulesById } from '../api';
import { LearningPathDetailView } from '../components';

export const LearningPathDetailsPage: React.FC = () => {
  const theme = useMantineTheme();
  const { id } = useParams<{ id: string }>();
  const guidanceId = id ? parseInt(id, 10) : 0;

  const { data: guidance, isLoading, error } = useGetGuidanceWithModulesById(guidanceId);

  if (isLoading) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Loader size="lg" />
        </motion.div>
      </Center>
    );
  }

  if (error || !guidance) {
    return (
      <Center style={{ minHeight: '100vh' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: `rgba(255, 255, 255, 0.05)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid rgba(255, 255, 255, 0.1)`,
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.7)',
          }}
        >
          Error loading learning path
        </motion.div>
      </Center>
    );
  }

  return (
    <Container size="xl" py="xl">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
        <LearningPathDetailView guidance={guidance} onBack={() => window.history.back()} />
      </motion.div>
    </Container>
  );
};

export default LearningPathDetailsPage;
