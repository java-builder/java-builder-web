export interface CreateUserRequest {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface CreateUserResponse {
    firstName: string;
    lastName: string;
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
}

export enum UserStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    BANNED = 'BANNED'
}