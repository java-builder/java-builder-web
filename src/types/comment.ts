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
  targetId?: string;
  commentTargetType?: "BLOG" | "LESSON" | "POST" | "QUESTION" | "DOCS";
  parentComment?: {
    id: string;
    username: string;
    avatar?: string;
    content: string;
  };
  createdAt: string;
  targetTitle?: string;
  targetUrlPath?: string;
}

export interface CreateCommentRequest {
  targetId: string;
  targetType: "BLOG" | "LESSON" | "POST" | "QUESTION" | "DOCS";
  parentId?: string;
  content: string;
}

export interface CreateCommentResponse {
  id: string;
  content: string;
  username: string;
  avatar?: string;
  repliesCount: number;
  createdAt: string;
}

