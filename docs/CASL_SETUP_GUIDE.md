# CASL Permission System - Complete Setup Guide

## Overview

Your backend now has a role-based permission system using CASL (Client-Side Authorization Library) format. This guide walks you through the complete setup.

## What Has Been Implemented

### Backend Components
✅ CASL Rules Generator (`app/core/casl_rules.py`)
✅ Permission Schemas (`app/schemas/permission.py`)
✅ Permission Endpoint (`GET /api/v1/users/permissions/current`)
✅ 5 Role Configurations (superadmin, admin, manager, career_counselor, user)
✅ Financial Route Restrictions

### Role Definitions

1. **Superadmin** - Unrestricted access to everything
2. **Admin** - All access except Financial/Payroll/Invoice
3. **Manager** - Like admin but read-only on Users/Roles
4. **Career Counselor** - Can manage assessments, recommendations; cannot manage users/roles
5. **User** - Limited access, own data only

---

## Installation & Setup

### Step 1: Backend Setup (Already Done)

Files created:
- `/app/core/casl_rules.py` - Permission rules
- `/app/schemas/permission.py` - Response schemas
- `/app/routers/users.py` - Updated with new endpoint

### Step 2: Test Backend Endpoint

```bash
# Start your backend
python -m uvicorn app.main:app --reload

# In another terminal, login first
curl -X POST http://localhost:8000/api/v1/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password"}'

# Copy the access_token from response
# Then get permissions
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/v1/users/permissions/current
```

Expected response:
```json
{
  "user_id": 1,
  "role": "admin",
  "rules": [
    {
      "action": ["create", "read", "update", "delete", "export"],
      "subject": "Assessment"
    },
    {
      "action": ["create", "read", "update", "delete"],
      "subject": "Financial",
      "inverted": true
    }
  ]
}
```

### Step 3: Frontend Setup

#### 3.1 Install CASL
```bash
cd frontend
npm install @casl/core @casl/ability

# If using Vue:
npm install @casl/vue

# If using Svelte:
npm install @casl/svelte

# If using React:
npm install @casl/react
```

#### 3.2 Create Ability Instance

Create `src/lib/casl/ability.ts`:
```typescript
import { createMongoAbility } from '@casl/ability';

export type AppAbility = ReturnType<typeof createAppAbility>;

export const createAppAbility = (rules = []) => {
  return createMongoAbility(rules);
};

export const ability = createAppAbility();
```

#### 3.3 Create CASL Context (Vue Example)

Create `src/lib/casl/AbilityContext.ts`:
```typescript
import { provide, inject } from 'vue';
import { ability } from './ability';
import type { AppAbility } from './ability';

const AbilitySymbol = Symbol('ability');

export function provideAbility(caslAbility: AppAbility) {
  provide(AbilitySymbol, caslAbility);
}

export function useAbility(): AppAbility {
  return inject<AppAbility>(AbilitySymbol) || ability;
}

// Helper to update rules from backend
export async function loadPermissionsFromBackend(token: string) {
  try {
    const response = await fetch('/api/v1/users/permissions/current', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch permissions');
    }

    const { rules } = await response.json();
    ability.update(rules);
    return rules;
  } catch (error) {
    console.error('Error loading permissions:', error);
    // Use default rules on error
    return [];
  }
}
```

#### 3.4 Setup in App.vue (Vue Example)

```vue
<script setup lang="ts">
import { onMounted } from 'vue';
import { provideAbility, loadPermissionsFromBackend } from '@/lib/casl/AbilityContext';

onMounted(async () => {
  // Get token from localStorage or wherever you store it
  const token = localStorage.getItem('access_token');
  
  if (token) {
    await loadPermissionsFromBackend(token);
  }
  
  // Provide ability to all child components
  provideAbility(ability);
});
</script>

<template>
  <div id="app">
    <!-- Your app content -->
  </div>
</template>
```

#### 3.5 Create usePermission Composable

Create `src/lib/casl/usePermission.ts`:
```typescript
import { useAbility } from './AbilityContext';

export function usePermission() {
  const ability = useAbility();
  
  return {
    // Raw ability
    ability,
    
    // Helper functions
    can: (action: string, subject: string) => ability.can(action, subject),
    cannot: (action: string, subject: string) => !ability.can(action, subject),
    
    // Common checks
    canCreate: (subject: string) => ability.can('create', subject),
    canRead: (subject: string) => ability.can('read', subject),
    canUpdate: (subject: string) => ability.can('update', subject),
    canDelete: (subject: string) => ability.can('delete', subject),
    canExport: (subject: string) => ability.can('export', subject),
    
    // Special checks
    canViewFinancial: () => ability.can('read', 'Financial'),
    canManageUsers: () => ability.can('create', 'User'),
    canManageRoles: () => ability.can('manage', 'Role'),
  };
}
```

---

## Usage in Components

### Hide/Show Menu Items (Sidebar)

```vue
<script setup lang="ts">
import { usePermission } from '@/lib/casl/usePermission';

const { can } = usePermission();

const menuItems = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Assessment', path: '/assessment', permission: { action: 'read', subject: 'Assessment' } },
  { label: 'Career Paths', path: '/careers', permission: { action: 'read', subject: 'Career' } },
  { label: 'Recommendations', path: '/recommendations', permission: { action: 'read', subject: 'Recommendation' } },
  { label: 'Learning Paths', path: '/learning', permission: { action: 'read', subject: 'LearningPath' } },
  { label: 'Users', path: '/users', permission: { action: 'read', subject: 'User' } },
  { label: 'Roles', path: '/roles', permission: { action: 'read', subject: 'Role' } },
  { label: 'Analytics', path: '/analytics', permission: { action: 'read', subject: 'Analytics' } },
  { label: 'Financial', path: '/financial', permission: { action: 'read', subject: 'Financial' } },
];
</script>

<template>
  <nav class="sidebar">
    <ul>
      <li v-for="item in menuItems" :key="item.path">
        <!-- Show item if no permission required OR if user can perform the action -->
        <a 
          v-if="!item.permission || can(item.permission.action, item.permission.subject)"
          :href="item.path"
        >
          {{ item.label }}
        </a>
      </li>
    </ul>
  </nav>
</template>
```

### Conditional Button Display

```vue
<template>
  <div class="actions">
    <!-- Create button only for admin/manager -->
    <button v-if="canCreate('Assessment')" @click="createAssessment">
      Create Assessment
    </button>

    <!-- Edit button -->
    <button v-if="canUpdate('Assessment')" @click="editAssessment">
      Edit
    </button>

    <!-- Delete button only for superadmin/admin -->
    <button v-if="canDelete('Assessment')" @click="deleteAssessment">
      Delete
    </button>

    <!-- Financial page (hidden for admin/manager) -->
    <div v-if="canViewFinancial" class="financial-section">
      <!-- Financial content -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { usePermission } from '@/lib/casl/usePermission';

const { canCreate, canUpdate, canDelete, canViewFinancial } = usePermission();
</script>
```

### Field-Level Visibility

```vue
<script setup lang="ts">
import { usePermission } from '@/lib/casl/usePermission';

const { ability } = usePermission();
const user = ref({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  salary: 50000
});
</script>

<template>
  <form>
    <div>
      <label>Name</label>
      <input v-model="user.name" />
    </div>

    <div>
      <label>Email</label>
      <input v-model="user.email" />
    </div>

    <!-- Salary field only visible to superadmin -->
    <div v-if="ability.can('read', 'Financial')">
      <label>Salary</label>
      <input v-model="user.salary" />
    </div>
  </form>
</template>
```

### Route Protection

```typescript
// src/router/index.ts
import { useAbility } from '@/lib/casl/AbilityContext';

router.beforeEach((to, from, next) => {
  const ability = useAbility();
  
  // Check if route requires specific permission
  if (to.meta.permission) {
    const { action, subject } = to.meta.permission;
    if (!ability.can(action, subject)) {
      // Redirect to dashboard if no permission
      next('/dashboard');
      return;
    }
  }
  
  next();
});

// Define routes with permissions
const routes = [
  {
    path: '/assessment',
    component: Assessment,
    meta: { permission: { action: 'read', subject: 'Assessment' } }
  },
  {
    path: '/financial',
    component: Financial,
    meta: { permission: { action: 'read', subject: 'Financial' } }
  },
  {
    path: '/users',
    component: Users,
    meta: { permission: { action: 'read', subject: 'User' } }
  }
];
```

---

## Testing Each Role

### Test 1: Superadmin (Full Access)
```bash
# Login with superadmin
# Expected: Can see all menus, including Financial
# Can create/delete/update everything
```

### Test 2: Admin (No Financial)
```bash
# Login with admin
# Expected: Cannot see Financial menu
# Financial button should be disabled/hidden
# All other CRUD operations work
```

### Test 3: Manager (Read-Only Users/Roles)
```bash
# Login with manager
# Expected: Cannot delete users
# Cannot manage roles (create/delete)
# Can see User menu but no create/delete buttons
```

### Test 4: Career Counselor (Limited Access)
```bash
# Login with career_counselor
# Expected: Can manage assessments
# Cannot see user management
# Cannot see Financial
# Can only update own profile
```

### Test 5: User (Very Limited)
```bash
# Login with regular user
# Expected: Can only see own dashboard
# Can take assessments but not manage them
# Can only view own profile
# Cannot see Financial, Payroll, User Management
```

---

## Customizing Rules

To add or modify rules for a role, edit `app/core/casl_rules.py`:

```python
def get_casl_rules_for_role(role_name: str, user_id: int = None):
    if role_name == "your_role":
        return [
            # Allow actions
            {
                "action": ["read", "create"],
                "subject": "YourEntity"
            },
            
            # Deny actions (inverted=true)
            {
                "action": ["delete"],
                "subject": "YourEntity",
                "inverted": True
            },
            
            # Conditional access (own records)
            {
                "action": ["update"],
                "subject": "YourEntity",
                "conditions": { "userId": user_id }
            }
        ]
```

Then restart the backend and permissions will automatically use the new rules.

---

## Common Integration Patterns

### Pattern 1: Simple Permission Check
```typescript
if (can('read', 'Assessment')) {
  showAssessmentMenu();
}
```

### Pattern 2: Conditional Button Display
```typescript
<button :disabled="!canUpdate('Assessment')">
  Update
</button>
```

### Pattern 3: Own Records Only
```typescript
const canViewUser = ability.can('read', 'User', { id: userId });
```

### Pattern 4: Multiple Permissions
```typescript
const hasFullAccess = 
  can('create', 'Assessment') && 
  can('delete', 'Assessment');
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Rules not loading | Verify token is valid, check network tab for API response |
| Menus still visible | Verify `ability.update(rules)` was called after fetching |
| Wrong permissions | Check user's role in database, verify rules in `casl_rules.py` |
| Financial still visible | Verify rule has `inverted: true` for Financial subject |
| Conditions not working | Ensure condition keys match rule structure (e.g., `id`, `userId`) |

---

## Architecture Diagram

```
Frontend App
    ↓
User Login
    ↓
Backend Auth (creates JWT)
    ↓
Frontend stores token
    ↓
Frontend calls /api/v1/users/permissions/current
    ↓
Backend checks role
    ↓
Backend generates CASL rules
    ↓
Frontend receives rules
    ↓
ability.update(rules)
    ↓
Components check ability.can()
    ↓
Hide/show/disable UI elements
```

---

## Files Reference

### Backend Files
- `app/core/casl_rules.py` - Rule generator
- `app/schemas/permission.py` - Response schemas
- `app/routers/users.py` - Permission endpoint

### Documentation Files
- `CASL_SETUP_GUIDE.md` - This file
- `CASL_QUICK_REFERENCE.md` - Quick reference
- `CASL_FRONTEND_INTEGRATION.md` - Frontend guide
- `CASL_ROLE_EXAMPLES.md` - Role examples

---

## Next Steps

1. ✅ Test backend endpoint
2. ✅ Install CASL in frontend
3. ✅ Create ability instance
4. ✅ Fetch permissions on login
5. ✅ Add permission checks to components
6. ✅ Hide Financial menus for non-superadmin
7. ✅ Test with each role
8. ✅ Add route guards
9. ✅ Deploy to production

---

## Support

Refer to:
- CASL Documentation: https://casl.js.org
- CASL Vue Integration: https://casl.js.org/v6/en/guide/install
- CASL Ability API: https://casl.js.org/v6/en/api/ability
