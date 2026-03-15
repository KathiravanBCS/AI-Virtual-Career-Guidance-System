# Permission API Integration Fix

## Issues Found & Fixed

### 1. **Permission API Not Being Called** ✅ FIXED
**Problem:** The backend permission endpoint (`/api/v1/users/permissions/current`) was never being called on app initialization. This meant CASL permissions were never loaded, so the permission-based navigation filtering wasn't working.

**Solution:** Added `loadPermissionsFromBackend()` call to `AuthProvider.tsx` when user authenticates.

**File Modified:**
- `src/lib/auth/AuthProvider.tsx` (lines 10, 74-78)

**Changes:**
```typescript
// Added import
import { loadPermissionsFromBackend } from '@/lib/casl/useCASLIntegration';

// Added to auth flow (after user is set)
try {
  await loadPermissionsFromBackend();
} catch (permissionError) {
  console.error('[AuthProvider] Failed to load permissions:', permissionError);
}
```

### 2. **Multiple User Requests** 
**Finding:** Multiple `/users/` API calls in the Network tab are expected and normal:
- `useGetUsers` hook is only used in `userList.tsx` (the Users management page)
- React Query automatically retries failed requests (default: 1 retry)
- Browser may show cached requests with query parameters

**Recommendation:** If you want to reduce these calls:
1. Ensure the backend `/api/v1/users/` endpoint is optimized
2. Consider pagination/filtering on the backend
3. Use `staleTime` to prevent refetches

## How Permissions Now Work

### Flow:
1. **User logs in** → Firebase auth triggers
2. **User role loaded** → Fetched from Firestore
3. **Permissions loaded** → Backend API call to `/api/v1/users/permissions/current`
4. **CASL ability updated** → Rules applied to authorization checks
5. **Navigation filtered** → NavData.ts filters items based on `canAccess()` checks

### Permission Check in Navigation:
```typescript
// In Navigation component
import { usePermission } from '@/lib/casl/usePermission';

const { canAccess } = usePermission();
const filteredNav = filterNavByPermissions(navData, canAccess);
```

### Permission Check in Components:
```typescript
import { usePermission } from '@/lib/casl/usePermission';

const { can } = usePermission();

if (can(Action.READ, Subject.USER)) {
  // Show component
}
```

## API Endpoints

### Current User Permissions
- **Endpoint:** `GET /api/v1/users/permissions/current`
- **Response:** `PermissionsResponse`
- **Called on:** User authentication
- **Cache:** Reloaded when user logs in or via `useCASLIntegration().reloadPermissions()`

### User Management (List)
- **Endpoint:** `GET /api/v1/users/`
- **Used by:** `userList.tsx` component
- **Query:** `useGetUsers()` hook

## Testing the Fix

1. **Check if permissions loaded:**
   - Open DevTools Console
   - Look for `[CASL] Permissions loaded:` message
   - Should show user_id, role, and rules_count

2. **Check if navigation is filtered:**
   - Different roles should see different menu items
   - Admin should see: Users, Master Data, Permissions, Role Permissions
   - Regular user should see: Dashboard, Guidance, Resume Builder, AI Chat, etc.

3. **Verify permission checks work:**
   - Navigate to protected routes without permission → should be denied
   - Check that components respect `can(action, subject)` checks

## Related Files

- `src/lib/casl/usePermission.ts` - Hook for checking permissions
- `src/lib/casl/ability.ts` - CASL ability configuration
- `src/lib/casl/useCASLIntegration.ts` - Permission loading logic
- `src/components/Navigation/NavData.ts` - Navigation structure with permissions
- `src/lib/api-endpoints.ts` - API endpoint definitions
- `src/lib/api.ts` - API client configuration
