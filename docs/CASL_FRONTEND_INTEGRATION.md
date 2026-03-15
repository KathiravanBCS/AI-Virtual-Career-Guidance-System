# CASL Permission System - Frontend Integration Guide

## Overview

The backend now provides a CASL-compatible permissions endpoint that returns role-based permission rules. The frontend can use these rules to control UI visibility, hide/show menu items, and enforce field-level access control.

## Backend Endpoint

### Endpoint Details
```
GET /api/v1/users/permissions/current
Authentication: Bearer token (required)
Returns: PermissionsResponse
```

### Response Format
```json
{
  "user_id": 1,
  "role": "manager",
  "rules": [
    {
      "action": ["create", "read", "update", "delete"],
      "subject": "Assessment",
      "conditions": null,
      "fields": null,
      "inverted": false
    },
    {
      "action": ["create", "read", "update", "delete"],
      "subject": "Financial",
      "conditions": null,
      "fields": null,
      "inverted": true
    }
  ]
}
```

## CASL Rule Structure

Each rule has:
- **action**: Single or array of actions (create, read, update, delete, export, manage, etc.)
- **subject**: Entity/resource type (User, Assessment, Dashboard, Financial, etc.)
- **conditions**: Optional conditions that restrict the rule (e.g., `{"id": user_id}` for own records)
- **fields**: Optional field-level restrictions (not implemented yet)
- **inverted**: When true, negates the rule (deny instead of allow)

## Role Permissions Summary

### Superadmin
- Action: `manage` on `all`
- Result: Unrestricted access to everything

### Admin
- Can access: Dashboard, Assessment, Career, Recommendation, LearningPath, User, Role, Analytics, Document, Skill, Certification
- Cannot access: Financial routes (inverted=true)
- Cannot access: Payroll routes (inverted=true)
- Cannot access: Invoice routes (inverted=true)

### Manager
- Can access: Dashboard, Assessment, Career, Recommendation, LearningPath
- Can read: User, Role, Analytics, Certification
- Can create/update: Document, Skill
- Cannot access: Financial, Payroll, Invoice (inverted=true)
- Restricted conditions: Can only see active users, can only read roles

### Career Counselor
- Can access: Assessment, Recommendation, LearningPath
- Can only read own profile: User (conditions: {id: user_id})
- Cannot manage users (inverted=true)
- Cannot manage roles (inverted=true)
- Cannot access: Financial, Payroll (inverted=true)

### User (Regular User)
- Very limited access
- Can read: Career, Document, Skill, Certification
- Can read own data: Dashboard, User, LearnPath, Recommendation, Analytics (with conditions)
- Cannot manage: User creation/deletion, Roles (inverted=true)
- Cannot access: Financial, Payroll (inverted=true)

## Frontend Implementation Steps

### 1. Create CASL Ability Instance (once, on app init)

```javascript
// src/lib/casl/ability.ts
import { createMongoAbility } from '@casl/ability';
import type { AppAbility } from '@casl/ability';

export type AppAbility = ReturnType<typeof createAppAbility>;

export const createAppAbility = (rules = []) => {
  return createMongoAbility(rules);
};

// Export ability instance
export const ability = createAppAbility();
```

### 2. Fetch Permissions on Login

```javascript
// src/lib/api/auth.ts
export async function getPermissions(token: string) {
  const response = await fetch('/api/v1/users/permissions/current', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch permissions');
  }
  
  return await response.json();
}
```

### 3. Update Ability After Login

```javascript
// In your login flow
const { access_token } = await loginUser(email, password);
const { rules } = await getPermissions(access_token);

// Update ability with rules from backend
ability.update(rules);

// Store token for future requests
localStorage.setItem('token', access_token);
```

### 4. Check Permissions in Components

```javascript
// src/lib/casl/usePermission.ts
import { useAbility } from '@casl/vue';

export function usePermission() {
  const { can } = useAbility();
  
  return {
    can,
    // Helper functions
    canCreate: (subject) => can('create', subject),
    canRead: (subject) => can('read', subject),
    canUpdate: (subject) => can('update', subject),
    canDelete: (subject) => can('delete', subject),
  };
}
```

### 5. Use in Components/Sidebar

```svelte
<!-- Sidebar.svelte -->
<script>
  import { usePermission } from '$lib/casl/usePermission';
  const { can } = usePermission();
</script>

<nav>
  {#each menuItems as item}
    {#if !item.permission || can(item.permission.action, item.permission.subject)}
      <a href={item.path}>{item.label}</a>
    {/if}
  {/each}
</nav>
```

### 6. Restrict Routes (if using route guards)

```javascript
// src/routes/+layout.ts or middleware
import { redirect } from '@sveltejs/kit';
import { ability } from '$lib/casl/ability';

export async function load({ url, locals }) {
  // Check if user has access to this route
  if (url.pathname.includes('/financial')) {
    if (!ability.can('read', 'Financial')) {
      throw redirect(303, '/dashboard');
    }
  }
}
```

## Testing the Integration

### 1. Test with Superadmin
- Should see all features
- No restrictions

### 2. Test with Admin
- Should see all features EXCEPT Financial/Payroll/Invoice
- These routes should be hidden or redirected

### 3. Test with Manager
- Should see Dashboard, Assessment, Career, Recommendation, LearningPath
- Can read User, Role, Analytics
- Cannot see Financial routes
- Cannot create/delete users

### 4. Test with Career Counselor
- Should see Assessment, Career, Recommendation, LearningPath
- Can only view own profile
- Cannot access user management routes
- Cannot see Financial routes

### 5. Test with User
- Should only see Assessment, Career, Document, Skill
- Can only view own data
- Cannot create/delete anything
- Cannot see Financial routes

## Common CASL Patterns

### Check if user can perform action on specific record
```javascript
const can = ability.can('read', subject, record);
```

### Check with conditions (own records)
```javascript
// User can only read their own tasks
if (ability.can('read', 'Task', { userId: currentUserId })) {
  // Show task
}
```

### Check inverted rules (denials)
```javascript
// Financial routes are inverted (deny)
if (ability.can('read', 'Financial')) {
  // This will be FALSE for non-superadmin users
  // Don't show financial menu
}
```

## Troubleshooting

### Rules not loading
- Ensure `/api/v1/users/permissions/current` endpoint is called after login
- Check token is valid and user has role assigned
- Check browser console for API errors

### Menu items still showing
- Verify CASL rules were updated: `ability.update(rules)`
- Check condition logic in permission filter
- Test with different roles to confirm

### Conditions not working
- Ensure conditions match rule structure from backend
- Test with simpler conditions first
- Check CASL documentation for condition syntax

## Example Frontend Sidebar Implementation

```javascript
// Navigation items with permissions
const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Assessment', path: '/assessment', permission: { action: 'read', subject: 'Assessment' } },
  { label: 'Career Paths', path: '/careers', permission: { action: 'read', subject: 'Career' } },
  { label: 'Recommendations', path: '/recommendations', permission: { action: 'read', subject: 'Recommendation' } },
  { label: 'Learning Paths', path: '/learning', permission: { action: 'read', subject: 'LearningPath' } },
  { label: 'Users', path: '/users', permission: { action: 'read', subject: 'User' } },
  { label: 'Roles', path: '/roles', permission: { action: 'read', subject: 'Role' } },
  { label: 'Analytics', path: '/analytics', permission: { action: 'read', subject: 'Analytics' } },
  { label: 'Documents', path: '/documents', permission: { action: 'read', subject: 'Document' } },
  { label: 'Financial', path: '/financial', permission: { action: 'read', subject: 'Financial' } }, // Hidden for admin/manager
];

// Filter visible items
const visibleMenuItems = menuItems.filter(item => {
  if (!item.permission) return true; // Always show items without permissions
  return can(item.permission.action, item.permission.subject);
});
```
