import { useState } from 'react';

import { Badge, Button, Checkbox, Container, Drawer, Group, Stack, Text, TextInput } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';
import { ListTable } from '@/components/tables/ListTable';
import { useListPageState } from '@/lib/hooks/useListPageState';

import { useCreateRole, useDeleteRole, useGetAllRoles, useGetRoleById, useUpdateRole } from '../api';
import type { CreateRoleRequest, Role, UpdateRoleRequest } from '../types';

const RolesList: React.FC = () => {
  const { data: rolesResponse, isLoading, error } = useGetAllRoles();
  const roles = Array.isArray(rolesResponse) ? rolesResponse : (rolesResponse as any)?.data || [];
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateRoleRequest | CreateRoleRequest>>({});

  const { data: roleDetail, isLoading: isLoadingDetail } = useGetRoleById(selectedRoleId);
  const updateRole = useUpdateRole();
  const createRole = useCreateRole();
  const deleteRole = useDeleteRole();

  const handleRowClick = (role: Role) => {
    setSelectedRoleId(role.id);
    setIsDrawerOpen(true);
    setIsEditMode(false);
    setFormData({});
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedRoleId(null);
    setIsEditMode(false);
    setIsCreateMode(false);
    setFormData({});
  };

  const handleAddRoleClick = () => {
    setIsCreateMode(true);
    setIsEditMode(false);
    setSelectedRoleId(null);
    setFormData({
      role_name: '',
      description: '',
      is_system_role: false,
      is_active: true,
    });
    setIsDrawerOpen(true);
  };

  const handleEditClick = () => {
    if (roleDetail) {
      setFormData({
        role_name: roleDetail.role_name,
        description: roleDetail.description,
        is_system_role: roleDetail.is_system_role,
        is_active: roleDetail.is_active,
      });
      setIsEditMode(true);
    }
  };

  const handleUpdateSubmit = () => {
    if (selectedRoleId && formData) {
      updateRole.mutate(
        {
          roleId: selectedRoleId,
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
      createRole.mutate(formData as CreateRoleRequest, {
        onSuccess: () => {
          handleDrawerClose();
        },
      });
    }
  };

  const handleDeleteRole = () => {
    if (selectedRoleId && confirm('Are you sure you want to delete this role?')) {
      deleteRole.mutate(selectedRoleId, {
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
    { accessor: 'role_name', title: 'Role Name' },
    { accessor: 'description', title: 'Description' },
    { accessor: 'is_system_role', title: 'Type' },
    { accessor: 'is_active', title: 'Status' },
  ];

  const { page, setPage, pageSize, setPageSize, sortStatus, setSortStatus, totalRecords, paginatedData } =
    useListPageState<Role>({
      data: roles,
      columns: ColumnDefinitions,
      storageKey: 'roles',
    });

  // Table columns
  const columns: DataTableColumn<Role>[] = [
    {
      accessor: 'role_name',
      title: 'Role Name',
      width: 200,
      resizable: true,
      sortable: true,
      render: (role) => (
        <Text size="md" fw={500}>
          {role.role_name}
        </Text>
      ),
    },
    {
      accessor: 'description',
      title: 'Description',
      width: 250,
      resizable: true,
      sortable: true,
      render: (role) => <Text size="md">{role.description}</Text>,
    },
    {
      accessor: 'is_system_role',
      title: 'Type',
      width: 120,
      resizable: true,
      sortable: true,
      render: (role) => (
        <Badge color={role.is_system_role ? 'blue' : 'gray'} variant="light">
          {role.is_system_role ? 'System' : 'Custom'}
        </Badge>
      ),
    },
    {
      accessor: 'is_active',
      title: 'Status',
      width: 120,
      resizable: true,
      sortable: true,
      render: (role) => (
        <Badge color={role.is_active ? 'green' : 'red'} variant="light">
          {role.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <Container size="fluid" py="xs">
      <ListPageLayout
        title="Master Roles"
        titleProps={{ fw: 700, size: 'h1' }}
        description="Browse and manage all system roles."
        actions={
          <Button leftSection={<IconPlus />} onClick={handleAddRoleClick} size="sm">
            Add Role
          </Button>
        }
      >
        <ListTable<Role>
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
          storeColumnsKey="roles"
          onRowClick={handleRowClick}
          emptyState={{
            title: 'No roles found',
            description: 'No master roles available.',
          }}
        />

        <Drawer
          opened={isDrawerOpen}
          onClose={handleDrawerClose}
          title={isCreateMode ? 'Create Role' : isEditMode ? 'Edit Role' : 'Role Details'}
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
                  label="Role Name"
                  required
                  value={formData.role_name || ''}
                  onChange={(e) => setFormData({ ...formData, role_name: e.currentTarget.value })}
                />

                <TextInput
                  label="Description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
                />

                <Checkbox
                  label="System Role"
                  checked={formData.is_system_role || false}
                  onChange={(e) => setFormData({ ...formData, is_system_role: e.currentTarget.checked })}
                />

                <Checkbox
                  label="Active"
                  checked={formData.is_active !== false}
                  onChange={(e) => setFormData({ ...formData, is_active: e.currentTarget.checked })}
                />

                <Group justify="flex-end" mt="xl">
                  <Button variant="default" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={createRole.isPending}>
                    Create
                  </Button>
                </Group>
              </Stack>
            </form>
          ) : isLoadingDetail ? (
            <Text>Loading...</Text>
          ) : roleDetail ? (
            <>
              {!isEditMode ? (
                <div>
                  <Group justify="space-between" mb="lg">
                    <Group gap="md">
                      <Badge color={roleDetail.is_active ? 'green' : 'red'} variant="light">
                        {roleDetail.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                      <Badge color={roleDetail.is_system_role ? 'blue' : 'gray'} variant="light">
                        {roleDetail.is_system_role ? 'System' : 'Custom'}
                      </Badge>
                    </Group>
                    <Button variant="light" onClick={handleEditClick}>
                      Edit
                    </Button>
                  </Group>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                      Role Name
                    </Text>
                    <Text size="lg" fw={500}>
                      {roleDetail.role_name}
                    </Text>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                      Description
                    </Text>
                    <Text size="md">{roleDetail.description}</Text>
                  </div>

                  <Button fullWidth color="red" variant="light" onClick={handleDeleteRole} mt="xl">
                    Delete Role
                  </Button>
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
                      label="Role Name"
                      required
                      value={formData.role_name || ''}
                      onChange={(e) => setFormData({ ...formData, role_name: e.currentTarget.value })}
                    />

                    <TextInput
                      label="Description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
                    />

                    <Checkbox
                      label="System Role"
                      checked={formData.is_system_role || false}
                      onChange={(e) => setFormData({ ...formData, is_system_role: e.currentTarget.checked })}
                    />

                    <Checkbox
                      label="Active"
                      checked={formData.is_active !== false}
                      onChange={(e) => setFormData({ ...formData, is_active: e.currentTarget.checked })}
                    />

                    <Group justify="flex-end" mt="xl">
                      <Button variant="default" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit" loading={updateRole.isPending}>
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

export default RolesList;
