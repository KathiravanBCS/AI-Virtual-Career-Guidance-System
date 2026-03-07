import { Button, FileInput, Group, PasswordInput, Stack, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { RolePicker } from '@/components/Forms/Pickers';

interface UserFormData {
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  location: string;
  profile_picture_url?: string;
  password: string;
  role_id: number | null;
}

interface UserFormProps {
  onSubmit: (data: UserFormData) => void;
  initialValues?: Partial<UserFormData>;
  isLoading?: boolean;
}

export function UserForm({ onSubmit, initialValues, isLoading = false }: UserFormProps) {
  const form = useForm<UserFormData>({
    initialValues: {
      email: initialValues?.email || '',
      first_name: initialValues?.first_name || '',
      last_name: initialValues?.last_name || '',
      phone: initialValues?.phone || '',
      location: initialValues?.location || '',
      profile_picture_url: initialValues?.profile_picture_url || '',
      password: '',
      role_id: initialValues?.role_id || null,
    },
    validate: {
      email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email address'),
      first_name: (value) => (value.trim() ? null : 'First name is required'),
      last_name: (value) => (value.trim() ? null : 'Last name is required'),
      phone: (value) => (value.trim() ? null : 'Phone is required'),
      location: (value) => (value.trim() ? null : 'Location is required'),
      password: (value) => (value && value.length < 6 ? 'Password must be at least 6 characters' : null),
      role_id: (value) => (value ? null : 'Role is required'),
    },
  });

  const handleSubmit = (values: UserFormData) => {
    const payload: any = {
      ...values,
      role_id: values.role_id ? Number(values.role_id) : undefined,
    };

    // Remove empty profile_picture_url
    if (!payload.profile_picture_url) {
      delete payload.profile_picture_url;
    }

    onSubmit(payload);
  };

  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
      <Stack gap="md">
        <TextInput label="Email" placeholder="user@example.com" {...form.getInputProps('email')} />

        <TextInput label="First Name" placeholder="John" {...form.getInputProps('first_name')} />

        <TextInput label="Last Name" placeholder="Doe" {...form.getInputProps('last_name')} />

        <TextInput label="Phone" placeholder="+1 (555) 000-0000" {...form.getInputProps('phone')} />

        <TextInput label="Location" placeholder="New York, NY" {...form.getInputProps('location')} />

        <FileInput
          label="Profile Picture"
          placeholder="Upload image"
          accept="image/png,image/jpeg"
          {...form.getInputProps('profile_picture_url')}
        />

        <PasswordInput label="Password" placeholder="Your password" {...form.getInputProps('password')} />

        <RolePicker
          value={form.values.role_id}
          onChange={(val) => form.setFieldValue('role_id', val)}
          required
        />

        <Group justify="flex-end">
          <Button type="submit" loading={isLoading}>
            Submit
          </Button>
        </Group>
      </Stack>
    </form>
  );
}
