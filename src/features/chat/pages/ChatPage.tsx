import { useEffect, useRef, useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Box,
  Center,
  Container,
  Flex,
  Group,
  Loader,
  Paper,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconLayoutSidebarLeftExpand, IconSend2, IconSparkles } from '@tabler/icons-react';
import { useQueryClient } from '@tanstack/react-query';

import { generateChatResponse } from '@/config/groq.config';

import { useCreateChatMessage } from '../api/useCreateChatMessage';
import { useCreateChatSession } from '../api/useCreateChatSession';
import { useGetChatSessionById } from '../api/useGetChatSessionById';
import { useGetChatSessionMessages } from '../api/useGetChatSessionMessages';
import { useGetChatSessions } from '../api/useGetChatSessions';
import { ChatMessage } from '../components/ChatMessage';
import { ChatSidebar } from '../components/ChatSidebar';
import type { ChatMessage as ChatMessageType } from '../types';
import * as styles from './ChatPage.css';

export function ChatPage() {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isMobile = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
  const queryClient = useQueryClient();

  const [currentSessionId, setCurrentSessionId] = useState<number | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessageType[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile); // Open by default on desktop

  const { data: sessionsResponse = [], isLoading: isLoadingSessions } = useGetChatSessions();
  const sessions = Array.isArray(sessionsResponse) ? sessionsResponse : sessionsResponse?.data || [];
  const { data: currentSessionData } = useGetChatSessionById(currentSessionId);
  const { data: messagesResponse = { data: [], total: 0, page: 1, limit: 50 } } =
    useGetChatSessionMessages(currentSessionId);

  const createSessionMutation = useCreateChatSession();
  const createMessageMutation = useCreateChatMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const isDark = colorScheme === 'dark';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  useEffect(() => {
    if (currentSessionId) {
      const msgs = currentSessionData?.messages || messagesResponse?.data || [];
      setLocalMessages(msgs);
    }
  }, [currentSessionId, currentSessionData]);

  useEffect(() => {
    if (sessions.length > 0 && !currentSessionId) {
      setCurrentSessionId(sessions[0].id);
    }
  }, [sessions]);

  const handleNewSession = async () => {
    if (!messageInput.trim()) return;
    try {
      const newSession = await createSessionMutation.mutateAsync({
        title: messageInput.slice(0, 50) || 'New Chat Session',
        ai_model: 'llama-3.1-8b-instant',
        system_prompt: 'You are a helpful AI career guidance assistant.',
      });
      if (newSession.id) {
        setCurrentSessionId(newSession.id);
        await queryClient.refetchQueries({ queryKey: ['chat', 'sessions'] });
        await sendMessage(newSession.id, messageInput);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = async (sessionId: number, content: string) => {
    if (!content.trim()) return;
    setIsLoadingResponse(true);
    try {
      const userMsg: ChatMessageType = {
        role: 'user',
        content,
        session_id: sessionId.toString(),
        user_id: 0,
        sequence_number: localMessages.length + 1,
        ai_model_used: 'llama-3.1-8b-instant',
        prompt_tokens: 45,
        completion_tokens: 0,
        total_tokens: 45,
        response_time_ms: 0,
        groq_request_id: '',
        finish_reason: '',
        is_helpful: false,
        feedback_note: null,
        created_at: new Date().toISOString(),
      };
      setLocalMessages((p) => [...p, userMsg]);
      const aiText = await generateChatResponse(content, {});
      const aiMsg: ChatMessageType = {
        role: 'assistant',
        content: aiText,
        session_id: sessionId.toString(),
        user_id: 0,
        sequence_number: localMessages.length + 2,
        ai_model_used: 'llama-3.1-8b-instant',
        prompt_tokens: 45,
        completion_tokens: 150,
        total_tokens: 195,
        response_time_ms: 0,
        groq_request_id: '',
        finish_reason: 'stop',
        is_helpful: false,
        feedback_note: null,
        created_at: new Date().toISOString(),
      };
      setLocalMessages((p) => [...p, aiMsg]);
      await createMessageMutation.mutateAsync({ sessionId: sessionId.toString(), data: userMsg });
      await createMessageMutation.mutateAsync({ sessionId: sessionId.toString(), data: aiMsg });
      setMessageInput('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoadingResponse(false);
    }
  };

  const handleSend = () => {
    if (!currentSessionId) handleNewSession();
    else sendMessage(currentSessionId, messageInput);
  };

  return (
    <Box style={{ display: 'flex', flexDirection: 'row', height: '100%', width: '100%' }}>
      {/* ── Sidebar (always visible on desktop, drawer on mobile) ── */}
      {sidebarOpen && (
        <>
          {/* Mobile backdrop */}
          {isMobile && (
            <Box
              onClick={() => setSidebarOpen(false)}
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 999,
              }}
            />
          )}

          {/* Sidebar Container */}
          <Box
            style={{
              width: 261,
              borderRight: `1px solid ${theme.colors.gray[colorScheme === 'dark' ? 7 : 3]}`,
              overflow: 'auto',
              display: 'flex',
              flexDirection: 'column',
              backgroundColor: colorScheme === 'dark' ? theme.colors.dark[8] : theme.white,
              position: isMobile ? 'fixed' : 'relative',
              left: 0,
              top: 0,
              bottom: 0,
              zIndex: isMobile ? 1000 : 'auto',
              animation: isMobile ? 'slideIn 250ms ease' : 'none',
            }}
          >
            <ChatSidebar
              sessions={sessions}
              currentSessionId={currentSessionId}
              onSessionSelect={(id) => {
                setLocalMessages([]);
                setCurrentSessionId(id);
                isMobile && setSidebarOpen(false);
              }}
              onNewSession={() => {
                setCurrentSessionId(null);
                setLocalMessages([]);
                setMessageInput('');
                isMobile && setSidebarOpen(false);
              }}
              onDeleteSession={(id) => console.log('delete', id)}
              isLoading={isLoadingSessions}
              currentSessionMessages={currentSessionData?.messages || messagesResponse?.data || []}
              onToggleSidebar={() => isMobile && setSidebarOpen(false)}
            />
          </Box>
        </>
      )}

      {/* ── Main chat content area ── */}
      <Box
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Sidebar toggle button */}
        <Box
          style={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 10,
          }}
        >
          <Tooltip label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'} withArrow position="right">
            <ActionIcon variant="subtle" size="lg" radius="md" onClick={() => setSidebarOpen((v) => !v)}>
              <IconLayoutSidebarLeftExpand
                size={20}
                stroke={1.6}
                style={{
                  transition: 'transform 250ms ease',
                  transform: sidebarOpen ? 'scaleX(-1)' : 'scaleX(1)',
                }}
              />
            </ActionIcon>
          </Tooltip>
        </Box>

        {/* Chat content */}
        <Flex direction="column" style={{ flex: 1, overflow: 'hidden' }}>
          {/* Scroll area */}
          <Box
            className={styles.scrollArea}
            style={{
              scrollbarColor:
                colorScheme === 'dark'
                  ? `${theme.colors[theme.primaryColor][7]}4d transparent`
                  : `${theme.colors[theme.primaryColor][2]} transparent`,
            }}
          >
            <Stack className={styles.contentCol} gap={0}>
              {localMessages.length === 0 ? (
                <Center className={styles.emptyWrap}>
                  <Stack align="center" gap="xl" maw={500}>
                    <Center className={styles.emptyRing}>
                      <IconSparkles size={28} stroke={1.5} className={styles.emptyIcon} />
                    </Center>
                    <Stack gap={6} align="center">
                      <Text className={styles.emptyHeading}>How can I help you?</Text>
                      <Text size="sm" c="dimmed" ta="center" maw={360}>
                        Ask me anything about your career — interviews, resumes, strategies, or growth planning.
                      </Text>
                    </Stack>
                    <Group gap="sm" justify="center" wrap="wrap">
                      {[
                        'Help me prep for interviews',
                        'Review my career path',
                        'Write a cover letter',
                        'Salary negotiation tips',
                      ].map((s) => (
                        <Paper
                          key={s}
                          className={styles.chip}
                          px="md"
                          py="xs"
                          radius="xl"
                          withBorder
                          onClick={() => setMessageInput(s)}
                          style={{
                            background:
                              colorScheme === 'dark'
                                ? `${theme.colors[theme.primaryColor][9]}0d`
                                : theme.colors[theme.primaryColor][0],
                            borderColor:
                              colorScheme === 'dark'
                                ? `${theme.colors[theme.primaryColor][6]}1a`
                                : theme.colors[theme.primaryColor][2],
                            color:
                              colorScheme === 'dark'
                                ? theme.colors[theme.primaryColor][3]
                                : theme.colors[theme.primaryColor][6],
                          }}
                        >
                          <Text size="xs" fw={500}>
                            {s}
                          </Text>
                        </Paper>
                      ))}
                    </Group>
                  </Stack>
                </Center>
              ) : (
                <Stack gap={0} py="xl">
                  {localMessages.map((msg, i) => (
                    <ChatMessage key={msg.id || i} message={msg} />
                  ))}
                  {isLoadingResponse && (
                    <Group gap="md" align="flex-start" px="xl" mt="md">
                      <Avatar size={34} radius="md" className={styles.aiAvatar}>
                        <IconSparkles size={16} stroke={1.5} />
                      </Avatar>
                      <Paper className={styles.typingPill} px="md" py="sm" radius="xl" withBorder>
                        <Loader size="xs" type="dots" />
                      </Paper>
                    </Group>
                  )}
                  <div ref={messagesEndRef} />
                </Stack>
              )}
            </Stack>
          </Box>

          {/* Input bar */}
          <Box className={styles.inputOuter}>
            <Box className={styles.inputCol}>
              <Paper className={styles.inputCard} radius="xl" withBorder p={8}>
                <Group gap={6} align="flex-end" wrap="nowrap">
                  <Textarea
                    placeholder="Ask AI Career Guidance…"
                    value={messageInput}
                    minRows={1}
                    maxRows={6}
                    autosize
                    variant="unstyled"
                    className={styles.textarea}
                    styles={{ input: { padding: '4px 8px', fontSize: 15, lineHeight: 1.6, background: 'transparent' } }}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        if (messageInput.trim() && !isLoadingResponse) handleSend();
                      }
                    }}
                    disabled={isLoadingResponse}
                    autoFocus
                    style={{ flex: 1 }}
                  />
                  <ActionIcon
                    className={styles.sendBtn}
                    onClick={handleSend}
                    disabled={!messageInput.trim() || isLoadingResponse}
                    loading={isLoadingResponse}
                    size={38}
                    radius="xl"
                    mb={2}
                    mr={2}
                  >
                    <IconSend2 size={17} stroke={2} />
                  </ActionIcon>
                </Group>
              </Paper>
              <Text size="xs" c="dimmed" ta="center" mt={4} className={styles.inputHint}>
                AI Career Guidance can make mistakes. Double-check important info.
              </Text>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Box>
  );
}
