"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Circle,
  Eye,
  EyeOff,
  KeyRound,
  Loader2,
  ShieldAlert,
} from "lucide-react";
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
      <div className="flex min-h-[360px] items-center justify-center rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface">
        <Loader2 className="h-6 w-6 animate-spin text-[#FF5A1F]" />
      </div>
    );
  }

  const isPasswordSet = passwordStatus === PasswordStatus.SET;

  const newPasswordVal = formData.newPassword || "";
  const isLengthValid = newPasswordVal.length >= 8;
  const isCaseValid =
    /[a-z]/.test(newPasswordVal) && /[A-Z]/.test(newPasswordVal);
  const isSpecialValid =
    /[0-9]/.test(newPasswordVal) || /[^a-zA-Z0-9]/.test(newPasswordVal);

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
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-5">
        {isPasswordSet && (
          <PasswordField
            label={t("profilePage.passwordTab.currentPassword")}
            placeholder={t(
              "profilePage.passwordTab.currentPasswordPlaceholder"
            )}
            value={formData.currentPassword}
            visible={showPasswords.current}
            onToggle={() => togglePasswordVisibility("current")}
            onChange={(v) =>
              setFormData({ ...formData, currentPassword: v })
            }
            required
          />
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
            placeholder={t(
              "profilePage.passwordTab.confirmNewPasswordPlaceholder"
            )}
            value={formData.confirmPassword}
            visible={showPasswords.confirm}
            onToggle={() => togglePasswordVisibility("confirm")}
            onChange={(v) =>
              setFormData({ ...formData, confirmPassword: v })
            }
            required
          />
        </div>

        {/* Password Requirements Card */}
        <div className="rounded-xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8]/70 dark:bg-muted/20 p-4">
          <div className="mb-2.5 flex items-center gap-2">
            <ShieldAlert className="h-4 w-4 text-[#FF5A1F]" />
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#171717] dark:text-foreground">
              {t("profilePage.passwordTab.passwordReqs")}
            </h4>
          </div>
          <ul className="space-y-2 text-xs sm:text-sm">
            <RequirementRow
              met={isLengthValid}
              text={
                <>
                  <strong>{t("profilePage.passwordTab.reqLength")}</strong>{" "}
                  {t("profilePage.passwordTab.reqRequired")}
                </>
              }
            />
            <RequirementRow
              met={isCaseValid}
              text={t("profilePage.passwordTab.reqCase")}
            />
            <RequirementRow
              met={isSpecialValid}
              text={t("profilePage.passwordTab.reqNumber")}
            />
          </ul>
        </div>

        <div className="flex justify-end pt-2 border-t border-[#E8E8E8] dark:border-border">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              formData.newPassword !== formData.confirmPassword ||
              !formData.newPassword
            }
            className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] active:scale-95 px-6 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 shadow-xs"
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

function RequirementRow({
  met,
  text,
}: {
  met: boolean;
  text: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-2">
      {met ? (
        <CheckCircle2 className="h-4 w-4 flex-shrink-0 text-emerald-500" />
      ) : (
        <Circle className="h-4 w-4 flex-shrink-0 text-muted-foreground/50" />
      )}
      <span
        className={`transition-colors duration-150 ${
          met
            ? "font-medium text-emerald-600 dark:text-emerald-400"
            : "text-muted-foreground"
        }`}
      >
        {text}
      </span>
    </li>
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
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
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
          className="block w-full rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-3.5 py-2 pr-10 text-sm text-[#171717] dark:text-foreground transition focus:border-[#FF5A1F] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/15"
        />
        <button
          type="button"
          onClick={onToggle}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-2.5 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-[#F8F8F8] hover:text-[#171717] dark:hover:bg-muted dark:hover:text-foreground"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
      {hint && (
        <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}
