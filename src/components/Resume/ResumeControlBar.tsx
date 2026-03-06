import { useEffect } from 'react';

import { Button, Checkbox, Group, Slider, Stack, Text, useMantineColorScheme, useMantineTheme } from '@mantine/core';
import { usePDF } from '@react-pdf/renderer';
import { IconDownload, IconEye, IconSearch } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';

import { useSetDefaultScale } from '@/components/Resume/hooks';

const ResumeControlBar = ({
  scale,
  setScale,
  documentSize,
  document,
  fileName,
}: {
  scale: number;
  setScale: (scale: number) => void;
  documentSize: string;
  document: React.ReactElement<any>;
  fileName: string;
}) => {
  const theme = useMantineTheme();
  const navigate = useNavigate();
  const { colorScheme } = useMantineColorScheme();
  const { scaleOnResize, setScaleOnResize } = useSetDefaultScale({
    setScale,
    documentSize,
  });

  const [instance, update] = usePDF({ document: document as any });

  // Hook to update pdf when document changes
  useEffect(() => {
    update(document as any);
  }, [document, update]);

  const handlePreview = () => {
    navigate('/resume-preview');
  };

  return (
    <Group
      p="md"
      gap="md"
      style={{
        backgroundColor: colorScheme === 'dark' ? theme.colors.dark[7] : theme.colors.gray[0],
        borderTop: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[2]}`,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <Group gap="sm" style={{ flex: 1 }}>
        <IconSearch size={20} />
        <Slider
          style={{ flex: 1, minWidth: '200px' }}
          min={0.5}
          max={1.5}
          step={0.01}
          value={scale}
          defaultValue={0.86}
          onChange={(e) => {
            setScaleOnResize(false);
            setScale(e);
          }}
        />
        <Text size="sm" fw={500} style={{ minWidth: '50px' }}>
          {`${Math.round(scale * 100)}%`}
        </Text>
        <Checkbox label="Autoscale" checked={scaleOnResize} onChange={() => setScaleOnResize((prev) => !prev)} />
      </Group>
      <Button leftSection={<IconEye size={18} />} variant="default" onClick={handlePreview}>
        Preview
      </Button>
      <Button
        leftSection={<IconDownload size={18} />}
        component="a"
        href={instance.url || '#'}
        download={fileName}
        disabled={!instance.url}
      >
        Download Resume
      </Button>
    </Group>
  );
};

export const ResumeControlBarCSR = ResumeControlBar;

export const ResumeControlBarBorder = () => (
  <div className="absolute bottom-[var(--resume-control-bar-height)] w-full border-t-2 bg-gray-50" />
);
