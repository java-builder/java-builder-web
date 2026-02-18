export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface TagDetailResponse {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export interface CreateTagRequest {
  name: string;
}

export interface UpdateTagRequest {
  name: string;
}
