import React, { useState } from 'react';

import {
  ActionIcon,
  Badge,
  Button,
  Card,
  Code,
  Container,
  Divider,
  Grid,
  Group,
  Image,
  List,
  Loader,
  Modal,
  ScrollArea,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import { IconArrowRight, IconBook, IconBulb, IconClock, IconVideo, IconX } from '@tabler/icons-react';
import { AnimatePresence, motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

import {
  generateModuleContent,
  generateTopicElaboration,
  generateVideoRecommendations,
} from '../../../config/groq.config';
import { useGetLearningModules } from '../../learningModules/api/useGetLearningModules';
import { useUpdateLearningModule } from '../../learningModules/api/useUpdateLearningModule';

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

interface ModuleContentCardProps {
  moduleTitle: string;
  moduleIndex: number;
  moduleId: number;
  onComplete?: () => void;
}

const ModuleContentCard: React.FC<ModuleContentCardProps> = ({ moduleTitle, moduleIndex, moduleId, onComplete }) => {
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

  const { refetch: refetchModules } = useGetLearningModules();
  const { mutate: updateModule, isPending } = useUpdateLearningModule();

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

  return (
    <Container size="lg">
      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <Card
          shadow="md"
          padding="lg"
          radius="md"
          mb="xl"
          withBorder
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-grape-6) 0%, var(--mantine-color-purple-6) 100%)',
          }}
        >
          <Group justify="space-between" align="flex-start">
            <Group align="flex-start">
              <Stack gap={4}>
                <Group gap={8}>
                  <ThemeIcon size="lg" radius="md" variant="light">
                    <IconBook size={24} />
                  </ThemeIcon>
                  <Badge size="sm" variant="light" style={{ minHeight: '24px' }}>
                    <Text fw={600} size="xs">
                      Module {moduleIndex + 1}: {moduleTitle}
                    </Text>
                  </Badge>
                  <Group gap={4}>
                    <IconClock size={14} />
                    <Text size="xs">Estimated: 15-20 min</Text>
                  </Group>
                </Group>
              </Stack>
            </Group>
          </Group>
        </Card>
      </motion.div>

      {/* Content Loading Section */}
      {sections.length === 0 && !error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Stack align="center" gap="lg" py="xl">
              {loading ? (
                <>
                  <Loader size="lg" />
                  <Text c="dimmed" ta="center">
                    Preparing your learning materials with AI...
                  </Text>
                </>
              ) : (
                <>
                  <IconBook size={48} stroke={1.5} opacity={0.5} />
                  <Stack gap={8} align="center">
                    <Text fw={500}>Ready to Learn?</Text>
                    <Text size="sm" c="dimmed" ta="center">
                      Click the button below to load AI-generated content for this module
                    </Text>
                  </Stack>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={handleLoadContent}
                      loading={loading}
                      rightSection={<IconArrowRight size={18} />}
                      size="md"
                    >
                      View Content
                    </Button>
                  </motion.div>
                </>
              )}
            </Stack>
          </Card>
        </motion.div>
      )}

      {/* Error State */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder bg="red.0" c="red.9">
            <Stack gap="md">
              <Text fw={500}>Error Loading Content</Text>
              <Text size="sm">{error}</Text>
              <Button variant="light" onClick={handleLoadContent} loading={loading}>
                Try Again
              </Button>
            </Stack>
          </Card>
        </motion.div>
      )}

      {/* Content Sections */}
      <AnimatePresence>
        {sections.map((section, index) => (
          <motion.div
            key={index}
            initial={section.isNew ? { opacity: 0, y: 20 } : { opacity: 1, y: 0 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: section.isNew ? 0.2 : index * 0.1,
              duration: 0.5,
            }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
              <Stack gap="md">
                {/* Section Header */}
                <Group justify="space-between" align="flex-start">
                  <Stack gap={4} flex={1}>
                    <Group gap={8}>
                      <Text fw={600} size="lg">
                        {section.title}
                      </Text>
                      {section.isAdvanced && (
                        <Badge size="sm" color="orange">
                          Advanced
                        </Badge>
                      )}
                    </Group>
                  </Stack>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                    onClick={() => handleElaborate(section.title)}
                  >
                    <ThemeIcon variant="light" size="md" radius="md">
                      <IconBulb size={18} />
                    </ThemeIcon>
                  </motion.button>
                </Group>

                {/* Section Content */}
                <div style={{ fontSize: '0.95rem', lineHeight: 1.6 }}>
                  <ReactMarkdown components={markdownRenderers}>{section.content}</ReactMarkdown>
                </div>

                {/* Code Example */}
                {section.codeExample?.code && (
                  <Stack gap="xs">
                    <Text fw={500} size="sm">
                      Example Code
                    </Text>
                    <SyntaxHighlighter
                      language={section.codeExample.language || 'javascript'}
                      style={vscDarkPlus}
                      customStyle={{ borderRadius: '8px' }}
                    >
                      {section.codeExample.code}
                    </SyntaxHighlighter>
                    {section.codeExample.explanation && (
                      <Card bg="gray.1" p="sm" radius="md">
                        <Text size="sm" c="dimmed">
                          {section.codeExample.explanation}
                        </Text>
                      </Card>
                    )}
                  </Stack>
                )}

                {/* Key Points */}
                {section.keyPoints && section.keyPoints.length > 0 && (
                  <Stack gap="xs">
                    <Text fw={500} size="sm">
                      Key Points
                    </Text>
                    <List
                      icon={
                        <ThemeIcon size="xs" radius="xl" variant="filled">
                          <IconArrowRight size={12} />
                        </ThemeIcon>
                      }
                      spacing="xs"
                    >
                      {section.keyPoints.map((point, idx) => (
                        <List.Item key={idx}>
                          <Text size="sm">{point}</Text>
                        </List.Item>
                      ))}
                    </List>
                  </Stack>
                )}
              </Stack>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Related Tutorials Section */}
      {sections.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
            <Stack gap="lg">
              <Group gap="sm">
                <ThemeIcon size="lg" radius="md" variant="light">
                  <IconVideo size={24} />
                </ThemeIcon>
                <Stack gap={2}>
                  <Text fw={600}>Related Tutorials</Text>
                  <Text size="sm" c="dimmed">
                    Watch video tutorials to reinforce your learning
                  </Text>
                </Stack>
              </Group>

              {!videoRecommendations && !videosLoading && (
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    onClick={handleLoadVideos}
                    loading={videosLoading}
                    variant="light"
                    fullWidth
                    rightSection={<IconArrowRight size={18} />}
                  >
                    Find Video Resources
                  </Button>
                </motion.div>
              )}

              {videosLoading && (
                <Stack align="center" gap="lg" py="lg">
                  <Loader size="md" />
                  <Text c="dimmed" size="sm">
                    Finding relevant video tutorials...
                  </Text>
                </Stack>
              )}

              {videoRecommendations && videoRecommendations.videos.length > 0 && (
                <Stack gap="md">
                  <Text size="sm" c="dimmed" style={{ fontStyle: 'italic' }}>
                    {videoRecommendations.topicSummary}
                  </Text>

                  <Grid gutter="md">
                    {videoRecommendations.videos.map((video: any, idx: number) => (
                      <Grid.Col key={idx} span={{ base: 12, sm: 6, md: 4 }}>
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <Card
                            shadow="xs"
                            padding={0}
                            radius="md"
                            withBorder
                            style={{
                              cursor: 'pointer',
                              transition: 'all 200ms ease',
                              height: '100%',
                              display: 'flex',
                              flexDirection: 'column',
                              overflow: 'hidden',
                            }}
                            onClick={() => {
                              if (video.link) {
                                window.open(video.link, '_blank');
                              }
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0, 0, 0, 0.15)';
                              e.currentTarget.style.transform = 'translateY(-6px)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow =
                                '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24)';
                              e.currentTarget.style.transform = 'translateY(0)';
                            }}
                          >
                            {/* Video Thumbnail */}
                            <div
                              style={{
                                position: 'relative',
                                width: '100%',
                                paddingTop: '56.25%',
                                backgroundColor: 'var(--mantine-color-gray-2)',
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
                              {/* Fallback or Play Button */}
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
                                  <ThemeIcon size="xl" radius="md" variant="light">
                                    <IconVideo size={32} />
                                  </ThemeIcon>
                                </div>
                              )}
                              {/* Duration Badge */}
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
                                    backgroundColor: 'var(--mantine-color-gray-2)',
                                    borderRadius: '2px',
                                    overflow: 'hidden',
                                  }}
                                >
                                  <div
                                    style={{
                                      width: `${(video.relevanceScore || 0.8) * 100}%`,
                                      height: '100%',
                                      backgroundColor: 'var(--mantine-color-grape-6)',
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
                            >
                              Watch on YouTube
                            </Button>
                          </Card>
                        </motion.div>
                      </Grid.Col>
                    ))}
                  </Grid>
                </Stack>
              )}
            </Stack>
          </Card>
        </motion.div>
      )}

      {/* Load More Content Button */}
      {sections.length > 0 && !expanded && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="lg">
            <Group justify="space-between">
              <Stack gap={4}>
                <Text fw={500}>Want more details?</Text>
                <Text size="sm" c="dimmed">
                  Load advanced content with additional examples and explanations
                </Text>
              </Stack>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
                    setExpanded(true);
                    handleLoadContent();
                  }}
                  loading={loading}
                  variant="light"
                  rightSection={<IconArrowRight size={18} />}
                >
                  Load Advanced
                </Button>
              </motion.div>
            </Group>
          </Card>
        </motion.div>
      )}

      {/* Action Buttons */}
      {sections.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder bg="grape.0">
            <Group justify="flex-end">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => {
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
                          onComplete?.();
                        },
                      }
                    );
                  }}
                  loading={isPending}
                  size="md"
                >
                  Mark as Complete
                </Button>
              </motion.div>
            </Group>
          </Card>
        </motion.div>
      )}

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
                  <Text fw={600} mb="xs">
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
    </Container>
  );
};

export default ModuleContentCard;
