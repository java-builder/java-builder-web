export enum BlogType {
  EXPERIENCE = "EXPERIENCE",
  TUTORIAL = "TUTORIAL",
  QUESTION = "QUESTION",
  DISCUSSION = "DISCUSSION",
  TIPS = "TIPS",
  REVIEW = "REVIEW",
  NEWS = "NEWS",
}

export const BlogTypeDisplayNames: Record<BlogType, string> = {
  [BlogType.EXPERIENCE]: "Chia sẻ kinh nghiệm",
  [BlogType.TUTORIAL]: "Hướng dẫn",
  [BlogType.QUESTION]: "Câu hỏi",
  [BlogType.DISCUSSION]: "Thảo luận",
  [BlogType.TIPS]: "Tips & Tricks",
  [BlogType.REVIEW]: "Đánh giá",
  [BlogType.NEWS]: "Tin tức",
};

export interface CreateBlogRequest {
  title: string;
  content: string;
  summary?: string;
  featuredImage?: string;
  blogType: BlogType;
}

export interface CreateBlogResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  blogType: BlogType;
  featuredImage?: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  blogType: BlogType;
  featuredImage?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  author?: string;
  createdAt: string;
}
