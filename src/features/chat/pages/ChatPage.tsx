import { useEffect, useRef, useState } from 'react';

import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Button,
  Container,
  Drawer,
  Flex,
  Grid,
  Group,
  Image,
  List,
  ScrollArea,
  Stack,
  Switch,
  Text,
  Textarea,
  UnstyledButton,
  useMantineTheme,
} from '@mantine/core';
import { IconAlertCircle, IconMenu, IconPlus, IconTrash } from '@tabler/icons-react';

import {
  addMessageToSession,
  ChatSession,
  clearSessionMessages,
  countTokens,
  createCareerGuidanceSystemMessage,
  createChatSession,
  deleteChatSession,
  formatMessagesForGroq,
  getAllChatSessions,
  getCurrentSession,
  getCurrentSessionId,
  getDemoResponse,
  ChatMessage as GroqChatMessage,
  sendChatMessage,
  setCurrentSessionId,
  setDemoMode,
  shouldUseDemoMode,
} from '@/config/groq.config';
import { useTheme } from '@/theme/ThemeProvider';

import agentLogo from '../../../assets/gm-ai-cg-fav.png';
import { ChatMessage } from '../components';
import { ChatMessage as ChatMessageType } from '../types';

const promptSuggestions = [
  'Analyze current market opportunities',
  'What skills do I need to develop?',
  'Career path recommendations',
  'How to negotiate salary?',
  'Industry trends to watch',
  'Top companies to target',
  'Interview preparation tips',
  'Networking strategies',
  'Remote work best practices',
  'Professional development goals',
  'Leadership skills needed',
  'Work-life balance advice',
];

export const ChatPage: React.FC = () => {
  const mantineTheme = useMantineTheme();
  const { themeName } = useTheme();
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState('');
  const [hideToolCalls, setHideToolCalls] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setLocalCurrentSessionId] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [tokenCount, setTokenCount] = useState(0);
  const [useDemoMode, setUseDemoModeState] = useState(shouldUseDemoMode());
  const scrollRef = useRef<HTMLDivElement>(null);
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const primaryColor = mantineTheme.colors[mantineTheme.primaryColor][6];
  const accentColor = mantineTheme.colors[mantineTheme.primaryColor][4];
  const glassBackground = 'rgba(255, 255, 255, 0.7)';
  const glassBackgroundDark = 'rgba(255, 255, 255, 0.85)';

  // Initialize sessions and load current session
  useEffect(() => {
    const allSessions = getAllChatSessions();
    setSessions(allSessions);

    let sessionId = getCurrentSessionId();
    if (!sessionId && allSessions.length === 0) {
      // Create new session if none exist
      const newSession = createChatSession();
      setSessions([newSession]);
      sessionId = newSession.id;
    } else if (!sessionId && allSessions.length > 0) {
      // Load most recent session
      sessionId = allSessions[allSessions.length - 1].id;
      setCurrentSessionId(sessionId);
    }

    setLocalCurrentSessionId(sessionId);

    // Load messages from current session
    const session = getCurrentSession();
    if (session && session.messages) {
      // Ensure all messages have IDs for proper typing
      const messagesWithIds = session.messages.map((msg, idx) => ({
        ...msg,
        id: msg.id || `msg-${Date.now()}-${idx}`,
      }));
      setMessages(messagesWithIds as ChatMessageType[]);
      setTokenCount(session.tokenCount || 0);
    }
  }, []);

  // Save messages when they change
  useEffect(() => {
    if (currentSessionId) {
      const session = getCurrentSession();
      if (session) {
        session.messages = messages;
        session.updatedAt = new Date();
        const allSessions = getAllChatSessions();
        const index = allSessions.findIndex((s) => s.id === currentSessionId);
        if (index >= 0) {
          allSessions[index] = session;
          localStorage.setItem('career_guidance_chat_sessions', JSON.stringify(allSessions));
        }
      }
    }
  }, [messages, currentSessionId]);

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    setError(null);

    // Create user message
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      sender: 'user',
      message: input,
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      // Add user message to session
      if (currentSessionId) {
        addMessageToSession(currentSessionId, userMessage);
      }

      // Prepare messages for Groq API
      const groqMessages: GroqChatMessage[] = [
        createCareerGuidanceSystemMessage(),
        ...formatMessagesForGroq(newMessages),
      ];

      // Count tokens
      try {
        const tokenResponse = await countTokens(groqMessages);
        setTokenCount(tokenResponse.totalTokens);
      } catch (tokenError) {
        console.warn('Token counting failed:', tokenError);
      }

      // Use demo mode or real API
      let botResponse: string;
      if (useDemoMode) {
        // Simulate API delay in demo mode
        await new Promise((resolve) => setTimeout(resolve, 1000));
        botResponse = getDemoResponse(input);
      } else {
        botResponse = await sendChatMessage(groqMessages);
      }

      // Create bot message
      const botMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        message: botResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      // Save bot message to session
      if (currentSessionId) {
        addMessageToSession(currentSessionId, botMessage);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get response from AI';
      console.error('Chat error:', err);

      // If it's a rate limit or auth error, offer demo mode
      if (
        errorMessage.includes('Rate limit') ||
        errorMessage.includes('quota') ||
        errorMessage.includes('Authentication')
      ) {
        setError(`${errorMessage}\n\nWould you like to enable demo mode to test the chat? Click the toggle below.`);
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const toggleDemoMode = () => {
    const newDemoMode = !useDemoMode;
    setUseDemoModeState(newDemoMode);
    setDemoMode(newDemoMode);
    setError(null);

    if (newDemoMode) {
      setError('Demo mode enabled! You can now chat without API calls.');
    }
  };

  const handleNewSession = () => {
    const newSession = createChatSession();
    setSessions([...sessions, newSession]);
    setLocalCurrentSessionId(newSession.id);
    setMessages([]);
    setTokenCount(0);
    setError(null);
  };

  const handleSelectSession = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    setLocalCurrentSessionId(sessionId);
    const session = getCurrentSession();
    if (session && session.messages) {
      // Ensure all messages have IDs for proper typing
      const messagesWithIds = session.messages.map((msg, idx) => ({
        ...msg,
        id: msg.id || `msg-${Date.now()}-${idx}`,
      }));
      setMessages(messagesWithIds as ChatMessageType[]);
      setTokenCount(session.tokenCount || 0);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    deleteChatSession(sessionId);
    const remaining = sessions.filter((s) => s.id !== sessionId);
    setSessions(remaining);
    if (currentSessionId === sessionId) {
      if (remaining.length > 0) {
        handleSelectSession(remaining[0].id);
      } else {
        handleNewSession();
      }
    }
  };

  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
    setTimeout(() => {
      if (textAreaRef.current) {
        textAreaRef.current.focus();
      }
    }, 0);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  const chatStarted = messages.length > 0;

  return (
    <Box
      style={{
        display: 'flex',
        height: '100vh',
        width: '100%',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${mantineTheme.colors[mantineTheme.primaryColor][0]} 0%, ${mantineTheme.colors[mantineTheme.primaryColor][1]} 100%)`,
      }}
    >
      {/* Sidebar - Chat History */}
      <Drawer
        opened={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        withCloseButton={false}
        size={300}
        position="left"
        styles={{
          content: {
            backgroundColor: glassBackgroundDark,
            backdropFilter: 'blur(10px)',
            borderRight: `1px solid rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.1)`,
          },
        }}
      >
        <Stack gap="md" style={{ height: '100vh', overflow: 'hidden' }}>
          <Group justify="space-between" align="center">
            <Text fw={600} size="lg" c={mantineTheme.primaryColor}>
              Chat History
            </Text>
            <ActionIcon variant="subtle" onClick={handleNewSession} title="New chat" color={mantineTheme.primaryColor}>
              <IconPlus size={20} />
            </ActionIcon>
          </Group>

          <ScrollArea style={{ flex: 1 }}>
            <Stack gap="xs">
              {sessions.length === 0 ? (
                <Text size="sm" c="dimmed" ta="center">
                  No chat history yet
                </Text>
              ) : (
                sessions.map((session) => (
                  <Group
                    key={session.id}
                    justify="space-between"
                    align="center"
                    gap="xs"
                    p="xs"
                    style={{
                      borderRadius: 'var(--mantine-radius-md)',
                      backgroundColor:
                        currentSessionId === session.id
                          ? `rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.15)`
                          : 'rgba(255, 255, 255, 0.3)',
                      backdropFilter: 'blur(8px)',
                      border: `1px solid rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, ${currentSessionId === session.id ? '0.3' : '0.1'})`,
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                    }}
                    onClick={() => handleSelectSession(session.id)}
                  >
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text
                        size="sm"
                        fw={500}
                        truncate
                        title={session.title}
                        c={currentSessionId === session.id ? mantineTheme.primaryColor : 'gray'}
                      >
                        {session.title}
                      </Text>
                      <Text size="xs" c="dimmed">
                        {session.messages.length} messages
                      </Text>
                    </Box>
                    <ActionIcon
                      variant="subtle"
                      color={mantineTheme.primaryColor}
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                      title="Delete chat"
                    >
                      <IconTrash size={16} />
                    </ActionIcon>
                  </Group>
                ))
              )}
            </Stack>
          </ScrollArea>

          <Box
            p="xs"
            style={{
              borderTop: `1px solid rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.2)`,
              backgroundColor: glassBackgroundDark,
              backdropFilter: 'blur(10px)',
            }}
          >
            {tokenCount > 0 && (
              <Text size="xs" c={mantineTheme.primaryColor} mb="md">
                Tokens used: <strong>{tokenCount}</strong>
              </Text>
            )}

            <Group gap="xs" justify="space-between" align="center">
              <label htmlFor="demo-mode" style={{ cursor: 'pointer', flex: 1 }}>
                <Group gap="xs">
                  <Switch
                    id="demo-mode"
                    checked={useDemoMode}
                    onChange={toggleDemoMode}
                    color={mantineTheme.primaryColor}
                  />
                  <Text size="xs" c={useDemoMode ? mantineTheme.primaryColor : 'dimmed'}>
                    {useDemoMode ? '✓ Demo Mode' : 'Demo Mode'}
                  </Text>
                </Group>
              </label>
            </Group>
          </Box>
        </Stack>
      </Drawer>

      {/* Main Chat Area */}
      <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {chatStarted && (
          <Box
            style={{
              padding: 'var(--mantine-spacing-md)',
              borderBottom: `1px solid rgba(255, 255, 255, 0.2)`,
              backgroundColor: glassBackground,
              backdropFilter: 'blur(10px)',
            }}
          >
            <Group justify="space-between" align="center">
              <Group>
                <ActionIcon
                  variant="subtle"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  title="Toggle sidebar"
                  color={mantineTheme.primaryColor}
                >
                  <IconMenu size={20} />
                </ActionIcon>
                <Box
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '8px',
                    border: `2px solid ${primaryColor}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '4px',
                    flexShrink: 0,
                    background: `rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.1)`,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <img
                    src={agentLogo}
                    alt="Career Guidance Agent"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                </Box>
                <div>
                  <Text fw={600} size="lg" c={primaryColor}>
                    Career Guidance Agent
                  </Text>
                </div>
              </Group>
            </Group>
          </Box>
        )}

        {/* Messages Area or Welcome Screen */}
        <ScrollArea
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
          viewportRef={scrollRef}
          type="auto"
        >
          <Container size="lg" py="xl" style={{ width: '100%' }}>
            {error && (
              <Alert
                icon={<IconAlertCircle />}
                color={mantineTheme.primaryColor}
                title="Error"
                mb="md"
                onClose={() => setError(null)}
                withCloseButton
                style={{
                  backgroundColor: `rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.1)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.2)`,
                }}
              >
                {error}
              </Alert>
            )}

            {!chatStarted ? (
              <>
                <Box style={{ padding: 'var(--mantine-spacing-md)', position: 'absolute', top: 0, left: 0 }}>
                  <ActionIcon
                    variant="subtle"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    title="Toggle sidebar"
                    color={mantineTheme.primaryColor}
                  >
                    <IconMenu size={24} />
                  </ActionIcon>
                </Box>
                <Stack align="center" justify="center" style={{ minHeight: '100vh' }}>
                  <Group justify="center" mb="xl">
                    <Box
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: '12px',
                        border: `2px solid ${primaryColor}`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '4px',
                        background: `rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.15)`,
                        backdropFilter: 'blur(10px)',
                      }}
                    >
                      <img
                        src={agentLogo}
                        alt="Career Guidance Agent"
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                      />
                    </Box>
                    <Text fw={600} size="xl" c={primaryColor}>
                      Career Guidance Agent
                    </Text>
                  </Group>

                  <Stack style={{ width: '100%', maxWidth: 700 }} gap="lg">
                    <Text fw={500} size="md" ta="center" c={primaryColor}>
                      Prompt Suggestions For You
                    </Text>

                    <Grid gutter="sm">
                      {promptSuggestions.map((suggestion, index) => (
                        <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
                          <Button
                            variant="default"
                            fullWidth
                            onClick={() => handleSelectPrompt(suggestion)}
                            style={{
                              height: 'auto',
                              padding: 'var(--mantine-spacing-sm)',
                              whiteSpace: 'normal',
                              textAlign: 'left',
                              backgroundColor: `rgba(255, 255, 255, 0.5)`,
                              backdropFilter: 'blur(10px)',
                              border: `1px solid rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.2)`,
                              transition: 'all 150ms ease',
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = `rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.15)`;
                              e.currentTarget.style.borderColor = `rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.4)`;
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = `rgba(255, 255, 255, 0.5)`;
                              e.currentTarget.style.borderColor = `rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.2)`;
                            }}
                          >
                            <Group gap="xs" style={{ width: '100%' }}>
                              <Text
                                style={{
                                  fontSize: 'var(--mantine-font-size-sm)',
                                  flexWrap: 'wrap',
                                  color: primaryColor,
                                }}
                              >
                                ✨ {suggestion}
                              </Text>
                            </Group>
                          </Button>
                        </Grid.Col>
                      ))}
                    </Grid>
                  </Stack>
                </Stack>
              </>
            ) : (
              <Stack gap="md" py="lg">
                {messages.map((msg) => (
                  <ChatMessage key={msg.id} message={msg} />
                ))}
                {isLoading && (
                  <ChatMessage
                    message={{
                      id: 'loading',
                      sender: 'bot',
                      message: 'Thinking...',
                      timestamp: new Date(),
                      isLoading: true,
                    }}
                  />
                )}
              </Stack>
            )}
          </Container>
        </ScrollArea>

        {/* Input Area */}
        <Box
          style={{
            padding: 'var(--mantine-spacing-lg)',
            backgroundColor: glassBackground,
            backdropFilter: 'blur(10px)',
            borderTop: `1px solid rgba(255, 255, 255, 0.3)`,
          }}
        >
          <Container size="lg" style={{ width: '100%' }}>
            <Stack gap="md">
              <Textarea
                ref={textAreaRef}
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.currentTarget.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                disabled={isLoading}
                autoFocus={chatStarted}
                style={{
                  minHeight: 'auto',
                }}
                styles={{
                  input: {
                    minHeight: '40px',
                    resize: 'none',
                    backgroundColor: `rgba(255, 255, 255, 0.4)`,
                    backdropFilter: 'blur(8px)',
                    border: `1px solid rgba(${mantineTheme.colors[mantineTheme.primaryColor][6]}, 0.2)`,
                    color: mantineTheme.colors[mantineTheme.primaryColor][9],
                  },
                }}
              />

              <Group justify="space-between" align="center">
                <Group gap="xs">
                  <Switch
                    id="hide-tool-calls"
                    checked={hideToolCalls}
                    onChange={(e) => setHideToolCalls(e.currentTarget.checked)}
                    disabled={isLoading}
                    color={mantineTheme.primaryColor}
                  />
                  <label htmlFor="hide-tool-calls" style={{ cursor: 'pointer' }}>
                    <Text size="sm" c={mantineTheme.primaryColor} component="span">
                      Hide Tool Calls
                    </Text>
                  </label>
                </Group>

                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !input.trim()}
                  loading={isLoading}
                  color={mantineTheme.primaryColor}
                  style={{
                    background: `linear-gradient(135deg, ${mantineTheme.colors[mantineTheme.primaryColor][6]} 0%, ${mantineTheme.colors[mantineTheme.primaryColor][5]} 100%)`,
                    border: 'none',
                  }}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </Button>
              </Group>
            </Stack>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default ChatPage;
