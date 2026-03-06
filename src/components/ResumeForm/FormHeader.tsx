import { useState } from 'react';

import { ActionIcon, Collapse, Flex, Group, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconChevronDown, IconChevronUp, IconEye, IconEyeOff } from '@tabler/icons-react';

import { useSettingsStore, type ShowForm } from '@/lib/store/useSettingsStore';

interface FormHeaderProps {
  formType?: ShowForm;
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  collapsibleOnly?: boolean;
}

export const FormHeader = ({ formType, title, icon, children, collapsibleOnly = false }: FormHeaderProps) => {
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  const { formToShow, changeShowForm, formsOrder, changeFormOrder } = useSettingsStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  // Only apply visibility logic if formType is provided and not collapsibleOnly
  const isVisible = formType ? formToShow[formType] : true;
  const currentIdx = formType ? formsOrder.indexOf(formType) : -1;
  const canMoveUp = currentIdx > 0;
  const canMoveDown = currentIdx >= 0 && currentIdx < formsOrder.length - 1;

  if (formType && !isVisible && !collapsibleOnly) {
    return (
      <div
        style={{
          border: `1px solid ${theme.colors.gray[3]}`,
          borderRadius: '8px',
          padding: '1rem',
          backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
          opacity: 0.6,
        }}
      >
        <Flex justify="space-between" align="center">
          <Group gap="xs">
            {icon}
            <Text fw={600} size="lg" c={colorScheme === 'dark' ? theme.colors.gray[4] : '#999'}>
              {title}
            </Text>
          </Group>
          <ActionIcon variant="subtle" color="gray" onClick={() => changeShowForm(formType, true)} title="Show section">
            <IconEye size={18} />
          </ActionIcon>
        </Flex>
      </div>
    );
  }

  return (
    <div
      style={{
        border: `1px solid ${theme.colors.gray[3]}`,
        borderRadius: '8px',
        padding: '1.5rem',
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
      }}
    >
      <Flex justify="space-between" align="center" mb={isCollapsed ? 0 : 'lg'}>
        <Group gap="xs">
          {icon}
          <Text fw={600} size="lg" c={colorScheme === 'dark' ? theme.colors.gray[0] : 'black'}>
            {title}
          </Text>
        </Group>

        <Group gap="xs">
          {/* Move Up Button - only show if formType provided */}
          {formType && !collapsibleOnly && (
            <ActionIcon
              variant="subtle"
              color={theme.primaryColor}
              disabled={!canMoveUp}
              onClick={() => changeFormOrder(formType, 'up')}
              title="Move section up"
            >
              <IconArrowUp size={18} />
            </ActionIcon>
          )}

          {/* Move Down Button - only show if formType provided */}
          {formType && !collapsibleOnly && (
            <ActionIcon
              variant="subtle"
              color={theme.primaryColor}
              disabled={!canMoveDown}
              onClick={() => changeFormOrder(formType, 'down')}
              title="Move section down"
            >
              <IconArrowDown size={18} />
            </ActionIcon>
          )}

          {/* Show/Hide Toggle - only show if formType provided */}
          {formType && !collapsibleOnly && (
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={() => changeShowForm(formType, false)}
              title="Hide section"
            >
              <IconEyeOff size={18} />
            </ActionIcon>
          )}

          {/* Collapse/Expand Toggle - always show */}
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={() => setIsCollapsed(!isCollapsed)}
            title={isCollapsed ? 'Expand section' : 'Collapse section'}
          >
            {isCollapsed ? <IconChevronDown size={18} /> : <IconChevronUp size={18} />}
          </ActionIcon>
        </Group>
      </Flex>

      <Collapse in={!isCollapsed}>{children}</Collapse>
    </div>
  );
};
