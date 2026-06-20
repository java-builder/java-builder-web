"use client";

import { useEffect, useState } from "react";
import { Eye, EyeOff, KeyRound, Loader2, ShieldAlert } from "lucide-react";
import toast from "react-hot-toast";
import { userApi } from "@/services/user.service";
import { PasswordStatus } from "@/types/user";
import { useI18n } from "@/contexts/I18nContext";
import SectionCard from "./SectionCard";

type PwField = "current" | "new" | "confirm";

export default function PasswordTab() {
  const { t } = useI18n();
  const [passwordStatus, setPasswordStatus] = useState<PasswordStatus | null>(
    null
  );
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPasswords, setShowPasswords] = useState<Record<PwField, boolean>>({
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
      } else {
        await userApi.changePassword(
          formData.currentPassword,
          formData.newPassword
        );
        toast.success(t("profilePage.passwordTab.changeSuccess"));
      }
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : t("profilePage.passwordTab.actionFailed")
      );
      console.error("Failed to create/update password", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = (field: PwField) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (isLoadingStatus) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-gray-200 bg-white dark:border-slate-700 dark:bg-slate-800">
        <Loader2 className="h-7 w-7 animate-spin text-accent" />
      </div>
    );
  }

  const isPasswordSet = passwordStatus === PasswordStatus.SET;

  const newPasswordVal = formData.newPassword || "";
  const isLengthValid = newPasswordVal.length >= 8;
  const isCaseValid = /[a-z]/.test(newPasswordVal) && /[A-Z]/.test(newPasswordVal);
  const isSpecialValid = /[0-9]/.test(newPasswordVal) || /[^a-zA-Z0-9]/.test(newPasswordVal);

  return (
    <SectionCard
      icon={KeyRound}
      title={
        isPasswordSet
          ? t("profilePage.passwordTab.changePassword")
          : t("profilePage.passwordTab.createPassword")
      }
      subtitle={
        isPasswordSet
          ? t("profilePage.passwordTab.updateDesc")
          : t("profilePage.passwordTab.createDesc")
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {isPasswordSet && (
          <PasswordField
            label={t("profilePage.passwordTab.currentPassword")}
            placeholder={t("profilePage.passwordTab.currentPasswordPlaceholder")}
            value={formData.currentPassword}
            visible={showPasswords.current}
            onToggle={() => togglePasswordVisibility("current")}
            onChange={(v) =>
              setFormData({ ...formData, currentPassword: v })
            }
            required
          />
        )}

        <PasswordField
          label={t("profilePage.passwordTab.newPassword")}
          placeholder={t("profilePage.passwordTab.newPasswordPlaceholder")}
          value={formData.newPassword}
          visible={showPasswords.new}
          onToggle={() => togglePasswordVisibility("new")}
          onChange={(v) => setFormData({ ...formData, newPassword: v })}
          required
          minLength={8}
          hint={t("profilePage.passwordTab.passwordLengthTip")}
        />

        <PasswordField
          label={t("profilePage.passwordTab.confirmNewPassword")}
          placeholder={t("profilePage.passwordTab.confirmNewPasswordPlaceholder")}
          value={formData.confirmPassword}
          visible={showPasswords.confirm}
          onToggle={() => togglePasswordVisibility("confirm")}
          onChange={(v) =>
            setFormData({ ...formData, confirmPassword: v })
          }
          required
        />

         {/* Requirements */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-slate-700 dark:bg-slate-900/40">
          <div className="mb-2 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-amber-500" />
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300">
              {t("profilePage.passwordTab.passwordReqs")}
            </h4>
          </div>
          <ul className="space-y-1.5 text-sm">
            <li className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 ${isLengthValid ? "bg-green-500" : "bg-rose-500"}`} />
              <span className={`transition-colors duration-200 ${isLengthValid ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-900 dark:text-gray-300 font-medium"}`}>
                <strong>{t("profilePage.passwordTab.reqLength")}</strong>{" "}
                {t("profilePage.passwordTab.reqRequired")}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 ${isCaseValid ? "bg-green-500" : "bg-gray-300 dark:bg-slate-600"}`} />
              <span className={`transition-colors duration-200 ${isCaseValid ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-600 dark:text-gray-300"}`}>
                {t("profilePage.passwordTab.reqCase")}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <span className={`h-1.5 w-1.5 flex-shrink-0 rounded-full transition-colors duration-200 ${isSpecialValid ? "bg-green-500" : "bg-gray-300 dark:bg-slate-600"}`} />
              <span className={`transition-colors duration-200 ${isSpecialValid ? "text-green-600 dark:text-green-400 font-medium" : "text-gray-600 dark:text-gray-300"}`}>
                {t("profilePage.passwordTab.reqNumber")}
              </span>
            </li>
          </ul>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              formData.newPassword !== formData.confirmPassword ||
              !formData.newPassword
            }
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
            {isSubmitting
              ? t("profilePage.passwordTab.submitting")
              : isPasswordSet
                ? t("profilePage.passwordTab.changePassword")
                : t("profilePage.passwordTab.createPassword")}
          </button>
        </div>
      </form>
    </SectionCard>
  );
}

interface PasswordFieldProps {
  label: string;
  placeholder: string;
  value: string;
  visible: boolean;
  onToggle: () => void;
  onChange: (v: string) => void;
  required?: boolean;
  minLength?: number;
  hint?: string;
}

function PasswordField({
  label,
  placeholder,
  value,
  visible,
  onToggle,
  onChange,
  required,
  minLength,
  hint,
}: PasswordFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <div className="relative">
        <input
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          required={required}
          minLength={minLength}
          className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 pr-10 text-sm text-gray-900 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-slate-600 dark:hover:text-gray-200"
        >
          {visible ? (
            <EyeOff className="h-3.5 w-3.5" />
          ) : (
            <Eye className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      {hint && (
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
}
