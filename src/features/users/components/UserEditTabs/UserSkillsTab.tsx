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

import { useGetAllSkills } from '@/features/master/masterSkills/api';

import { useCreateUserSkill, useDeleteUserSkill, useUpdateUserSkill } from '../../api/userSkills';
import type { CreateUserSkillRequest, UserSkill } from '../../types';

interface UserSkillsTabProps {
  userId?: number;
  skills: UserSkill[];
}

const PROFICIENCY_LEVELS = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

export const UserSkillsTab = ({ userId, skills }: UserSkillsTabProps) => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { mutate: createSkill } = useCreateUserSkill();
  const { mutate: updateSkill } = useUpdateUserSkill(editingId || undefined);
  const { mutate: deleteSkill } = useDeleteUserSkill();
  const { data: masterSkills = [], isLoading: isLoadingSkills } = useGetAllSkills();

  const form = useForm({
    initialValues: {
      skill_id: '',
      proficiency_level: '',
      years_of_experience: 0,
      endorsement_count: 0,
    },
    validate: {
      skill_id: (value) => (!value ? 'Skill ID is required' : null),
      proficiency_level: (value) => (!value ? 'Proficiency level is required' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    if (editingId && userId) {
      updateSkill({
        id: editingId,
        proficiency_level: values.proficiency_level,
        years_of_experience: values.years_of_experience,
        endorsement_count: values.endorsement_count,
      });
      setEditingId(null);
      setFormVisible(false);
      form.reset();
    } else if (userId) {
      createSkill({
        user_id: userId,
        skill_id: parseInt(values.skill_id, 10),
        proficiency_level: values.proficiency_level,
        years_of_experience: values.years_of_experience,
        endorsement_count: values.endorsement_count,
      } as CreateUserSkillRequest);
      setFormVisible(false);
      form.reset();
    }
  });

  const handleEdit = (skill: UserSkill) => {
    setEditingId(skill.id);
    form.setValues({
      skill_id: skill.skill_id.toString(),
      proficiency_level: skill.proficiency_level,
      years_of_experience: skill.years_of_experience,
      endorsement_count: skill.endorsement_count,
    });
    setFormVisible(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this skill?')) {
      deleteSkill(id);
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
              Skills
            </Text>
            <Text size="sm" color="dimmed" mb="lg">
              Manage your professional skills
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
              Add Skill
            </Button>
          )}
        </Box>

        {skills.length === 0 && !formVisible ? (
          <Alert icon={<IconAlertCircle />} color="blue">
            No skills added yet. Click "Add Skill" to add your professional skills.
          </Alert>
        ) : null}

        {skills.length > 0 && (
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Skill Name</Table.Th>
                <Table.Th>Proficiency Level</Table.Th>
                <Table.Th>Years of Experience</Table.Th>
                <Table.Th>Endorsements</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {skills.map((skill) => {
                const skillName =
                  masterSkills.find((s) => s.id === skill.skill_id)?.skill_name || `Skill ${skill.skill_id}`;
                return (
                  <Table.Tr key={skill.id}>
                    <Table.Td>{skillName}</Table.Td>
                    <Table.Td>{skill.proficiency_level}</Table.Td>
                    <Table.Td>{skill.years_of_experience}</Table.Td>
                    <Table.Td>{skill.endorsement_count}</Table.Td>
                    <Table.Td>
                      <Box style={{ display: 'flex', gap: '8px' }}>
                        <ActionIcon size="xs" color="blue" variant="light" onClick={() => handleEdit(skill)}>
                          <IconEdit size={14} />
                        </ActionIcon>
                        <ActionIcon size="xs" color="red" variant="light" onClick={() => handleDelete(skill.id)}>
                          <IconTrash size={14} />
                        </ActionIcon>
                      </Box>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        )}

        {formVisible && (
          <Card withBorder p="lg" mt="lg">
            <Stack gap="md">
              <Box>
                <Text fw={600} mb="sm">
                  {editingId ? 'Edit Skill' : 'Add New Skill'}
                </Text>
              </Box>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack gap="md">
                  <Grid>
                    <Grid.Col span={{ base: 12 }}>
                      <Select
                        label="Skill Name"
                        placeholder="Select a skill"
                        required
                        disabled={!!editingId || isLoadingSkills}
                        data={masterSkills.map((skill) => ({
                          value: skill.id.toString(),
                          label: `${skill.skill_name}`,
                        }))}
                        {...form.getInputProps('skill_id')}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12 }}>
                      <Select
                        label="Proficiency Level"
                        placeholder="Select proficiency level"
                        data={PROFICIENCY_LEVELS}
                        required
                        {...form.getInputProps('proficiency_level')}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Years of Experience"
                        type="number"
                        placeholder="Enter years"
                        min={0}
                        {...form.getInputProps('years_of_experience')}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Endorsements"
                        type="number"
                        placeholder="Enter count"
                        min={0}
                        {...form.getInputProps('endorsement_count')}
                      />
                    </Grid.Col>
                  </Grid>

                  <Box style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <Button variant="light" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit">{editingId ? 'Update' : 'Add'} Skill</Button>
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

export default UserSkillsTab;
