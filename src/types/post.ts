export interface PostDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  key?: string | null;
  thumbnailUrl?: string | null;
  username?: string | null;
  avatar?: string | null;
  viewCount?: number;
  commentCount?: number;
  categoryId: string;
  categoryName: string;
  isSolved?: boolean;
  tags?: string[];
  createdAt: string;
}

export interface CreatePostRequest {
  title: string;
  content?: string;
  key?: string | null;
  categoryId: string;
  tags?: string[];
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  key?: string | null;
  isSolved?: boolean;
  categoryId?: string;
  tags?: string[];
}

export interface CreatePostResponse {
  id: string;
  title: string;
  slug: string;
  content?: string;
  thumbnailUrl?: string | null;
  categoryName?: string | null;
  createdAt: string;
}

export interface UpdatePostResponse {
  id: string;
  title: string;
  content?: string;
  slug: string;
  thumbnailUrl?: string | null;
  categoryName?: string | null;
  isSolved: boolean;
  updatedAt: string;
}
 
