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
  username: string;
  university: string;
}

export interface UpdateProfileResponse {
  username: string;
  university: string;
}

export interface UserDetailResponse {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  university?: string;
  userStatus: UserStatus;
  mftEnable: boolean;
  createdAt: string;
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BANNED = "BANNED",
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
