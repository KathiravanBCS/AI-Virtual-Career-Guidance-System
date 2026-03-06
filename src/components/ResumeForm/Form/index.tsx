import { Box, Button, Group, Paper, TextInput, useMantineTheme } from '@mantine/core';
import { IconBriefcase, IconBuildingSkyscraper, IconBulb, IconPlus, IconSchool, IconTool } from '@tabler/icons-react';

import { ExpanderWithHeightTransition } from '@/components/ExpanderWithHeightTransition';
import { DeleteIconButton, MoveIconButton, ShowIconButton } from '@/components/ResumeForm/Form/IconButton';
import { useResumeStore } from '@/lib/store/useResumeStore';
import { useSettingsStore, type ShowForm } from '@/lib/store/useSettingsStore';

/**
 * BaseForm is the bare bone form, i.e. just the outline with no title and no control buttons.
 * ProfileForm uses this to compose its outline.
 */
export const BaseForm = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  const theme = useMantineTheme();

  return (
    <Paper
      p="lg"
      pt="md"
      radius="md"
      shadow="md"
      className={`flex flex-col gap-5 bg-white transition-opacity duration-200 ${className}`}
      style={{
        border: `1px solid ${theme.colors.gray[2]}`,
      }}
    >
      {children}
    </Paper>
  );
};

const FORM_TO_ICON: { [section in ShowForm]: typeof IconBuildingSkyscraper } = {
  summary: IconBriefcase,
  workExperiences: IconBuildingSkyscraper,
  educations: IconSchool,
  projects: IconBulb,
  skills: IconTool,
  custom: IconTool,
};

export const Form = ({
  form,
  addButtonText,
  children,
}: {
  form: ShowForm;
  addButtonText?: string;
  children: React.ReactNode;
}) => {
  const theme = useMantineTheme();
  const { formToShow, formToHeading, formsOrder, changeShowForm, changeFormHeading, changeFormOrder } =
    useSettingsStore();
  const { addSectionInForm } = useResumeStore();

  const showForm = formToShow[form];
  const heading = formToHeading[form];
  const isFirstForm = formsOrder[0] === form;
  const isLastForm = formsOrder[formsOrder.length - 1] === form;

  const handleMoveClick = (type: 'up' | 'down') => {
    changeFormOrder(form, type);
  };

  const Icon = FORM_TO_ICON[form];

  return (
    <BaseForm className={`transition-opacity duration-200 ${showForm ? 'pb-6' : 'pb-2 opacity-60'}`}>
      <Group justify="space-between" align="center" gap="lg">
        <Group gap="sm" className="flex-1">
          <Icon size={24} stroke={1.5} color="gray" />
          <TextInput
            type="text"
            className="flex-1"
            value={heading}
            onChange={(e) => changeFormHeading(form, e.currentTarget.value)}
            placeholder="Section heading"
            variant="unstyled"
            styles={{
              input: {
                fontSize: '1.125rem',
                fontWeight: 600,
                letterSpacing: '0.025em',
                borderBottom: '2px solid transparent',
                paddingBottom: theme.spacing.xs,
                transition: 'border-color 200ms ease',
                '&:hover': {
                  borderBottomColor: theme.colors.gray[3],
                  boxShadow: theme.shadows.sm,
                },
                '&:focus': {
                  borderBottomColor: theme.colors.gray[3],
                  boxShadow: theme.shadows.sm,
                  outline: 'none',
                },
              },
            }}
          />
        </Group>
        <Group gap={2}>
          {!isFirstForm && <MoveIconButton type="up" onClick={handleMoveClick} />}
          {!isLastForm && <MoveIconButton type="down" onClick={handleMoveClick} />}
          <ShowIconButton show={showForm} setShow={(value) => changeShowForm(form, value)} />
        </Group>
      </Group>
      <ExpanderWithHeightTransition expanded={showForm}>{children}</ExpanderWithHeightTransition>
      {showForm && addButtonText && (
        <Box mt="md" style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="light"
            size="sm"
            leftSection={<IconPlus size={20} stroke={1.5} />}
            onClick={() => {
              addSectionInForm(form);
            }}
            radius="md"
          >
            {addButtonText}
          </Button>
        </Box>
      )}
    </BaseForm>
  );
};

export const FormSection = ({
  form,
  idx,
  showMoveUp,
  showMoveDown,
  showDelete,
  deleteButtonTooltipText,
  children,
}: {
  form: ShowForm;
  idx: number;
  showMoveUp: boolean;
  showMoveDown: boolean;
  showDelete: boolean;
  deleteButtonTooltipText: string;
  children: React.ReactNode;
}) => {
  const { deleteSectionInFormByIdx, moveSectionInForm } = useResumeStore();

  const handleDeleteClick = () => {
    deleteSectionInFormByIdx(form, idx);
  };
  const handleMoveClick = (direction: 'up' | 'down') => {
    moveSectionInForm(form, idx, direction);
  };

  return (
    <>
      {idx !== 0 && <div className="mb-4 mt-6 border-t-2 border-dotted border-gray-200" />}
      <Box style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 'md', alignItems: 'flex-start' }}>
        <Box style={{ gridColumn: '1' }}>{children}</Box>
        <Group gap={2} style={{ gridColumn: '2', minWidth: 'fit-content' }}>
          {showMoveUp && <MoveIconButton type="up" size="small" onClick={() => handleMoveClick('up')} />}
          {showMoveDown && <MoveIconButton type="down" size="small" onClick={() => handleMoveClick('down')} />}
          {showDelete && <DeleteIconButton onClick={handleDeleteClick} tooltipText={deleteButtonTooltipText} />}
        </Group>
      </Box>
    </>
  );
};
