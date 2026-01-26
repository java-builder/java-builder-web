export interface PostDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  thumbnail?: string | null;
  username?: string | null;
  avatar?: string | null;
  viewCount?: number;
  commentCount?: number;
  categoryId: string;
  categoryName: string;
  createdAt: string;
}

export interface CreatePostRequest {
  title: string;
  content?: string;
  thumbnail?: string | null;
  categoryId: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  thumbnail?: string | null;
  isSolved?: boolean;
  categoryId?: string;
}

export interface CreatePostResponse {
  id: string;
  title: string;
  slug: string;
  content?: string;
  thumbnail?: string | null;
  categoryName?: string | null;
  createdAt: string;
}

export interface UpdatePostResponse {
  id: string;
  title: string;
  content?: string;
  slug: string;
  thumbnail?: string | null;
  categoryName?: string | null;
  isSolved: boolean;
  updatedAt: string;
}
 
