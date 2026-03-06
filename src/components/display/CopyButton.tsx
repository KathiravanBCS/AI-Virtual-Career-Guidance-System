import { useState } from 'react';

import { ActionIcon, Tooltip } from '@mantine/core';
import { IconCheck, IconCopy } from '@tabler/icons-react';

interface CopyButtonProps {
  text: string;
  label?: string;
  successMessage?: string;
  size?: string | number;
  variant?: string;
  color?: string;
  tooltip?: string;
}

export function CopyButton({
  text,
  label = 'Copy',
  successMessage = 'Copied!',
  size = 18,
  variant = 'subtle',
  color = 'gray',
  tooltip = 'Copy to clipboard',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silent fail - don't show error notification
    }
  };

  return (
    <Tooltip label={copied ? 'Copied!' : tooltip} withArrow position="top">
      <ActionIcon size={size} variant={variant} color={copied ? 'green' : color} onClick={handleCopy}>
        {copied ? (
          <IconCheck size={typeof size === 'number' ? size - 2 : 16} />
        ) : (
          <IconCopy size={typeof size === 'number' ? size - 2 : 16} />
        )}
      </ActionIcon>
    </Tooltip>
  );
}
