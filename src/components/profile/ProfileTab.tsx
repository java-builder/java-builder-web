"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import {
  Loader2,
  Pencil,
  Globe,
  ExternalLink,
  X,
  Plus,
  Check,
} from "lucide-react";
import { FaGithub as Github, FaLinkedin as Linkedin } from "react-icons/fa";
import { ProfileDetailResponse, ExperienceLevel } from "@/types/user";
import { userApi } from "@/services/user.service";
import { useI18n } from "@/contexts/I18nContext";
import SectionCard from "./SectionCard";
import CustomSelect, { CustomSelectOption } from "@/components/ui/select";

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
  {
    value: ExperienceLevel.INTERN,
    label: "Intern (Thực tập sinh)",
    description: "Đang học hoặc mới bắt đầu",
  },
  {
    value: ExperienceLevel.FRESHER,
    label: "Fresher (Mới tốt nghiệp)",
    description: "Dưới 1 năm kinh nghiệm",
  },
  {
    value: ExperienceLevel.JUNIOR,
    label: "Junior (1-2 năm)",
    description: "Nắm vững căn bản, làm việc độc lập",
  },
  {
    value: ExperienceLevel.MIDDLE,
    label: "Middle (2-4 năm)",
    description: "Kinh nghiệm thực chiến phong phú",
  },
  {
    value: ExperienceLevel.SENIOR,
    label: "Senior (5+ năm)",
    description: "Chuyên gia, giải quyết bài toán khó",
  },
  {
    value: ExperienceLevel.LEAD,
    label: "Tech Lead",
    description: "Dẫn dắt kỹ thuật, định hướng team",
  },
  {
    value: ExperienceLevel.ARCHITECT,
    label: "Software Architect",
    description: "Thiết kế kiến trúc hệ thống tổng thể",
  },
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

  const experienceLabel =
    EXPERIENCE_LEVEL_OPTIONS.find((o) => o.value === formData.experienceLevel)
      ?.label || formData.experienceLevel;

  const editAction = !isEditing ? (
    <button
      type="button"
      onClick={() => setIsEditing(true)}
      className="inline-flex items-center gap-1.5 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] px-4 py-1.5 text-xs font-semibold text-white transition active:scale-95 shadow-xs"
    >
      <Pencil className="h-3.5 w-3.5" />
      {t("profilePage.profileTab.editBtn")}
    </button>
  ) : (
    <button
      type="button"
      onClick={handleCancel}
      className="inline-flex items-center gap-1.5 rounded-full border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-3.5 py-1.5 text-xs font-semibold text-muted-foreground hover:text-[#171717] dark:hover:text-foreground transition active:scale-95"
    >
      <X className="h-3.5 w-3.5" />
      {t("profilePage.profileTab.cancelBtn")}
    </button>
  );

  return (
    <SectionCard
      title={t("profilePage.profileTab.personalInfo")}
      subtitle="Quản lý hồ sơ lập trình viên và thông tin cá nhân của bạn"
      action={editAction}
    >
      <form onSubmit={handleSubmit} className="space-y-7">
        {/* 1. Thông tin chung & Chuyên môn (Unified Grid in both View & Edit modes) */}
        <div>
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Thông tin chung & Chuyên môn
          </h3>
          <div className="rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface divide-y divide-[#E8E8E8] dark:divide-border">
            {/* Row 1: Username | Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E8E8] dark:divide-border">
              <EditableSpecCell
                label={t("profilePage.profileTab.username")}
                value={formData.username}
                isEditing={isEditing}
                placeholder="Nhập tên hiển thị"
                onChange={(v) => setFormData({ ...formData, username: v })}
              />
              <EditableSpecCell
                label={t("profilePage.profileTab.email")}
                value={formData.email}
                isEditing={isEditing}
                disabled
                type="email"
              />
            </div>

            {/* Row 2: Specialization | Experience Level */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E8E8] dark:divide-border">
              <EditableSpecCell
                label="Chuyên ngành / Vị trí"
                value={formData.specialization}
                isEditing={isEditing}
                placeholder="VD: Java Backend Developer..."
                onChange={(v) =>
                  setFormData({ ...formData, specialization: v })
                }
              />
              <div className="px-4 py-3.5">
                <dt className="text-xs font-medium text-muted-foreground">
                  Trình độ kinh nghiệm
                </dt>
                <dd className="mt-1.5">
                  {isEditing ? (
                    <CustomSelect<ExperienceLevel>
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
                  ) : experienceLabel ? (
                    <span className="inline-flex items-center rounded-md bg-[#FF5A1F]/10 px-2 py-0.5 text-xs font-semibold text-[#FF5A1F]">
                      {experienceLabel}
                    </span>
                  ) : (
                    <span className="text-sm text-muted-foreground/60">
                      Chưa cập nhật
                    </span>
                  )}
                </dd>
              </div>
            </div>

            {/* Row 3: University | Headline */}
            <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[#E8E8E8] dark:divide-border">
              <EditableSpecCell
                label={t("profilePage.profileTab.university")}
                value={formData.university}
                isEditing={isEditing}
                placeholder={t("profilePage.profileTab.universityPlaceholder")}
                onChange={(v) => setFormData({ ...formData, university: v })}
              />
              <EditableSpecCell
                label="Chức danh hiển thị (Headline)"
                value={formData.headline}
                isEditing={isEditing}
                placeholder="VD: Senior Java Backend Engineer"
                onChange={(v) => setFormData({ ...formData, headline: v })}
              />
            </div>
          </div>
        </div>

        {/* 2. Giới thiệu bản thân (Bio) */}
        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Giới thiệu bản thân
          </h3>
          {isEditing ? (
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) =>
                setFormData({ ...formData, bio: e.target.value })
              }
              placeholder="Viết một đoạn giới thiệu ngắn về kinh nghiệm, định hướng phát triển của bạn..."
              className="block w-full rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-4 py-3 text-sm text-[#171717] dark:text-foreground transition focus:border-[#FF5A1F] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/15"
            />
          ) : (
            <div className="rounded-xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8]/40 dark:bg-muted/10 px-4 py-3.5">
              {formData.bio ? (
                <p className="whitespace-pre-line text-sm leading-relaxed text-[#171717] dark:text-foreground">
                  {formData.bio}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground/60">
                  Chưa có giới thiệu bản thân.
                </p>
              )}
            </div>
          )}
        </div>

        {/* 3. Kỹ năng & Tech Stack */}
        <div>
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kỹ năng & Tech Stack
            </h3>
            {formData.skills.length > 0 && (
              <span className="text-xs text-muted-foreground">
                {formData.skills.length} kỹ năng
              </span>
            )}
          </div>

          <div className="rounded-xl border border-[#E8E8E8] dark:border-border bg-[#F8F8F8]/40 dark:bg-muted/10 p-4 space-y-3.5">
            {formData.skills.length === 0 ? (
              <p className="text-sm text-muted-foreground/60">
                Chưa cập nhật kỹ năng công nghệ.
              </p>
            ) : (
              <div className="flex flex-wrap gap-2">
                {formData.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-3 py-1.5 text-xs font-semibold text-[#171717] dark:text-foreground"
                  >
                    {skill}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="ml-0.5 rounded-full p-0.5 text-muted-foreground hover:bg-rose-500/15 hover:text-rose-500 transition"
                        title="Xóa"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </span>
                ))}
              </div>
            )}

            {isEditing && (
              <div className="pt-3 border-t border-[#E8E8E8] dark:border-border space-y-3">
                <div className="flex gap-2">
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
                    className="block flex-1 rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-3.5 py-2 text-sm text-[#171717] dark:text-foreground focus:border-[#FF5A1F] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/15"
                  />
                  <button
                    type="button"
                    onClick={handleAddSkill}
                    className="inline-flex items-center gap-1 rounded-xl bg-[#FF5A1F] hover:bg-[#e04b16] active:scale-95 px-4 py-2 text-xs font-semibold text-white transition shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Thêm
                  </button>
                </div>

                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Gợi ý chọn nhanh:
                  </p>
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
                              ? "bg-[#FF5A1F]/10 text-[#FF5A1F] border border-[#FF5A1F]/30 font-semibold"
                              : "border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface text-muted-foreground hover:border-[#FF5A1F]/30 hover:text-[#171717] dark:hover:text-foreground"
                          }`}
                        >
                          {isSelected ? (
                            <Check className="h-3 w-3 text-[#FF5A1F]" />
                          ) : (
                            <Plus className="h-3 w-3 text-muted-foreground" />
                          )}
                          {skill}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 4. Liên kết & Portfolio (Unified Rows in both View & Edit modes) */}
        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Liên kết & Portfolio
          </h3>
          <div className="overflow-hidden rounded-xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface divide-y divide-[#E8E8E8] dark:divide-border">
            <EditableSocialRow
              icon={Github}
              label="GitHub"
              url={formData.githubUrl}
              isEditing={isEditing}
              placeholder="https://github.com/username"
              onChange={(v) => setFormData({ ...formData, githubUrl: v })}
            />
            <EditableSocialRow
              icon={Linkedin}
              label="LinkedIn"
              url={formData.linkedinUrl}
              isEditing={isEditing}
              placeholder="https://linkedin.com/in/username"
              onChange={(v) => setFormData({ ...formData, linkedinUrl: v })}
            />
            <EditableSocialRow
              icon={Globe}
              label="Website / Portfolio"
              url={formData.websiteUrl}
              isEditing={isEditing}
              placeholder="https://yourportfolio.dev"
              onChange={(v) => setFormData({ ...formData, websiteUrl: v })}
            />
          </div>
        </div>

        {/* Save / Cancel Footer when editing */}
        {isEditing && (
          <div className="flex flex-col-reverse items-stretch gap-2.5 border-t border-[#E8E8E8] dark:border-border pt-5 sm:flex-row sm:items-center sm:justify-end">
            <button
              type="button"
              onClick={handleCancel}
              className="inline-flex items-center justify-center rounded-full border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-5 py-2 text-sm font-semibold text-[#171717] dark:text-foreground transition hover:bg-[#F8F8F8] dark:hover:bg-muted/30 active:scale-95"
            >
              {t("profilePage.profileTab.cancelBtn")}
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#FF5A1F] hover:bg-[#e04b16] active:scale-95 px-6 py-2 text-sm font-semibold text-white transition disabled:opacity-50 shadow-xs"
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

interface EditableSpecCellProps {
  label: string;
  value?: string;
  isEditing: boolean;
  disabled?: boolean;
  placeholder?: string;
  type?: string;
  emptyText?: string;
  onChange?: (v: string) => void;
}

function EditableSpecCell({
  label,
  value,
  isEditing,
  disabled,
  placeholder,
  type = "text",
  emptyText = "Chưa cập nhật",
  onChange,
}: EditableSpecCellProps) {
  return (
    <div className="px-4 py-3.5">
      <dt className="text-xs font-medium text-muted-foreground">{label}</dt>
      <dd className="mt-1.5">
        {isEditing ? (
          <input
            type={type}
            value={value || ""}
            disabled={disabled}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            className="block w-full rounded-lg border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-3 py-1.5 text-sm text-[#171717] dark:text-foreground transition focus:border-[#FF5A1F] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/15 disabled:cursor-not-allowed disabled:bg-[#F8F8F8] disabled:text-muted-foreground dark:disabled:bg-muted/20"
          />
        ) : value ? (
          <span className="block truncate text-sm font-semibold text-[#171717] dark:text-foreground">
            {value}
          </span>
        ) : (
          <span className="text-sm text-muted-foreground/60">{emptyText}</span>
        )}
      </dd>
    </div>
  );
}

interface EditableSocialRowProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  url?: string;
  isEditing: boolean;
  placeholder?: string;
  onChange: (v: string) => void;
}

function EditableSocialRow({
  icon: Icon,
  label,
  url,
  isEditing,
  placeholder,
  onChange,
}: EditableSocialRowProps) {
  return (
    <div className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
      <div className="flex items-center gap-2.5 text-sm font-medium text-[#171717] dark:text-foreground shrink-0">
        <Icon className="h-4 w-4 text-muted-foreground" />
        <span>{label}</span>
      </div>
      {isEditing ? (
        <input
          type="url"
          value={url || ""}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="block w-full sm:max-w-sm rounded-lg border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface px-3 py-1.5 text-sm text-[#171717] dark:text-foreground transition focus:border-[#FF5A1F] focus:outline-none focus:ring-2 focus:ring-[#FF5A1F]/15"
        />
      ) : url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 truncate text-sm font-medium text-[#FF5A1F] hover:underline"
        >
          <span className="truncate max-w-[240px] sm:max-w-[320px]">
            {url.replace(/^https?:\/\/(www\.)?/, "")}
          </span>
          <ExternalLink className="h-3.5 w-3.5 flex-shrink-0" />
        </a>
      ) : (
        <span className="text-sm text-muted-foreground/60">Chưa liên kết</span>
      )}
    </div>
  );
}
