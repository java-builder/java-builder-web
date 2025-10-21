// Course types
export interface CreateCourseRequest {
    title: string;
    description: string;
    price: number;
    duration?: number;
    courseCover?: string;
    level?: CourseLevel;
}

export interface CreateCourseResponse {
    id: string;
    title: string;
    description: string;
    price: number;
    duration?: number;
    courseCover?: string;
    level?: CourseLevel;
}

export interface CourseDetailResponse {
    id: string;
    title: string;
    description: string;
    price: number;
    duration?: number;
    courseCover?: string;
    level?: CourseLevel;
    createdAt: string;
    updatedAt: string;
}

export enum CourseLevel {
    BEGINNER = 'BEGINNER',
    INTERMEDIATE = 'INTERMEDIATE',
    ADVANCED = 'ADVANCED',
    EXPERT = 'EXPERT'
}

// File upload types
export interface FileMetaDataResponse {
    name: string;
    contentType: string;
    size: number;
    url: string;
    displayOrder?: number;
}

export interface FileResponse {
    files: FileMetaDataResponse[];
}
