# Quick Start Guide - Master Modules

## Access the New Modules

Navigate to these routes in your application:

```
http://localhost:5173/#/master/roles
http://localhost:5173/#/master/permissions
http://localhost:5173/#/master/role-permissions
```

Or use the sidebar menu:
1. Click "Master Data"
2. Select "Roles", "Permissions", or "Role Permissions"

---

## Using the Hooks in Your Component

### Import Hooks
```typescript
import {
  useGetAllRoles,
  useGetRoleById,
  useCreateRole,
  useUpdateRole,
  useDeleteRole,
} from '@/features/master/masterRoles/api';
```

### Fetch All Roles
```typescript
function RolesList() {
  const { data: rolesResponse, isLoading, error } = useGetAllRoles();
  const roles = rolesResponse?.data || [];

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <ul>
      {roles.map((role) => (
        <li key={role.id}>{role.role_name}</li>
      ))}
    </ul>
  );
}
```

### Create a Role
```typescript
function CreateRoleForm() {
  const createRole = useCreateRole();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createRole.mutate({
      role_name: 'Editor',
      description: 'Can edit content',
      is_active: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={createRole.isPending}>
        {createRole.isPending ? 'Creating...' : 'Create Role'}
      </button>
    </form>
  );
}
```

### Update a Role
```typescript
function UpdateRoleForm({ roleId }: { roleId: number }) {
  const { data: role } = useGetRoleById(roleId);
  const updateRole = useUpdateRole();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateRole.mutate({
      roleId,
      data: { role_name: 'Updated Role' },
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <button type="submit" disabled={updateRole.isPending}>
        {updateRole.isPending ? 'Updating...' : 'Update'}
      </button>
    </form>
  );
}
```

### Delete a Role
```typescript
function DeleteRoleButton({ roleId }: { roleId: number }) {
  const deleteRole = useDeleteRole();

  const handleDelete = () => {
    if (confirm('Delete this role?')) {
      deleteRole.mutate(roleId);
    }
  };

  return (
    <button onClick={handleDelete} disabled={deleteRole.isPending}>
      {deleteRole.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

## Using the List Components

The ready-made components handle everything:

```typescript
import { RolesListPage } from '@/features/master/masterRoles';
import { PermissionsListPage } from '@/features/master/masterPermissions';
import { RolePermissionsListPage } from '@/features/master/rolePermissions';

export function AdminPanel() {
  return (
    <>
      <RolesListPage />
      <PermissionsListPage />
      <RolePermissionsListPage />
    </>
  );
}
```

---

## API Reference

### Roles
```typescript
const { data, isLoading, error } = useGetAllRoles();
const { data, isLoading, error } = useGetRoleById(1);
const { mutate, isPending, isError } = useCreateRole();
const { mutate, isPending, isError } = useUpdateRole();
const { mutate, isPending, isError } = useDeleteRole();
```

### Permissions
```typescript
const { data, isLoading, error } = useGetAllPermissions();
const { data, isLoading, error } = useGetPermissionById(1);
const { mutate, isPending, isError } = useCreatePermission();
const { mutate, isPending, isError } = useUpdatePermission();
const { mutate, isPending, isError } = useDeletePermission();
```

### Role Permissions
```typescript
const { data, isLoading, error } = useGetAllRolePermissions();
const { data, isLoading, error } = useGetRolePermissionById(1);
const { mutate, isPending, isError } = useCreateRolePermission();
const { mutate, isPending, isError } = useUpdateRolePermission();
const { mutate, isPending, isError } = useDeleteRolePermission();
```

---

## Data Structures

### Role
```typescript
interface Role {
  id: number;
  role_name: string;
  description: string;
  is_system_role: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
```

### Permission
```typescript
interface Permission {
  id: number;
  action: string;           // e.g., "read", "write", "delete"
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
```

### RolePermission
```typescript
interface RolePermission {
  id: number;
  role_id: number;
  permission_id: number;
  action?: string;
  description?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}
```

---

## Common Tasks

### Show All Roles
```typescript
import { RolesListPage } from '@/features/master/masterRoles';

<RolesListPage />
```

### Show All Permissions
```typescript
import { PermissionsListPage } from '@/features/master/masterPermissions';

<PermissionsListPage />
```

### Show All Role-Permission Assignments
```typescript
import { RolePermissionsListPage } from '@/features/master/rolePermissions';

<RolePermissionsListPage />
```

### Get Current User's Roles
```typescript
import { useGetAllRoles } from '@/features/master/masterRoles/api';

const { data: rolesResponse } = useGetAllRoles();
const userRoles = rolesResponse?.data || [];
```

### Check if User Has Permission
```typescript
function hasPermission(userPermissions: Permission[], requiredAction: string): boolean {
  return userPermissions.some((perm) => perm.action === requiredAction && perm.is_active);
}
```

---

## Form Validation Example

```typescript
import { useCreateRole } from '@/features/master/masterRoles/api';

function CreateRoleForm() {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const createRole = useCreateRole();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    // Validate
    const newErrors: Record<string, string> = {};
    if (!formData.get('role_name')) {
      newErrors.role_name = 'Role name is required';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit
    createRole.mutate({
      role_name: formData.get('role_name') as string,
      description: formData.get('description') as string,
      is_active: true,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="role_name" placeholder="Role name" />
      {errors.role_name && <span>{errors.role_name}</span>}
      
      <textarea name="description" placeholder="Description" />
      
      <button type="submit" disabled={createRole.isPending}>
        Create
      </button>
    </form>
  );
}
```

---

## Error Handling Example

```typescript
import { useGetAllRoles } from '@/features/master/masterRoles/api';

function RolesList() {
  const { data: rolesResponse, isLoading, error } = useGetAllRoles();

  if (isLoading) {
    return <div className="spinner">Loading roles...</div>;
  }

  if (error) {
    return (
      <div className="error-alert">
        <h3>Failed to load roles</h3>
        <p>{error.message}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  const roles = rolesResponse?.data || [];

  if (roles.length === 0) {
    return <div className="empty-state">No roles found</div>;
  }

  return (
    <ul>
      {roles.map((role) => (
        <li key={role.id}>{role.role_name}</li>
      ))}
    </ul>
  );
}
```

---

## Performance Tips

1. **Avoid refetching** - React Query caches data for 5 minutes
2. **Use specific hooks** - Don't fetch all when you need one
3. **Memoize components** - Use React.memo() for list items
4. **Lazy load** - Load modules only when needed
5. **Batch requests** - Combine multiple queries when possible

---

## Troubleshooting

### Hooks not found?
- Make sure imports point to correct module
- Check `api/index.ts` exports

### Data not updating?
- Check network tab for API errors
- Verify mock data is disabled if using real API
- Check React Query devtools for query status

### Styles not applying?
- Verify Mantine UI is installed
- Check className prop on components
- Clear cache and rebuild

### Type errors?
- Run `npm run type-check`
- Ensure TypeScript types are imported correctly
- Check `types.ts` files for interface definitions

---

## Next Steps

1. **Implement Backend** - Create API endpoints matching the schema
2. **Test Locally** - Try each CRUD operation
3. **Add Validation** - Implement form validation
4. **Add Notifications** - Toast messages on success/error
5. **Add Permissions** - Restrict access based on user roles
6. **Add Logging** - Track user actions
7. **Optimize Performance** - Add caching strategies
8. **Write Tests** - Unit and integration tests

---

## Support

For detailed information, see:
- `MASTER_MODULES_IMPLEMENTATION.md` - Complete guide
- `IMPLEMENTATION_SUMMARY.md` - Technical summary
- Component source files - JSDoc comments

---

**Happy coding!** 🚀
