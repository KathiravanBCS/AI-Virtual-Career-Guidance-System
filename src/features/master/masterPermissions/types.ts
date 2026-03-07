// Master Permissions Types

export interface Permission {
  id: number;
  action: string;
  description: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePermissionRequest {
  action: string;
  description: string;
  is_active?: boolean;
}

export interface UpdatePermissionRequest {
  action?: string;
  description?: string;
  is_active?: boolean;
}

export type GetAllPermissionsResponse = Permission[];

export interface GetPermissionByIdResponse {
  data: Permission;
}
