"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { authApi } from "@/services/auth.service";

// Module-level variable để track việc đã xử lý - persist qua re-renders của Strict Mode
let isCallbackProcessed = false;

const GitHubCallbackContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Nếu đã xử lý rồi thì không làm gì
    if (isCallbackProcessed) return;

    const handleGitHubCallback = async () => {
      const code = searchParams.get("code");

      if (!code) {
        setError("Không nhận được mã xác thực từ GitHub");
        setIsProcessing(false);
        return;
      }

      // Đánh dấu đã xử lý TRƯỚC khi gọi API
      isCallbackProcessed = true;

      try {
        const response = await authApi.loginWithGithub(code);

        if (
          response.code === 200 &&
          response.result?.accessToken &&
          response.result?.userId
        ) {
          localStorage.setItem("access_token", response.result.accessToken);
          localStorage.setItem("user_id", response.result.userId);

          // Check if user has ADMIN authority
          const isAdmin = response.result.authorities?.includes("ADMIN");
          router.push(isAdmin ? "/admin" : "/");
        } else {
          setError("Không nhận được thông tin đăng nhập từ GitHub");
          setIsProcessing(false);
        }
      } catch (err) {
        setError(
          `Đăng nhập GitHub thất bại: ${err instanceof Error ? err.message : "Vui lòng thử lại."}`,
        );
        setIsProcessing(false);
      } finally {
        setIsProcessing(false);
      }
    };

    handleGitHubCallback();

    // Reset flag khi component unmount (để có thể login lại nếu cần)
    return () => {
      setTimeout(() => {
        isCallbackProcessed = false;
      }, 1000);
    };
  }, [searchParams, router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Đăng nhập thất bại
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/login")}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors cursor-pointer"
          >
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
              <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>

            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Đang xử lý đăng nhập GitHub
          </h2>
          <p className="text-gray-600 mb-2">Vui lòng đợi trong giây lát...</p>
          <p className="text-sm text-gray-500">
            Hệ thống đang xác thực thông tin của bạn
          </p>
        </div>
      </div>
    );
  }

  return null;
};

const GitHubCallbackPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-300 border-t-blue-600"></div>
            </div>
            <p className="text-gray-600 mt-4">Loading...</p>
          </div>
        </div>
      }
    >
      <GitHubCallbackContent />
    </Suspense>
  );
};

export default GitHubCallbackPage;
