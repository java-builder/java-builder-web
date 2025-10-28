'use client';

import { useState, useEffect } from 'react';
import { userApi } from '@/services/user.service';
import { UserDetailResponse } from '@/types/user';

export const useUser = (userId?: string) => {
    const [user, setUser] = useState<UserDetailResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true);
                setError(null);

                let response;
                if (userId) {
                    response = await userApi.getById(userId);
                } else {
                    response = await userApi.getCurrentUser();
                }

                if (response.result) {
                    setUser(response.result);
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [userId]);

    const updateUser = async (data: Partial<UserDetailResponse>) => {
        if (!user) return;

        try {
            setUser(prevUser => prevUser ? { ...prevUser, ...data } : null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi cập nhật thông tin');
            throw err;
        }
    };

    return {
        user,
        loading,
        error,
        updateUser,
        refetch: () => {
            const fetchUser = async () => {
                try {
                    setLoading(true);
                    setError(null);

                    let response;
                    if (userId) {
                        response = await userApi.getById(userId);
                    } else {
                        response = await userApi.getCurrentUser();
                    }

                    if (response.result) {
                        setUser(response.result);
                    }
                } catch (err) {
                    setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi tải thông tin người dùng');
                } finally {
                    setLoading(false);
                }
            };
            fetchUser();
        }
    };
};
