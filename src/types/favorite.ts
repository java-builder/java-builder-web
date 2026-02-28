// Favorite types
export enum FavoriteTargetType {
  BLOG = 'BLOG',
  COURSE = 'COURSE'
}

export interface FavoriteResponse {
  id: string;
  targetId: string;
  targetType: FavoriteTargetType;
  targetTitle: string;
  targetDescription: string;
  coursePrice?: number;
  thumbnailUrl?: string;
  courseLevel?: string;
  courseDuration?: number;
  addedAt: string;
}

export interface FavoriteRequest {
  targetId: string;
  targetType: FavoriteTargetType;
}
