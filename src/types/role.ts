export interface Role {
  id: string;
  name: string;
}

export interface RoleDetailResponse {
  id: string;
  name: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoleRequest {
  name: string;
  description?: string;
}

export interface UpdateRoleRequest {
  description?: string;
}
