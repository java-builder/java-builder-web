"use client";

import { useState, useRef, useEffect } from "react";
import { Lock, X, Loader2 } from "lucide-react";
import { authApi } from "@/services/auth.service";
import { useAuth } from "@/contexts/AuthContext";

interface TwoFactorModalProps {
  isOpen: boolean;
  onClose: () => void;
  email?: string;
  userId?: string;
  identityProvider?: 'USERNAME_PASSWORD' | 'GOOGLE' | 'GITHUB' | 'LINKEDIN';
  onSuccess: (data: { authorities?: string[]; accessToken?: string; userId?: string }) => void;
}

export default function TwoFactorModal({
  isOpen,
  onClose,
  email,
  userId,
  identityProvider = 'USERNAME_PASSWORD',
  onSuccess,
}: TwoFactorModalProps) {
  const { setAuthFromLogin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (index: number, value: string) => {
    if (!value) {
      const newOtp = [...otp];
      newOtp[index] = "";
      setOtp(newOtp);
      return;
    }

    // Lấy ký tự cuối cùng được nhập vào (để ghi đè và tương thích bộ gõ tiếng Việt)
    const lastChar = value.slice(-1);
    
    // Chỉ chấp nhận các chữ số từ 0-9
    if (!/^\d$/.test(lastChar)) return;

    const newOtp = [...otp];
    newOtp[index] = lastChar;
    setOtp(newOtp);

    if (index < 5) {
      inputRefs.current[index + 1]?.focus();
    } else if (index === 5) {
      // Tự động xác thực khi đã nhập đủ 6 chữ số
      const code = newOtp.join("");
      if (code.length === 6) {
        onSubmit(newOtp);
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "Enter") {
      const code = otp.join("");
      if (code.length === 6 && !isLoading) {
        onSubmit();
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    const newOtp = pastedData
      .split("")
      .concat(new Array(6 - pastedData.length).fill(""));
    setOtp(newOtp);

    if (pastedData.length === 6) {
      onSubmit(newOtp);
    } else if (pastedData.length > 0) {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const onSubmit = async (currentOtp: string[] = otp) => {
    const code = currentOtp.join("");
    if (code.length !== 6) {
      setError("Vui lòng nhập đủ 6 chữ số");
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const requestUserId = userId || email;
      if (!requestUserId) {
        setError("Thiếu thông tin xác thực");
        return;
      }

      const result = await authApi.loginTwoFactor({
        userId: requestUserId,
        code,
        identityProvider,
      });

      if (result.code === 200 && result.data?.accessToken) {
        setAuthFromLogin(result.data);
        onSuccess(result.data);
        handleClose();
      } else {
        setError("Mã OTP không đúng. Vui lòng thử lại.");
      }
    } catch {
      setError("Mã OTP không đúng. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setOtp(new Array(6).fill(""));
    setError("");
    onClose();
  };

  useEffect(() => {
    if (isOpen) {
      inputRefs.current[0]?.focus();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 dark:bg-black/60">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-gray-100 dark:border-slate-800 animate-in fade-in-0 zoom-in-95 duration-300">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:text-slate-500 dark:hover:text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-accent/10 dark:bg-accent/20 flex items-center justify-center mx-auto mb-4 ring-8 ring-accent/5 dark:ring-accent/10">
            <Lock className="w-5 h-5 text-accent" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Xác thực 2 bước
          </h2>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Nhập mã OTP từ ứng dụng authenticator
          </p>
          {email && (
            <span className="mt-2 inline-flex items-center rounded-lg bg-gray-50 dark:bg-slate-800 px-2.5 py-1 text-xs font-mono text-gray-700 dark:text-slate-300 border border-gray-100 dark:border-slate-700">
              {email}
            </span>
          )}
        </div>

        {error && (
          <p className="mb-4 text-center text-xs font-semibold text-rose-600 dark:text-rose-400">
            {error}
          </p>
        )}

        <div className="space-y-5">
          <div className="flex justify-center space-x-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                disabled={isLoading}
                className="w-12 h-12 text-center text-xl font-bold border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/15 focus:outline-none transition-all disabled:opacity-50 text-gray-950 dark:text-white"
              />
            ))}
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => onSubmit()}
              disabled={isLoading || otp.join("").length !== 6}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-8 py-2 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Đang xác thực...
                </>
              ) : (
                "Xác thực"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
