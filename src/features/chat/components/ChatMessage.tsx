import { useState } from 'react';

import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Code,
  Group,
  Paper,
  Stack,
  Text,
  Tooltip,
  useMantineColorScheme,
  useMantineTheme,
} from '@mantine/core';
import {
  IconCheck,
  IconCopy,
  IconDotsVertical,
  IconSparkles,
  IconThumbDown,
  IconThumbUp,
  IconUser,
} from '@tabler/icons-react';

import type { ChatMessage as ChatMessageType } from '../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

/* ─────────────────────────────────────────
   Markdown renderer — no external library.
   Handles: headings, bold, italic, inline
   code, fenced code blocks, bullet lists,
   numbered lists, horizontal rules.
───────────────────────────────────────── */
function MarkdownRenderer({ content, isUser }: { content: string; isUser: boolean }) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const textColor = isUser ? '#fff' : isDark ? theme.colors.gray[1] : theme.colors.gray[9];
  const dimColor = isUser ? 'rgba(255,255,255,0.65)' : isDark ? 'rgba(255,255,255,0.35)' : 'rgba(0,0,0,0.4)';

  // Split into blocks separated by blank lines or code fences
  const blocks = parseBlocks(content);

  return (
    <Stack gap={12}>
      {blocks.map((block, i) => {
        /* ── Fenced code block ── */
        if (block.type === 'code') {
          return (
            <Box key={i}>
              {block.lang && (
                <Box
                  px="sm"
                  py={4}
                  style={{
                    background: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.06)',
                    borderRadius: '8px 8px 0 0',
                    borderBottom: `1px solid ${isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Text size="xs" style={{ color: dimColor, fontFamily: 'monospace', fontWeight: 500 }}>
                    {block.lang}
                  </Text>
                  <CopyCodeButton code={block.text} isDark={isDark} />
                </Box>
              )}
              <Box
                style={{
                  background: isDark ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0.04)',
                  borderRadius: block.lang ? '0 0 8px 8px' : 8,
                  border: `1px solid ${isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.07)'}`,
                  borderTop: block.lang ? 'none' : undefined,
                  overflow: 'auto',
                  padding: '12px 14px',
                }}
              >
                <Text
                  size="xs"
                  style={{
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
                    lineHeight: 1.7,
                    whiteSpace: 'pre',
                    color: isDark ? '#c9d1d9' : '#24292f',
                    wordBreak: 'keep-all',
                  }}
                >
                  {block.text}
                </Text>
              </Box>
            </Box>
          );
        }

        /* ── Horizontal rule ── */
        if (block.type === 'hr') {
          return (
            <Box
              key={i}
              style={{
                height: 1,
                background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
                margin: '4px 0',
              }}
            />
          );
        }

        /* ── Heading ── */
        if (block.type === 'heading') {
          const sizes: Record<number, string> = { 1: '18px', 2: '16px', 3: '14px' };
          return (
            <Text
              key={i}
              fw={700}
              style={{
                fontSize: sizes[block.level ?? 1] ?? '14px',
                color: textColor,
                lineHeight: 1.3,
                marginTop: i > 0 ? 4 : 0,
              }}
            >
              {renderInline(block.text, isUser, isDark, theme)}
            </Text>
          );
        }

        /* ── Bullet list ── */
        if (block.type === 'ul') {
          return (
            <Stack key={i} gap={4} pl="xs">
              {block.items!.map((item, j) => (
                <Group key={j} gap={8} align="flex-start" wrap="nowrap">
                  <Box
                    style={{
                      width: 5,
                      height: 5,
                      borderRadius: '50%',
                      background: isUser ? 'rgba(255,255,255,0.7)' : theme.colors[theme.primaryColor][6],
                      marginTop: 8,
                      flexShrink: 0,
                    }}
                  />
                  <Text size="sm" lh={1.65} style={{ color: textColor, flex: 1 }}>
                    {renderInline(item, isUser, isDark, theme)}
                  </Text>
                </Group>
              ))}
            </Stack>
          );
        }

        /* ── Numbered list ── */
        if (block.type === 'ol') {
          return (
            <Stack key={i} gap={4} pl="xs">
              {block.items!.map((item, j) => (
                <Group key={j} gap={8} align="flex-start" wrap="nowrap">
                  <Text
                    size="xs"
                    fw={600}
                    style={{
                      color: isUser ? 'rgba(255,255,255,0.7)' : theme.colors[theme.primaryColor][6],
                      minWidth: 18,
                      marginTop: 2,
                      flexShrink: 0,
                    }}
                  >
                    {j + 1}.
                  </Text>
                  <Text size="sm" lh={1.65} style={{ color: textColor, flex: 1 }}>
                    {renderInline(item, isUser, isDark, theme)}
                  </Text>
                </Group>
              ))}
            </Stack>
          );
        }

        /* ── Paragraph (default) ── */
        return (
          <Text
            key={i}
            size="sm"
            lh={1.8}
            style={{
              color: textColor,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              marginTop: i > 0 ? 4 : 0,
            }}
          >
            {renderInline(block.text, isUser, isDark, theme)}
          </Text>
        );
      })}
    </Stack>
  );
}

/* ── Copy button for code blocks ── */
function CopyCodeButton({ code, isDark }: { code: string; isDark: boolean }) {
  const theme = useMantineTheme();
  const [copied, setCopied] = useState(false);
  return (
    <ActionIcon
      size="xs"
      variant="subtle"
      color={copied ? theme.primaryColor : 'gray'}
      onClick={() => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? <IconCheck size={11} /> : <IconCopy size={11} />}
    </ActionIcon>
  );
}

/* ─────────────────────────────────────────
   Inline renderer: bold, italic, inline code
───────────────────────────────────────── */
function renderInline(
  text: string,
  isUser: boolean,
  isDark: boolean,
  theme: ReturnType<typeof useMantineTheme>
): React.ReactNode {
  // Pattern matches **bold**, *italic*, `code`, and plain text segments
  const pattern = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*)/g;
  const parts: React.ReactNode[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    if (match.index > last) {
      parts.push(<span key={key++}>{text.slice(last, match.index)}</span>);
    }
    const token = match[0];
    if (token.startsWith('**')) {
      parts.push(
        <Text key={key++} span fw={700} style={{ color: isUser ? '#fff' : isDark ? '#f0ede8' : '#111' }}>
          {token.slice(2, -2)}
        </Text>
      );
    } else if (token.startsWith('*')) {
      parts.push(
        <Text key={key++} span fs="italic">
          {token.slice(1, -1)}
        </Text>
      );
    } else if (token.startsWith('`')) {
      parts.push(
        <Code
          key={key++}
          style={{
            fontSize: 12,
            padding: '1px 5px',
            borderRadius: 4,
            background: isUser ? 'rgba(255,255,255,0.18)' : isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.07)',
            color: isUser ? '#fff' : isDark ? theme.colors.gray[2] : theme.colors[theme.primaryColor][6],
            fontFamily: "'JetBrains Mono', monospace",
          }}
        >
          {token.slice(1, -1)}
        </Code>
      );
    }
    last = match.index + token.length;
  }
  if (last < text.length) {
    parts.push(<span key={key++}>{text.slice(last)}</span>);
  }
  return parts.length === 1 && typeof parts[0] === 'string' ? parts[0] : <>{parts}</>;
}

/* ─────────────────────────────────────────
   Block parser
───────────────────────────────────────── */
type Block =
  | { type: 'code'; text: string; lang?: string }
  | { type: 'heading'; text: string; level: number }
  | { type: 'ul'; items: string[]; text: '' }
  | { type: 'ol'; items: string[]; text: '' }
  | { type: 'hr'; text: '' }
  | { type: 'p'; text: string };

function parseBlocks(raw: string): Block[] {
  const lines = raw.split('\n');
  const blocks: Block[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    const fenceMatch = line.match(/^```(\w*)$/);
    if (fenceMatch) {
      const lang = fenceMatch[1] || '';
      const codeLines: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i]);
        i++;
      }
      i++; // skip closing ```
      blocks.push({ type: 'code', text: codeLines.join('\n'), lang });
      continue;
    }

    // Horizontal rule
    if (/^---+$/.test(line.trim())) {
      blocks.push({ type: 'hr', text: '' });
      i++;
      continue;
    }

    // Headings
    const headingMatch = line.match(/^(#{1,3})\s+(.+)$/);
    if (headingMatch) {
      blocks.push({ type: 'heading', level: headingMatch[1].length, text: headingMatch[2] });
      i++;
      continue;
    }

    // Bullet list — collect consecutive bullet lines
    if (/^[-*]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^[-*]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ul', items, text: '' });
      continue;
    }

    // Numbered list
    if (/^\d+[.)]\s/.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+[.)]\s/.test(lines[i])) {
        items.push(lines[i].replace(/^\d+[.)]\s+/, ''));
        i++;
      }
      blocks.push({ type: 'ol', items, text: '' });
      continue;
    }

    // Empty line — skip
    if (line.trim() === '') {
      i++;
      continue;
    }

    // Paragraph — accumulate until blank line or special line
    const paraLines: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('```') &&
      !/^#{1,3}\s/.test(lines[i]) &&
      !/^[-*]\s/.test(lines[i]) &&
      !/^\d+[.)]\s/.test(lines[i]) &&
      !/^---+$/.test(lines[i].trim())
    ) {
      paraLines.push(lines[i]);
      i++;
    }
    if (paraLines.length) {
      blocks.push({ type: 'p', text: paraLines.join('\n') });
    }
  }

  return blocks;
}

/* ─────────────────────────────────────────
   Main ChatMessage component
───────────────────────────────────────── */
export function ChatMessage({ message }: ChatMessageProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [copied, setCopied] = useState(false);
  const [helpful, setHelpful] = useState<boolean | null>(message.is_helpful ? true : null);
  const [showActions, setShowActions] = useState(false);

  const isUser = message.role === 'user';

  const timeAgo = (date: string) => {
    const s = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (s < 60) return 'just now';
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return new Date(date).toLocaleDateString();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /* ── User bubble ── */
  if (isUser) {
    return (
      <Group justify="flex-end" align="flex-start" gap="sm" mb="md" wrap="nowrap">
        <Stack gap={4} align="flex-end" style={{ maxWidth: '72%' }}>
          <Paper
            px="lg"
            py="sm"
            radius="xl"
            style={{
              background: theme.colors[theme.primaryColor][6],
              color: '#fff',
              boxShadow: `0 2px 14px ${theme.colors[theme.primaryColor][6]}38`,
              borderBottomRightRadius: 6,
            }}
          >
            <MarkdownRenderer content={message.content} isUser={true} />
          </Paper>
          <Text size="xs" c="dimmed" pr={4}>
            {timeAgo(message.created_at)}
          </Text>
        </Stack>
        <Avatar
          size={32}
          radius="md"
          style={{
            background: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)',
            color: isDark ? 'rgba(255,255,255,0.5)' : 'rgba(0,0,0,0.4)',
            flexShrink: 0,
            marginTop: 2,
          }}
        >
          <IconUser size={15} stroke={1.5} />
        </Avatar>
      </Group>
    );
  }

  /* ── Assistant bubble ── */
  return (
    <Group
      justify="flex-start"
      align="flex-start"
      gap="sm"
      mb="lg"
      wrap="nowrap"
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <Avatar
        size={32}
        radius="md"
        style={{
          background: isDark ? `${theme.colors[theme.primaryColor][6]}24` : `${theme.colors[theme.primaryColor][6]}17`,
          color: theme.colors[theme.primaryColor][6],
          flexShrink: 0,
          marginTop: 2,
        }}
      >
        <IconSparkles size={15} stroke={1.5} />
      </Avatar>

      <Stack gap={6} style={{ flex: 1, minWidth: 0, maxWidth: '85%' }}>
        {/* Message content — simple rendering without card wrapper */}
        <Box style={{ paddingRight: '8px' }}>
          <MarkdownRenderer content={message.content} isUser={false} />
        </Box>

        {/* Meta row + action buttons */}
        <Group gap={6} justify="space-between" px={2}>
          <Group gap={6}>
            <Text size="xs" c="dimmed">
              {timeAgo(message.created_at)}
            </Text>
            {message.ai_model_used && (
              <>
                <Text size="xs" c="dimmed">
                  ·
                </Text>
                <Text size="xs" c="dimmed">
                  {message.ai_model_used}
                </Text>
              </>
            )}
            {message.total_tokens && (
              <>
                <Text size="xs" c="dimmed">
                  ·
                </Text>
                <Text size="xs" c="dimmed">
                  {message.total_tokens} tokens
                </Text>
              </>
            )}
          </Group>

          {/* Action buttons — always visible on mobile, hover on desktop */}
          <Group
            gap={2}
            style={{
              opacity: showActions ? 1 : 0,
              transition: 'opacity 160ms ease',
            }}
          >
            <Tooltip label={copied ? 'Copied!' : 'Copy'} withArrow>
              <ActionIcon
                variant="subtle"
                size="sm"
                radius="sm"
                color={copied ? theme.primaryColor : 'gray'}
                onClick={handleCopy}
              >
                {copied ? <IconCheck size={13} /> : <IconCopy size={13} />}
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Good response" withArrow>
              <ActionIcon
                variant="subtle"
                size="sm"
                radius="sm"
                color={helpful === true ? theme.primaryColor : 'gray'}
                onClick={() => setHelpful(helpful === true ? null : true)}
              >
                <IconThumbUp size={13} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Bad response" withArrow>
              <ActionIcon
                variant="subtle"
                size="sm"
                radius="sm"
                color={helpful === false ? 'red' : 'gray'}
                onClick={() => setHelpful(helpful === false ? null : false)}
              >
                <IconThumbDown size={13} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="More" withArrow>
              <ActionIcon variant="subtle" size="sm" radius="sm" color="gray">
                <IconDotsVertical size={13} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Group>
      </Stack>
    </Group>
  );
}
