// Role Permissions Types

import type { Role } from '../masterRoles/types';
import type { Permission } from '../masterPermissions/types';

export interface RolePermission {
  id: number;
  is_granted: boolean;
  created_at: string;
  created_by: number;
  updated_at: string;
  updated_by: number | null;
  role: Role;
  permission: Permission;
}

export interface CreateRolePermissionRequest {
  role_id: number;
  permission_id: number;
  is_granted?: boolean;
}

export interface UpdateRolePermissionRequest {
  role_id?: number;
  permission_id?: number;
  is_granted?: boolean;
}

export type GetAllRolePermissionsResponse = RolePermission[];

export type GetRolePermissionByIdResponse = RolePermission;
