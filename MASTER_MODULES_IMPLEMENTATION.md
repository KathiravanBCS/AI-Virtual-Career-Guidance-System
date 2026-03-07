# Master Modules Implementation Guide

## Overview
Complete implementation of three master data modules for role-based access control (RBAC) with full CRUD functionality using React Query hooks and Mantine UI components.

---

## Modules

### 1. Master Roles Module
**Path:** `src/features/master/masterRoles/`

#### Features
- View all roles with pagination and sorting
- Create new roles (system or custom)
- Edit existing roles
- Delete roles with confirmation
- Filter by status (Active/Inactive)
- Drawer-based form interface

#### File Structure
```
masterRoles/
├── api/
│   ├── index.ts (exports all hooks)
│   ├── useGetAllRoles.ts
│   ├── useGetRoleById.ts
│   ├── useCreateRole.ts
│   ├── useUpdateRole.ts
│   └── useDeleteRole.ts
├── components/
│   └── rolesList.tsx (reusable list component)
├── pages/
│   ├── index.ts
│   └── RolesListPage.tsx (page wrapper)
├── types.ts (TypeScript interfaces)
└── index.ts (main exports)
```

### 2. Master Permissions Module
**Path:** `src/features/master/masterPermissions/`

#### Features
- View all permissions with pagination and sorting
- Create new permissions with action and description
- Edit existing permissions
- Delete permissions with confirmation
- Filter by status (Active/Inactive)
- Drawer-based form interface

#### File Structure
```
masterPermissions/
├── api/
│   ├── index.ts (exports all hooks)
│   ├── useGetAllPermissions.ts
│   ├── useGetPermissionById.ts
│   ├── useCreatePermission.ts
│   ├── useUpdatePermission.ts
│   └── useDeletePermission.ts
├── components/
│   └── permissionsList.tsx (reusable list component)
├── pages/
│   ├── index.ts
│   └── PermissionsListPage.tsx (page wrapper)
├── types.ts (TypeScript interfaces)
└── index.ts (main exports)
```

### 3. Role Permissions Module
**Path:** `src/features/master/rolePermissions/`

#### Features
- View all role-permission mappings
- Assign new permissions to roles
- Edit existing assignments
- Remove role-permission mappings
- Filter by status (Active/Inactive)
- Drawer-based form interface

#### File Structure
```
rolePermissions/
├── api/
│   ├── index.ts (exports all hooks)
│   ├── useGetAllRolePermissions.ts
│   ├── useGetRolePermissionById.ts
│   ├── useCreateRolePermission.ts
│   ├── useUpdateRolePermission.ts
│   └── useDeleteRolePermission.ts
├── components/
│   └── rolePermissionsList.tsx (reusable list component)
├── pages/
│   ├── index.ts
│   └── RolePermissionsListPage.tsx (page wrapper)
├── types.ts (TypeScript interfaces)
└── index.ts (main exports)
```

---

## API Integration

### Endpoints
All endpoints follow RESTful conventions:

```typescript
// Roles
GET    /api/v1/roles/              - Get all roles
POST   /api/v1/roles/              - Create role
GET    /api/v1/roles/{roleId}      - Get role by ID
PUT    /api/v1/roles/{roleId}      - Update role
DELETE /api/v1/roles/{roleId}      - Delete role

// Permissions
GET    /api/v1/permissions/              - Get all permissions
POST   /api/v1/permissions/              - Create permission
GET    /api/v1/permissions/{permissionId}    - Get permission by ID
PUT    /api/v1/permissions/{permissionId}    - Update permission
DELETE /api/v1/permissions/{permissionId}    - Delete permission

// Role Permissions
GET    /api/v1/role-permissions/              - Get all mappings
POST   /api/v1/role-permissions/              - Create mapping
GET    /api/v1/role-permissions/{rolePermissionId}  - Get mapping by ID
PUT    /api/v1/role-permissions/{rolePermissionId}  - Update mapping
DELETE /api/v1/role-permissions/{rolePermissionId}  - Delete mapping
```

### Service Layer
**Location:** `src/lib/api.ts`

Three new service objects added to the API:
- `api.roles`
- `api.permissions`
- `api.rolePermissions`

Each provides methods:
```typescript
api.roles.getAll()
api.roles.getById(id)
api.roles.create(data)
api.roles.update(id, data)
api.roles.delete(id)
```

---

## React Query Hooks

### Roles Hooks
```typescript
import { useGetAllRoles, useGetRoleById, useCreateRole, useUpdateRole, useDeleteRole } from '@/features/master/masterRoles/api';

// Fetch all roles
const { data: roles, isLoading, error } = useGetAllRoles();

// Fetch single role
const { data: role, isLoading } = useGetRoleById(roleId);

// Create role
const createRole = useCreateRole();
createRole.mutate({ role_name: 'Admin', description: '...', is_active: true });

// Update role
const updateRole = useUpdateRole();
updateRole.mutate({ roleId: 1, data: { role_name: 'Super Admin' } });

// Delete role
const deleteRole = useDeleteRole();
deleteRole.mutate(1);
```

### Permissions Hooks
```typescript
import {
  useGetAllPermissions,
  useGetPermissionById,
  useCreatePermission,
  useUpdatePermission,
  useDeletePermission,
} from '@/features/master/masterPermissions/api';

// Fetch all permissions
const { data: permissions, isLoading, error } = useGetAllPermissions();

// Fetch single permission
const { data: permission, isLoading } = useGetPermissionById(permissionId);

// Create permission
const createPermission = useCreatePermission();
createPermission.mutate({ action: 'read', description: '...', is_active: true });

// Update permission
const updatePermission = useUpdatePermission();
updatePermission.mutate({ permissionId: 1, data: { action: 'write' } });

// Delete permission
const deletePermission = useDeletePermission();
deletePermission.mutate(1);
```

### Role Permissions Hooks
```typescript
import {
  useGetAllRolePermissions,
  useGetRolePermissionById,
  useCreateRolePermission,
  useUpdateRolePermission,
  useDeleteRolePermission,
} from '@/features/master/rolePermissions/api';

// Fetch all role permissions
const { data: rolePermissions, isLoading, error } = useGetAllRolePermissions();

// Fetch single role permission
const { data: rolePermission, isLoading } = useGetRolePermissionById(rolePermissionId);

// Create role permission
const createRolePermission = useCreateRolePermission();
createRolePermission.mutate({ role_id: 1, permission_id: 1, is_active: true });

// Update role permission
const updateRolePermission = useUpdateRolePermission();
updateRolePermission.mutate({ rolePermissionId: 1, data: { is_active: false } });

// Delete role permission
const deleteRolePermission = useDeleteRolePermission();
deleteRolePermission.mutate(1);
```

---

## Component Usage

### Using List Components

#### RolesList Component
```typescript
import RolesList from '@/features/master/masterRoles/components/rolesList';

export function MyPage() {
  return <RolesList />;
}
```

#### PermissionsList Component
```typescript
import PermissionsList from '@/features/master/masterPermissions/components/permissionsList';

export function MyPage() {
  return <PermissionsList />;
}
```

#### RolePermissionsList Component
```typescript
import RolePermissionsList from '@/features/master/rolePermissions/components/rolePermissionsList';

export function MyPage() {
  return <RolePermissionsList />;
}
```

---

## Component Features

All list components share common features:

### Pagination
- Page size selection (5, 10, 25, 50 records)
- Previous/Next navigation
- Jump to page
- Total records display

### Sorting
- Click column headers to sort
- Ascending/Descending indicators
- Multi-column sorting support

### Filtering
- Status filters (Active/Inactive)
- Search/filter by name or description

### Column Customization
- Resizable columns
- Show/hide columns
- Column order customization
- Persistent column preferences (localStorage)

### Actions
- Click rows to view details
- Edit button in drawer
- Delete with confirmation
- Create new entries

### Drawer Interface
- Side panel for view/edit
- Form validation
- Submit/Cancel buttons
- Loading states
- Auto-close on success

---

## TypeScript Types

### Role Types
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

interface CreateRoleRequest {
  role_name: string;
  description: string;
  is_system_role?: boolean;
  is_active?: boolean;
}

interface UpdateRoleRequest {
  role_name?: string;
  description?: string;
  is_system_role?: boolean;
  is_active?: boolean;
}
```

### Permission Types
```typescript
interface Permission {
  id: number;
  action: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

interface CreatePermissionRequest {
  action: string;
  description: string;
  is_active?: boolean;
}

interface UpdatePermissionRequest {
  action?: string;
  description?: string;
  is_active?: boolean;
}
```

### RolePermission Types
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

interface CreateRolePermissionRequest {
  role_id: number;
  permission_id: number;
  is_active?: boolean;
}

interface UpdateRolePermissionRequest {
  role_id?: number;
  permission_id?: number;
  is_active?: boolean;
}
```

---

## Routes

Routes added to `src/Router.tsx`:

```typescript
/master/roles              // Master Roles
/master/permissions        // Master Permissions
/master/role-permissions   // Role Permissions
```

---

## Navigation

Updated in `src/components/Navigation/NavData.ts`:

```
Master Data
  ├─ Skills
  ├─ Roles (new)
  ├─ Permissions (new)
  └─ Role Permissions (new)
```

---

## Usage Examples

### Creating a Role
```typescript
import { useCreateRole } from '@/features/master/masterRoles/api';

function CreateRoleModal() {
  const createRole = useCreateRole();
  
  const handleSubmit = (data: CreateRoleRequest) => {
    createRole.mutate(data, {
      onSuccess: () => {
        console.log('Role created successfully');
        // Close modal, show toast, etc.
      },
      onError: (error) => {
        console.error('Failed to create role:', error);
      },
    });
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({...});
    }}>
      {/* Form fields */}
      <button type="submit" disabled={createRole.isPending}>
        {createRole.isPending ? 'Creating...' : 'Create'}
      </button>
    </form>
  );
}
```

### Updating a Permission
```typescript
import { useUpdatePermission, useGetPermissionById } from '@/features/master/masterPermissions/api';

function EditPermissionModal({ permissionId }: { permissionId: number }) {
  const { data: permission } = useGetPermissionById(permissionId);
  const updatePermission = useUpdatePermission();
  
  const handleSubmit = (data: UpdatePermissionRequest) => {
    updatePermission.mutate({ permissionId, data }, {
      onSuccess: () => {
        console.log('Permission updated');
      },
    });
  };
  
  return (
    <form onSubmit={(e) => {
      e.preventDefault();
      handleSubmit({...});
    }}>
      {/* Form fields */}
    </form>
  );
}
```

### Deleting a Role Permission
```typescript
import { useDeleteRolePermission } from '@/features/master/rolePermissions/api';

function DeleteRolePermissionButton({ rolePermissionId }: { rolePermissionId: number }) {
  const deleteRolePermission = useDeleteRolePermission();
  
  const handleDelete = () => {
    if (confirm('Delete this assignment?')) {
      deleteRolePermission.mutate(rolePermissionId, {
        onSuccess: () => {
          console.log('Assignment deleted');
        },
      });
    }
  };
  
  return (
    <button onClick={handleDelete} disabled={deleteRolePermission.isPending}>
      {deleteRolePermission.isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}
```

---

## Caching & Data Invalidation

React Query automatically handles caching with:
- **5-minute stale time** for GET requests
- **Automatic cache invalidation** on mutations
- **Optimistic updates** ready to implement

Query keys used:
```typescript
['roles']                           // All roles
['role', roleId]                   // Single role
['permissions']                    // All permissions
['permission', permissionId]       // Single permission
['rolePermissions']                // All role permissions
['rolePermission', rolePermissionId] // Single role permission
```

---

## Testing

Mock data is automatically provided when `enableMockData: true` in config.

### Mocking API Calls
```typescript
// In src/lib/api.ts, mock implementations return Promise.resolve({} as Type)
// Update with mock data as needed:

const roles: Role[] = [
  {
    id: 1,
    role_name: 'Admin',
    description: 'Administrator',
    is_system_role: true,
    is_active: true,
  },
];
```

---

## Future Enhancements

1. **Bulk Operations**
   - Select multiple rows
   - Bulk delete
   - Bulk status updates

2. **Advanced Filtering**
   - Filter by created date
   - Filter by updated date
   - Complex query builder

3. **Audit Logging**
   - Track who modified what
   - Timestamp history
   - Revert changes

4. **Role Hierarchy**
   - Parent-child role relationships
   - Permission inheritance
   - Default role templates

5. **Performance**
   - Virtual scrolling for large datasets
   - Server-side pagination
   - Export to CSV/Excel

6. **Permissions**
   - Role-based access control for these modules
   - Hide from non-admin users
   - Custom permission checks

---

## Dependencies

- **React Query** - Data fetching and caching
- **Mantine UI** - Component library
- **React Router** - Routing
- **TypeScript** - Type safety

---

## Summary

All three master modules are fully implemented with:
- ✅ API integration
- ✅ React Query hooks
- ✅ Type-safe interfaces
- ✅ Reusable components
- ✅ CRUD operations
- ✅ Pagination & sorting
- ✅ Column customization
- ✅ Error handling
- ✅ Loading states
- ✅ Router integration
- ✅ Navigation menu items

The implementation follows the same pattern as the existing `masterSkills` module for consistency and maintainability.
