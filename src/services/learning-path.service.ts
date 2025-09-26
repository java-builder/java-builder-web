import { apiClient } from '@/lib/axios';
import { isAxiosError } from 'axios';
import { ApiResponse, ChatbotRequest, ChatbotResponse, CreateLearningPathRequest, LearningPathDetailResponse, LearningPreferences } from '@/types/learning-path';

export class LearningPathService {

    /**
     * Generate a learning path by asking the chatbot (not saved yet)
     */
    static async generateLearningPath(request: ChatbotRequest): Promise<ApiResponse<ChatbotResponse>> {
        try {
            const response = await apiClient.post<ApiResponse<ChatbotResponse>>(
                '/api/v1/chatbot',
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                }
            );

            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                }
                if ((status ?? 0) >= 500) {
                    throw new Error('Lỗi server. Vui lòng thử lại sau.');
                }
            }
            throw new Error('Không thể tạo lộ trình học tập. Vui lòng thử lại.');
        }
    }


    static buildChatbotMessage(preferences: Partial<LearningPreferences>): string {
        const parts: string[] = [];

        if (preferences.name) {
            parts.push(`Tôi là ${preferences.name}`);
        }

        if (preferences.currentJob) {
            parts.push(`hiện tại đang làm ${preferences.currentJob}`);
        }

        if (preferences.specificGoals && preferences.specificGoals.trim()) {
            parts.push(`mục tiêu ${preferences.specificGoals.trim()}`);
        }

        if (preferences.preferredTopics && preferences.preferredTopics.trim()) {
            parts.push(`muốn học ${preferences.preferredTopics.trim()}`);
        }

        if (preferences.experience) {
            parts.push(`trình độ ${preferences.experience}`);
        }

        if (preferences.timeline) {
            parts.push(`thời gian ${preferences.timeline}`);
        }

        // Ghép tất cả bằng dấu phẩy
        const base = parts.join(', ') + '. Tạo lộ trình học tập chi tiết cho tôi.';


        console.log('Built message:', base);
        return base;
    }

    /**
     * Save a learning path to database (after user clicks "Bắt đầu học ngay")
     */
    static async saveLearningPath(request: CreateLearningPathRequest): Promise<ApiResponse<void>> {
        try {
            console.log('Creating learning path:', request);

            const response = await apiClient.post<ApiResponse<void>>(
                '/api/v1/learning-path',
                request,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                }
            );

            return response.data;
        } catch (error: unknown) {
            if (isAxiosError(error)) {
                const status = error.response?.status;
                if (status === 401) {
                    throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
                }
                if ((status ?? 0) >= 500) {
                    throw new Error('Lỗi server. Vui lòng thử lại sau.');
                }
            }
            throw new Error('Không thể lưu lộ trình học tập. Vui lòng thử lại.');
        }
    }

    /**
     * Get all learning paths for the logged-in user
     */
    static async getUserLearningPaths(): Promise<ApiResponse<LearningPathDetailResponse[]>> {
        try {
            const response = await apiClient.get<ApiResponse<LearningPathDetailResponse[]>>(
                '/api/v1/learning-path',
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error fetching learning paths:', error);
            throw new Error('Không thể tải danh sách lộ trình học tập.');
        }
    }

    /**
     * Delete a learning path
     */
    static async deleteLearningPath(id: string): Promise<ApiResponse<void>> {
        try {
            const response = await apiClient.delete<ApiResponse<void>>(
                `/api/v1/learning-path/${id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error('Error deleting learning path:', error);
            throw new Error('Không thể xóa lộ trình học tập.');
        }
    }
}
