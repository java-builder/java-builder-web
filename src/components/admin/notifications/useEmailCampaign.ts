"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { userApi } from "@/services/user.service";
import { emailSchedulerService } from "@/services/email-scheduler.service";
import { emailTemplateService } from "@/services/email-template.service";
import { ScheduleEmailRequest, RecipientType, EmailEventType } from "@/types/email-scheduler";
import { UserDetailResponse } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";

export type ActiveTab = "config" | "content" | "audience" | "schedule";
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

const DEFAULT_TEMPLATE: CampaignTemplateConfig = {
  id: "empty",
  name: "Trang Trắng",
  emoji: "📄",
  subject: "",
  preheader: "",
  customVars: [],
  htmlContent: "<p>Bắt đầu viết nội dung thư của bạn ở đây...</p>",
  textContent: "",
};

export function useEmailCampaign() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("config");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("empty");

  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [senderName, setSenderName] = useState("JavaBuilder");
  const [senderEmail, setSenderEmail] = useState("noreply@javabuilder.online");
  const [replyTo, setReplyTo] = useState("javabuilder.platform@gmail.com");

  const [content, setContent] = useState("");
  const [customVarValues, setCustomVarValues] = useState<Record<string, string>>({});

  const [campaignTemplates, setCampaignTemplates] = useState<CampaignTemplateConfig[]>([DEFAULT_TEMPLATE]);
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(false);

  // Fetch all templates from API
  useEffect(() => {
    const fetchTemplates = async () => {
      setIsLoadingTemplates(true);
      try {
        const res = await emailTemplateService.getAllEmailTemplates();
        if (res.data) {
          const apiTemplates: CampaignTemplateConfig[] = res.data.map((tpl) => {
            // Extract custom variables like {{var}} or {var}
            const matches = tpl.htmlContent.match(/\{\{(\w+)\}\}/g) ?? tpl.htmlContent.match(/\{(\w+)\}/g) ?? [];
            const vars = [...new Set(matches.map((m) => m.replace(/[\{\}]/g, "")))].filter(
              (v) => v !== "username" && v !== "email"
            );

            return {
              id: tpl.templateName,
              name: tpl.templateName,
              emoji: "✉️",
              subject: tpl.subject,
              preheader: tpl.subject,
              customVars: vars,
              htmlContent: tpl.htmlContent,
              textContent: tpl.textContent,
            };
          });
          setCampaignTemplates([DEFAULT_TEMPLATE, ...apiTemplates]);
        }
      } catch (e) {
        console.error("Failed to fetch templates for campaign", e);
        toast.error("Không thể tải danh sách mẫu email từ AWS SES. Đang dùng mẫu mặc định.");
      } finally {
        setIsLoadingTemplates(false);
      }
    };
    fetchTemplates();
  }, []);

  const currentTemplateCfg = useMemo(
    () => campaignTemplates.find((t) => t.id === selectedTemplate) || DEFAULT_TEMPLATE,
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

  const handleTemplateChange = (id: string) => {
    const cfg = campaignTemplates.find((t) => t.id === id) || DEFAULT_TEMPLATE;
    setSelectedTemplate(id);
    setSubject(cfg.subject);
    setPreheader(cfg.preheader);
    const initVars: Record<string, string> = {};
    cfg.customVars.forEach((v) => { initVars[v] = ""; });
    setCustomVarValues(initVars);
    setContent(cfg.htmlContent);
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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!subject.trim()) { toast.error("Vui lòng nhập Tiêu đề Email"); setActiveTab("config"); return; }
    if (!content.trim()) { toast.error("Vui lòng soạn Thư nội dung"); setActiveTab("content"); return; }
    if (targetSegment === "custom" && selectedUsers.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 người nhận"); setActiveTab("audience"); return;
    }
    const unfilledCustom = currentTemplateCfg.customVars.filter((v) => !customVarValues[v]?.trim());
    if (unfilledCustom.length > 0) {
      toast.error(`Vui lòng điền đầy đủ: ${unfilledCustom.map((v) => `{${v}}`).join(", ")}`);
      setActiveTab("content"); return;
    }
    if (scheduleType === "schedule" && (!scheduleDate || !scheduleTime)) {
      toast.error("Vui lòng chọn ngày và giờ gửi");
      setActiveTab("schedule"); return;
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
      switch (id) {
        case "PROMOTION": return "PROMOTION";
        case "MAINTENANCE_ALERT": return "MAINTENANCE_ALERT";
        case "RE_ENGAGEMENT": return "RE_ENGAGEMENT";
        case "NEW_COURSE_ANNOUNCEMENT": return "NEW_COURSE_ANNOUNCEMENT";
        case "APPRECIATION": return "APPRECIATION";
        default: return "BROADCAST";
      }
    };
    const eventType = toEmailEventType(selectedTemplate);

    const payload: ScheduleEmailRequest = {
      jobLabel: (currentTemplateCfg.id || "broadcast").replace(/_/g, "-"),
      subject: subject.trim(),
      type: eventType,
      htmlBody: eventType === "BROADCAST" ? content : undefined, // Send HTML body only for BROADCAST
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
  };
}
