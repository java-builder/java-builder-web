export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
}

export interface CreateUserResponse {
  username: string;
  email: string;
}

export interface UpdateProfileRequest {
  username?: string;
  university?: string;
  userStatus?: UserStatus;
}

export interface UpdateProfileResponse {
  username: string;
  university: string;
  userStatus?: UserStatus;
}

export interface UserDetailResponse {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  university?: string;
  userStatus: UserStatus;
  mftEnable: boolean;
  authorities?: string[];
  createdAt: string;
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  DELETED = "DELETED",
}

export enum PasswordStatus {
  SET = "SET",
  NOT_SET = "NOT_SET",
}

export interface PasswordStatusResponse {
  passwordStatus: PasswordStatus;
}

export interface CreatePasswordRequest {
  password: string;
}

export interface UserStatisticsResponse {
  totalUsers: number;
  activeUsers: number;
  inactiveUsers: number;
  deletedUsers: number;
}