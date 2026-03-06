import { ReactNode, useState } from 'react';

import { Group, Text } from '@mantine/core';

import { CopyButton } from './CopyButton';

interface CopyableTextProps {
  text: string;
  label?: string;
  successMessage?: string;
  children?: ReactNode;
  size?: string;
  fw?: number;
  c?: string;
  variant?: 'inline' | 'block';
  lineClamp?: number;
}

/**
 * Displays text with a copy button that appears on hover.
 * Perfect for customer info like name, email, phone, code.
 */
export function CopyableText({
  text,
  label = 'Copy',
  successMessage = 'Copied!',
  children,
  size = 'sm',
  fw = 500,
  c,
  variant = 'inline',
  lineClamp,
}: CopyableTextProps) {
  const [isHovered, setIsHovered] = useState(false);

  if (!text) {
    return (
      <Text size={size} c="dimmed">
        —
      </Text>
    );
  }

  const content = children || text;

  if (variant === 'block') {
    return (
      <Group gap={6} wrap="nowrap" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Text size={size} fw={fw} c={c} lineClamp={lineClamp}>
          {content}
        </Text>
        <div style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 150ms ease' }}>
          <CopyButton text={text} label={label} successMessage={successMessage} size={16} color="gray" />
        </div>
      </Group>
    );
  }

  // inline variant - shows copy icon inline
  return (
    <Group gap={4} wrap="nowrap" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <Text size={size} fw={fw} c={c} lineClamp={lineClamp}>
        {content}
      </Text>
      <div style={{ opacity: isHovered ? 1 : 0, transition: 'opacity 150ms ease' }}>
        <CopyButton
          text={text}
          label={label}
          successMessage={successMessage}
          size={14}
          color="gray"
          tooltip={`Copy ${label.toLowerCase()}`}
        />
      </div>
    </Group>
  );
}
