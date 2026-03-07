import { useState } from 'react';

import { Badge, Button, Checkbox, Container, Drawer, Group, Stack, Text, TextInput, Textarea } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';
import { ListTable } from '@/components/tables/ListTable';
import { useListPageState } from '@/lib/hooks/useListPageState';

import {
  useCreatePermission,
  useDeletePermission,
  useGetAllPermissions,
  useGetPermissionById,
  useUpdatePermission,
} from '../api';
import type { CreatePermissionRequest, Permission, UpdatePermissionRequest } from '../types';
import { IconPlus } from '@tabler/icons-react';

const PermissionsList: React.FC = () => {
  const { data: permissionsResponse, isLoading, error } = useGetAllPermissions();
  const permissions = Array.isArray(permissionsResponse) ? permissionsResponse : (permissionsResponse as any)?.data || [];
  const [selectedPermissionId, setSelectedPermissionId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdatePermissionRequest | CreatePermissionRequest>>({});

  const { data: permissionDetail, isLoading: isLoadingDetail } = useGetPermissionById(selectedPermissionId);
  const updatePermission = useUpdatePermission();
  const createPermission = useCreatePermission();
  const deletePermission = useDeletePermission();

  const handleRowClick = (permission: Permission) => {
    setSelectedPermissionId(permission.id);
    setIsDrawerOpen(true);
    setIsEditMode(false);
    setFormData({});
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedPermissionId(null);
    setIsEditMode(false);
    setIsCreateMode(false);
    setFormData({});
  };

  const handleAddPermissionClick = () => {
    setIsCreateMode(true);
    setIsEditMode(false);
    setSelectedPermissionId(null);
    setFormData({
      action: '',
      description: '',
      is_active: true,
    });
    setIsDrawerOpen(true);
  };

  const handleEditClick = () => {
    if (permissionDetail) {
      setFormData({
        action: permissionDetail.action,
        description: permissionDetail.description,
        is_active: permissionDetail.is_active,
      });
      setIsEditMode(true);
    }
  };

  const handleUpdateSubmit = () => {
    if (selectedPermissionId && formData) {
      updatePermission.mutate(
        {
          permissionId: selectedPermissionId,
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
      createPermission.mutate(formData as CreatePermissionRequest, {
        onSuccess: () => {
          handleDrawerClose();
        },
      });
    }
  };

  const handleDeletePermission = () => {
    if (selectedPermissionId && confirm('Are you sure you want to delete this permission?')) {
      deletePermission.mutate(selectedPermissionId, {
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
    { accessor: 'action', title: 'Action' },
    { accessor: 'description', title: 'Description' },
    { accessor: 'is_active', title: 'Status' },
  ];

  const { page, setPage, pageSize, setPageSize, sortStatus, setSortStatus, totalRecords, paginatedData } =
    useListPageState<Permission>({
      data: permissions,
      columns: ColumnDefinitions,
      storageKey: 'permissions',
    });

  // Table columns
  const columns: DataTableColumn<Permission>[] = [
    {
      accessor: 'action',
      title: 'Action',
      width: 150,
      resizable: true,
      sortable: true,
      render: (permission) => (
        <Text size="md" fw={500}>
          {permission.action}
        </Text>
      ),
    },
    {
      accessor: 'description',
      title: 'Description',
      width: 300,
      resizable: true,
      sortable: true,
      render: (permission) => <Text size="md">{permission.description}</Text>,
    },
    {
      accessor: 'is_active',
      title: 'Status',
      width: 120,
      resizable: true,
      sortable: true,
      render: (permission) => (
        <Badge color={permission.is_active ? 'green' : 'red'} variant="light">
          {permission.is_active ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
  ];

  return (
    <Container size="fluid" py="xs">
      <ListPageLayout
        title="Master Permissions"
        titleProps={{ fw: 700, size: 'h1' }}
        description="Browse and manage all system permissions."
        actions={
          <Button leftSection={<IconPlus />} onClick={handleAddPermissionClick} size="sm">
            Add Permission
          </Button>
        }
      >
        <ListTable<Permission>
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
          storeColumnsKey="permissions"
          onRowClick={handleRowClick}
          emptyState={{
            title: 'No permissions found',
            description: 'No master permissions available.',
          }}
        />

        <Drawer
          opened={isDrawerOpen}
          onClose={handleDrawerClose}
          title={isCreateMode ? 'Create Permission' : isEditMode ? 'Edit Permission' : 'Permission Details'}
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
                  label="Action"
                  required
                  placeholder="e.g., read, write, delete"
                  value={formData.action || ''}
                  onChange={(e) => setFormData({ ...formData, action: e.currentTarget.value })}
                />

                <Textarea
                  label="Description"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
                  minRows={3}
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
                  <Button type="submit" loading={createPermission.isPending}>
                    Create
                  </Button>
                </Group>
              </Stack>
            </form>
          ) : isLoadingDetail ? (
            <Text>Loading...</Text>
          ) : permissionDetail ? (
            <>
              {!isEditMode ? (
                <div>
                  <Group justify="space-between" mb="lg">
                    <Badge color={permissionDetail.is_active ? 'green' : 'red'} variant="light">
                      {permissionDetail.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Button variant="light" onClick={handleEditClick}>
                      Edit
                    </Button>
                  </Group>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                      Action
                    </Text>
                    <Text size="lg" fw={500}>
                      {permissionDetail.action}
                    </Text>
                  </div>

                  <div style={{ marginBottom: '1.5rem' }}>
                    <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                      Description
                    </Text>
                    <Text size="md">{permissionDetail.description}</Text>
                  </div>

                  <Button fullWidth color="red" variant="light" onClick={handleDeletePermission} mt="xl">
                    Delete Permission
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
                      label="Action"
                      required
                      placeholder="e.g., read, write, delete"
                      value={formData.action || ''}
                      onChange={(e) => setFormData({ ...formData, action: e.currentTarget.value })}
                    />

                    <Textarea
                      label="Description"
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.currentTarget.value })}
                      minRows={3}
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
                      <Button type="submit" loading={updatePermission.isPending}>
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

export default PermissionsList;
