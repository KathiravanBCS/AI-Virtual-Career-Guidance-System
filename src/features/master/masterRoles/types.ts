// Master Roles Types

export interface Role {
  id: number;
  role_name: string;
  description: string;
  is_system_role: boolean;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface CreateRoleRequest {
  role_name: string;
  description: string;
  is_system_role?: boolean;
  is_active?: boolean;
}

export interface UpdateRoleRequest {
  role_name?: string;
  description?: string;
  is_system_role?: boolean;
  is_active?: boolean;
}

export type GetAllRolesResponse = Role[];

export interface GetRoleByIdResponse {
  data: Role;
}
