import { useState } from 'react';

import { ActionIcon, Box, Center, Loader, Text, Tooltip, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconBrain, IconMessageCircle, IconPlus, IconSearch, IconX } from '@tabler/icons-react';

import type { ChatSession } from '../types';
import * as styles from './ChatSidebar.css';

interface ChatSidebarProps {
  sessions: ChatSession[];
  currentSessionId: number | null;
  onSessionSelect: (sessionId: number) => void;
  onNewSession: () => void;
  onDeleteSession: (sessionId: number) => void;
  isLoading?: boolean;
  currentSessionMessages?: any[];
  onToggleSidebar?: () => void;
}

const truncateTitle = (title: string, maxLength: number = 32): string => {
  if (title.length > maxLength) return title.slice(0, maxLength) + '...';
  return title;
};

const isToday = (dateStr: string) => {
  const d = new Date(dateStr);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
};

export function ChatSidebar({
  sessions,
  currentSessionId,
  onSessionSelect,
  onNewSession,
  onDeleteSession,
  isLoading = false,
  currentSessionMessages = [],
}: ChatSidebarProps) {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  const currentSession = sessions.find((s) => s.id === currentSessionId);
  const todaySessions = sessions.filter((s) => s.id !== currentSessionId && isToday(s.created_at || ''));
  const recentSessions = sessions.filter((s) => s.id !== currentSessionId && !isToday(s.created_at || ''));

  const activeTokens = currentSessionMessages.reduce((sum, msg) => sum + (msg.total_tokens || 0), 0);

  return (
    <Box className={styles.sidebarWrap}>
      {/* Header */}
      <Box className={styles.sbHeader}>
        <Box className={styles.sbBrand} style={{ color: theme.colors[theme.primaryColor][6] }}>
          GM-AICG
        </Box>
      </Box>

      {/* Nav Items — horizontal row, consistent sizing */}
      <Box className={styles.sbNav}>
        <Tooltip label="New chat" withArrow>
          <button className={styles.sbNavItem} onClick={onNewSession}>
            <IconPlus size={16} className={styles.sbNavItemSvg} />
            New chat
          </button>
        </Tooltip>
        <Tooltip label="Search" withArrow>
          <button className={styles.sbNavItem}>
            <IconSearch size={16} className={styles.sbNavItemSvg} />
            Search
          </button>
        </Tooltip>
        <Tooltip label="All chats" withArrow>
          <button className={styles.sbNavItem}>
            <IconMessageCircle size={16} className={styles.sbNavItemSvg} />
            All chats
          </button>
        </Tooltip>
      </Box>

      {/* Active / Today Card */}
      <Box className={styles.sbActiveCardWrap}>
        {currentSession && (
          <Box className={styles.sbActiveCard} onClick={() => onSessionSelect(currentSession.id)}>
            <Box className={styles.sbActiveIcon}>
              <IconBrain size={18} stroke={1.5} />
            </Box>
            <Box className={styles.sbActiveMeta}>
              <Box className={styles.sbActiveTitle}>{truncateTitle(currentSession.title, 26)}</Box>
              <Box className={styles.sbActiveSub}>Tokens used: {activeTokens.toLocaleString()}</Box>
            </Box>
          </Box>
        )}

        {todaySessions.length > 0 && currentSession && <Box className={styles.sbDivider} style={{ margin: '6px 0' }} />}

        {todaySessions.map((session) => {
          const tokens = (session.messages || []).reduce((s: number, m: any) => s + (m.total_tokens || 0), 0);
          return (
            <Box
              key={session.id}
              className={styles.sbActiveCard}
              onClick={() => onSessionSelect(session.id)}
              style={{ marginTop: '6px' }}
            >
              <Box className={styles.sbActiveIcon}>
                <IconMessageCircle size={18} stroke={1.5} />
              </Box>
              <Box className={styles.sbActiveMeta}>
                <Box className={styles.sbActiveTitle}>{truncateTitle(session.title, 26)}</Box>
                <Box className={styles.sbActiveSub}>Tokens: {tokens.toLocaleString()}</Box>
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* Recents List */}
      <Box className={styles.sbScroll}>
        {isLoading ? (
          <Center p="lg">
            <Loader size="sm" type="dots" />
          </Center>
        ) : (
          <Box>
            {recentSessions.length > 0 && (
              <>
                <Box className={styles.sbSectionLabel}>Recents</Box>
                {recentSessions.map((session) => (
                  <Box
                    key={session.id}
                    className={`${styles.sbRecentItem} ${currentSessionId === session.id ? styles.sbRecentItemActive : ''}`}
                    onMouseEnter={() => setHoveredId(session.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    onClick={() => onSessionSelect(session.id)}
                  >
                    <Box className={styles.sbRecentTitle}>{truncateTitle(session.title, 30)}</Box>
                    {hoveredId === session.id && (
                      <button
                        className={styles.sbRecentDelete}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteSession(session.id);
                        }}
                      >
                        <IconX size={14} />
                      </button>
                    )}
                  </Box>
                ))}
              </>
            )}

            {sessions.length === 0 && (
              <Center p="lg">
                <Text size="sm" c="dimmed" ta="center">
                  No conversations yet.
                </Text>
              </Center>
            )}
          </Box>
        )}
      </Box>

      {/* Footer */}
      <Box className={styles.sbFooter}>© AI Career Guidance</Box>
    </Box>
  );
}
