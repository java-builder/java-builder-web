"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { userApi } from "@/services/user.service";
import { emailSchedulerService } from "@/services/email-scheduler.service";
import { emailTemplateService } from "@/services/email-template.service";
import { ScheduleEmailRequest, RecipientType, EmailEventType } from "@/types/email-scheduler";
import { UserDetailResponse } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";
import { TEMPLATE_LIST } from "./emailTemplates";

export type CampaignMode = "template" | "custom";
export type ActiveTab = "mode" | "content" | "audience" | "schedule";
export type PreviewMode = "desktop" | "mobile";
export type TargetSegment = "all" | "premium" | "inactive" | "custom";
export type Priority = "HIGH" | "NORMAL" | "LOW";

export interface CampaignTemplateConfig {
  id: string;
  name: string;
  emoji: string;
  subject: string;
  preheader: string;
  customVars: string[];
  htmlContent: string;
  textContent: string;
}

export const SYSTEM_VARS: Record<string, string> = {
  username: "Nguyễn Văn A",
  email: "nguyenvana@gmail.com",
};

const DEFAULT_BLANK_TEMPLATE: CampaignTemplateConfig = {
  id: "empty",
  name: "Soạn email mới",
  emoji: "✍️",
  subject: "",
  preheader: "",
  customVars: [],
  htmlContent: `<div style="font-family: 'Inter', system-ui, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px 24px; background: #ffffff; border-radius: 12px; border: 1px solid #e2e8f0; color: #1e293b;">
  <h2 style="color: #0f172a; margin-top: 0;">Xin chào {{username}}! 👋</h2>
  <p style="color: #475569; line-height: 1.6; font-size: 15px;">
    Bắt đầu soạn thảo thông điệp của bạn tại đây...
  </p>
  <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
  <p style="color: #94a3b8; font-size: 12px; margin: 0; text-align: center;">
    © 2026 JavaBuilder Online. Mọi quyền được bảo lưu.
  </p>
</div>`,
  textContent: "",
};

const BUILT_IN_FALLBACK_TEMPLATES: CampaignTemplateConfig[] = TEMPLATE_LIST
  .filter((t) => t.id !== "empty")
  .map((t) => ({
    id: t.id === "promotion" ? "PROMOTION"
      : t.id === "system-alert" ? "MAINTENANCE_ALERT"
      : t.id === "re-engage" ? "RE_ENGAGEMENT"
      : t.id === "new-course" ? "NEW_COURSE_ANNOUNCEMENT"
      : t.id === "thank-you" ? "APPRECIATION"
      : t.id,
    name: t.name,
    emoji: t.emoji,
    subject: t.subject,
    preheader: t.preheader,
    customVars: t.customVars,
    htmlContent: t.build({}),
    textContent: "",
  }));

const getEmojiForTemplate = (name: string): string => {
  const upper = name.toUpperCase();
  if (upper.includes("PROMOTION")) return "🎁";
  if (upper.includes("MAINTENANCE") || upper.includes("ALERT")) return "🚨";
  if (upper.includes("COURSE")) return "🆕";
  if (upper.includes("ENGAGE")) return "📚";
  if (upper.includes("APPRECIATION") || upper.includes("THANK")) return "🙏";
  return "✉️";
};

export function useEmailCampaign() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("mode");
  const [campaignMode, setCampaignMode] = useState<CampaignMode | null>(null);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");

  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [senderName, setSenderName] = useState("JavaBuilder");
  const [senderEmail, setSenderEmail] = useState("noreply@javabuilder.online");
  const [replyTo, setReplyTo] = useState("javabuilder.platform@gmail.com");

  const [content, setContent] = useState("");
  const [customVarValues, setCustomVarValues] = useState<Record<string, string>>({});

  const [campaignTemplates, setCampaignTemplates] = useState<CampaignTemplateConfig[]>(BUILT_IN_FALLBACK_TEMPLATES);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // Fetch all templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const res = await emailTemplateService.getAllEmailTemplates();
        if (res.data && res.data.length > 0) {
          const apiTemplates: CampaignTemplateConfig[] = res.data.map((tpl) => {
            const matches = tpl.htmlContent.match(/\{\{(\w+)\}\}/g) ?? tpl.htmlContent.match(/\{(\w+)\}/g) ?? [];
            const vars = [...new Set(matches.map((m) => m.replace(/[{}]/g, "")))].filter(
              (v) => v !== "username" && v !== "email"
            );

            return {
              id: tpl.templateName,
              name: tpl.templateName,
              emoji: getEmojiForTemplate(tpl.templateName),
              subject: tpl.subject,
              preheader: tpl.subject,
              customVars: vars,
              htmlContent: tpl.htmlContent,
              textContent: tpl.textContent,
            };
          });
          setCampaignTemplates(apiTemplates);
        } else {
          setCampaignTemplates(BUILT_IN_FALLBACK_TEMPLATES);
        }
      } catch (e) {
        console.error("Failed to fetch templates for campaign", e);
        setCampaignTemplates(BUILT_IN_FALLBACK_TEMPLATES);
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  const currentTemplateCfg = useMemo(
    () => campaignTemplates.find((t) => t.id === selectedTemplate) || DEFAULT_BLANK_TEMPLATE,
    [campaignTemplates, selectedTemplate]
  );

  const systemVarsDetected = useMemo(() => {
    const matches = content.match(/\{(\w+)\}/g) ?? content.match(/\{\{(\w+)\}\}/g) ?? [];
    const all = [...new Set(matches.map((m) => m.replace(/[{}]/g, "")))];
    return all.filter((v) => v in SYSTEM_VARS);
  }, [content]);

  const [targetSegment, setTargetSegment] = useState<TargetSegment>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [selectedUsersDetails, setSelectedUsersDetails] = useState<UserDetailResponse[]>([]);
  const [users, setUsers] = useState<UserDetailResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const [scheduleType, setScheduleType] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [priority, setPriority] = useState<Priority>("NORMAL");
  const [isSending, setIsSending] = useState(false);

  const loadUsers = useCallback(async () => {
    if (!debouncedSearchQuery.trim()) { setUsers([]); setIsLoadingUsers(false); return; }
    setIsLoadingUsers(true);
    try {
      const res = await userApi.search({ page: 1, search: debouncedSearchQuery.trim() });
      setUsers(res.data?.data || []);
    } catch {
      const mock = [
        { id: "1", username: "alex_java",    email: "alex.java@gmail.com",        active: true, userStatus: "ACTIVE", mftEnable: false, createdAt: new Date().toISOString() },
        { id: "2", username: "tranthib",     email: "b.tranthi@outlook.com",      active: true, userStatus: "ACTIVE", mftEnable: false, createdAt: new Date().toISOString() },
        { id: "3", username: "mentor_duc",   email: "duc.le@javabuilder.online",  active: true, userStatus: "ACTIVE", mftEnable: false, createdAt: new Date().toISOString() },
        { id: "4", username: "premium_user", email: "premium.dev@gmail.com",      active: true, userStatus: "ACTIVE", mftEnable: false, createdAt: new Date().toISOString() },
      ] as unknown as UserDetailResponse[];
      const q = debouncedSearchQuery.toLowerCase();
      setUsers(mock.filter((u) => u.username.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)));
    } finally {
      setIsLoadingUsers(false);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  const handleUserSelect = (userId: string) => {
    const isSelected = selectedUsers.includes(userId);
    if (isSelected) {
      setSelectedUsers((prev) => prev.filter((id) => id !== userId));
      setSelectedUsersDetails((prev) => prev.filter((u) => u.id !== userId));
    } else {
      const userObj = users.find((u) => u.id === userId);
      setSelectedUsers((prev) => [...prev, userId]);
      if (userObj) {
        setSelectedUsersDetails((prev) => {
          if (prev.some((u) => u.id === userId)) return prev;
          return [...prev, userObj];
        });
      }
    }
  };

  const handleSelectAll = () => {
    if (!searchQuery.trim()) {
      setSelectedUsers([]);
      setSelectedUsersDetails([]);
      return;
    }
    const currentSearchIds = users.map((u) => u.id);
    const allCurrentSelected = currentSearchIds.every((id) => selectedUsers.includes(id));

    if (allCurrentSelected) {
      setSelectedUsers((prev) => prev.filter((id) => !currentSearchIds.includes(id)));
      setSelectedUsersDetails((prev) => prev.filter((u) => !currentSearchIds.includes(u.id)));
    } else {
      const toSelect = users.filter((u) => !selectedUsers.includes(u.id));
      setSelectedUsers((prev) => [...prev, ...toSelect.map((u) => u.id)]);
      setSelectedUsersDetails((prev) => {
        const filteredPrev = prev.filter((u) => !toSelect.some((ts) => ts.id === u.id));
        return [...filteredPrev, ...toSelect];
      });
    }
  };

  const handleSelectMode = (mode: CampaignMode) => {
    setCampaignMode(mode);
    if (mode === "custom") {
      setSelectedTemplate("empty");
      setSubject("");
      setPreheader("");
      setContent(DEFAULT_BLANK_TEMPLATE.htmlContent);
      setCustomVarValues({});
    } else {
      if (selectedTemplate === "empty") {
        setSelectedTemplate("");
      }
    }
  };

  const handleTemplateChange = (id: string) => {
    const cfg = campaignTemplates.find((t) => t.id === id) || DEFAULT_BLANK_TEMPLATE;
    setSelectedTemplate(id);
    setCampaignMode("template");
    setSubject(cfg.subject);
    setPreheader(cfg.preheader);
    const initVars: Record<string, string> = {};
    cfg.customVars.forEach((v) => { initVars[v] = ""; });
    setCustomVarValues(initVars);
    setContent(cfg.htmlContent);
  };

  const selectCustomAndProceed = () => {
    setCampaignMode("custom");
    setSelectedTemplate("empty");
    setSubject("");
    setPreheader("");
    setContent(DEFAULT_BLANK_TEMPLATE.htmlContent);
    setCustomVarValues({});
    setActiveTab("content");
  };

  const selectTemplateAndProceed = (templateId: string) => {
    const cfg = campaignTemplates.find((t) => t.id === templateId) || DEFAULT_BLANK_TEMPLATE;
    setSelectedTemplate(templateId);
    setCampaignMode("template");
    setSubject(cfg.subject);
    setPreheader(cfg.preheader);
    const initVars: Record<string, string> = {};
    cfg.customVars.forEach((v) => { initVars[v] = ""; });
    setCustomVarValues(initVars);
    setContent(cfg.htmlContent);
    setActiveTab("content");
  };

  const handleCustomVarChange = (varName: string, value: string) => {
    const next = { ...customVarValues, [varName]: value };
    setCustomVarValues(next);
  };

  const insertTag = (tag: string) => {
    setContent((prev) => prev + ` ${tag} `);
    toast.success(`Đã thêm thẻ ${tag}`);
  };

  const previewHtml = useMemo(() => {
    if (!content) return "<p style='color:#94a3b8; text-align:center; padding: 40px;'>Nội dung thư rỗng</p>";
    let html = content;
    Object.entries(SYSTEM_VARS).forEach(([k, v]) => {
      html = html.replaceAll(`{{${k}}}`, v).replaceAll(`{${k}}`, v);
    });
    Object.entries(customVarValues).forEach(([k, v]) => {
      html = html.replaceAll(`{{${k}}}`, v || `[${k}]`).replaceAll(`{${k}}`, v || `[${k}]`);
    });
    return html;
  }, [content, customVarValues]);

  // Validation guards
  const isModeValid = Boolean(
    campaignMode &&
    (campaignMode === "custom" || (campaignMode === "template" && selectedTemplate && selectedTemplate !== "empty"))
  );

  const isContentValid = Boolean(
    isModeValid &&
    subject.trim().length > 0 &&
    (campaignMode === "template"
      ? currentTemplateCfg.customVars.every((v) => Boolean(customVarValues[v]?.trim()))
      : content.trim().length > 0)
  );

  const isAudienceValid = Boolean(
    isContentValid &&
    (targetSegment !== "custom" || selectedUsers.length > 0)
  );

  const canAccessTab = useCallback(
    (tab: ActiveTab): boolean => {
      if (tab === "mode") return true;
      if (tab === "content") return isModeValid;
      if (tab === "audience") return isModeValid && isContentValid;
      if (tab === "schedule") return isModeValid && isContentValid && isAudienceValid;
      return false;
    },
    [isModeValid, isContentValid, isAudienceValid]
  );

  const handleNextFromMode = () => {
    if (!campaignMode) {
      toast.error("Vui lòng chọn 1 trong 2 hình thức gửi email.");
      return;
    }
    if (campaignMode === "template" && (!selectedTemplate || selectedTemplate === "empty")) {
      toast.error("Vui lòng chọn một mẫu email trong danh sách.");
      return;
    }
    setActiveTab("content");
  };

  const handleNextFromContent = () => {
    if (!subject.trim()) {
      toast.error("Vui lòng nhập tiêu đề email.");
      return;
    }
    if (campaignMode === "custom" && !content.trim()) {
      toast.error("Vui lòng soạn nội dung email.");
      return;
    }
    if (campaignMode === "template") {
      const unfilled = currentTemplateCfg.customVars.filter((v) => !customVarValues[v]?.trim());
      if (unfilled.length > 0) {
        toast.error(`Vui lòng điền đầy đủ các biến: ${unfilled.map((v) => `{${v}}`).join(", ")}`);
        return;
      }
    }
    setActiveTab("audience");
  };

  const handleNextFromAudience = () => {
    if (targetSegment === "custom" && selectedUsers.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người nhận.");
      return;
    }
    setActiveTab("schedule");
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!campaignMode) {
      toast.error("Vui lòng chọn hình thức gửi email.");
      setActiveTab("mode");
      return;
    }
    if (campaignMode === "template" && (!selectedTemplate || selectedTemplate === "empty")) {
      toast.error("Vui lòng chọn một mẫu email.");
      setActiveTab("mode");
      return;
    }
    if (!subject.trim()) {
      toast.error("Vui lòng nhập Tiêu đề Email.");
      setActiveTab("content");
      return;
    }
    if (campaignMode === "custom" && !content.trim()) {
      toast.error("Vui lòng soạn Thư nội dung.");
      setActiveTab("content");
      return;
    }
    if (targetSegment === "custom" && selectedUsers.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 người nhận.");
      setActiveTab("audience");
      return;
    }
    if (campaignMode === "template") {
      const unfilledCustom = currentTemplateCfg.customVars.filter((v) => !customVarValues[v]?.trim());
      if (unfilledCustom.length > 0) {
        toast.error(`Vui lòng điền đầy đủ: ${unfilledCustom.map((v) => `{${v}}`).join(", ")}`);
        setActiveTab("content");
        return;
      }
    }
    if (scheduleType === "schedule" && (!scheduleDate || !scheduleTime)) {
      toast.error("Vui lòng chọn ngày và giờ gửi.");
      setActiveTab("schedule");
      return;
    }

    const recipientType = targetSegment.toUpperCase() as RecipientType;
    const recipients = recipientType === "CUSTOM"
      ? selectedUsersDetails.filter((u) => selectedUsers.includes(u.id)).map((u) => u.email)
      : undefined;

    const scheduledTime = scheduleType === "schedule"
      ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
      : undefined;

    // Dynamically resolve event type based on template selection
    const toEmailEventType = (id: string): EmailEventType => {
      if (campaignMode === "custom") return "BROADCAST";
      switch (id) {
        case "PROMOTION":
        case "promotion":
          return "PROMOTION";
        case "MAINTENANCE_ALERT":
        case "system-alert":
          return "MAINTENANCE_ALERT";
        case "RE_ENGAGEMENT":
        case "re-engage":
          return "RE_ENGAGEMENT";
        case "NEW_COURSE_ANNOUNCEMENT":
        case "new-course":
          return "NEW_COURSE_ANNOUNCEMENT";
        case "APPRECIATION":
        case "thank-you":
          return "APPRECIATION";
        default:
          return "BROADCAST";
      }
    };
    const eventType = toEmailEventType(selectedTemplate);

    const payload: ScheduleEmailRequest = {
      jobLabel: (campaignMode === "custom" ? "broadcast" : (currentTemplateCfg.id || "broadcast")).replace(/_/g, "-"),
      subject: subject.trim(),
      type: eventType,
      htmlBody: eventType === "BROADCAST" ? content : undefined,
      summary: preheader.trim() || subject.trim(),
      nameSender: senderName,
      emailSender: senderEmail,
      recipientType,
      variables: Object.keys(customVarValues).length > 0 ? customVarValues : undefined,
      recipients,
      sendImmediately: scheduleType === "now",
      scheduledTime,
    };

    setIsSending(true);
    try {
      const res = await emailSchedulerService.scheduleBroadcast(payload);
      toast.success(res.message || "Chiến dịch đã được khởi chạy!");
    } catch (err) {
      const msg = (err as { response?: { data?: { message?: string } }; message?: string })
        .response?.data?.message
        ?? "Không thể gửi chiến dịch. Vui lòng thử lại.";
      toast.error(msg);
    } finally {
      setIsSending(false);
    }
  };

  return {
    activeTab, setActiveTab,
    campaignMode, handleSelectMode,
    previewMode, setPreviewMode,
    selectedTemplate,
    subject, setSubject,
    preheader, setPreheader,
    senderName, setSenderName,
    senderEmail, setSenderEmail,
    replyTo, setReplyTo,
    content, setContent,
    customVarValues,
    currentTemplateCfg,
    systemVarsDetected,
    campaignTemplates,
    isLoadingTemplates,
    handleTemplateChange,
    handleCustomVarChange,
    insertTag,
    previewHtml,
    targetSegment, setTargetSegment,
    selectedUsers,
    users: searchQuery.trim() === ""
      ? selectedUsersDetails.filter((u, i, self) => self.findIndex((x) => x.id === u.id) === i)
      : users,
    searchQuery, setSearchQuery,
    isLoadingUsers,
    handleUserSelect,
    handleSelectAll,
    scheduleType, setScheduleType,
    scheduleDate, setScheduleDate,
    scheduleTime, setScheduleTime,
    priority, setPriority,
    isSending,
    handleSubmit,
    // Step navigation guards
    isModeValid,
    isContentValid,
    isAudienceValid,
    canAccessTab,
    handleNextFromMode,
    handleNextFromContent,
    handleNextFromAudience,
    selectCustomAndProceed,
    selectTemplateAndProceed,
  };
}
