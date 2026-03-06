import { Alert, Box, Button, Grid, Stack, Text, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconAlertCircle } from '@tabler/icons-react';

import { useUpdateUser } from '../../api/users/useUpdateUser';
import type { User } from '../../types';

interface UserBasicInfoTabProps {
  user: User;
}

export const UserBasicInfoTab = ({ user }: UserBasicInfoTabProps) => {
  const { mutate: updateUser, isPending } = useUpdateUser(user.id);

  const form = useForm({
    initialValues: {
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      email: user.email || '',
      phone: user.phone || '',
      location: user.location || '',
      profile_picture_url: user.profile_picture_url || '',
    },
    validate: {
      first_name: (value) => (!value ? 'First name is required' : null),
      last_name: (value) => (!value ? 'Last name is required' : null),
      email: (value) => (!value ? 'Email is required' : null),
    },
  });

  const handleSubmit = form.onSubmit((values) => {
    updateUser(values);
  });

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Box>
          <Text fw={600} mb="md">
            Personal Information
          </Text>
          <Text size="sm" color="dimmed" mb="lg">
            Update your basic profile information
          </Text>
        </Box>

        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="First Name"
              placeholder="Enter first name"
              {...form.getInputProps('first_name')}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Last Name" placeholder="Enter last name" {...form.getInputProps('last_name')} required />
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="Email"
              type="email"
              placeholder="Enter email address"
              {...form.getInputProps('email')}
              required
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput label="Phone" placeholder="Enter phone number" {...form.getInputProps('phone')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <TextInput label="Location" placeholder="Enter your location" {...form.getInputProps('location')} />
          </Grid.Col>

          <Grid.Col span={{ base: 12 }}>
            <TextInput
              label="Profile Picture URL"
              placeholder="Enter profile picture URL"
              {...form.getInputProps('profile_picture_url')}
            />
          </Grid.Col>
        </Grid>

        <Box display="flex" style={{ justifyContent: 'flex-end', gap: '16px' }}>
          <Button type="submit" loading={isPending}>
            Save Changes
          </Button>
        </Box>
      </Stack>
    </Box>
  );
};

export default UserBasicInfoTab;
