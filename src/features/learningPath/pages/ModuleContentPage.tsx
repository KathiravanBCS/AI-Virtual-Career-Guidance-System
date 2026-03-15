import React, { useState } from 'react';

import {
  Badge,
  Button,
  Code,
  Container,
  Divider,
  Grid,
  Group,
  List,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
  Title,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconArrowLeft, IconArrowRight, IconBook, IconBulb, IconClock, IconVideo } from '@tabler/icons-react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import {
  generateModuleContent,
  generateTopicElaboration,
  generateVideoRecommendations,
} from '../../../config/groq.config';
import { useGetLearningModules } from '../../learningModules/api/useGetLearningModules';
import { useUpdateLearningModule } from '../../learningModules/api/useUpdateLearningModule';
import { useGetGuidanceWithModulesById } from '../api';
import useActivityLogger from '@/hooks/useActivityLogger';
import { useNotification } from '@/features/gamification/context/NotificationContext';
import { useLoggedInUser } from '@/lib/auth/useLoggedInUser';

interface CodeExample {
  language: string;
  code: string;
  explanation: string;
}

interface ModuleSection {
  title: string;
  content: string;
  keyPoints?: string[];
  codeExample?: CodeExample | null;
  isAdvanced?: boolean;
  isNew?: boolean;
}

interface ModuleContentResponse {
  title: string;
  type: 'technical' | 'general';
  sections: ModuleSection[];
}

const ModuleContentPage: React.FC = () => {
  const navigate = useNavigate();
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { id, moduleIndex } = useParams<{ id: string; moduleIndex: string }>();
  const guidanceId = id ? parseInt(id, 10) : 0;
  const moduleIdx = moduleIndex ? parseInt(moduleIndex, 10) : 0;

  const [loading, setLoading] = useState(false);
  const [sections, setSections] = useState<ModuleSection[]>([]);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [elaborationTopic, setElaborationTopic] = useState('');
  const [elaborationContent, setElaborationContent] = useState<any>(null);
  const [elaborationLoading, setElaborationLoading] = useState(false);
  const [videoRecommendations, setVideoRecommendations] = useState<any>(null);
  const [videosLoading, setVideosLoading] = useState(false);

  const { data: guidance } = useGetGuidanceWithModulesById(guidanceId);
  const { refetch: refetchModules } = useGetLearningModules();
  const { mutate: updateModule, isPending } = useUpdateLearningModule();
  const { showNotification } = useNotification();
  const { logModuleComplete } = useActivityLogger({
    showNotification,
  });
  const { user: loggedInUser } = useLoggedInUser();

  const module = guidance?.learning_modules?.[moduleIdx];
  const moduleTitle = module?.title || 'Module';
  const moduleId = module?.id || 0;
  const primaryColor = theme.colors[theme.primaryColor]?.[6] || theme.primaryColor;

  const handleLoadContent = async () => {
    setLoading(true);
    setError('');

    try {
      const response = (await generateModuleContent(moduleTitle, {
        detailed: expanded,
      })) as ModuleContentResponse;

      if (response?.sections && response.sections.length > 0) {
        setSections(response.sections);
      } else {
        setError('Failed to load content. Please try again.');
      }
    } catch (err) {
      console.error('Content generation error:', err);
      setError('Unable to generate content. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleElaborate = async (topic: string) => {
    setElaborationTopic(topic);
    setIsPopupOpen(true);
    setElaborationLoading(true);
    setElaborationContent(null);

    try {
      const elaboration = await generateTopicElaboration(topic, moduleTitle, {
        detailed: true,
        includeExamples: true,
      });

      setElaborationContent(elaboration);
    } catch (err) {
      console.error('Elaboration error:', err);
      setElaborationContent({
        title: topic,
        error: 'Failed to generate elaboration. Please try again.',
        sections: [],
      });
    } finally {
      setElaborationLoading(false);
    }
  };

  const closeElaborationPopup = () => {
    setIsPopupOpen(false);
    setTimeout(() => {
      setElaborationContent(null);
      setElaborationTopic('');
    }, 300);
  };

  const handleLoadVideos = async () => {
    setVideosLoading(true);
    try {
      const contentText = sections.map((s) => `${s.title}: ${s.content}`).join('\n') || moduleTitle;
      const videos = await generateVideoRecommendations(moduleTitle, contentText, {
        limit: 6,
      });
      setVideoRecommendations(videos);
    } catch (err) {
      console.error('Error loading videos:', err);
      setVideoRecommendations({
        moduleName: moduleTitle,
        topicSummary: `Learn ${moduleTitle} through video tutorials`,
        videos: [],
        searchSuggestions: [`${moduleTitle} tutorial`, `${moduleTitle} course`],
      });
    } finally {
      setVideosLoading(false);
    }
  };

  const markdownRenderers = {
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <div style={{ margin: '1rem 0' }}>
          <SyntaxHighlighter style={vscDarkPlus} language={match[1]} PreTag="div" {...props}>
            {String(children).replace(/\n$/, '')}
          </SyntaxHighlighter>
        </div>
      ) : (
        <Code {...props}>{children}</Code>
      );
    },
  };

  const handleBack = () => {
    navigate(`/learning-path/${id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          borderBottom: `1px solid ${theme.colors.gray[3]}`,
          padding: '16px 24px',
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : '#fafbfc',
        }}
      >
        <Group justify="space-between" align="center">
          <div style={{ textAlign: 'left' }}>
            <Text size="xs" c="dimmed">
              Module {moduleIdx + 1}
            </Text>
            <Text fw={600} size="sm" lineClamp={1} style={{ maxWidth: '300px' }}>
              {moduleTitle}
            </Text>
          </div>

          <Button
            variant="subtle"
            leftSection={<IconArrowLeft size={18} />}
            onClick={handleBack}
            style={{ color: primaryColor }}
          >
            Back to Learning Path
          </Button>
        </Group>
      </motion.div>

      {/* Content Area */}
      <ScrollArea style={{ flex: 1, overflow: 'auto' }}>
        <Container size="lg" py="xl" style={{ maxWidth: '100%' }}>
          {/* Module Info Card */}
          {sections.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                marginBottom: '24px',
                padding: '16px 20px',
                borderRadius: '12px',
                border: `1px solid ${theme.colors.gray[3]}`,
                backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : '#f8f9fa',
              }}
            >
              <Group justify="space-between" align="center">
                <Group gap="xs" align="center">
                  <ThemeIcon size="lg" radius="md" variant="light" style={{ color: primaryColor }}>
                    <IconBook size={20} />
                  </ThemeIcon>
                  <div>
                    <Text fw={600} size="sm">
                      {moduleTitle}
                    </Text>
                    <Group gap="xs">
                      <Group gap={4}>
                        <IconClock size={14} />
                        <Text size="xs" c="dimmed">
                          Estimated: 15-20 min
                        </Text>
                      </Group>
                      {module?.completion_percentage && module.completion_percentage > 0 && (
                        <Badge size="sm" variant="dot" style={{ backgroundColor: primaryColor }}>
                          {module.completion_percentage}% Complete
                        </Badge>
                      )}
                    </Group>
                  </div>
                </Group>
              </Group>
            </motion.div>
          )}

          {/* Content Loading Section */}
          {sections.length === 0 && !error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Stack
                align="center"
                gap="lg"
                py="xl"
                style={{
                  padding: '60px 20px',
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.gray[3]}`,
                  backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : '#f8f9fa',
                }}
              >
                {loading ? (
                  <>
                    <Loader size="lg" />
                    <Text c="dimmed" ta="center">
                      Preparing your learning materials with AI...
                    </Text>
                  </>
                ) : (
                  <>
                    <ThemeIcon size={64} radius="md" variant="light" style={{ color: primaryColor, opacity: 0.5 }}>
                      <IconBook size={40} />
                    </ThemeIcon>
                    <Stack gap={8} align="center">
                      <Text fw={600} size="lg">
                        Ready to Learn?
                      </Text>
                      <Text size="sm" c="dimmed" ta="center" maw={400}>
                        Click the button below to load AI-generated content for this module
                      </Text>
                    </Stack>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={handleLoadContent}
                        loading={loading}
                        rightSection={<IconArrowRight size={18} />}
                        size="md"
                        style={{ backgroundColor: primaryColor }}
                      >
                        View Content
                      </Button>
                    </motion.div>
                  </>
                )}
              </Stack>
            </motion.div>
          )}

          {/* Error State */}
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <Stack
                gap="md"
                p="lg"
                style={{
                  borderRadius: '12px',
                  border: `1px solid ${theme.colors.red[3]}`,
                  backgroundColor: theme.colors.red[0],
                }}
              >
                <div>
                  <Text fw={600} c="red">
                    Error Loading Content
                  </Text>
                  <Text size="sm" c="red">
                    {error}
                  </Text>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button onClick={handleLoadContent} loading={loading} size="sm">
                    Try Again
                  </Button>
                </motion.div>
              </Stack>
            </motion.div>
          )}

          {/* Main Content */}
          {sections.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Stack gap="xl">
                {/* Content Sections */}
                {sections.map((section, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                  >
                    <Stack
                      gap="md"
                      p="20px"
                      style={{
                        borderRadius: '12px',
                        border: `1px solid ${theme.colors.gray[3]}`,
                        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : '#f8f9fa',
                      }}
                    >
                      {/* Section Header */}
                      <div>
                        <Group justify="space-between" align="flex-start" mb="xs">
                          <Title
                            order={3}
                            style={{
                              color: primaryColor,
                              flex: 1,
                            }}
                          >
                            {section.title}
                          </Title>
                          <Group gap="xs">
                            {section.isAdvanced && (
                              <Badge size="sm" color="orange">
                                Advanced
                              </Badge>
                            )}
                            {section.isNew && (
                              <Badge size="sm" color="blue">
                                New
                              </Badge>
                            )}
                          </Group>
                        </Group>
                      </div>

                      {/* Section Content */}
                      <div
                        style={{
                          fontSize: '0.95rem',
                          lineHeight: 1.7,
                          color: colorScheme === 'dark' ? theme.colors.gray[4] : '#333',
                        }}
                      >
                        <ReactMarkdown components={markdownRenderers}>{section.content}</ReactMarkdown>
                      </div>

                      {/* Key Points */}
                      {section.keyPoints && section.keyPoints.length > 0 && (
                        <div
                          style={{
                            padding: '16px',
                            borderRadius: '8px',
                            border: `1px solid ${primaryColor}40`,
                            backgroundColor: `${primaryColor}10`,
                          }}
                        >
                          <Group gap={6} mb="xs">
                            <IconBulb size={16} style={{ color: primaryColor }} />
                            <Text fw={600} size="sm" style={{ color: primaryColor }}>
                              Key Points:
                            </Text>
                          </Group>
                          <List spacing="xs" ml="md">
                            {section.keyPoints.map((point, pidx) => (
                              <List.Item
                                key={pidx}
                                style={{ color: colorScheme === 'dark' ? theme.colors.gray[4] : '#333' }}
                              >
                                {point}
                              </List.Item>
                            ))}
                          </List>
                        </div>
                      )}

                      {/* Code Example */}
                      {section.codeExample && (
                        <div>
                          <Text fw={600} mb="xs" size="sm">
                            Code Example ({section.codeExample.language})
                          </Text>
                          <div style={{ marginBottom: '1rem', borderRadius: '8px', overflow: 'hidden' }}>
                            <SyntaxHighlighter style={vscDarkPlus} language={section.codeExample.language} PreTag="div">
                              {section.codeExample.code}
                            </SyntaxHighlighter>
                          </div>
                          <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                            {section.codeExample.explanation}
                          </Text>
                        </div>
                      )}

                      {/* Elaborate Button */}
                      <Group mt="md">
                        <Button
                          variant="light"
                          size="sm"
                          leftSection={<IconBulb size={14} />}
                          onClick={() => handleElaborate(section.title)}
                          style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                        >
                          Learn More About This
                        </Button>
                      </Group>

                      {idx < sections.length - 1 && <Divider />}
                    </Stack>
                  </motion.div>
                ))}

                {/* Video Recommendations */}
                <Stack
                  gap="md"
                  p="20px"
                  style={{
                    borderRadius: '12px',
                    border: `1px solid ${theme.colors.gray[3]}`,
                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : '#f8f9fa',
                  }}
                >
                  <Group justify="space-between" align="center">
                    <Title order={3} style={{ color: primaryColor, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <IconVideo size={20} />
                      Recommended Videos
                    </Title>
                  </Group>

                  {videoRecommendations ? (
                    <Stack gap="md">
                      <Text size="sm" c="dimmed">
                        {videoRecommendations.topicSummary}
                      </Text>

                      {videoRecommendations.videos && videoRecommendations.videos.length > 0 ? (
                        <Grid>
                          {videoRecommendations.videos.map((video: any, vidIdx: number) => (
                            <Grid.Col key={vidIdx} span={{ base: 12, sm: 6, md: 4 }}>
                              <div
                                style={{
                                  height: '100%',
                                  cursor: 'pointer',
                                  borderRadius: '8px',
                                  overflow: 'hidden',
                                  transition: 'box-shadow 0.3s ease',
                                }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.boxShadow = `0 8px 24px rgba(0, 0, 0, 0.15)`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.boxShadow = 'none';
                                }}
                              >
                                <Stack
                                  gap={0}
                                  style={{
                                    height: '100%',
                                    backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : 'white',
                                    borderRadius: '8px',
                                    overflow: 'hidden',
                                    border: `1px solid ${theme.colors.gray[3]}`,
                                    display: 'flex',
                                  }}
                                >
                                  {/* Video Thumbnail */}
                                  <div
                                    style={{
                                      position: 'relative',
                                      width: '100%',
                                      paddingTop: '56.25%',
                                      backgroundColor: theme.colors.gray[2],
                                      overflow: 'hidden',
                                    }}
                                  >
                                    {video.imageUrl ? (
                                      <img
                                        src={video.imageUrl}
                                        alt={video.title}
                                        style={{
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          width: '100%',
                                          height: '100%',
                                          objectFit: 'cover',
                                          transition: 'transform 0.3s ease',
                                        }}
                                        onError={(e) => {
                                          (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                      />
                                    ) : null}
                                    {!video.imageUrl && (
                                      <div
                                        style={{
                                          position: 'absolute',
                                          top: 0,
                                          left: 0,
                                          width: '100%',
                                          height: '100%',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        <ThemeIcon
                                          size="xl"
                                          radius="md"
                                          variant="light"
                                          style={{ color: primaryColor }}
                                        >
                                          <IconVideo size={32} />
                                        </ThemeIcon>
                                      </div>
                                    )}
                                    {video.duration && (
                                      <Badge
                                        size="xs"
                                        style={{
                                          position: 'absolute',
                                          bottom: '8px',
                                          right: '8px',
                                          backgroundColor: 'rgba(0, 0, 0, 0.7)',
                                          color: 'white',
                                        }}
                                      >
                                        {video.duration}
                                      </Badge>
                                    )}
                                  </div>

                                  <Stack gap="xs" p="md" style={{ flex: 1 }}>
                                    <div>
                                      <Text fw={600} size="sm" lineClamp={2}>
                                        {video.title}
                                      </Text>
                                      <Text size="xs" c="dimmed" lineClamp={1}>
                                        {video.channel}
                                      </Text>
                                    </div>

                                    {video.difficulty && (
                                      <Badge
                                        size="sm"
                                        variant="light"
                                        color={
                                          video.difficulty === 'beginner'
                                            ? 'blue'
                                            : video.difficulty === 'intermediate'
                                              ? 'grape'
                                              : 'orange'
                                        }
                                        style={{ alignSelf: 'fit-content' }}
                                      >
                                        {video.difficulty.toUpperCase()}
                                      </Badge>
                                    )}

                                    <Group gap="xs" mt="auto">
                                      <div
                                        style={{
                                          width: '100%',
                                          height: '3px',
                                          backgroundColor: theme.colors.gray[2],
                                          borderRadius: '2px',
                                          overflow: 'hidden',
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: `${(video.relevanceScore || 0.8) * 100}%`,
                                            height: '100%',
                                            backgroundColor: primaryColor,
                                            transition: 'width 0.3s ease',
                                          }}
                                        />
                                      </div>
                                    </Group>
                                  </Stack>

                                  <Button
                                    size="xs"
                                    fullWidth
                                    radius={0}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (video.link) {
                                        window.open(video.link, '_blank');
                                      }
                                    }}
                                    rightSection={<IconArrowRight size={14} />}
                                    style={{ backgroundColor: primaryColor }}
                                  >
                                    Watch on YouTube
                                  </Button>
                                </Stack>
                              </div>
                            </Grid.Col>
                          ))}
                        </Grid>
                      ) : (
                        <Button
                          onClick={handleLoadVideos}
                          loading={videosLoading}
                          rightSection={<IconArrowRight size={18} />}
                          style={{ backgroundColor: primaryColor }}
                        >
                          Load Videos
                        </Button>
                      )}
                    </Stack>
                  ) : (
                    <Button
                      onClick={handleLoadVideos}
                      loading={videosLoading}
                      rightSection={<IconArrowRight size={18} />}
                      style={{ backgroundColor: primaryColor }}
                    >
                      Load Videos
                    </Button>
                  )}
                </Stack>

                {/* Load More Content Button */}
                {!expanded && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                    <Stack
                      gap="md"
                      p="20px"
                      style={{
                        borderRadius: '12px',
                        border: `1px solid ${theme.colors.gray[3]}`,
                        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[6] : '#f8f9fa',
                      }}
                    >
                      <div>
                        <Text fw={600}>Want more details?</Text>
                        <Text size="sm" c="dimmed">
                          Load advanced content with additional examples and explanations
                        </Text>
                      </div>
                      <Button
                        onClick={() => {
                          setExpanded(true);
                          handleLoadContent();
                        }}
                        loading={loading}
                        variant="light"
                        rightSection={<IconArrowRight size={18} />}
                        style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                      >
                        Load Advanced
                      </Button>
                    </Stack>
                  </motion.div>
                )}

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Group justify="flex-end" gap="md">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => {
                          navigate(`/quiz`, {
                            state: {
                              selectedPathId: id,
                              selectedModuleIndex: moduleIdx,
                              from: {
                                pathname: window.location.pathname,
                                hash: window.location.hash,
                              },
                            },
                          });
                        }}
                        size="md"
                        variant="light"
                        style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                      >
                        Take Quiz
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={() => {
                          navigate(`/flashcards/generate`, {
                            state: {
                              selectedPathId: id,
                              selectedModuleIndex: moduleIdx,
                              from: {
                                pathname: window.location.pathname,
                                hash: window.location.hash,
                              },
                            },
                          });
                        }}
                        size="md"
                        variant="light"
                        style={{ color: primaryColor, borderColor: `${primaryColor}40` }}
                      >
                        Generate Flashcards
                      </Button>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        onClick={async () => {
                          // Log module completion and award points
                          await logModuleComplete(moduleId);
                          
                          // Update module status
                          updateModule(
                            {
                              moduleId,
                              data: {
                                completion_percentage: 100,
                                status: 'completed',
                              },
                            },
                            {
                              onSuccess: async () => {
                                await refetchModules();
                                handleBack();
                              },
                            }
                          );
                        }}
                        disabled={module?.completion_percentage === 100}
                        loading={isPending}
                        size="md"
                        style={{ backgroundColor: primaryColor }}
                      >
                        {module?.completion_percentage === 100 ? '✓ Completed' : 'Mark as Complete'}
                      </Button>
                    </motion.div>
                  </Group>
                </motion.div>
              </Stack>
            </motion.div>
          )}
        </Container>
      </ScrollArea>

      {/* Elaboration Modal */}
      <Modal opened={isPopupOpen} onClose={closeElaborationPopup} title={elaborationTopic} size="lg" radius="md">
        <ScrollArea>
          {elaborationLoading ? (
            <Stack align="center" gap="lg" py="xl">
              <Loader />
              <Text c="dimmed">Generating detailed explanation...</Text>
            </Stack>
          ) : elaborationContent?.error ? (
            <Stack gap="md">
              <Text c="red">{elaborationContent.error}</Text>
              <Button onClick={() => handleElaborate(elaborationTopic)} loading={elaborationLoading}>
                Try Again
              </Button>
            </Stack>
          ) : elaborationContent?.sections ? (
            <Stack gap="md">
              {elaborationContent.sections.map((section: any, idx: number) => (
                <div key={idx}>
                  <Text fw={600} mb="xs" style={{ color: primaryColor }}>
                    {section.title}
                  </Text>
                  <div style={{ fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                    <ReactMarkdown components={markdownRenderers}>{section.content}</ReactMarkdown>
                  </div>
                  {section.keyPoints && section.keyPoints.length > 0 && (
                    <List spacing="xs" mb="lg">
                      {section.keyPoints.map((point: string, pidx: number) => (
                        <List.Item key={pidx}>{point}</List.Item>
                      ))}
                    </List>
                  )}
                  {idx < elaborationContent.sections.length - 1 && <Divider my="lg" />}
                </div>
              ))}
            </Stack>
          ) : null}
        </ScrollArea>
      </Modal>
    </div>
  );
};

export default ModuleContentPage;
