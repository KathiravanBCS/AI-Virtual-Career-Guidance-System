import { useState } from 'react';

import { Badge, Button, Checkbox, Container, Drawer, Group, Stack, Text } from '@mantine/core';
import { DataTableColumn } from 'mantine-datatable';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';
import { ListTable } from '@/components/tables/ListTable';
import { RolePicker, PermissionPicker } from '@/components/Forms/Pickers';
import { useListPageState } from '@/lib/hooks/useListPageState';

import {
  useCreateRolePermission,
  useDeleteRolePermission,
  useGetAllRolePermissions,
  useGetRolePermissionById,
  useUpdateRolePermission,
} from '../api';
import type { CreateRolePermissionRequest, RolePermission, UpdateRolePermissionRequest } from '../types';
import { IconPlus } from '@tabler/icons-react';

const RolePermissionsList: React.FC = () => {
  const { data: rolePermissions = [], isLoading, error } = useGetAllRolePermissions();
  const [selectedRolePermissionId, setSelectedRolePermissionId] = useState<number | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCreateMode, setIsCreateMode] = useState(false);
  const [formData, setFormData] = useState<Partial<UpdateRolePermissionRequest | CreateRolePermissionRequest>>({});

  const { data: rolePermissionDetail, isLoading: isLoadingDetail } = useGetRolePermissionById(
    selectedRolePermissionId
  );
  const updateRolePermission = useUpdateRolePermission();
  const createRolePermission = useCreateRolePermission();
  const deleteRolePermission = useDeleteRolePermission();

  const handleRowClick = (rolePermission: RolePermission) => {
    setSelectedRolePermissionId(rolePermission.id);
    setIsDrawerOpen(true);
    setIsEditMode(false);
    setFormData({});
  };

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
    setSelectedRolePermissionId(null);
    setIsEditMode(false);
    setIsCreateMode(false);
    setFormData({});
  };

  const handleAddRolePermissionClick = () => {
    setIsCreateMode(true);
    setIsEditMode(false);
    setSelectedRolePermissionId(null);
    setFormData({
      role_id: undefined,
      permission_id: undefined,
      is_granted: true,
    });
    setIsDrawerOpen(true);
  };

  const handleEditClick = () => {
    if (rolePermissionDetail) {
      setFormData({
        role_id: rolePermissionDetail.role.id,
        permission_id: rolePermissionDetail.permission.id,
        is_granted: rolePermissionDetail.is_granted,
      });
      setIsEditMode(true);
    }
  };

  const handleUpdateSubmit = () => {
    if (selectedRolePermissionId && formData) {
      updateRolePermission.mutate(
        {
          rolePermissionId: selectedRolePermissionId,
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
    if (formData && isCreateMode && formData.role_id && formData.permission_id) {
      createRolePermission.mutate(formData as CreateRolePermissionRequest, {
        onSuccess: () => {
          handleDrawerClose();
        },
      });
    }
  };

  const handleDeleteRolePermission = () => {
    if (selectedRolePermissionId && confirm('Are you sure you want to delete this role permission?')) {
      deleteRolePermission.mutate(selectedRolePermissionId, {
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
    { accessor: 'role_id', title: 'Role ID' },
    { accessor: 'permission_id', title: 'Permission ID' },
    { accessor: 'action', title: 'Action' },
    { accessor: 'is_active', title: 'Status' },
  ];

  const { page, setPage, pageSize, setPageSize, sortStatus, setSortStatus, totalRecords, paginatedData } =
    useListPageState<RolePermission>({
      data: rolePermissions,
      columns: ColumnDefinitions,
      storageKey: 'rolePermissions',
    });

  // Table columns
  const columns: DataTableColumn<RolePermission>[] = [
    {
      accessor: 'role.role_name',
      title: 'Role',
      width: 150,
      resizable: true,
      sortable: true,
      render: (rp) => (
        <Text size="md" fw={500}>
          {rp.role?.role_name || '-'}
        </Text>
      ),
    },
    {
      accessor: 'permission.action',
      title: 'Permission',
      width: 150,
      resizable: true,
      sortable: true,
      render: (rp) => (
        <Text size="md" fw={500}>
          {rp.permission?.action || '-'}
        </Text>
      ),
    },
    {
      accessor: 'permission.description',
      title: 'Description',
      width: 250,
      resizable: true,
      render: (rp) => <Text size="sm">{rp.permission?.description || '-'}</Text>,
    },
    {
      accessor: 'is_granted',
      title: 'Status',
      width: 120,
      resizable: true,
      sortable: true,
      render: (rp) => (
        <Badge color={rp.is_granted ? 'green' : 'red'} variant="light">
          {rp.is_granted ? 'Granted' : 'Denied'}
        </Badge>
      ),
    },
  ];

  return (
    <Container size="fluid" py="xs">
      <ListPageLayout
        title="Role Permissions"
        titleProps={{ fw: 700, size: 'h1' }}
        description="Assign and manage permissions for roles."
        actions={
          <Button leftSection={<IconPlus />} onClick={handleAddRolePermissionClick} size="sm">
            Assign Permission
          </Button>
        }
      >
        <ListTable<RolePermission>
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
          storeColumnsKey="rolePermissions"
          onRowClick={handleRowClick}
          emptyState={{
            title: 'No role permissions found',
            description: 'No role-permission assignments available.',
          }}
        />

        <Drawer
          opened={isDrawerOpen}
          onClose={handleDrawerClose}
          title={
            isCreateMode ? 'Assign Permission to Role' : isEditMode ? 'Edit Role Permission' : 'Role Permission Details'
          }
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
                <RolePicker
                  required
                  value={formData.role_id || null}
                  onChange={(val) => setFormData({ ...formData, role_id: val || undefined })}
                />

                <PermissionPicker
                  required
                  value={formData.permission_id || null}
                  onChange={(val) => setFormData({ ...formData, permission_id: val || undefined })}
                />

                <Checkbox
                  label="Granted"
                  checked={formData.is_granted !== false}
                  onChange={(e) => setFormData({ ...formData, is_granted: e.currentTarget.checked })}
                />

                <Group justify="flex-end" mt="xl">
                  <Button variant="default" onClick={handleCancel}>
                    Cancel
                  </Button>
                  <Button type="submit" loading={createRolePermission.isPending}>
                    Create
                  </Button>
                </Group>
              </Stack>
            </form>
          ) : isLoadingDetail ? (
            <Text>Loading...</Text>
          ) : rolePermissionDetail && rolePermissionDetail.role && rolePermissionDetail.permission ? (
            <>
              {!isEditMode ? (
                <div>
                  <Group justify="space-between" mb="lg">
                    <Badge color={rolePermissionDetail.is_granted ? 'green' : 'red'} variant="light">
                      {rolePermissionDetail.is_granted ? 'Granted' : 'Denied'}
                    </Badge>
                     <Button variant="light" onClick={handleEditClick}>
                       Edit
                     </Button>
                   </Group>

                   <div style={{ marginBottom: '1.5rem' }}>
                     <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                       Role
                     </Text>
                     <Text size="lg" fw={500}>
                       {rolePermissionDetail.role.role_name}
                     </Text>
                     <Text size="sm" c="dimmed">
                       {rolePermissionDetail.role.description}
                     </Text>
                   </div>

                   <div style={{ marginBottom: '1.5rem' }}>
                     <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                       Permission
                     </Text>
                     <Text size="lg" fw={500}>
                       {rolePermissionDetail.permission.action}
                     </Text>
                     <Text size="sm" c="dimmed">
                       {rolePermissionDetail.permission.description}
                     </Text>
                   </div>

                   <div style={{ marginBottom: '1.5rem' }}>
                     <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                       Created By
                     </Text>
                     <Text size="md">{rolePermissionDetail.created_by}</Text>
                   </div>

                   <div style={{ marginBottom: '1.5rem' }}>
                     <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                       Created At
                     </Text>
                     <Text size="md">{new Date(rolePermissionDetail.created_at).toLocaleString()}</Text>
                   </div>

                   {rolePermissionDetail.updated_by && (
                     <div style={{ marginBottom: '1.5rem' }}>
                       <Text size="xs" c="dimmed" fw={500} tt="uppercase" mb={4}>
                         Updated By
                       </Text>
                       <Text size="md">{rolePermissionDetail.updated_by}</Text>
                     </div>
                   )}

                   <Button fullWidth color="red" variant="light" onClick={handleDeleteRolePermission} mt="xl">
                     Delete Assignment
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
                    <RolePicker
                      required
                      value={formData.role_id || null}
                      onChange={(val) => setFormData({ ...formData, role_id: val || undefined })}
                    />

                    <PermissionPicker
                      required
                      value={formData.permission_id || null}
                      onChange={(val) => setFormData({ ...formData, permission_id: val || undefined })}
                    />

                    <Checkbox
                      label="Granted"
                      checked={formData.is_granted !== false}
                      onChange={(e) => setFormData({ ...formData, is_granted: e.currentTarget.checked })}
                    />

                    <Group justify="flex-end" mt="xl">
                      <Button variant="default" onClick={handleCancel}>
                        Cancel
                      </Button>
                      <Button type="submit" loading={updateRolePermission.isPending}>
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

export default RolePermissionsList;
