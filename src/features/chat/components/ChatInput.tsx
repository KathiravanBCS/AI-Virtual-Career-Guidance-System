import { useState } from 'react';

import { ActionIcon, Button, Group, TextInput } from '@mantine/core';
import { IconSend } from '@tabler/icons-react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, disabled }) => {
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim()) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <Group gap="xs" grow>
      <TextInput
        placeholder="Type your message..."
        value={input}
        onChange={(e) => setInput(e.currentTarget.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && !disabled) {
            handleSend();
          }
        }}
        disabled={disabled}
      />
      <ActionIcon onClick={handleSend} disabled={disabled || !input.trim()}>
        <IconSend size={18} />
      </ActionIcon>
    </Group>
  );
};
