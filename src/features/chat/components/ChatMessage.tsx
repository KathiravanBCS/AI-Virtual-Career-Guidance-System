import { Box, Group, Loader, Paper, Text } from '@mantine/core';
import ReactMarkdown from 'react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import 'katex/dist/katex.min.css';

import agentLogo from '../../../assets/gm-ai-cg-fav.png';
import { ChatMessage as ChatMessageType } from '../types';

import './chat-message-styles.css';

interface ChatMessageProps {
  message: ChatMessageType;
}

const markdownComponents = {
  h1: ({ ...props }: any) => (
    <h1
      style={{
        fontSize: '1.75rem',
        fontWeight: '700',
        marginBottom: '1rem',
        marginTop: '1.5rem',
        borderBottom: '2px solid rgba(0,0,0,0.1)',
        paddingBottom: '0.5rem',
      }}
      {...props}
    />
  ),
  h2: ({ ...props }: any) => (
    <h2
      style={{
        fontSize: '1.4rem',
        fontWeight: '600',
        marginBottom: '0.75rem',
        marginTop: '1.25rem',
        color: '#1a1a1a',
      }}
      {...props}
    />
  ),
  h3: ({ ...props }: any) => (
    <h3
      style={{
        fontSize: '1.1rem',
        fontWeight: '600',
        marginBottom: '0.5rem',
        marginTop: '0.75rem',
        color: '#333',
      }}
      {...props}
    />
  ),
  p: ({ ...props }: any) => (
    <p
      style={{
        marginBottom: '1rem',
        lineHeight: '1.7',
        fontSize: '0.95rem',
        wordWrap: 'break-word',
      }}
      {...props}
    />
  ),
  ul: ({ ...props }: any) => (
    <ul
      style={{
        marginLeft: '1.75rem',
        marginBottom: '1rem',
        listStyleType: 'disc',
      }}
      {...props}
    />
  ),
  ol: ({ ...props }: any) => (
    <ol
      style={{
        marginLeft: '1.75rem',
        marginBottom: '1rem',
        listStyleType: 'decimal',
      }}
      {...props}
    />
  ),
  li: ({ ...props }: any) => (
    <li
      style={{
        marginBottom: '0.5rem',
        lineHeight: '1.6',
        fontSize: '0.95rem',
      }}
      {...props}
    />
  ),
  code: ({ inline, children, ...props }: any) =>
    inline ? (
      <code
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.08)',
          padding: '0.2em 0.4em',
          borderRadius: '0.3rem',
          fontFamily: '"Fira Code", "Monaco", monospace',
          fontSize: '0.9em',
          fontWeight: '500',
          color: '#c7254e',
        }}
        {...props}
      >
        {children}
      </code>
    ) : (
      <pre
        style={{
          backgroundColor: '#2d2d2d',
          color: '#f8f8f2',
          padding: '1rem',
          borderRadius: '0.5rem',
          overflowX: 'auto',
          fontSize: '0.85rem',
          lineHeight: '1.5',
          border: '1px solid rgba(0,0,0,0.2)',
          marginBottom: '1rem',
        }}
      >
        <code {...props}>{children}</code>
      </pre>
    ),
  blockquote: ({ ...props }: any) => (
    <blockquote
      style={{
        borderLeft: '4px solid #0070f3',
        paddingLeft: '1rem',
        paddingRight: '0.5rem',
        color: '#555',
        marginLeft: 0,
        marginRight: 0,
        marginBottom: '1rem',
        backgroundColor: 'rgba(0, 112, 243, 0.05)',
        borderRadius: '0 0.3rem 0.3rem 0',
        fontStyle: 'italic',
        padding: '0.75rem 1rem',
      }}
      {...props}
    />
  ),
  a: ({ ...props }: any) => (
    <a
      style={{
        color: '#0070f3',
        textDecoration: 'underline',
        textDecorationColor: 'rgba(0, 112, 243, 0.3)',
        textUnderlineOffset: '2px',
        fontWeight: '500',
      }}
      {...props}
    />
  ),
  table: ({ ...props }: any) => (
    <div style={{ overflowX: 'auto', marginBottom: '1rem' }}>
      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '0.9rem',
          border: '1px solid #ddd',
          borderRadius: '0.3rem',
          overflow: 'hidden',
        }}
        {...props}
      />
    </div>
  ),
  th: ({ ...props }: any) => (
    <th
      style={{
        borderBottom: '2px solid #0070f3',
        padding: '0.75rem',
        textAlign: 'left',
        backgroundColor: '#f0f7ff',
        fontWeight: '600',
        color: '#1a1a1a',
      }}
      {...props}
    />
  ),
  td: ({ ...props }: any) => (
    <td
      style={{
        borderBottom: '1px solid #eee',
        padding: '0.75rem',
        color: '#333',
      }}
      {...props}
    />
  ),
  tr: ({ ...props }: any) => (
    <tr
      style={{
        '&:nth-child(even)': { backgroundColor: '#fafafa' },
      }}
      {...props}
    />
  ),
  strong: ({ ...props }: any) => <strong style={{ fontWeight: '700', color: '#1a1a1a' }} {...props} />,
  em: ({ ...props }: any) => <em style={{ fontStyle: 'italic', color: '#555' }} {...props} />,
};

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';

  return (
    <Group justify={isUser ? 'flex-end' : 'flex-start'} align="flex-end" gap="sm" style={{ width: '100%' }}>
      {!isUser && (
        <Box
          style={{
            width: 36,
            height: 36,
            borderRadius: '4px',
            backgroundColor: 'var(--mantine-color-gray-8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            padding: '4px',
          }}
        >
          <img src={agentLogo} alt="Agent" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </Box>
      )}

      <Paper
        p="md"
        radius="md"
        bg={isUser ? 'var(--mantine-color-blue-6)' : 'var(--mantine-color-gray-1)'}
        withBorder={!isUser}
        style={{
          maxWidth: '70%',
          wordWrap: 'break-word',
        }}
      >
        {message.isLoading ? (
          <Group gap="xs">
            <Loader size="sm" />
            <Text size="sm">Thinking...</Text>
          </Group>
        ) : (
          <div className="chat-message-content" style={{ color: isUser ? 'white' : 'black', fontSize: '0.875rem' }}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex]}
              components={markdownComponents}
            >
              {message.message}
            </ReactMarkdown>
          </div>
        )}
      </Paper>
    </Group>
  );
};
