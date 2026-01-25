"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { authApi } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

let isCallbackProcessed = false;

const LinkedinCallbackContent = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { setAuthFromLogin } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isCallbackProcessed) return;

    const handleLinkedinCallback = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setError("Không nhận được mã xác thực từ LinkedIn");
        setIsProcessing(false);
        return;
      }

      isCallbackProcessed = true;

      try {
        const response = await authApi.loginWithLinkedin(code);

        if (
          response.code === 200 &&
          response.data?.accessToken &&
          response.data?.userId
        ) {
          setAuthFromLogin(response.data);
          await queryClient.invalidateQueries({ queryKey: ["currentUser"] });
          const isAdmin = response.data?.authorities?.includes("ADMIN");
          router.push(isAdmin ? "/admin" : "/");
        } else {
          setError("Không nhận được thông tin đăng nhập từ LinkedIn");
          setIsProcessing(false);
        }
      } catch (err) {
        setError(
          `Đăng nhập LinkedIn thất bại: ${err instanceof Error ? err.message : "Vui lòng thử lại."}`,
        );
        setIsProcessing(false);
      }
    };

    handleLinkedinCallback();

    return () => {
      setTimeout(() => {
        isCallbackProcessed = false;
      }, 1000);
    };
  }, [searchParams, router, queryClient, setAuthFromLogin]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg className="w-16 h-16 text-red-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đăng nhập thất bại</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button onClick={() => router.push("/login")} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer">
            Quay lại đăng nhập
          </button>
        </div>
      </div>
    );
  }

  if (isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center justify-center w-16 h-16 bg-white rounded-full shadow-md mb-6">
              <svg className="w-8 h-8" viewBox="0 0 24 24">
                <rect width="24" height="24" rx="4" fill="#0A66C2" />
                <path d="M7 9h3v7H7zM8.5 7.5a1.5 1.5 0 110-3 1.5 1.5 0 010 3zM14 9c1.657 0 3 1.343 3 3v4h-3v-4c0-.552-.448-1-1-1s-1 .448-1 1v4h-3v-7h3v1c.33-.644.986-1 1.664-1z" fill="#fff"/>
              </svg>
            </div>
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Đang xử lý đăng nhập LinkedIn</h2>
          <p className="text-gray-600 mb-2">Vui lòng đợi trong giây lát...</p>
          <p className="text-sm text-gray-500">Hệ thống đang xác thực thông tin của bạn</p>
        </div>
      </div>
    );
  }

  return null;
};

const LinkedinCallbackPage = () => {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading...</p>
        </div>
      </div>
    }>
      <LinkedinCallbackContent />
    </Suspense>
  );
};

export default LinkedinCallbackPage;


