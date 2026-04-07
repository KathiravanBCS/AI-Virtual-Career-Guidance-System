import { useEffect, useRef, useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Flex,
  Group,
  Loader,
  Modal,
  Stack,
  Text,
  Textarea,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import { IconSend2, IconSparkles, IconX } from '@tabler/icons-react';

import { generateChatResponse } from '@/config/groq.config';
import { useLoggedInUser } from '@/lib/auth/useLoggedInUser';

import { useCreateChatMessage } from '../api/useCreateChatMessage';
import { useCreateChatSession } from '../api/useCreateChatSession';
import { useGetChatSessionMessages } from '../api/useGetChatSessionMessages';
import { ChatMessage } from './ChatMessage';
import type { ChatMessage as ChatMessageType } from '../types';

interface ChatModalProps {
  opened: boolean;
  onClose: () => void;
  sessionId?: number | null;
}

const QUICK_ACTIONS = [
  {
    icon: '📚',
    title: 'Learning Resources',
    description: 'Get personalized learning recommendations',
  },
  {
    icon: '🎯',
    title: 'Career Path Planning',
    description: 'Create your personalized career roadmap',
  },
  {
    icon: '💡',
    title: 'Skill Assessment',
    description: 'Assess your current skills and gaps',
  },
  {
    icon: '📊',
    title: 'Progress Tracking',
    description: 'Monitor your learning progress',
  },
];

export function ChatModal({ opened, onClose, sessionId }: ChatModalProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { user } = useLoggedInUser();
  const isDark = colorScheme === 'dark';

  const [messageInput, setMessageInput] = useState('');
  const [isLoadingResponse, setIsLoadingResponse] = useState(false);
  const [localMessages, setLocalMessages] = useState<ChatMessageType[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<number | null>(sessionId || null);

  const { data: messagesResponse = { data: [], total: 0, page: 1, limit: 50 } } =
    useGetChatSessionMessages(currentSessionId);

  const createSessionMutation = useCreateChatSession();
  const createMessageMutation = useCreateChatMessage();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const areMessagesEqual = (a: ChatMessageType[], b: ChatMessageType[]) => {
    if (a.length !== b.length) return false;
    if (a.length === 0) return true;
    const aLast = a[a.length - 1];
    const bLast = b[b.length - 1];
    return aLast.created_at === bLast.created_at && aLast.content === bLast.content && aLast.role === bLast.role;
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [localMessages]);

  useEffect(() => {
    if (!currentSessionId || !messagesResponse?.data) return;
    setLocalMessages((prev) => (areMessagesEqual(prev, messagesResponse.data) ? prev : messagesResponse.data));
  }, [currentSessionId, messagesResponse?.data]);

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

  const handleQuickAction = (action: (typeof QUICK_ACTIONS)[0]) => {
    setMessageInput(`Tell me about: ${action.title}`);
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={
        <Group justify="space-between" style={{ width: '100%' }}>
          <Group gap="sm">
            <IconSparkles size={20} color={theme.colors[theme.primaryColor][6]} />
            <Text fw={600}>New chat</Text>
          </Group>
        </Group>
      }
      size="md"
      radius="lg"
      centered
      styles={{
        header: {
          background: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
          borderBottom: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
        },
        body: {
          display: 'flex',
          flexDirection: 'column',
          height: '70vh',
          padding: 0,
          background: isDark ? theme.colors.dark[8] : '#fff',
        },
      }}
    >
      {/* Messages Container */}
      <Box
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
        }}
      >
        {localMessages.length === 0 ? (
          /* Welcome State */
          <Stack gap="xl" style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Stack gap="md" align="center">
              <Avatar size={60} color={theme.primaryColor} radius="xl">
                <IconSparkles size={32} />
              </Avatar>
              <Stack gap={4} align="center">
                <Text fw={600} size="lg">
                  Hello {`${user?.first_name || ''} ${user?.last_name || ''}`.trim() || 'there'}!
                </Text>
                <Text size="sm" c="dimmed">
                  How can I help you today?
                </Text>
              </Stack>
            </Stack>

            {/* Quick Actions */}
            <Stack gap="md" style={{ width: '100%' }}>
              {QUICK_ACTIONS.map((action, idx) => (
                <Button
                  key={idx}
                  variant="light"
                  size="sm"
                  onClick={() => handleQuickAction(action)}
                  style={{
                    height: 'auto',
                    padding: '12px',
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    background: isDark
                      ? `${theme.colors[theme.primaryColor][8]}20`
                      : `${theme.colors[theme.primaryColor][0]}`,
                    border: `1px solid ${isDark ? theme.colors[theme.primaryColor][7] : theme.colors[theme.primaryColor][2]}`,
                  }}
                >
                  <Stack gap={2} style={{ flex: 1 }}>
                    <Group gap={8}>
                      <Text size="lg">{action.icon}</Text>
                      <Text fw={500} size="sm">
                        {action.title}
                      </Text>
                    </Group>
                    <Text size="xs" c="dimmed" pl={32}>
                      {action.description}
                    </Text>
                  </Stack>
                </Button>
              ))}
            </Stack>
          </Stack>
        ) : (
          /* Messages View */
          <>
            {localMessages.map((msg, idx) => (
              <ChatMessage key={idx} message={msg} />
            ))}
            {isLoadingResponse && (
              <Group>
                <Avatar
                  size={32}
                  radius="md"
                  style={{
                    background: isDark
                      ? `${theme.colors[theme.primaryColor][6]}24`
                      : `${theme.colors[theme.primaryColor][6]}17`,
                    color: theme.colors[theme.primaryColor][6],
                  }}
                >
                  <IconSparkles size={15} stroke={1.5} />
                </Avatar>
                <Loader size="sm" type="dots" />
              </Group>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </Box>

      {/* Input Area */}
      <Flex
        gap="sm"
        style={{
          padding: '16px',
          borderTop: `1px solid ${isDark ? theme.colors.dark[5] : theme.colors.gray[2]}`,
          background: isDark ? theme.colors.dark[7] : theme.colors.gray[0],
        }}
      >
        <Textarea
          placeholder="Type your message..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          style={{ flex: 1 }}
          minRows={1}
          maxRows={3}
          styles={{
            input: {
              background: isDark ? theme.colors.dark[6] : theme.colors.gray[1],
              borderColor: isDark ? theme.colors.dark[4] : theme.colors.gray[3],
              color: isDark ? theme.colors.gray[1] : theme.colors.gray[9],
              fontSize: '14px',
            },
          }}
          disabled={isLoadingResponse}
        />
        <Tooltip label="Send message">
          <ActionIcon
            size="lg"
            radius="md"
            color={theme.primaryColor}
            onClick={handleSend}
            disabled={!messageInput.trim() || isLoadingResponse}
            loading={isLoadingResponse}
          >
            <IconSend2 size={18} stroke={1.5} />
          </ActionIcon>
        </Tooltip>
      </Flex>
    </Modal>
  );
}
