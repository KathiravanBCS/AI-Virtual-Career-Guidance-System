import { ActionIcon, Avatar, Badge, Button, Container, Group, Text, Tooltip } from '@mantine/core';
import { modals } from '@mantine/modals';
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react';
import { DataTableColumn } from 'mantine-datatable';
import { useNavigate } from 'react-router-dom';

import { ListPageLayout } from '@/components/list-page/ListPageLayout';
import { ColumnDefinition } from '@/components/tables/ColumnSelector';
import { ListTable } from '@/components/tables/ListTable';
import { User } from '@/features/users/types';
import { useListPageState } from '@/lib/hooks/useListPageState';

import { useDeleteUser } from '../api/users/useDeleteUser';
import { useGetUsers } from '../api/users/useGetUsers';

const UserList: React.FC = () => {
  const navigate = useNavigate();
  const { data: users = [], isLoading, error } = useGetUsers();
  const deleteUser = useDeleteUser();

  const ColumnDefinitions: ColumnDefinition[] = [
    { accessor: 'user_code', title: 'User Code' },
    { accessor: 'first_name', title: 'Name' },
    { accessor: 'email', title: 'Email' },
    { accessor: 'phone', title: 'Phone' },
    { accessor: 'location', title: 'Location' },
    { accessor: 'role_id', title: 'Role' },
    { accessor: 'status', title: 'Status' },
  ];

  const { page, setPage, pageSize, setPageSize, sortStatus, setSortStatus, totalRecords, paginatedData } =
    useListPageState<User>({
      data: users,
      columns: ColumnDefinitions,
      storageKey: 'users',
    });

  // Handlers
  const handleAddUser = () => {
    navigate('/users/new');
  };

  const handleEditUser = (user: User) => {
    if (!user.id) {
      modals.openConfirmModal({
        title: 'Error',
        children: 'Unable to edit user: user ID is missing.',
        labels: { confirm: 'OK', cancel: 'Cancel' },
        onConfirm: () => {},
        centered: true,
      });
      return;
    }
    navigate(`/users/edit/${user.id}`);
  };

  const handleDeleteUser = (user: User) => {
    if (!user.id) {
      modals.openConfirmModal({
        title: 'Error',
        children: 'Unable to delete user: user ID is missing.',
        labels: { confirm: 'OK', cancel: 'Cancel' },
        onConfirm: () => {},
        centered: true,
      });
      return;
    }

    modals.openConfirmModal({
      title: 'Delete User',
      children: `Are you sure you want to delete "${user.first_name} ${user.last_name}"?`,
      labels: { confirm: 'Delete', cancel: 'Cancel' },
      confirmProps: { color: 'red' },
      onConfirm: () => {
        if (!user.id) {
          console.error('Cannot delete user without a valid id.', user);
          return;
        }
        deleteUser.mutate(user.id);
      },
      centered: true,
    });
  };

  // Table columns
  const columns: DataTableColumn<User>[] = [
    {
      accessor: 'user_code',
      title: 'User Code',
      width: 120,
      resizable: true,
      sortable: true,
      render: (user) => (
        <Text size="md" fw={500}>
          {user.user_code}
        </Text>
      ),
    },
    {
      accessor: 'name',
      title: 'Name',
      width: 200,
      resizable: true,
      sortable: true,
      render: (user) => (
        <Group gap="md">
          <Avatar src={user.profile_picture_url} size={32} radius="md" name={`${user.first_name} ${user.last_name}`} />
          <Text size="md" fw={500}>
            {user.first_name} {user.last_name}
          </Text>
        </Group>
      ),
    },
    {
      accessor: 'email',
      title: 'Email',
      width: 250,
      resizable: true,
      sortable: true,
      render: (user) => (
        <Tooltip label={user.email} position="top" multiline maw={300}>
          <Text size="md" truncate>
            {user.email}
          </Text>
        </Tooltip>
      ),
    },
    {
      accessor: 'phone',
      title: 'Phone',
      width: 150,
      resizable: true,
      sortable: true,
      render: (user) => <Text size="md">{user.phone}</Text>,
    },
    {
      accessor: 'location',
      title: 'Location',
      width: 150,
      resizable: true,
      sortable: true,
      render: (user) => <Text size="md">{user.location}</Text>,
    },
    {
      accessor: 'role.role_name',
      title: 'Role',
      width: 150,
      resizable: true,
      sortable: true,
      render: (user) => (
        <Badge color="blue" variant="light">
          {user.role?.role_name || `Role ${user.role_id}`}
        </Badge>
      ),
    },
    {
      accessor: 'status',
      title: 'Status',
      width: 120,
      resizable: true,
      sortable: true,
      render: (user) => (
        <Badge color={user.is_active ? 'green' : 'red'} variant="light">
          {user.status || (user.is_active ? 'Active' : 'Inactive')}
        </Badge>
      ),
    },
    {
      accessor: 'actions',
      title: '',
      width: 100,
      resizable: true,
      textAlign: 'center',
      render: (user) => (
        <Group gap={8} justify="center">
          <Tooltip label="Edit" position="top" color="blue">
            <ActionIcon variant="subtle" color="blue" onClick={() => handleEditUser(user)}>
              <IconEdit size={16} />
            </ActionIcon>
          </Tooltip>
          <Tooltip label="Delete" position="top" color="red">
            <ActionIcon variant="subtle" color="red" onClick={() => handleDeleteUser(user)}>
              <IconTrash size={16} />
            </ActionIcon>
          </Tooltip>
        </Group>
      ),
    },
  ];

  return (
    <Container size="fluid" py="xs">
      <ListPageLayout
        title="Users"
        titleProps={{ fw: 700, size: 'h1' }}
        actions={
          <Button leftSection={<IconPlus size={16} />} onClick={handleAddUser}>
            Add User
          </Button>
        }
      >
        <ListTable<User>
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
          storeColumnsKey="users"
          emptyState={{
            title: 'No users found',
            description: 'Click "Add User" to create one.',
            action: {
              label: 'Add User',
              onClick: handleAddUser,
            },
          }}
        />
      </ListPageLayout>
    </Container>
  );
};

export default UserList;
