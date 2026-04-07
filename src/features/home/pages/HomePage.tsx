import { useEffect, useRef, useState } from 'react';

import {
  Badge,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from '@mantine/core';
import {
  IconArrowRight,
  IconBrain,
  IconCheck,
  IconClock,
  IconPlayerPlay,
  IconQuote,
  IconRocket,
  IconShieldCheck,
  IconSparkles,
  IconStar,
  IconTrophy,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import { AnimatePresence, motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/lib/auth/useAuth';

// Add CSS for smooth animations
const animationStyles = `
  @keyframes pulse {
    0%, 100% {
      transform: translate3d(0,0,0) scale(1);
      opacity: var(--base-opacity, 0.3);
    }
    50% {
      transform: translate3d(0,0,0) scale(1.1);
      opacity: calc(var(--base-opacity, 0.3) * 1.4);
    }
  }
  @keyframes float {
    0%, 100% { transform: translateY(0px) rotate(0deg); }
    50% { transform: translateY(-10px) rotate(5deg); }
  }
  @keyframes gradient-x {
    0%, 100% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
  }
  .animate-float {
    animation: float 6s ease-in-out infinite;
  }
  .animate-gradient-x {
    background-size: 400% 400%;
    animation: gradient-x 8s ease infinite;
  }
`;

// Inject styles once
if (typeof document !== 'undefined' && !document.getElementById('particle-styles')) {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'particle-styles';
  styleSheet.innerText = animationStyles;
  document.head.appendChild(styleSheet);
}

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
}

interface Connection {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  opacity: number;
}

// Enhanced Particle Background Component
const ParticleBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [connections, setConnections] = useState<Connection[]>([]);

  useEffect(() => {
    const particleCount = 25;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 1.2 + 1,
      speedX: (Math.random() - 0.5) * 0.15,
      speedY: (Math.random() - 0.5) * 0.15,
      opacity: Math.random() * 0.25 + 0.2,
      color: Math.random() > 0.5 ? '#ff9d54' : '#ff8a30',
    }));
    setParticles(newParticles);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    let animationId: number;
    let lastTime = 0;
    const targetFPS = 60;
    const frameInterval = 1000 / targetFPS;

    const animateParticles = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        setParticles((prev) => {
          const newParticles = prev.map((particle) => {
            let newX = particle.x + particle.speedX;
            let newY = particle.y + particle.speedY;

            if (newX <= 0 || newX >= window.innerWidth) {
              particle.speedX *= -0.8;
              newX = Math.max(0, Math.min(window.innerWidth, newX));
            }
            if (newY <= 0 || newY >= window.innerHeight) {
              particle.speedY *= -0.8;
              newY = Math.max(0, Math.min(window.innerHeight, newY));
            }

            const dx = mousePosition.x - newX;
            const dy = mousePosition.y - newY;
            const distanceSquared = dx * dx + dy * dy;

            if (distanceSquared < 10000) {
              const distance = Math.sqrt(distanceSquared);
              const force = (100 - distance) / 100;
              newX -= dx * force * 0.004;
              newY -= dy * force * 0.004;
            }

            particle.speedX += (Math.random() - 0.5) * 0.0005;
            particle.speedY += (Math.random() - 0.5) * 0.0005;

            const maxSpeed = 0.4;
            particle.speedX = Math.max(-maxSpeed, Math.min(maxSpeed, particle.speedX));
            particle.speedY = Math.max(-maxSpeed, Math.min(maxSpeed, particle.speedY));

            return {
              ...particle,
              x: newX,
              y: newY,
            };
          });

          const newConnections: { x1: number; y1: number; x2: number; y2: number; opacity: number }[] = [];
          const maxConnections = 8;
          let connectionCount = 0;

          for (let i = 0; i < newParticles.length && connectionCount < maxConnections; i += 2) {
            for (let j = i + 2; j < newParticles.length && connectionCount < maxConnections; j += 2) {
              const dx = newParticles[i].x - newParticles[j].x;
              const dy = newParticles[i].y - newParticles[j].y;
              const distanceSquared = dx * dx + dy * dy;

              if (distanceSquared < 6400) {
                const opacity = ((6400 - distanceSquared) / 6400) * 0.12;
                newConnections.push({
                  x1: newParticles[i].x,
                  y1: newParticles[i].y,
                  x2: newParticles[j].x,
                  y2: newParticles[j].y,
                  opacity: opacity,
                });
                connectionCount++;
              }
            }
          }
          setConnections(newConnections);

          return newParticles;
        });

        lastTime = currentTime;
      }

      animationId = requestAnimationFrame(animateParticles);
    };

    animationId = requestAnimationFrame(animateParticles);
    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [mousePosition]);

  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
      }}
    >
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        {connections.map((connection, index) => (
          <motion.line
            key={index}
            x1={connection.x1}
            y1={connection.y1}
            x2={connection.x2}
            y2={connection.y2}
            stroke="#ff9d54"
            strokeWidth="1"
            opacity={connection.opacity}
            initial={{ opacity: 0 }}
            animate={{ opacity: connection.opacity }}
            transition={{ duration: 0.3 }}
          />
        ))}
      </svg>

      {particles.map((particle) => (
        <Box
          key={particle.id}
          style={
            {
              position: 'absolute',
              borderRadius: '9999px',
              '--base-opacity': particle.opacity,
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              backgroundColor: particle.color,
              opacity: particle.opacity,
              boxShadow: `0 0 ${particle.size * 1.5}px ${particle.color}20`,
              transform: 'translate3d(0,0,0)',
              animation: `pulse ${10 + Math.random() * 5}s ease-in-out infinite`,
              animationDelay: `${Math.random() * 3}s`,
            } as any
          }
        />
      ))}
    </Box>
  );
};

// Animated Counter Component
const AnimatedCounter = ({ target, duration = 3000 }: { target: string; duration?: number }) => {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const rawNumber = parseInt(target.replace(/\D/g, ''), 10);
    const hasK = target.includes('K');
    const end = hasK ? rawNumber * 1000 : rawNumber;

    const totalSteps = Math.floor(duration / 50);
    const step = Math.max(1, Math.floor(end / totalSteps));

    const timer = setInterval(() => {
      start += step;
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 50);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  const display = target.includes('K')
    ? `${Math.floor(count / 1000)}K+`
    : target.includes('+')
      ? `${count}+`
      : target.includes('%')
        ? `${count}%`
        : count;

  return <Text ref={ref}>{display}</Text>;
};

// Enhanced FAQ Component
const FaqItem = ({ question, answer, index }: { question: string; answer: string; index: number }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
    >
      <Paper
        p="md"
        radius="xl"
        style={{
          backgroundColor: 'rgba(42, 42, 42, 0.8)',
          border: '1px solid #3a3a3a',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
        }}
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(51, 51, 51, 0.8)';
          e.currentTarget.style.borderColor = '#ff9d54';
          e.currentTarget.style.boxShadow = '0 0 20px rgba(255, 157, 84, 0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(42, 42, 42, 0.8)';
          e.currentTarget.style.borderColor = '#3a3a3a';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <Group justify="space-between">
          <Text fw={500} c="white" size="sm">
            {question}
          </Text>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
            style={{ color: '#ff9d54', fontSize: '18px' }}
          >
            ▼
          </motion.div>
        </Group>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
            >
              <Text c="dimmed" size="sm" style={{ lineHeight: 1.6 }}>
                {answer}
              </Text>
            </motion.div>
          )}
        </AnimatePresence>
      </Paper>
    </motion.div>
  );
};

// Floating Elements Component
const FloatingElements = () => {
  return (
    <Box style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      <Box
        style={{
          position: 'absolute',
          top: '80px',
          left: '40px',
          width: '64px',
          height: '64px',
          border: '2px solid rgba(255, 157, 84, 0.25)',
          borderRadius: '9999px',
          animation: 'float 15s ease-in-out infinite',
          animationDelay: '0s',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          top: '128px',
          right: '64px',
          width: '48px',
          height: '48px',
          background: 'linear-gradient(135deg, rgba(255, 157, 84, 0.15), rgba(255, 138, 48, 0.15))',
          borderRadius: '8px',
          animation: 'float 14s ease-in-out infinite',
          animationDelay: '2s',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '128px',
          left: '64px',
          width: '40px',
          height: '40px',
          border: '2px solid rgba(255, 138, 48, 0.3)',
          borderRadius: '9999px',
          animation: 'float 10s ease-in-out infinite',
          animationDelay: '4s',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          right: '32px',
          width: '32px',
          height: '32px',
          backgroundColor: 'rgba(255, 157, 84, 0.2)',
          borderRadius: '9999px',
          animation: 'float 8s ease-in-out infinite',
          animationDelay: '1s',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '25%',
          right: '25%',
          width: '24px',
          height: '24px',
          border: '1px solid rgba(255, 138, 48, 0.25)',
          borderRadius: '8px',
          animation: 'float 16s ease-in-out infinite',
          animationDelay: '3s',
        }}
      />
    </Box>
  );
};

// Modern Data Structures
const features = [
  {
    icon: <IconBrain size={24} />,
    title: 'AI-Powered Intelligence',
    description:
      'Advanced machine learning algorithms create personalized learning experiences that adapt to your unique style and pace.',
    gradient: 'linear-gradient(135deg, #ff9d54, #ff8a30)',
    delay: 0.1,
  },
  {
    icon: <IconRocket size={24} />,
    title: 'Accelerated Growth',
    description:
      'Boost your learning speed with interactive modules, real-time feedback, and gamified progress tracking.',
    gradient: 'linear-gradient(135deg, #ff8a30, #ff9d54)',
    delay: 0.2,
  },
  {
    icon: <IconShieldCheck size={24} />,
    title: 'Proven Results',
    description:
      "Join thousands of successful learners who've achieved their goals with our scientifically-backed methodology.",
    gradient: 'linear-gradient(135deg, #ff9d54, #ff7a20)',
    delay: 0.3,
  },
  {
    icon: <IconWorld size={24} />,
    title: 'Global Community',
    description:
      'Connect with learners worldwide, share knowledge, and grow together in our supportive learning ecosystem.',
    gradient: 'linear-gradient(135deg, #ff8a30, #ff9d54)',
    delay: 0.4,
  },
  {
    icon: <IconTrophy size={24} />,
    title: 'Industry Recognition',
    description: 'Earn certificates and badges recognized by top companies and institutions worldwide.',
    gradient: 'linear-gradient(135deg, #ff9d54, #ff8a30)',
    delay: 0.5,
  },
  {
    icon: <IconClock size={24} />,
    title: '24/7 Availability',
    description: 'Learn anytime, anywhere with our cloud-based platform that syncs across all your devices.',
    gradient: 'linear-gradient(135deg, #ff7a20, #ff9d54)',
    delay: 0.6,
  },
];

const stats = [
  { number: '50K+', label: 'Active Learners', icon: <IconUser /> },
  { number: '200+', label: 'Learning Paths', icon: <IconRocket /> },
  { number: '98%', label: 'Success Rate', icon: <IconTrophy /> },
  { number: '24/7', label: 'AI Support', icon: <IconBrain /> },
];

const testimonials = [
  {
    name: 'Alexandra Chen',
    role: 'Senior Software Engineer',
    company: 'Google',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote:
      'Gokul Mohan AI Career Guidance System AI-driven approach revolutionized my learning journey. The personalized paths helped me master complex concepts faster than ever before.',
    rating: 5,
  },
  {
    name: 'Marcus Rodriguez',
    role: 'Data Scientist',
    company: 'Microsoft',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote:
      "The interactive modules and real-time feedback system are game-changers. I've never experienced such engaging and effective learning.",
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Product Manager',
    company: 'Meta',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    quote:
      'From beginner to expert in just months! The adaptive learning technology truly understands how I learn best.',
    rating: 5,
  },
];

const faqs = [
  {
    q: "How does Gokul Mohan AI Career Guidance System's AI personalization work?",
    a: 'Our advanced AI analyzes your learning patterns, performance metrics, and preferences to create a unique learning path. It continuously adapts based on your progress, ensuring optimal challenge levels and content delivery.',
  },
  {
    q: 'Is Gokul Mohan AI Career Guidance System suitable for complete beginners?',
    a: "Absolutely! Our platform is designed for learners at all levels. The AI assessment identifies your current knowledge and creates a customized starting point, whether you're a complete beginner or looking to advance existing skills.",
  },
  {
    q: 'What makes Gokul Mohan AI Career Guidance System different from other learning platforms?',
    a: 'Gokul Mohan AI Career Guidance System combines cutting-edge AI technology with proven educational methodologies. Our unique features include real-time adaptation, interactive simulations, peer collaboration tools, and industry-recognized certifications.',
  },
  {
    q: 'Can I learn at my own pace?',
    a: 'Yes! Gokul Mohan AI Career Guidance System is completely self-paced. You can pause, resume, or revisit any content anytime. The AI adjusts to your schedule and learning speed, ensuring you never feel rushed or held back.',
  },
  {
    q: 'What kind of support is available?',
    a: "We offer 24/7 AI-powered assistance, community forums, expert mentorship programs, and dedicated support teams. You'll never feel alone in your learning journey.",
  },
  {
    q: 'Are the certificates recognized by employers?',
    a: 'Yes! Our certificates are recognized by leading companies worldwide including Google, Microsoft, Amazon, and many others. We maintain partnerships with industry leaders to ensure our credentials hold real value.',
  },
];

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleStartLearning = () => {
    if (user) {
      navigate('/');
    } else {
      navigate('/auth/login');
    }
  };

  return (
    <Box style={{ backgroundColor: '#1c1b1b', color: 'white', position: 'relative', overflow: 'hidden' }}>
      {/* Particle Background */}
      <ParticleBackground />

      {/* Hero Section */}
      <Box
        component="section"
        style={{
          position: 'relative',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(to bottom right, #1c1b1b, #252525, #1c1b1b)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <FloatingElements />

        <Box
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'linear-gradient(to right, rgba(255, 157, 84, 0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 157, 84, 0.1) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
            opacity: 0.05,
          }}
        />

        <Box
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at center, rgba(255, 157, 84, 0.1) 0%, transparent 100%)',
          }}
        />

        <Container size="xl" style={{ position: 'relative', zIndex: 10, paddingTop: '80px', paddingBottom: '80px' }}>
          <Stack align="center" justify="center" gap="xl">
            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge
                variant="light"
                size="lg"
                leftSection={<IconSparkles size={16} />}
                style={{
                  backgroundColor: 'rgba(42, 42, 42, 0.8)',
                  border: '1px solid rgba(255, 157, 84, 0.3)',
                  color: '#ff9d54',
                }}
              >
                Next-Generation AI Learning Platform
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              style={{ textAlign: 'center' }}
            >
              <Title
                order={1}
                style={{
                  fontSize: 'clamp(32px, 8vw, 72px)',
                  fontWeight: 700,
                  marginBottom: '16px',
                  lineHeight: 1.2,
                }}
              >
                <div>Transform Your</div>
                <div
                  className="animate-gradient-x"
                  style={{
                    background: 'linear-gradient(to right, #ff9d54, #ff8a30, #ff9d54)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Learning Journey
                </div>
              </Title>
            </motion.div>

            {/* Subtitle */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Text size="lg" c="dimmed" style={{ maxWidth: '600px', textAlign: 'center', lineHeight: 1.6 }}>
                Unlock your potential with AI-powered personalized learning paths, interactive content, and real-time
                progress tracking.
              </Text>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <Group justify="center" gap="md">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handleStartLearning}
                    size="lg"
                    style={{
                      background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
                      color: 'white',
                      fontWeight: 600,
                      boxShadow: '0 10px 30px rgba(255, 157, 84, 0.25)',
                    }}
                    rightSection={<IconArrowRight size={18} />}
                  >
                    Start Learning Free
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="subtle"
                    size="lg"
                    style={{
                      backgroundColor: 'rgba(42, 42, 42, 0.8)',
                      border: '2px solid #3a3a3a',
                      color: 'white',
                      fontWeight: 600,
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ff9d54';
                      e.currentTarget.style.backgroundColor = 'rgba(51, 51, 51, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#3a3a3a';
                      e.currentTarget.style.backgroundColor = 'rgba(42, 42, 42, 0.8)';
                    }}
                    rightSection={<IconPlayerPlay size={18} style={{ color: '#ff9d54' }} />}
                  >
                    Watch Demo
                  </Button>
                </motion.div>
              </Group>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              <Group justify="center" gap="lg" style={{ marginTop: '48px' }}>
                <Group gap="sm">
                  <IconStar size={16} style={{ color: '#ff9d54' }} />
                  <Text size="sm" c="dimmed">
                    Trusted by 50K+ learners
                  </Text>
                </Group>
                <Group gap="sm">
                  <IconShieldCheck size={16} style={{ color: '#ff9d54' }} />
                  <Text size="sm" c="dimmed">
                    Industry certified
                  </Text>
                </Group>
                <Group gap="sm">
                  <IconTrophy size={16} style={{ color: '#ff9d54' }} />
                  <Text size="sm" c="dimmed">
                    98% success rate
                  </Text>
                </Group>
              </Group>
            </motion.div>
          </Stack>
        </Container>
      </Box>

      {/* Revolutionary Features Section */}
      <Box
        component="section"
        style={{
          position: 'relative',
          paddingTop: '128px',
          paddingBottom: '128px',
          background: 'linear-gradient(to bottom, #252525, #1c1b1b)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '80px',
            left: '40px',
            width: '288px',
            height: '288px',
            backgroundColor: 'rgba(255, 157, 84, 0.05)',
            borderRadius: '9999px',
            filter: 'blur(96px)',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '40px',
            width: '384px',
            height: '384px',
            backgroundColor: 'rgba(255, 138, 48, 0.05)',
            borderRadius: '9999px',
            filter: 'blur(96px)',
          }}
        />

        <Container size="xl" style={{ position: 'relative', zIndex: 10 }}>
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <Title
              order={2}
              style={{
                fontSize: 'clamp(24px, 6vw, 48px)',
                marginBottom: '16px',
                background: 'linear-gradient(to right, #ff9d54, #ff8a30, #ff9d54)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Revolutionary Features
            </Title>
            <Text size="lg" c="dimmed" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Discover cutting-edge technology that adapts to your learning style and accelerates your growth
            </Text>
          </motion.div>

          {/* Features Grid */}
          <Grid gutter="lg">
            {features.map((feature, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: feature.delay }}
                  whileHover={{ y: -5, scale: 1.01 }}
                >
                  <Paper
                    p="lg"
                    radius="xl"
                    style={{
                      backgroundColor: 'rgba(42, 42, 42, 0.5)',
                      border: '1px solid #3a3a3a',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 157, 84, 0.5)';
                      e.currentTarget.style.backgroundColor = 'rgba(42, 42, 42, 0.6)';
                      const gradient = e.currentTarget.querySelector('.gradient-overlay') as HTMLElement;
                      if (gradient) gradient.style.opacity = '0.08';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#3a3a3a';
                      e.currentTarget.style.backgroundColor = 'rgba(42, 42, 42, 0.5)';
                      const gradient = e.currentTarget.querySelector('.gradient-overlay') as HTMLElement;
                      if (gradient) gradient.style.opacity = '0';
                    }}
                  >
                    <Box
                      className="gradient-overlay"
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: feature.gradient,
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                        borderRadius: '12px',
                      }}
                    />

                    <Stack gap="md" style={{ position: 'relative', zIndex: 10 }}>
                      <ThemeIcon
                        size="lg"
                        radius="md"
                        style={{ background: feature.gradient, transition: 'all 0.3s ease' }}
                      >
                        <Box style={{ color: 'white' }}>{feature.icon}</Box>
                      </ThemeIcon>

                      <div>
                        <Title order={3} size="h5" style={{ marginBottom: '8px' }}>
                          {feature.title}
                        </Title>
                        <Text size="sm" c="dimmed">
                          {feature.description}
                        </Text>
                      </div>
                    </Stack>

                    <Box
                      style={{
                        position: 'absolute',
                        top: '12px',
                        right: '12px',
                        width: '64px',
                        height: '64px',
                        border: '1px solid rgba(255, 157, 84, 0.15)',
                        borderRadius: '9999px',
                        opacity: 0,
                        transition: 'opacity 0.3s ease',
                      }}
                    />
                  </Paper>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box
        component="section"
        style={{
          position: 'relative',
          paddingTop: '80px',
          paddingBottom: '80px',
          background: 'linear-gradient(135deg, #1c1b1b, #2a2a2a, #1c1b1b)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255, 157, 84, 0.08), transparent)',
            borderRadius: '9999px',
          }}
        />

        <Container size="xl" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '48px' }}
          >
            <Title
              order={2}
              style={{
                fontSize: 'clamp(24px, 6vw, 48px)',
                marginBottom: '12px',
                background: 'linear-gradient(to right, #ff9d54, #ff8a30, #ff9d54)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Trusted by Learners Worldwide
            </Title>
            <Text size="lg" c="dimmed" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Join our growing community of successful learners and transform your career
            </Text>
          </motion.div>

          <Grid gutter="lg">
            {stats.map((stat, index) => (
              <Grid.Col key={index} span={{ base: 6, md: 3 }}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ scale: 1.03, y: -5 }}
                >
                  <Paper
                    p="xl"
                    radius="xl"
                    style={{
                      backgroundColor: 'rgba(42, 42, 42, 0.6)',
                      border: '1px solid #3a3a3a',
                      textAlign: 'center',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 157, 84, 0.4)';
                      e.currentTarget.style.backgroundColor = 'rgba(51, 51, 51, 0.6)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#3a3a3a';
                      e.currentTarget.style.backgroundColor = 'rgba(42, 42, 42, 0.6)';
                    }}
                  >
                    <Stack gap="sm" align="center">
                      <Box style={{ color: '#ff9d54', fontSize: '28px' }}>{stat.icon}</Box>
                      <Title order={3} size="h3" style={{ fontSize: '28px', fontWeight: 700 }}>
                        <AnimatedCounter target={stat.number} />
                      </Title>
                      <Text size="sm" c="dimmed" fw={500}>
                        {stat.label}
                      </Text>
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Testimonials Section */}
      <Box
        component="section"
        style={{
          position: 'relative',
          paddingTop: '96px',
          paddingBottom: '96px',
          background: 'linear-gradient(to bottom, #1c1b1b, #252525)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '128px',
            left: '64px',
            width: '192px',
            height: '192px',
            backgroundColor: 'rgba(255, 157, 84, 0.05)',
            borderRadius: '9999px',
            filter: 'blur(96px)',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '128px',
            right: '64px',
            width: '256px',
            height: '256px',
            backgroundColor: 'rgba(255, 138, 48, 0.05)',
            borderRadius: '9999px',
            filter: 'blur(96px)',
          }}
        />

        <Container size="xl" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <Title
              order={2}
              style={{
                fontSize: 'clamp(24px, 6vw, 48px)',
                marginBottom: '16px',
                background: 'linear-gradient(to right, #ff9d54, #ff8a30, #ff9d54)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Success Stories
            </Title>
            <Text size="lg" c="dimmed" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Hear from professionals who transformed their careers with Gokul Mohan AI Career Guidance System
            </Text>
          </motion.div>

          <Grid gutter="lg">
            {testimonials.map((testimonial, index) => (
              <Grid.Col key={index} span={{ base: 12, md: 6, lg: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.15 }}
                  whileHover={{ y: -5, scale: 1.01 }}
                >
                  <Paper
                    p="lg"
                    radius="xl"
                    style={{
                      backgroundColor: 'rgba(42, 42, 42, 0.5)',
                      border: '1px solid #3a3a3a',
                      position: 'relative',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255, 157, 84, 0.5)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#3a3a3a';
                    }}
                  >
                    <Stack gap="md">
                      <Group justify="space-between">
                        <Group gap="xs">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <IconStar key={i} size={16} style={{ color: '#ff9d54' }} />
                          ))}
                        </Group>
                        <IconQuote size={20} style={{ color: 'rgba(255, 157, 84, 0.25)' }} />
                      </Group>

                      <Text size="sm" c="dimmed" style={{ fontStyle: 'italic', lineHeight: 1.6 }}>
                        "{testimonial.quote}"
                      </Text>

                      <Group gap="sm">
                        <Image
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          radius="full"
                          width={48}
                          height={48}
                          style={{ border: '2px solid rgba(255, 157, 84, 0.3)' }}
                        />
                        <Stack gap="xs" style={{ flex: 1 }}>
                          <Text size="sm" fw={600}>
                            {testimonial.name}
                          </Text>
                          <Text size="xs" style={{ color: '#ff9d54', fontWeight: 500 }}>
                            {testimonial.role}
                          </Text>
                          <Text size="xs" c="dimmed">
                            {testimonial.company}
                          </Text>
                        </Stack>
                      </Group>
                    </Stack>
                  </Paper>
                </motion.div>
              </Grid.Col>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* FAQ Section */}
      <Box
        component="section"
        style={{
          position: 'relative',
          paddingTop: '96px',
          paddingBottom: '96px',
          background: 'linear-gradient(to bottom, #252525, #1c1b1b)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '64px',
            right: '64px',
            width: '224px',
            height: '224px',
            backgroundColor: 'rgba(255, 157, 84, 0.05)',
            borderRadius: '9999px',
            filter: 'blur(96px)',
          }}
        />
        <Box
          style={{
            position: 'absolute',
            bottom: '64px',
            left: '64px',
            width: '288px',
            height: '288px',
            backgroundColor: 'rgba(255, 138, 48, 0.05)',
            borderRadius: '9999px',
            filter: 'blur(96px)',
          }}
        />

        <Container size="md" style={{ position: 'relative', zIndex: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <Title
              order={2}
              style={{
                fontSize: 'clamp(24px, 6vw, 48px)',
                marginBottom: '16px',
                background: 'linear-gradient(to right, #ff9d54, #ff8a30, #ff9d54)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Got Questions?
            </Title>
            <Text size="lg" c="dimmed" style={{ maxWidth: '600px', margin: '0 auto' }}>
              Find answers to the most common questions about Gokul Mohan AI Career Guidance System
            </Text>
          </motion.div>

          <Stack gap="lg">
            {faqs.map((item, index) => (
              <FaqItem key={index} question={item.q} answer={item.a} index={index} />
            ))}
          </Stack>
        </Container>
      </Box>

      {/* Final CTA Section */}
      <Box
        component="section"
        style={{
          position: 'relative',
          paddingTop: '96px',
          paddingBottom: '96px',
          background: 'linear-gradient(135deg, #1c1b1b, #2a2a2a, #1c1b1b)',
          overflow: 'hidden',
          zIndex: 1,
        }}
      >
        <Box
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(255, 157, 84, 0.08), transparent)',
            borderRadius: '9999px',
          }}
        />

        <Container size="md" style={{ position: 'relative', zIndex: 10 }}>
          <Stack align="center" justify="center" gap="lg" style={{ textAlign: 'center' }}>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Title
                order={2}
                style={{
                  fontSize: 'clamp(28px, 8vw, 56px)',
                  marginBottom: '16px',
                  lineHeight: 1.2,
                }}
              >
                <div>Ready to</div>
                <div
                  style={{
                    background: 'linear-gradient(to right, #ff9d54, #ff8a30, #ff9d54)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}
                >
                  Transform Your Future?
                </div>
              </Title>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <Text size="lg" c="dimmed" style={{ maxWidth: '500px', lineHeight: 1.6 }}>
                Join 50,000+ learners who've already started their journey to success. Your future self will thank you.
              </Text>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <Group justify="center" gap="md">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    onClick={handleStartLearning}
                    size="lg"
                    style={{
                      background: 'linear-gradient(to right, #ff9d54, #ff8a30)',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '16px',
                      boxShadow: '0 10px 30px rgba(255, 157, 84, 0.3)',
                    }}
                    rightSection={<IconRocket size={20} />}
                  >
                    Start Your Journey Free
                  </Button>
                </motion.div>

                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button
                    variant="subtle"
                    size="lg"
                    style={{
                      backgroundColor: 'rgba(42, 42, 42, 0.8)',
                      border: '2px solid #3a3a3a',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '16px',
                      transition: 'all 0.3s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#ff9d54';
                      e.currentTarget.style.backgroundColor = 'rgba(51, 51, 51, 0.8)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#3a3a3a';
                      e.currentTarget.style.backgroundColor = 'rgba(42, 42, 42, 0.8)';
                    }}
                    rightSection={<IconPlayerPlay size={20} style={{ color: '#ff9d54' }} />}
                  >
                    Book a Demo
                  </Button>
                </motion.div>
              </Group>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}
            >
              <Group justify="center" gap="lg">
                <Group gap="sm">
                  <IconCheck size={16} style={{ color: '#ff9d54' }} />
                  <Text size="sm" c="dimmed">
                    No credit card required
                  </Text>
                </Group>
                <Group gap="sm">
                  <IconCheck size={16} style={{ color: '#ff9d54' }} />
                  <Text size="sm" c="dimmed">
                    Cancel anytime
                  </Text>
                </Group>
                <Group gap="sm">
                  <IconCheck size={16} style={{ color: '#ff9d54' }} />
                  <Text size="sm" c="dimmed">
                    30-day money back guarantee
                  </Text>
                </Group>
              </Group>
            </motion.div>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

// Wrapper component that handles authentication redirect
export const HomePage_Wrapped: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && user) {
      navigate('/', { replace: true });
    }
  }, [user, isLoading, navigate]);

  if (isLoading || user) {
    return null;
  }

  return <HomePage />;
};

export default HomePage;
