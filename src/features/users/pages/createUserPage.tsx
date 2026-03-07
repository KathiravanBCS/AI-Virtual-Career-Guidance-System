import { Button, Container, Group, Stack, Title } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowLeft } from '@tabler/icons-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useCreateUser } from '../api/users/useCreateUser';
import { UserForm } from '../components/userForm';
import { CreateUserRequest } from '../types';

export function CreateUserPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const navState = (location.state as any) || {};
  const createMutation = useCreateUser();

  const handleSubmit = (values: CreateUserRequest) => {
    // Validate required fields
    const validationErrors: string[] = [];

    if (!values.email?.trim()) {
      validationErrors.push('Email is required');
    }
    if (!values.first_name?.trim()) {
      validationErrors.push('First name is required');
    }
    if (!values.last_name?.trim()) {
      validationErrors.push('Last name is required');
    }
    if (!values.phone?.trim()) {
      validationErrors.push('Phone is required');
    }
    if (!values.location?.trim()) {
      validationErrors.push('Location is required');
    }
    if (!values.password?.trim()) {
      validationErrors.push('Password is required');
    }

    if (validationErrors.length > 0) {
      notifications.show({
        title: 'Validation Error',
        message: validationErrors.join('\n'),
        color: 'red',
        autoClose: false,
      });
      return;
    }

    if (!values.role_id) {
      notifications.show({
        title: 'Validation Error',
        message: 'Role is required',
        color: 'red',
        autoClose: false,
      });
      return;
    }

    const payload: CreateUserRequest = {
      email: values.email,
      first_name: values.first_name,
      last_name: values.last_name,
      phone: values.phone,
      location: values.location,
      profile_picture_url: values.profile_picture_url,
      password: values.password,
      role_id: values.role_id,
    };

    createMutation.mutate(payload, {
      onSuccess: (data) => {
        notifications.show({
          title: 'Success',
          message: 'User created successfully',
          color: 'green',
          autoClose: 3000,
        });
        navigate(`/users/${data.id}`, { state: { from: navState.from } });
      },
    });
  };

  return (
    <Container size="xl">
      {/* Header */}
      <Group mb="lg" justify="space-between">
        <Title order={1}>Create New User</Title>
        <Group>
          {navState.from && (
            <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate(-1)} px="xs">
              Back
            </Button>
          )}
          <Button variant="subtle" leftSection={<IconArrowLeft size={16} />} onClick={() => navigate('/users')} px="xs">
            Back to Users
          </Button>
        </Group>
      </Group>

      <Stack gap="xl">
        <UserForm onSubmit={handleSubmit} isLoading={createMutation.isPending} />
      </Stack>
    </Container>
  );
}
