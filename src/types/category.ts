export enum CategoryType {
  BLOG = "BLOG",
  POST = "POST",
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  categoryType: CategoryType;
  displayOrder?: number;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  slug?: string;
  icon?: string;
  color?: string;
  displayOrder?: number;
  categoryType?: CategoryType;
}

export interface CreateCategoryResponse {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  categoryType: CategoryType;
  displayOrder: number;
  createdAt: string;
}

export interface CategoryDetailResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  color?: string;
  categoryType: CategoryType;
  displayOrder: number;
  createdAt: string;
}


