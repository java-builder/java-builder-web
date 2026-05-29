"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import toast from "react-hot-toast";
import { userApi } from "@/services/user.service";
import { UserDetailResponse } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";
import { TEMPLATE_LIST, SYSTEM_VARS, type TemplateId } from "./emailTemplates";

export type ActiveTab = "config" | "content" | "audience" | "schedule";
export type PreviewMode = "desktop" | "mobile";
export type TargetSegment = "all" | "premium" | "inactive" | "custom";
export type Priority = "HIGH" | "NORMAL" | "LOW";

export function useEmailCampaign() {
  // ── UI state ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<ActiveTab>("config");
  const [previewMode, setPreviewMode] = useState<PreviewMode>("desktop");
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("empty");

  // ── Config tab ────────────────────────────────────────────────────────────
  const [subject, setSubject] = useState("");
  const [preheader, setPreheader] = useState("");
  const [senderName, setSenderName] = useState("JavaBuilder Support");
  const [senderEmail, setSenderEmail] = useState("noreply@javabuilder.online");
  const [replyTo, setReplyTo] = useState("support@javabuilder.online");

  // ── Content tab ───────────────────────────────────────────────────────────
  const [content, setContent] = useState("");

  /**
   * customVarValues: values admin fills for non-system variables.
   * Merged with SYSTEM_VARS when building preview HTML.
   */
  const [customVarValues, setCustomVarValues] = useState<Record<string, string>>({});

  const currentTemplateCfg = useMemo(
    () => TEMPLATE_LIST.find((t) => t.id === selectedTemplate)!,
    [selectedTemplate]
  );

  /** System vars actually present in current content */
  const systemVarsDetected = useMemo(() => {
    const matches = content.match(/\{(\w+)\}/g) ?? [];
    const all = [...new Set(matches.map((m) => m.replace(/[{}]/g, "")))];
    return all.filter((v) => v in SYSTEM_VARS);
  }, [content]);

  // ── Audience tab ──────────────────────────────────────────────────────────
  const [targetSegment, setTargetSegment] = useState<TargetSegment>("all");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<UserDetailResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // ── Schedule tab ──────────────────────────────────────────────────────────
  const [scheduleType, setScheduleType] = useState<"now" | "schedule">("now");
  const [scheduleDate, setScheduleDate] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [priority, setPriority] = useState<Priority>("NORMAL");
  const [isSending, setIsSending] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────────
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
    // Pre-fill custom vars with empty strings so inputs appear immediately
    const initVars: Record<string, string> = {};
    cfg.customVars.forEach((v) => { initVars[v] = ""; });
    setCustomVarValues(initVars);
    // Build initial content with system var placeholders + empty custom vars
    setContent(cfg.build({ ...SYSTEM_VARS, ...initVars }));
  };

  const handleCustomVarChange = (varName: string, value: string) => {
    const next = { ...customVarValues, [varName]: value };
    setCustomVarValues(next);
    // Rebuild content live so preview updates
    setContent(currentTemplateCfg.build({ ...SYSTEM_VARS, ...next }));
  };

  const insertTag = (tag: string) => {
    setContent((prev) => prev + ` ${tag} `);
    toast.success(`Đã thêm thẻ ${tag}`);
  };

  /** Replace system vars with sample values for live preview */
  const previewHtml = useMemo(() => {
    if (!content) return "<p style='color:#94a3b8; text-align:center; padding: 40px;'>Nội dung thư rỗng</p>";
    let html = content;
    Object.entries(SYSTEM_VARS).forEach(([k, v]) => {
      html = html.replaceAll(`{${k}}`, v);
    });
    return html;
  }, [content]);

  const handleSubmit = (e?: React.FormEvent) => {
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
    setIsSending(true);
    setTimeout(() => {
      setIsSending(false);
      const targetText = targetSegment === "all" ? "tất cả thành viên"
        : targetSegment === "premium" ? "thành viên Premium"
        : targetSegment === "inactive" ? "thành viên chưa kích hoạt"
        : `${selectedUsers.length} người nhận đã chọn`;
      const scheduleText = scheduleType === "now" ? "Gửi ngay lập tức"
        : `Lên lịch vào lúc ${scheduleTime} ngày ${scheduleDate}`;
      toast.success(`Chiến dịch đã được khởi chạy!\nĐối tượng: ${targetText}\n${scheduleText}`);
    }, 2000);
  };

  return {
    // UI
    activeTab, setActiveTab,
    previewMode, setPreviewMode,
    selectedTemplate,
    // Config
    subject, setSubject,
    preheader, setPreheader,
    senderName, setSenderName,
    senderEmail, setSenderEmail,
    replyTo, setReplyTo,
    // Content
    content, setContent,
    customVarValues,
    currentTemplateCfg,
    systemVarsDetected,
    handleTemplateChange,
    handleCustomVarChange,
    insertTag,
    previewHtml,
    // Audience
    targetSegment, setTargetSegment,
    selectedUsers,
    users,
    searchQuery, setSearchQuery,
    isLoadingUsers,
    handleUserSelect,
    handleSelectAll,
    // Schedule
    scheduleType, setScheduleType,
    scheduleDate, setScheduleDate,
    scheduleTime, setScheduleTime,
    priority, setPriority,
    isSending,
    handleSubmit,
  };
}
