"use client";

import { useState, useEffect } from "react";
import { userApi } from "@/services/user.service";
import { PasswordStatus } from "@/types/user";
import toast from "react-hot-toast";
import { useI18n } from "@/contexts/I18nContext";

export default function PasswordTab() {
  const { t } = useI18n();
  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await userApi.getPasswordStatus();
        if (response.data) {
          setPasswordStatus(response.data.passwordStatus);
        }
      } catch (error) {
        console.error("Failed to fetch password status", error);
      } finally {
        setIsLoadingStatus(false);
      }
    };
    fetchStatus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error(t("profilePage.passwordTab.matchFailed"));
      return;
    }
    setIsSubmitting(true);
    try {
      if (passwordStatus === PasswordStatus.NOT_SET) {
        await userApi.createPassword({ password: formData.newPassword });
        toast.success(t("profilePage.passwordTab.createSuccess"));
        setPasswordStatus(PasswordStatus.SET);
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      } else {
        await userApi.changePassword(formData.currentPassword, formData.newPassword);
        toast.success(t("profilePage.passwordTab.changeSuccess"));
        setFormData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : t("profilePage.passwordTab.actionFailed"));
      console.error("Failed to create/update password", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field: "current" | "new" | "confirm") => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  if (isLoadingStatus) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
      </div>
    );
  }

  const isPasswordSet = passwordStatus === PasswordStatus.SET;

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          {isPasswordSet ? t("profilePage.passwordTab.changePassword") : t("profilePage.passwordTab.createPassword")}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {isPasswordSet
            ? t("profilePage.passwordTab.updateDesc")
            : t("profilePage.passwordTab.createDesc")}
        </p>
      </div>

      {/* Content */}
      <div className="p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Current Password - Only show if password is set */}
          {isPasswordSet && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t("profilePage.passwordTab.currentPassword")}
              </label>
              <div className="relative">
                <input
                  type={showPasswords.current ? "text" : "password"}
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      currentPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                  placeholder={t("profilePage.passwordTab.currentPasswordPlaceholder")}
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility("current")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  {showPasswords.current ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("profilePage.passwordTab.newPassword")}
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) =>
                  setFormData({ ...formData, newPassword: e.target.value })
                }
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                placeholder={t("profilePage.passwordTab.newPasswordPlaceholder")}
                minLength={8}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.new ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1.5">
              {t("profilePage.passwordTab.passwordLengthTip")}
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {t("profilePage.passwordTab.confirmNewPassword")}
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2.5 pr-10 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-900 dark:text-white bg-white dark:bg-slate-700 focus:ring-2 focus:ring-accent focus:border-accent transition-colors"
                placeholder={t("profilePage.passwordTab.confirmNewPasswordPlaceholder")}
                required
              />
              <button
                type="button"
                onClick={() => togglePasswordVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                {showPasswords.confirm ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Password Requirements */}
          <div className="bg-gray-50 dark:bg-slate-900/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2.5">
              {t("profilePage.passwordTab.passwordReqs")}
            </h4>
            <ul className="space-y-1.5 text-sm text-gray-600 dark:text-gray-300">
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span><strong>{t("profilePage.passwordTab.reqLength")}</strong> {t("profilePage.passwordTab.reqRequired")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{t("profilePage.passwordTab.reqCase")}</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-gray-400">•</span>
                <span>{t("profilePage.passwordTab.reqNumber")}</span>
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || formData.newPassword !== formData.confirmPassword}
              className="px-6 py-2.5 bg-accent text-white rounded-lg font-medium hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm"
            >
              {isSubmitting ? t("profilePage.passwordTab.submitting") : isPasswordSet ? t("profilePage.passwordTab.changePassword") : t("profilePage.passwordTab.createPassword")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
