export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
}

export interface CreateCategoryResponse {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
}

export interface CategoryDetailResponse {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  createdAt: string;
}


