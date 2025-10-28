export interface CreateCommentRequest {
    blogId: string;
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

export interface CommentDetailResponse {
    id: string;
    content: string;
    username: string;
    avatar?: string;
    createdAt: string;
    replies?: CommentDetailResponse[];
    repliesCount?: number;
}
