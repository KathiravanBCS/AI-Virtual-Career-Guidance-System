import { ActionIcon, Tooltip, useMantineTheme } from '@mantine/core';
import { IconArrowDown, IconArrowUp, IconEye, IconEyeOff, IconList, IconTrash } from '@tabler/icons-react';

export const ShowIconButton = ({ show, setShow }: { show: boolean; setShow: (show: boolean) => void }) => {
  const tooltipText = show ? 'Hide section' : 'Show section';
  const onClick = () => {
    setShow(!show);
  };
  const Icon = show ? IconEye : IconEyeOff;

  return (
    <Tooltip label={tooltipText}>
      <ActionIcon onClick={onClick} variant="subtle" color="gray" radius="md" size="lg">
        <Icon size={24} stroke={1.5} />
        <span className="sr-only">{tooltipText}</span>
      </ActionIcon>
    </Tooltip>
  );
};

type MoveIconButtonType = 'up' | 'down';
export const MoveIconButton = ({
  type,
  size = 'medium',
  onClick,
}: {
  type: MoveIconButtonType;
  size?: 'small' | 'medium';
  onClick: (type: MoveIconButtonType) => void;
}) => {
  const tooltipText = type === 'up' ? 'Move up' : 'Move down';
  const sizeMapping = size === 'medium' ? 'lg' : 'sm';
  const Icon = type === 'up' ? IconArrowUp : IconArrowDown;
  const iconSize = size === 'medium' ? 24 : 16;

  return (
    <Tooltip label={tooltipText}>
      <ActionIcon onClick={() => onClick(type)} variant="subtle" color="gray" radius="md" size={sizeMapping}>
        <Icon size={iconSize} stroke={1.5} />
        <span className="sr-only">{tooltipText}</span>
      </ActionIcon>
    </Tooltip>
  );
};

export const DeleteIconButton = ({ onClick, tooltipText }: { onClick: () => void; tooltipText: string }) => {
  return (
    <Tooltip label={tooltipText}>
      <ActionIcon onClick={onClick} variant="subtle" color="gray" radius="md" size="sm">
        <IconTrash size={16} stroke={1.5} />
        <span className="sr-only">{tooltipText}</span>
      </ActionIcon>
    </Tooltip>
  );
};

export const BulletListIconButton = ({
  onClick,
  showBulletPoints,
}: {
  onClick: (newShowBulletPoints: boolean) => void;
  showBulletPoints: boolean;
}) => {
  const theme = useMantineTheme();
  const tooltipText = showBulletPoints ? 'Hide bullet points' : 'Show bullet points';

  return (
    <Tooltip label={tooltipText}>
      <ActionIcon
        onClick={() => onClick(!showBulletPoints)}
        variant={showBulletPoints ? 'light' : 'subtle'}
        color={showBulletPoints ? 'cyan' : 'gray'}
        radius="md"
        size="sm"
      >
        <IconList size={16} stroke={1.5} color={showBulletPoints ? undefined : undefined} />
        <span className="sr-only">{tooltipText}</span>
      </ActionIcon>
    </Tooltip>
  );
};
