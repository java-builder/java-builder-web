export interface CommentResponse {
  id: string;
  content: string;
  username: string;
  avatar?: string;
  createdAt: string;
  repliesCount?: number;
  replies?: CommentResponse[];
}

export interface CommentDetailResponse {
  id: string;
  content: string;
  username: string;
  avatar?: string;
  repliesCount: number;
  status: "ACTIVE" | "DELETED";
  blogId?: string;
  lessonId?: string;
  createdAt: string;
}

export interface CreateCommentRequest {
  lessonId?: string;
  blogId?: string;
  parentCommentId?: string;
  parentId?: string;
  content: string;
}

export interface CreateCommentResponse {
  id: string;
  content: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface CommentPageResponse {
  result: CommentResponse[];
  currentPages: number;
  pageSizes: number;
  totalPages: number;
  totalElements: number;
}
