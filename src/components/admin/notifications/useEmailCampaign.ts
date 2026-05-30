"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { userApi } from "@/services/user.service";
import { emailSchedulerService } from "@/services/email-scheduler.service";
import { ScheduleEmailRequest, RecipientType, EmailEventType } from "@/types/email-scheduler";
import { UserDetailResponse } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";
import { TEMPLATE_LIST, SYSTEM_VARS, type TemplateId } from "./emailTemplates";

export type ActiveTab = "config" | "content" | "audience" | "schedule";
export type PreviewMode = "desktop" | "mobile";
export type TargetSegment = "all" | "premium" | "inactive" | "custom";
export type Priority = "HIGH" | "NORMAL" | "LOW";

const toEmailEventType = (id: TemplateId): EmailEventType => {
  switch (id) {
    case "empty":         return "BROADCAST";
    case "thank-you":     return "BROADCAST";
    case "promotion":     return "PROMOTION";
    case "system-alert":  return "MAINTENANCE_ALERT";
    case "re-engage":     return "RE_ENGAGEMENT";
    case "new-course":    return "NEW_COURSE_ANNOUNCEMENT";
  }
};

export function useEmailCampaign() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("config");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("empty");

  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [senderName, setSenderName] = useState("JavaBuilder Support");
  const [senderEmail, setSenderEmail] = useState("noreply@javabuilder.online");
  const [replyTo, setReplyTo] = useState("javabuilder.platform@gmail.com");

  const [content, setContent] = useState("");

  const [customVarValues, setCustomVarValues] = useState<Record<string, string>>({});

  const currentTemplateCfg = useMemo(
    () => TEMPLATE_LIST.find((t) => t.id === selectedTemplate)!,
    [selectedTemplate]
  );

  const systemVarsDetected = useMemo(() => {
    const matches = content.match(/\{(\w+)\}/g) ?? [];
    const all = [...new Set(matches.map((m) => m.replace(/[{}]/g, "")))];
    return all.filter((v) => v in SYSTEM_VARS);
  }, [content]);

  const [targetSegment, setTargetSegment] = useState<TargetSegment>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
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

  const handleUserSelect = (userId: string) =>
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );

  const handleSelectAll = () =>
    setSelectedUsers(selectedUsers.length === users.length ? [] : users.map((u) => u.id));

  const handleTemplateChange = (id: TemplateId) => {
    const cfg = TEMPLATE_LIST.find((t) => t.id === id)!;
    setSelectedTemplate(id);
    setSubject(cfg.subject);
    setPreheader(cfg.preheader);
    const initVars: Record<string, string> = {};
    cfg.customVars.forEach((v) => { initVars[v] = ""; });
    setCustomVarValues(initVars);
    setContent(cfg.build({ ...SYSTEM_VARS, ...initVars }));
  };

  const handleCustomVarChange = (varName: string, value: string) => {
    const next = { ...customVarValues, [varName]: value };
    setCustomVarValues(next);
    setContent(currentTemplateCfg.build({ ...SYSTEM_VARS, ...next }));
  };

  const insertTag = (tag: string) => {
    setContent((prev) => prev + ` ${tag} `);
    toast.success(`Đã thêm thẻ ${tag}`);
  };

  const previewHtml = useMemo(() => {
    if (!content) return "<p style='color:#94a3b8; text-align:center; padding: 40px;'>Nội dung thư rỗng</p>";
    let html = content;
    Object.entries(SYSTEM_VARS).forEach(([k, v]) => {
      html = html.replaceAll(`{${k}}`, v);
    });
    return html;
  }, [content]);

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
      ? users.filter((u) => selectedUsers.includes(u.id)).map((u) => u.email)
      : undefined;

    const scheduledTime = scheduleType === "schedule"
      ? new Date(`${scheduleDate}T${scheduleTime}`).toISOString()
      : undefined;

    const eventType = toEmailEventType(selectedTemplate);

    const payload: ScheduleEmailRequest = {
      jobLabel: (currentTemplateCfg.id || "broadcast").replace(/_/g, "-"),
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
    handleTemplateChange,
    handleCustomVarChange,
    insertTag,
    previewHtml,
    targetSegment, setTargetSegment,
    selectedUsers,
    users,
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
