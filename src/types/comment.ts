export interface Comment {
    id: string;
    content: string;
    author: string;
    createdAt: string;
    likeCount: number;
    isLiked?: boolean;
    replies?: Comment[];
}

export interface CreateCommentRequest {
    content: string;
    blogId: string;
    parentId?: string;
}

export interface CreateCommentResponse {
    id: string;
    content: string;
    author: string;
    authorId: string;
    blogId: string;
    parentId?: string;
    createdAt: string;
    likeCount: number;
}
