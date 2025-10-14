import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { ApiResponse } from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/f-learning';

export const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {

        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('access_token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
                console.log('🔑 Added Authorization header');
            } else {
                console.log('⚠️ No access token found');
            }
        }
        return config;
    },
    (error: AxiosError) => {
        console.error('🚨 Request interceptor error:', error);
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => {
        const apiResponse = response.data as ApiResponse<unknown>;

        if (apiResponse.code < 200 || apiResponse.code > 299) {
            return Promise.reject({
                response: {
                    status: apiResponse.code,
                    data: apiResponse
                }
            });
        }

        return response;
    },
    async (error: AxiosError<ApiResponse<unknown>>) => {
        const apiResponse = error.response?.data;

        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('access_token');
                window.location.href = '/login';
            }
            return Promise.reject(error);
        }

        if (error.response?.status === 403) {
            if (typeof window !== 'undefined') {
                window.location.href = '/403';
            }
            return Promise.reject(error);
        }

        if (apiResponse?.message) {
            return Promise.reject({
                ...error,
                message: apiResponse.message
            });
        }

        return Promise.reject(error);
    }
);