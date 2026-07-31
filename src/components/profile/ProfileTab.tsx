"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import {
  Camera,
  Loader2,
  Pencil,
  User as UserIcon,
  Code2,
  Globe,
  Briefcase,
  X,
  Plus,
  Check,
  Sparkles,
} from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import { ProfileDetailResponse, ExperienceLevel } from "@/types/user";
import { userApi } from "@/services/user.service";
import { useI18n } from "@/contexts/I18nContext";
import SectionCard from "./SectionCard";
import CustomSelect, { CustomSelectOption } from "@/components/common/CustomSelect";

const JAVA_SUGGESTED_SKILLS = [
  "Java",
  "Spring Boot",
  "Spring Security",
  "Spring Data JPA",
  "Hibernate",
  "Microservices",
  "MySQL",
  "PostgreSQL",
  "MongoDB",
  "Redis",
  "Apache Kafka",
  "RabbitMQ",
  "Docker",
  "Kubernetes",
  "RESTful API",
  "gRPC",
  "Maven",
  "Gradle",
  "JUnit",
  "Mockito",
  "CI/CD",
  "AWS",
];

const EXPERIENCE_LEVEL_OPTIONS: CustomSelectOption<ExperienceLevel>[] = [
  { value: ExperienceLevel.INTERN, label: "Intern (Thực tập sinh)", description: "Đang học hoặc mới bắt đầu" },
  { value: ExperienceLevel.FRESHER, label: "Fresher (Mới tốt nghiệp)", description: "Dưới 1 năm kinh nghiệm" },
  { value: ExperienceLevel.JUNIOR, label: "Junior (1-2 năm)", description: "Nắm vững căn bản, làm việc độc lập" },
  { value: ExperienceLevel.MIDDLE, label: "Middle (2-4 năm)", description: "Kinh nghiệm thực chiến phong phú" },
  { value: ExperienceLevel.SENIOR, label: "Senior (5+ năm)", description: "Chuyên gia, giải quyết bài toán khó" },
  { value: ExperienceLevel.LEAD, label: "Tech Lead", description: "Dẫn dắt kỹ thuật, định hướng team" },
  { value: ExperienceLevel.ARCHITECT, label: "Software Architect", description: "Thiết kế kiến trúc hệ thống tổng thể" },
];

interface ProfileTabProps {
  user: ProfileDetailResponse;
  onSave?: (data: Partial<ProfileDetailResponse>) => Promise<void>;
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
  const [skillInput, setSkillInput] = useState("");

  const [formData, setFormData] = useState({
    username: user.username || "",
    email: user.email || "",
    university: user.university || "",
    specialization: user.specialization || "",
    headline: user.headline || "",
    bio: user.bio || "",
    experienceLevel: user.experienceLevel || undefined,
    skills: user.skills ? Array.from(user.skills) : [],
    githubUrl: user.githubUrl || "",
    linkedinUrl: user.linkedinUrl || "",
    websiteUrl: user.websiteUrl || "",
  });

  useEffect(() => {
    setCurrentAvatar(user.avatar || "");
  }, [user.avatar]);



  const handleAddSkill = () => {
    const trimmed = skillInput.trim();
    if (!trimmed) return;
    if (formData.skills.includes(trimmed)) {
      toast.error("Kỹ năng này đã tồn tại!");
      return;
    }
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, trimmed] }));
    setSkillInput("");
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((s) => s !== skillToRemove),
    }));
  };

  const handleToggleSuggestedSkill = (skill: string) => {
    if (!isEditing) return;
    if (formData.skills.includes(skill)) {
      handleRemoveSkill(skill);
    } else {
      setFormData((prev) => ({ ...prev, skills: [...prev.skills, skill] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const payload = {
        username: formData.username,
        university: formData.university,
        specialization: formData.specialization,
        headline: formData.headline,
        bio: formData.bio,
        experienceLevel: formData.experienceLevel,
        skills: formData.skills,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        websiteUrl: formData.websiteUrl,
      };

      await userApi.updateProfile(payload);
      if (onSave) {
        await onSave(payload);
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
      specialization: user.specialization || "",
      headline: user.headline || "",
      bio: user.bio || "",
      experienceLevel: user.experienceLevel || undefined,
      skills: user.skills ? Array.from(user.skills) : [],
      githubUrl: user.githubUrl || "",
      linkedinUrl: user.linkedinUrl || "",
      websiteUrl: user.websiteUrl || "",
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
      subtitle="Quản lý hồ sơ lập trình viên và thông tin cá nhân của bạn"
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
              className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-accent text-white shadow-md transition hover:bg-accent-600 dark:border-slate-800 ${isUploadingAvatar ? "cursor-not-allowed opacity-50" : "cursor-pointer"
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

        {/* Basic Info */}
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-accent">
            Thông tin cơ bản
          </h3>
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
              onChange={() => { }}
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

        {/* Developer Info Section */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
            <Briefcase className="h-4 w-4" />
            Hồ sơ Lập trình viên
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <FormField
              label="Chuyên ngành / Vị trí"
              value={formData.specialization}
              disabled={!isEditing}
              placeholder="VD: Backend Developer, Fullstack Engineer..."
              onChange={(v) => setFormData({ ...formData, specialization: v })}
            />

            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Trình độ Kinh nghiệm
              </label>
              <CustomSelect<ExperienceLevel>
                disabled={!isEditing}
                value={formData.experienceLevel}
                onChange={(val) =>
                  setFormData({
                    ...formData,
                    experienceLevel: val,
                  })
                }
                options={EXPERIENCE_LEVEL_OPTIONS}
                placeholder="-- Chọn cấp độ --"
              />
            </div>
          </div>

          <FormField
            label="Chức danh hiển thị (Headline)"
            value={formData.headline}
            disabled={!isEditing}
            placeholder="VD: Senior Java Backend Engineer @ JavaBuilder"
            onChange={(v) => setFormData({ ...formData, headline: v })}
          />

          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Giới thiệu bản thân (Bio)
            </label>
            <textarea
              rows={3}
              disabled={!isEditing}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              placeholder="Viết một đoạn giới thiệu ngắn về kinh nghiệm, định hướng phát triển của bạn..."
              className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
            />
          </div>

          {/* Tech Stack / Skills */}
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Kỹ năng / Tech Stack
            </label>

            {isEditing && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddSkill();
                    }
                  }}
                  placeholder="Nhập kỹ năng khác (VD: GraphQL, AWS...) rồi nhấn Enter..."
                  className="block flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-900 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 dark:border-slate-600 dark:bg-slate-700 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="inline-flex items-center gap-1 rounded-lg bg-accent px-3 py-1.5 text-xs font-semibold text-white hover:bg-accent-600 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  Thêm
                </button>
              </div>
            )}

            {/* Selected Skills Container */}
            <div className="mb-3 flex flex-wrap gap-2 min-h-[42px] p-2.5 rounded-xl border border-gray-200 bg-gray-50 dark:border-slate-700 dark:bg-slate-800/60 items-center">
              {formData.skills.length === 0 ? (
                <span className="text-xs text-gray-400 italic px-1">Chưa chọn kỹ năng nào</span>
              ) : (
                formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-accent/15 text-accent border border-accent/20 dark:bg-accent/25 dark:text-accent-300"
                  >
                    <Code2 className="h-3.5 w-3.5" />
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-0.5 rounded p-0.5 hover:bg-rose-500/20 hover:text-rose-500 transition"
                        title="Xóa"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))
              )}
            </div>

            {/* Java Developer Tech Stack Suggestions */}
            {isEditing && (
              <div className="rounded-xl border border-gray-200/80 bg-white p-3.5 dark:border-slate-700 dark:bg-slate-800/40">
                <div className="mb-2.5 flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                  <span>Gợi ý Tech Stack Java (bấm để thêm/xóa nhanh):</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {JAVA_SUGGESTED_SKILLS.map((skill) => {
                    const isSelected = formData.skills.includes(skill);
                    return (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => handleToggleSuggestedSkill(skill)}
                        className={`inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                          isSelected
                            ? "bg-accent/20 text-accent border border-accent/40 font-semibold shadow-xs"
                            : "border border-gray-200 bg-gray-50/80 text-gray-700 hover:border-accent/50 hover:bg-accent/10 hover:text-accent dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-accent/50 dark:hover:bg-accent/20"
                        }`}
                      >
                        {isSelected ? (
                          <Check className="h-3 w-3 text-accent" />
                        ) : (
                          <Plus className="h-3 w-3 text-gray-400" />
                        )}
                        {skill}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Social / Portfolio Links Section */}
        <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-slate-700">
          <h3 className="text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
            <Globe className="h-4 w-4" />
            Liên kết Developer & Portfolio
          </h3>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <Github className="h-3.5 w-3.5" />
                GitHub URL
              </label>
              <input
                type="url"
                disabled={!isEditing}
                value={formData.githubUrl}
                onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                placeholder="https://github.com/username"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn URL
              </label>
              <input
                type="url"
                disabled={!isEditing}
                value={formData.linkedinUrl}
                onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/username"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
              />
            </div>

            <div>
              <label className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                <Globe className="h-3.5 w-3.5" />
                Website / Portfolio
              </label>
              <input
                type="url"
                disabled={!isEditing}
                value={formData.websiteUrl}
                onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })}
                placeholder="https://yourportfolio.dev"
                className="block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 transition focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-500 dark:border-slate-600 dark:bg-slate-700 dark:text-white dark:disabled:bg-slate-800"
              />
            </div>
          </div>
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
  hint?: string;
  onChange: (v: string) => void;
}

function FormField({
  label,
  value,
  disabled,
  placeholder,
  type = "text",
  hint,
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
      {hint && (
        <p className="mt-1 text-[11px] text-gray-500 dark:text-gray-400">
          {hint}
        </p>
      )}
    </div>
  );
}
