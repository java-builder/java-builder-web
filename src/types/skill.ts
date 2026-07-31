export interface Skill {
  id: string;
  name: string;
  userCount?: number;
  createdAt?: string;
}

export interface CreateSkillRequest {
  name: string;
}

export interface UpdateSkillRequest {
  name: string;
}

export interface SkillSearchParams {
  search?: string;
  page?: number;
  size?: number;
}
