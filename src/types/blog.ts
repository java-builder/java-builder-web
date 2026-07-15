import { Tag } from "./tag";
import { CategoryDetailResponse } from "./category";

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
  key?: string;
  blogType: BlogType;
  categoryId?: string;
  tags?: string[];
  isPremium?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
}

export interface CreateBlogResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  isPremium?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  blogType: BlogType;
  thumbnailUrl?: string;
  viewCount: number;
  likeCount: number;
  createdAt: string;
}

export interface UpdateBlogResponse {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  isPremium?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  blogType: BlogType;
  thumbnailUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  isPremium?: boolean;
  canAccess?: boolean;
  isFeatured?: boolean;
  featuredOrder?: number;
  blogType: BlogType;
  thumbnailUrl?: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  author?: string;
  category?: CategoryDetailResponse;
  categoryName?: string;
  tags: Tag[] | string[];
  createdAt: string;
}
