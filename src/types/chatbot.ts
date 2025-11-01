export interface ChatbotRequest {
    message: string;
}

export interface SuggestedBlogInfo {
    id: string;
    title: string;
    content: string;
    summary: string;
    blogType: string;
    featuredImage: string | null;
    author: string;
}

export interface SuggestedBlogResponse {
    answer: string;
    suggestedBlogs: SuggestedBlogInfo[];
}

export interface ChatbotResponse {
    answer: string;
}

