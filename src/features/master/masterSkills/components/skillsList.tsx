import { useState } from 'react';

import { Badge, Button, Container, Drawer, Group, Select, Stack, Text, Textarea, TextInput } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';
import { useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';
import { ListTable } from '@/components/tables/ListTable';
import { useListPageState } from '@/lib/hooks/useListPageState';

import { useCreateSkill, useGetAllSkills, useGetSkillById, useUpdateSkill } from '../api';
import type { CreateSkillRequest, SkillDetail, SkillListItem, UpdateSkillRequest } from '../types';

const SkillsList: React.FC = () => {
  const { data: skills = [], isLoading, error } = useGetAllSkills();
  const [selectedSkillId, setSelectedSkillId] = useState<string | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateSkillRequest | CreateSkillRequest>>({});

  const { data: skillDetail, isLoading: isLoadingDetail } = useGetSkillById(selectedSkillId || '');
  const updateSkill = useUpdateSkill();
  const createSkill = useCreateSkill();

  const handleRowClick = (skill: SkillListItem) => {
    setSelectedSkillId(skill.id.toString());
    setIsDrawerOpen(true);
    setIsEditMode(false);
    setFormData({});
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedSkillId(null);
    setIsEditMode(false);
    setIsCreateMode(false);
    setFormData({});
  };

  const handleAddSkillClick = () => {
    setIsCreateMode(true);
    setIsEditMode(false);
    setSelectedSkillId(null);
    setFormData({
      skill_name: '',
      category: '',
      difficulty_level: '',
      description: '',
      status: 'active',
    });
    setIsDrawerOpen(true);
  };

  const handleEditClick = () => {
    if (skillDetail) {
      setFormData({
        id: skillDetail.id,
        skill_name: skillDetail.skill_name,
        category: skillDetail.category,
        difficulty_level: skillDetail.difficulty_level,
        description: skillDetail.description,
        status: skillDetail.status,
      });
      setIsEditMode(true);
    }
  };

  const handleUpdateSubmit = () => {
    if (selectedSkillId && formData) {
      updateSkill.mutate(
        {
          skillId: selectedSkillId,
          data: formData,
        },
        {
          onSuccess: () => {
            handleDrawerClose();
          },
        }
      );
    }
  };

  const handleCreateSubmit = () => {
    if (formData && isCreateMode) {
      createSkill.mutate(formData as CreateSkillRequest, {
        onSuccess: () => {
          handleDrawerClose();
        },
      });
    }
  };

  const handleCancel = () => {
    setIsEditMode(false);
    setIsCreateMode(false);
    setFormData({});
  };

  const ColumnDefinitions: ColumnDefinition[] = [
    { accessor: 'skill_name', title: 'Skill Name' },
    { accessor: 'category', title: 'Category' },
    { accessor: 'difficulty_level', title: 'Difficulty Level' },
    { accessor: 'status', title: 'Status' },
    { accessor: 'created_at', title: 'Created At' },
  ];

  const { page, setPage, pageSize, setPageSize, sortStatus, setSortStatus, totalRecords, paginatedData } =
    useListPageState<SkillListItem>({
      data: skills,
      columns: ColumnDefinitions,
      storageKey: 'skills',
    });

  // Table columns
  const columns: DataTableColumn<SkillListItem>[] = [
    {
      accessor: 'skill_name',
      title: 'Skill Name',
      width: 200,
      resizable: true,
      sortable: true,
      render: (skill) => (
        <Text size="md" fw={500}>
          {skill.skill_name}
        </Text>
      ),
    },
    {
      accessor: 'category',
      title: 'Category',
      width: 150,
      resizable: true,
      sortable: true,
      render: (skill) => <Text size="md">{skill.category}</Text>,
    },
    {
      accessor: 'difficulty_level',
      title: 'Difficulty Level',
      width: 150,
      resizable: true,
      sortable: true,
      render: (skill) => (
        <Badge
          color={
            skill.difficulty_level === 'Beginner' ? 'green' : skill.difficulty_level === 'Intermediate' ? 'blue' : 'red'
          }
          variant="light"
        >
          {skill.difficulty_level}
        </Badge>
      ),
    },
    {
      accessor: 'status',
      title: 'Status',
      width: 120,
      resizable: true,
      sortable: true,
      render: (skill) => (
        <Badge color={skill.status === 'active' ? 'green' : 'red'} variant="light">
          {skill.status}
        </Badge>
      ),
    },
    {
      accessor: 'created_at',
      title: 'Created At',
      width: 150,
      resizable: true,
      sortable: true,
      render: (skill) => <Text size="sm">{new Date(skill.created_at).toLocaleDateString()}</Text>,
    },
  ];

  return (
    <Container size="fluid" py="xs">
      <ListPageLayout
        title="Master Skills"
        titleProps={{ fw: 700, size: 'h1' }}
        description="Browse all available skills in the system."
        actions={
          <Button onClick={handleAddSkillClick} size="md">
            Add Skill
          </Button>
        }
      >
        <ListTable<SkillListItem>
          data={paginatedData}
          loading={isLoading}
          error={error}
          columns={columns}
          page={page}
          pageSize={pageSize}
          totalRecords={totalRecords}
          onPageChange={setPage}
          sortStatus={sortStatus}
          onSortStatusChange={setSortStatus}
          stickyHeader
          onPageSizeChange={setPageSize}
          storeColumnsKey="skills"
          onRowClick={handleRowClick}
          emptyState={{
            title: 'No skills found',
            description: 'No master skills available.',
          }}
        />

        <Drawer
          opened={isDrawerOpen}
          onClose={handleDrawerClose}
          title={isCreateMode ? 'Create Skill' : isEditMode ? 'Edit Skill' : 'Skill Details'}
          position="right"
          size="md"
        >
          {isCreateMode ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateSubmit();
              }}
            >
              <Stack gap="md">
                <TextInput
                  label="Skill Name"
                  required
                  value={formData.skill_name || ''}
                  onChange={(e) => setFormData({ ...formData, skill_name: e.currentTarget.value })}
                />

                <TextInput
                  label="Category"
                  required
                  value={formData.category || ''}
                  onChange={(e) => setFormData({ ...formData, category: e.currentTarget.value })}
                />

                <Select
                  label="Difficulty Level"
                  required
                  data={[
                    { value: 'Beginner', label: 'Beginner' },
                    { value: 'Intermediate', label: 'Intermediate' },
                    { value: 'Advanced', label: 'Advanced' },
                  ]}
                  value={formData.difficulty_level || ''}
                  onChange={(value) => setFormData({ ...formData, difficulty_level: value || '' })}
                />

                <Textarea
                  label="Description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
                  minRows={4}
                />

                <Select
                  label="Status"
                  required
                  data={[
                    { value: 'active', label: 'Active' },
                    { value: 'inactive', label: 'Inactive' },
                  ]}
                  value={formData.status || ''}
                  onChange={(value) =>
                    setFormData({
                      ...formData,
                      status: (value || 'active') as 'active' | 'inactive',
                    })
                  }
                />

                <Group justify="flex-end" mt="xl">
                  <Button variant="default" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={createSkill.isPending}>
                    Create
                  </Button>
                </Group>
              </Stack>
            </form>
          ) : isLoadingDetail ? (
            <Text>Loading...</Text>
          ) : skillDetail ? (
            <>
              {!isEditMode ? (
                <div>
                  <Group justify="space-between" mb="lg">
                    <Badge color={skillDetail.status === 'active' ? 'green' : 'red'} variant="light">
                      {skillDetail.status}
                    </Badge>
                    <Button variant="light" onClick={handleEditClick}>
                      Edit
                    </Button>
                  </Group>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                      Skill Name
                    </Text>
                    <Text size="lg" fw={500}>
                      {skillDetail.skill_name}
                    </Text>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                      Category
                    </Text>
                    <Text size="md">{skillDetail.category}</Text>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                      Difficulty Level
                    </Text>
                    <Badge
                      color={
                        skillDetail.difficulty_level === 'Beginner'
                          ? 'green'
                          : skillDetail.difficulty_level === 'Intermediate'
                            ? 'blue'
                            : 'red'
                      }
                      variant="light"
                      size="lg"
                    >
                      {skillDetail.difficulty_level}
                    </Badge>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                      Description
                    </Text>
                    <Text size="md">{skillDetail.description}</Text>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                      Created At
                    </Text>
                    <Text size="md">{new Date(skillDetail.created_at).toLocaleDateString()}</Text>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleUpdateSubmit();
                  }}
                >
                  <Stack gap="md">
                    <TextInput
                      label="Skill Name"
                      required
                      value={formData.skill_name || ''}
                      onChange={(e) => setFormData({ ...formData, skill_name: e.currentTarget.value })}
                    />

                    <TextInput
                      label="Category"
                      required
                      value={formData.category || ''}
                      onChange={(e) => setFormData({ ...formData, category: e.currentTarget.value })}
                    />

                    <Select
                      label="Difficulty Level"
                      required
                      data={[
                        { value: 'Beginner', label: 'Beginner' },
                        { value: 'Intermediate', label: 'Intermediate' },
                        { value: 'Advanced', label: 'Advanced' },
                      ]}
                      value={formData.difficulty_level || ''}
                      onChange={(value) => setFormData({ ...formData, difficulty_level: value || '' })}
                    />

                    <Textarea
                      label="Description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
                      minRows={4}
                    />

                    <Select
                      label="Status"
                      required
                      data={[
                        { value: 'active', label: 'Active' },
                        { value: 'inactive', label: 'Inactive' },
                      ]}
                      value={formData.status || ''}
                      onChange={(value) =>
                        setFormData({
                          ...formData,
                          status: (value || 'active') as 'active' | 'inactive',
                        })
                      }
                    />

                    <Group justify="flex-end" mt="xl">
                      <Button variant="default" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit" loading={updateSkill.isPending}>
                        Update
                      </Button>
                    </Group>
                  </Stack>
                </form>
              )}
            </>
          ) : null}
        </Drawer>
      </ListPageLayout>
    </Container>
  );
};

export default SkillsList;
