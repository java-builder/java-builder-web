"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import { Camera, Loader2, Pencil, User as UserIcon } from "lucide-react";
import { UserDetailResponse } from "@/types/user";
import { userApi } from "@/services/user.service";
import { useI18n } from "@/contexts/I18nContext";
import SectionCard from "./SectionCard";

interface ProfileTabProps {
  user: UserDetailResponse;
  onSave?: (data: Partial<UserDetailResponse>) => Promise<void>;
  isSaving?: boolean;
}

export default function ProfileTab({
  user,
  isSaving,
  onSave,
}: ProfileTabProps) {
  const { t } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [currentAvatar, setCurrentAvatar] = useState(user.avatar || "");
  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    university: user.university || "",
  });

  useEffect(() => {
    setCurrentAvatar(user.avatar || "");
  }, [user.avatar]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const hasChanges =
      formData.username !== user.username ||
      formData.university !== (user.university || "");

    if (!hasChanges) {
      setIsEditing(false);
      return;
    }

    try {
      await userApi.updateProfile({
        username: formData.username,
        university: formData.university,
      });
      if (onSave) {
        await onSave({
          username: formData.username,
          university: formData.university,
        });
      }
      toast.success(t("profilePage.profileTab.updateSuccess"));
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : t("profilePage.profileTab.updateFailed")
      );
    }
  };

  const handleCancel = () => {
    setFormData({
      username: user.username || "",
      email: user.email || "",
      university: user.university || "",
    });
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error(t("profilePage.profileTab.fileTooLarge"));
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast.error(t("profilePage.profileTab.invalidImage"));
      return;
    }

    try {
      setIsUploadingAvatar(true);
      const response = await userApi.updateAvatar(file);
      if (response.data) {
        setCurrentAvatar(response.data);
        if (onSave) {
          await onSave({ avatar: response.data });
        }
        toast.success(t("profilePage.profileTab.avatarSuccess"));
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : t("profilePage.profileTab.avatarFailed")
      );
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const editAction = !isEditing ? (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 transition hover:border-accent hover:text-accent dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200"
    >
      <Pencil className="h-3.5 w-3.5" />
      {t("profilePage.profileTab.editBtn")}
    </button>
  ) : null;

  return (
    <SectionCard
      icon={UserIcon}
      title={t("profilePage.profileTab.personalInfo")}
      subtitle={t("profilePage.profileTab.manageDesc")}
      action={editAction}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Avatar */}
        <div className="flex flex-col items-start gap-4 border-b border-gray-200 pb-5 dark:border-slate-700 sm:flex-row sm:items-center sm:gap-6">
          <div className="relative flex-shrink-0">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-accent to-accent-600">
              {currentAvatar ? (
                <Image
                  key={currentAvatar}
                  src={`${currentAvatar}?t=${Date.now()}`}
                  alt={user.username || "User"}
                  width={80}
                  height={80}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-2xl font-semibold text-white">
                  {user.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              disabled={isUploadingAvatar}
              className="hidden"
              id="avatar-upload-icon"
            />
            <label
              htmlFor="avatar-upload-icon"
              className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow-md transition hover:bg-accent-600 dark:border-slate-800 ${
                isUploadingAvatar ? "cursor-not-allowed opacity-50" : "cursor-pointer"
              }`}
            >
              {isUploadingAvatar ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Camera className="h-3.5 w-3.5" />
              )}
            </label>
          </div>

          <div className="min-w-0 flex-1">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              {t("profilePage.profileTab.avatarLabel")}
            </h4>
            <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
              {t("profilePage.profileTab.avatarTip1")}
            </p>
            <p className="text-[11px] text-gray-400 dark:text-gray-500">
              {t("profilePage.profileTab.avatarTip2")}
            </p>
          </div>
        </div>

        {/* Fields */}
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label={t("profilePage.profileTab.username")}
              value={formData.username}
              disabled={!isEditing}
              onChange={(v) => setFormData({ ...formData, username: v })}
            />
            <FormField
              label={t("profilePage.profileTab.email")}
              value={formData.email}
              disabled
              type="email"
              onChange={() => {}}
            />
          </div>
          <FormField
            label={t("profilePage.profileTab.university")}
            value={formData.university}
            disabled={!isEditing}
            placeholder={t("profilePage.profileTab.universityPlaceholder")}
            onChange={(v) => setFormData({ ...formData, university: v })}
          />
        </div>

        {isEditing && (
          <div className="flex flex-col-reverse items-stretch gap-2 border-t border-gray-200 pt-5 dark:border-slate-700 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-gray-300 hover:bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-gray-200 dark:hover:bg-slate-700"
            >
              {t("profilePage.profileTab.cancelBtn")}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accent-600 disabled:opacity-50"
            >
              {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              {isSaving
                ? t("profilePage.profileTab.savingBtn")
                : t("profilePage.profileTab.saveBtn")}
            </button>
          </div>
        )}
      </form>
    </SectionCard>
  );
}

interface FormFieldProps {
  label: string;
  value: string;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  onChange: (v: string) => void;
}

function FormField({
  label,
  value,
  disabled,
  placeholder,
  type = "text",
  onChange,
}: FormFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800 dark:disabled:text-gray-400"
      />
    </div>
  );
}
