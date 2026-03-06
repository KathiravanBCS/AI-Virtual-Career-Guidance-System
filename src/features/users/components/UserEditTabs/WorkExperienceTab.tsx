import { useState } from 'react';

import {
  ActionIcon,
  Alert,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Grid,
  Loader,
  NumberInput,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle, IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';

import { useCreateWorkExperience, useDeleteWorkExperience, useUpdateWorkExperience } from '../../api/workExperience';
import type { CreateWorkExperienceRequest, UpdateWorkExperienceRequest, WorkExperience } from '../../types';

interface WorkExperienceTabProps {
  userId?: number;
  experiences: WorkExperience[];
}

export const WorkExperienceTab = ({ userId, experiences }: WorkExperienceTabProps) => {
  const [formVisible, setFormVisible] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { mutate: createExperience, isPending: createLoading } = useCreateWorkExperience();
  const { mutate: updateExperience, isPending: updateLoading } = useUpdateWorkExperience();
  const { mutate: deleteExperience, isPending: deleteLoading } = useDeleteWorkExperience();

  const form = useForm({
    initialValues: {
      job_title: '',
      company_name: '',
      industry: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: '',
      status: 'active',
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    const cleanValues = {
      ...values,
      end_date: values.end_date === '' ? undefined : values.end_date,
      description: values.description === '' ? undefined : values.description,
      industry: values.industry === '' ? undefined : values.industry,
    };

    if (editingId && userId) {
      updateExperience({ id: editingId, ...cleanValues });
      setEditingId(null);
      setFormVisible(false);
      form.reset();
    } else if (userId) {
      createExperience({
        user_id: userId,
        ...cleanValues,
      } as CreateWorkExperienceRequest);
      setFormVisible(false);
      form.reset();
    }
  });

  const handleEdit = (experience: WorkExperience) => {
    setEditingId(experience.id);
    form.setValues({
      job_title: experience.job_title,
      company_name: experience.company_name,
      industry: experience.industry,
      start_date: experience.start_date,
      end_date: experience.end_date,
      is_current: experience.is_current,
      description: experience.description,
      status: experience.status,
    });
    setFormVisible(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Are you sure you want to delete this work experience?')) {
      deleteExperience(id);
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
        <Box display="flex" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Text fw={600} mb="md">
              Work Experience
            </Text>
            <Text size="sm" color="dimmed" mb="lg">
              Employment records and work history
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
              Add Experience
            </Button>
          )}
        </Box>

        {deleteLoading && (
          <Center>
            <Loader />
          </Center>
        )}

        {experiences.length === 0 && !formVisible ? (
          <Alert icon={<IconAlertCircle />} color="blue">
            No employment records found. Click "Add Experience" to add employment history.
          </Alert>
        ) : null}

        {experiences.length > 0 && (
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Job Title</Table.Th>
                <Table.Th>Company</Table.Th>
                <Table.Th>Start Date</Table.Th>
                <Table.Th>End Date</Table.Th>
                <Table.Th>Current</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {experiences.map((exp) => (
                <Table.Tr key={exp.id}>
                  <Table.Td>{exp.job_title}</Table.Td>
                  <Table.Td>{exp.company_name}</Table.Td>
                  <Table.Td>{exp.start_date}</Table.Td>
                  <Table.Td>{exp.end_date}</Table.Td>
                  <Table.Td>{exp.is_current ? 'Yes' : 'No'}</Table.Td>
                  <Table.Td>
                    <Box display="flex" style={{ gap: '8px' }}>
                      <ActionIcon size="xs" color="blue" variant="light" onClick={() => handleEdit(exp)}>
                        <IconEdit size={14} />
                      </ActionIcon>
                      <ActionIcon size="xs" color="red" variant="light" onClick={() => handleDelete(exp.id)}>
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
                  {editingId ? 'Edit Work Experience' : 'Add New Employment Record'}
                </Text>
              </Box>
              <Box component="form" onSubmit={handleSubmit}>
                <Stack gap="md">
                  <Grid>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Job Title"
                        placeholder="Enter job title"
                        required
                        {...form.getInputProps('job_title')}
                      />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput
                        label="Company Name"
                        placeholder="Enter company name"
                        required
                        {...form.getInputProps('company_name')}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput label="Industry" placeholder="Enter industry" {...form.getInputProps('industry')} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput label="Status" placeholder="Enter status" {...form.getInputProps('status')} />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput label="Start Date" type="date" {...form.getInputProps('start_date')} />
                    </Grid.Col>
                    <Grid.Col span={{ base: 12, md: 6 }}>
                      <TextInput label="End Date" type="date" {...form.getInputProps('end_date')} />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12 }}>
                      <Checkbox
                        label="Currently working here"
                        {...form.getInputProps('is_current', {
                          type: 'checkbox',
                        })}
                      />
                    </Grid.Col>

                    <Grid.Col span={{ base: 12 }}>
                      <Textarea
                        label="Description"
                        placeholder="Enter job description"
                        rows={3}
                        {...form.getInputProps('description')}
                      />
                    </Grid.Col>
                  </Grid>

                  <Box display="flex" style={{ justifyContent: 'flex-end', gap: '16px' }}>
                    <Button variant="light" onClick={handleCancel}>
                      Cancel
                    </Button>
                    <Button type="submit" loading={createLoading || updateLoading}>
                      {editingId ? 'Update' : 'Add'} Employment
                    </Button>
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

export default WorkExperienceTab;
