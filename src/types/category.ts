export enum CategoryType {
  BLOG = "BLOG",
  POST = "POST",
  CHALLENGE = "CHALLENGE",
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  categoryType: CategoryType;
}

export interface UpdateCategoryRequest {
  name?: string;
  description?: string;
  slug?: string;
  displayOrder?: number;
  categoryType?: CategoryType;
}

export interface CreateCategoryResponse {
  id: string;
  name: string;
  description?: string;
  categoryType: CategoryType;
  displayOrder: number;
  createdAt: string;
}

export interface CategoryDetailResponse {
  id: string;
  name: string;
  slug: string;
  description?: string;
  categoryType: CategoryType;
  displayOrder: number;
  createdAt: string;
}

export interface CategorySummaryResponse {
  id: string;
  name: string;
  slug: string;
}
