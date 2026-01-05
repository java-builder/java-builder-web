// Review types
export interface ReviewResponse {
  id: string;
  content: string;
  rating: number;
  username: string;
  userAvatar: string | null;
  courseId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateReviewRequest {
  courseId: string;
  rating: number;
  content?: string;
}

export interface UpdateReviewRequest {
  id: string;
  rating?: number;
  content?: string;
}
