# CASL Integration Guide - Frontend Implementation

## Overview

This guide shows how to integrate CASL permission system into your React/TypeScript application.

## Files Created

### 1. `/src/lib/casl/types.ts`
- CASL permission types
- `CASLRule` interface
- `PermissionsResponse` interface
- Role and Subject enums for type safety

### 2. `/src/lib/casl/ability.ts`
- Global ability instance creation
- Helper functions for permission checks
- `updateAbility()`, `resetAbility()`, `can()`, `cannot()` functions

### 3. `/src/lib/casl/usePermission.ts`
- `usePermission()` composable hook
- Helper methods for common permission checks
- Subject-specific helper methods (e.g., `canManageUsers()`, `canViewFinancial()`)

### 4. `/src/lib/casl/useCASLIntegration.ts`
- `useCASLIntegration()` hook
- `loadPermissionsFromBackend()` function
- Automatic ability updates after API call

### 5. Updated Files
- `/src/lib/api.ts` - Added `auth.getPermissions()` method
- `/src/lib/api-endpoints.ts` - Added `/api/v1/users/permissions/current` endpoint

## Integration Steps

### Step 1: Load Permissions on Login

In your login/auth flow, add permission loading:

```typescript
// src/features/auth/authStore.ts or your auth handler
import { useCASLIntegration } from '@/lib/casl/useCASLIntegration';

async function handleLogin(email: string, password: string) {
  const { mutate: login } = useLoginMutation();
  const { loadPermissions } = useCASLIntegration();

  // Perform login
  await login({ email, password }, {
    onSuccess: async (response) => {
      // Store token
      localStorage.setItem('token', response.access_token);

      // Load permissions
      await loadPermissions();

      // Navigate to dashboard
      navigate('/dashboard');
    },
  });
}
```

### Step 2: Restore Permissions on App Load

In your main App component:

```typescript
// src/App.tsx
import { useEffect } from 'react';
import { useCASLIntegration } from '@/lib/casl/useCASLIntegration';

function App() {
  const { loadPermissions } = useCASLIntegration();

  useEffect(() => {
    // Load permissions on app startup if token exists
    const token = localStorage.getItem('token');
    if (token) {
      loadPermissions();
    }
  }, [loadPermissions]);

  return (
    // Your app components
  );
}
```

### Step 3: Use Permissions in Components

#### In Menu/Sidebar:

```typescript
// src/components/Sidebar.tsx
import { usePermission } from '@/lib/casl/usePermission';

export function Sidebar() {
  const { can } = usePermission();

  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    {
      label: 'Assessment',
      path: '/assessment',
      show: can('read', 'Assessment'),
    },
    {
      label: 'Users',
      path: '/users',
      show: can('read', 'User'),
    },
    {
      label: 'Roles',
      path: '/roles',
      show: can('manage', 'Role'),
    },
    {
      label: 'Financial',
      path: '/financial',
      show: can('read', 'Financial'),
    },
  ];

  return (
    <nav>
      {menuItems
        .filter((item) => item.show !== false)
        .map((item) => (
          <a key={item.path} href={item.path}>
            {item.label}
          </a>
        ))}
    </nav>
  );
}
```

#### In Buttons/Actions:

```typescript
// src/components/UserActions.tsx
import { usePermission } from '@/lib/casl/usePermission';

export function UserActions({ userId }) {
  const { canUpdate, canDelete } = usePermission();

  return (
    <div>
      <button
        disabled={!canUpdate('User')}
        onClick={() => editUser(userId)}
      >
        Edit
      </button>
      <button
        disabled={!canDelete('User')}
        onClick={() => deleteUser(userId)}
      >
        Delete
      </button>
    </div>
  );
}
```

#### In Forms (Field-Level Control):

```typescript
// src/components/UserForm.tsx
import { usePermission } from '@/lib/casl/usePermission';

export function UserForm({ user }) {
  const { canViewFinancial } = usePermission();

  return (
    <form>
      <input name="name" value={user.name} />
      <input name="email" value={user.email} />

      {/* Only show salary field if user can view financial data */}
      {canViewFinancial() && (
        <input name="salary" value={user.salary} />
      )}
    </form>
  );
}
```

### Step 4: Protect Routes

```typescript
// src/routes/PrivateRoute.tsx or in your router setup
import { Navigate } from 'react-router-dom';
import { usePermission } from '@/lib/casl/usePermission';

interface ProtectedRouteProps {
  component: React.ComponentType;
  action: string;
  subject: string;
}

export function ProtectedRoute({
  component: Component,
  action,
  subject,
}: ProtectedRouteProps) {
  const { can } = usePermission();

  if (!can(action, subject)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Component />;
}

// Usage in router:
const routes = [
  {
    path: '/users',
    element: <ProtectedRoute component={Users} action="read" subject="User" />,
  },
  {
    path: '/financial',
    element: (
      <ProtectedRoute component={Financial} action="read" subject="Financial" />
    ),
  },
];
```

## Using Helper Methods

### Subject-Specific Helpers:

```typescript
const { canManageUsers, canViewFinancial, canViewAnalytics } = usePermission();

if (canManageUsers()) {
  showUserManagementMenu();
}

if (!canViewFinancial()) {
  hideFinancialRoutes();
}
```

### CRUD Operation Helpers:

```typescript
const { canCreate, canRead, canUpdate, canDelete } = usePermission();

if (canCreate('Assessment')) {
  showCreateButton();
}

if (!canDelete('Role')) {
  disableDeleteButton();
}
```

### Condition-Based Checks (Own Records):

```typescript
const { canUpdateRecord } = usePermission();

// Check if user can update a specific record
const user = { id: 1, name: 'John' };
if (canUpdateRecord('User', user)) {
  enableEditButton();
}
```

## Permission Reload

If a user's role changes (e.g., promoted from User to Manager):

```typescript
import { useCASLIntegration } from '@/lib/casl/useCASLIntegration';

const { reloadPermissions } = useCASLIntegration();

// After role change
await reloadPermissions();
```

## Debugging

### Check Current Rules:

```typescript
import { ability } from '@/lib/casl/ability';

console.log('Current CASL rules:', ability.rules);
```

### Check Specific Permission:

```typescript
import { can } from '@/lib/casl/ability';

console.log('Can read Assessment:', can('read', 'Assessment'));
console.log('Can manage Role:', can('manage', 'Role'));
```

### Log All Available Helpers:

```typescript
import { usePermission } from '@/lib/casl/usePermission';

const helpers = usePermission();
console.log('Available permission helpers:', Object.keys(helpers));
```

## Common Issues

| Issue | Solution |
|-------|----------|
| Permissions not loading | Check if `loadPermissions()` is called after login |
| Menu items still visible | Verify `can()` function is called correctly |
| Conditions not working | Ensure conditions match backend rule structure |
| Stale permissions after role change | Call `reloadPermissions()` after role update |
| TypeScript errors | Use Subject and Action enums for type safety |

## Best Practices

1. **Always call `loadPermissions()` after login**
   ```typescript
   await loadPermissions();
   ```

2. **Use enums for type safety**
   ```typescript
   import { Action, Subject } from '@/lib/casl/types';
   can(Action.READ, Subject.ASSESSMENT)
   ```

3. **Use helper methods instead of raw `can()`**
   ```typescript
   // ✅ Good
   canManageUsers();
   
   // ❌ Avoid
   can('create', 'User') && can('delete', 'User')
   ```

4. **Handle permission fetch errors gracefully**
   ```typescript
   const permissions = await loadPermissions();
   if (!permissions) {
     showErrorMessage('Failed to load permissions');
   }
   ```

5. **Reload permissions when user role changes**
   ```typescript
   await updateUserRole(userId, newRole);
   await reloadPermissions();
   ```

## Testing

### Mock Permissions in Tests:

```typescript
import { updateAbility } from '@/lib/casl/ability';
import { Action, Subject } from '@/lib/casl/types';

// Setup: Grant specific permissions
beforeEach(() => {
  updateAbility([
    {
      action: [Action.READ, Action.CREATE],
      subject: Subject.ASSESSMENT,
    },
  ]);
});

// Test: Check permission-based rendering
test('should show create button for manager', () => {
  render(<AssessmentPage />);
  expect(screen.getByText('Create Assessment')).toBeInTheDocument();
});
```

## Architecture

```
Frontend App
    ↓
User Logs In
    ↓
localStorage stores token
    ↓
loadPermissions() called
    ↓
API call to /api/v1/users/permissions/current
    ↓
Backend returns CASL rules
    ↓
ability.update(rules)
    ↓
Components use usePermission() hook
    ↓
UI renders based on permissions
```

## API Response Format

Your backend should return:

```json
{
  "user_id": 1,
  "role": "manager",
  "rules": [
    {
      "action": ["create", "read", "update", "delete"],
      "subject": "Assessment"
    },
    {
      "action": ["read"],
      "subject": "User"
    },
    {
      "action": ["read"],
      "subject": "Financial",
      "inverted": true
    }
  ]
}
```

## Next Steps

1. ✅ Add CASL files to project
2. ✅ Call `loadPermissions()` in login handler
3. ✅ Restore permissions on app startup
4. ✅ Add permission checks to components
5. ✅ Protect routes with permission guards
6. ✅ Test with different user roles
7. ✅ Handle permission reload on role change
8. ✅ Add loading states during permission fetch

## Support

- CASL Documentation: https://casl.js.org
- CASL Ability API: https://casl.js.org/v6/en/api/ability
- Backend CASL Setup Guide: `/CASL_SETUP_GUIDE.md`
