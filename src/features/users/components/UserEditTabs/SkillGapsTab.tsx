import { useState } from 'react';

import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Center,
  Grid,
  Loader,
  Select,
  Stack,
  Table,
  Text,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';

import { useCreateSkillGap, useDeleteSkillGap, useUpdateSkillGap } from '../../api/skillGaps';
import type { CreateSkillGapRequest, SkillGap } from '../../types';

interface SkillGapsTabProps {
  userId?: number;
  skillGaps: SkillGap[];
}

const GAP_LEVELS = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' },
];

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export const SkillGapsTab = ({ userId, skillGaps }: SkillGapsTabProps) => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { mutate: createGap } = useCreateSkillGap();
  const { mutate: updateGap } = useUpdateSkillGap(editingId || undefined);
  const { mutate: deleteGap } = useDeleteSkillGap();

  const form = useForm({
    initialValues: {
      career_id: '',
      skill_id: '',
      user_proficiency: '',
      required_proficiency: '',
      gap_level: '',
    },
    validate: {
      career_id: (value) => (!value ? 'Career ID is required' : null),
      skill_id: (value) => (!value ? 'Skill ID is required' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    if (editingId && userId) {
      updateGap({
        id: editingId,
        user_proficiency: values.user_proficiency,
        required_proficiency: values.required_proficiency,
        gap_level: values.gap_level,
      });
      setEditingId(null);
      setFormVisible(false);
      form.reset();
    } else if (userId) {
      createGap({
        user_id: userId,
        career_id: parseInt(values.career_id, 10),
        skill_id: parseInt(values.skill_id, 10),
        user_proficiency: values.user_proficiency,
        required_proficiency: values.required_proficiency,
        gap_level: values.gap_level,
      } as CreateSkillGapRequest);
      setFormVisible(false);
      form.reset();
    }
  });

  const handleEdit = (gap: SkillGap) => {
    setEditingId(gap.id);
    form.setValues({
      career_id: gap.career_id.toString(),
      skill_id: gap.skill_id.toString(),
      user_proficiency: gap.user_proficiency,
      required_proficiency: gap.required_proficiency,
      gap_level: gap.gap_level,
    });
    setFormVisible(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this skill gap?')) {
      deleteGap(id);
    }
  };

  const handleCancel = () => {
    setFormVisible(false);
    setEditingId(null);
    form.reset();
  };

  return (
    <Box>
      <Stack gap="lg">
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Text fw={600} mb="md">
              Skill Gaps
            </Text>
            <Text size="sm" color="dimmed" mb="lg">
              Identify skills needed for career goals
            </Text>
          </Box>
          {!formVisible && (
            <Button
              leftSection={<IconPlus size={16} />}
              onClick={() => {
                setEditingId(null);
                form.reset();
                setFormVisible(true);
              }}
            >
              Add Skill Gap
            </Button>
          )}
        </Box>

        {skillGaps.length === 0 && !formVisible ? (
          <Alert icon={<IconAlertCircle />} color="blue">
            No skill gaps identified yet. Click "Add Skill Gap" to identify skills needed for your career goals.
          </Alert>
        ) : null}

        {skillGaps.length > 0 && (
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Career ID</Table.Th>
                <Table.Th>Skill ID</Table.Th>
                <Table.Th>Your Proficiency</Table.Th>
                <Table.Th>Required Proficiency</Table.Th>
                <Table.Th>Gap Level</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {skillGaps.map((gap) => (
                <Table.Tr key={gap.id}>
                  <Table.Td>{gap.career_id}</Table.Td>
                  <Table.Td>{gap.skill_id}</Table.Td>
                  <Table.Td>{gap.user_proficiency}</Table.Td>
                  <Table.Td>{gap.required_proficiency}</Table.Td>
                  <Table.Td>{gap.gap_level}</Table.Td>
                  <Table.Td>
                    <Box style={{ display: 'flex', gap: '8px' }}>
                      <ActionIcon size="xs" color="blue" variant="light" onClick={() => handleEdit(gap)}>
                        <IconEdit size={14} />
                      </ActionIcon>
                      <ActionIcon size="xs" color="red" variant="light" onClick={() => handleDelete(gap.id)}>
                        <IconTrash size={14} />
                      </ActionIcon>
                    </Box>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}

        {formVisible && (
          <Card withBorder p="lg" mt="lg">
            <Stack gap="md">
              <Box>
                <Text fw={600} mb="sm">
                  {editingId ? 'Edit Skill Gap' : 'Add New Skill Gap'}
                </Text>
              </Box>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack gap="md">
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Career ID"
                        type="number"
                        placeholder="Enter career ID"
                        required
                        disabled={!!editingId}
                        {...form.getInputProps('career_id')}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Skill ID"
                        type="number"
                        placeholder="Enter skill ID"
                        required
                        disabled={!!editingId}
                        {...form.getInputProps('skill_id')}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Select
                        label="Your Proficiency"
                        placeholder="Select your proficiency"
                        data={PROFICIENCY_LEVELS}
                        {...form.getInputProps('user_proficiency')}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <Select
                        label="Required Proficiency"
                        placeholder="Select required proficiency"
                        data={PROFICIENCY_LEVELS}
                        {...form.getInputProps('required_proficiency')}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12 }}>
                      <Select
                        label="Gap Level"
                        placeholder="Select gap level"
                        data={GAP_LEVELS}
                        {...form.getInputProps('gap_level')}
                      />
                    </Grid.Col>
                  </Grid>

                  <Box style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button variant="light" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingId ? 'Update' : 'Add'} Skill Gap</Button>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Card>
        )}
      </Stack>
    </Box>
  );
};

export default SkillGapsTab;
