"use client";

import { useState, useEffect, useRef } from "react";
import { X, Sparkles, Bug, Lightbulb, HelpCircle, AlertCircle, ChevronDown, Wand2, Check, RefreshCw, ShieldCheck, Zap, Database, Cpu, ChevronRight, Code2, Server, Layers, Cloud, Tag as TagIcon, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { postService } from "@/services/post.service";
import { categoryService } from "@/services/category.service";
import { tagService } from "@/services/tag.service";
import { chatbotApi } from "@/services/chatbot.service";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { Tag as TagType } from "@/types/tag";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";

interface GenerateQnAWithAIModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

type TemplateType = "daily_problem" | "fix_bug" | "solution" | "general";

const TEMPLATES: Record<TemplateType, { name: string; icon: React.ComponentType<{ className?: string }> }> = {
  daily_problem: {
    name: "Daily Challenge",
    icon: Sparkles,
  },
  fix_bug: {
    name: "Fix Bug",
    icon: Bug,
  },
  solution: {
    name: "Solution",
    icon: Lightbulb,
  },
  general: {
    name: "Thảo luận",
    icon: HelpCircle,
  },
};

type QnALevel = "EASY" | "MEDIUM" | "HARD";

interface RoadmapTopic {
  title: string;
  level: QnALevel;
}

interface RoadmapGroup {
  id: string;
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  topics: RoadmapTopic[];
}

const BACKEND_ROADMAP_GROUPS: RoadmapGroup[] = [
  {
    id: "security",
    name: "Spring Security & OAuth2",
    icon: ShieldCheck,
    topics: [
      { title: "Cấu hình Spring Security 6 & Custom Security Filter Chain", level: "HARD" },
      { title: "Authentication với JWT Access Token & Refresh Token Rotation", level: "HARD" },
      { title: "OAuth2 Social Login (Google, GitHub) với Spring Security 6", level: "MEDIUM" },
      { title: "Phân quyền RBAC / ABAC với Spring Security & Method Security", level: "MEDIUM" },
      { title: "Xử lý SecurityContextHolder trong môi trường Bất đồng bộ", level: "HARD" },
    ],
  },
  {
    id: "java21",
    name: "Java 21 & Concurrency",
    icon: Code2,
    topics: [
      { title: "Java 21 Virtual Threads (Project Loom) & Structured Concurrency", level: "HARD" },
      { title: "Pattern Matching, Record Patterns & Sealed Classes trong Java 21", level: "EASY" },
      { title: "CompletableFuture & Multithreading Concurrent Collections", level: "HARD" },
      { title: "Khắc phục ThreadLocal Memory Leak trong Web Server", level: "MEDIUM" },
      { title: "Sequenced Collections & Stream API Best Practices", level: "EASY" },
    ],
  },
  {
    id: "spring_jpa",
    name: "Spring Boot & Data JPA",
    icon: Cpu,
    topics: [
      { title: "Tối ưu Xử lý N+1 Query với EntityGraph & Fetch Join", level: "MEDIUM" },
      { title: "Quy tắc @Transactional Rollback, Propagation & Isolation Level", level: "MEDIUM" },
      { title: "Optimistic vs Pessimistic Locking trong Spring Data JPA", level: "HARD" },
      { title: "Thiết kế Custom Annotation & Spring AOP Aspect", level: "MEDIUM" },
      { title: "Spring Boot Validation, Exception Handling & Global Handler", level: "EASY" },
    ],
  },
  {
    id: "db_tuning",
    name: "Database & Performance",
    icon: Server,
    topics: [
      { title: "Indexing Strategies & Query Optimization cho MySQL / PostgreSQL", level: "MEDIUM" },
      { title: "Xử lý Database Transaction Deadlock & HikariCP Connection Pool", level: "HARD" },
      { title: "Database Migration với Flyway / Liquibase trong CI/CD", level: "MEDIUM" },
      { title: "Partitioning & Sharding Database cho hệ thống triệu record", level: "HARD" },
    ],
  },
  {
    id: "redis",
    name: "Redis & Caching",
    icon: Database,
    topics: [
      { title: "Chống Cache Stampede & Distributed Lock với Redisson", level: "HARD" },
      { title: "Thiết kế Idempotent Payment API chống trùng request", level: "HARD" },
      { title: "Cache Strategies (Cache-Aside, Write-Through) & Redis Data Structures", level: "MEDIUM" },
      { title: "Rate Limiting & Throttling API với Resilience4j & Redis Bucket", level: "MEDIUM" },
    ],
  },
  {
    id: "microservices",
    name: "Microservices & Messaging",
    icon: Zap,
    topics: [
      { title: "Kafka Consumer Rebalance & Exactly-Once Semantics", level: "HARD" },
      { title: "Saga Pattern & Outbox Pattern cho Distributed Transactions", level: "HARD" },
      { title: "Spring Cloud Gateway, Circuit Breaker & Retry với Resilience4j", level: "MEDIUM" },
      { title: "Event-Driven Architecture với RabbitMQ / Apache Kafka", level: "MEDIUM" },
    ],
  },
  {
    id: "architecture",
    name: "System Design & Architecture",
    icon: Layers,
    topics: [
      { title: "Clean Architecture, Hexagonal Architecture trong Spring Boot", level: "MEDIUM" },
      { title: "CQRS & Event Sourcing Architecture cho High-Scale System", level: "HARD" },
      { title: "Thiết kế RESTful API Standard, Versioning & Open API (Swagger)", level: "EASY" },
      { title: "Observability với Micrometer, Prometheus & Grafana Tracing", level: "MEDIUM" },
    ],
  },
  {
    id: "devops",
    name: "Docker, K8s & Cloud",
    icon: Cloud,
    topics: [
      { title: "Containerize Spring Boot App với Multi-Stage Dockerfile", level: "EASY" },
      { title: "Graceful Shutdown & Health Check (Liveness/Readiness Probe) trong K8s", level: "MEDIUM" },
      { title: "CI/CD Pipeline tự động hóa Build & Deploy ứng dụng Java", level: "MEDIUM" },
    ],
  },
];

export default function GenerateQnAWithAIModal({ isOpen, onClose, onSuccess }: GenerateQnAWithAIModalProps) {
  const [postType, setPostType] = useState<TemplateType>("daily_problem");
  const [level, setLevel] = useState<"EASY" | "MEDIUM" | "HARD">("MEDIUM");
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [activeGroupId, setActiveGroupId] = useState("security");

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [generatedTags, setGeneratedTags] = useState<string[]>([]);

  const [categories, setCategories] = useState<CategoryDetailResponse[]>([]);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingCategories, setIsLoadingCategories] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Custom Category Dropdown State
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Tag Selection State
  const [tagInput, setTagInput] = useState("");
  const [tagSuggestions, setTagSuggestions] = useState<TagType[]>([]);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setPostType("daily_problem");
    setLevel("MEDIUM");
    setTopic("");
    setDescription("");
    setTitle("");
    setContent("");
    setGeneratedTags([]);
    setHasGenerated(false);
    setError(null);
    setActiveGroupId("security");

    let mounted = true;
    (async () => {
      setIsLoadingCategories(true);
      try {
        const resp = await categoryService.getAll(CategoryType.POST);
        const cats = resp?.data ?? [];
        if (mounted) {
          setCategories(cats);
          if (cats.length > 0) {
            setCategoryId((prev) => prev || cats[0].id);
          }
        }
      } catch (e) {
        console.error("Failed to load categories", e);
      } finally {
        if (mounted) setIsLoadingCategories(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCatDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (tagInput.trim()) {
        searchTags(tagInput);
      } else {
        setTagSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [tagInput]);

  const searchTags = async (query: string) => {
    setIsLoadingTags(true);
    try {
      const response = await tagService.search(query, 1, 10);
      setTagSuggestions(response.data?.data || []);
    } catch (err) {
      console.error("Error searching tags:", err);
    } finally {
      setIsLoadingTags(false);
    }
  };

  const handleAddTag = (tagName: string) => {
    const trimmed = tagName.trim();
    if (!trimmed) return;
    if (!generatedTags.includes(trimmed)) {
      setGeneratedTags((prev) => [...prev, trimmed]);
    }
    setTagInput("");
    setTagSuggestions([]);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setGeneratedTags((prev) => prev.filter((t) => t !== tagToRemove));
  };

  if (!isOpen) return null;

  const handleSelectSuggestedTopic = (tItem: RoadmapTopic) => {
    setTopic(tItem.title);
    setLevel(tItem.level);
  };

  const handleGenerateAI = async () => {
    if (!topic.trim()) return;
    setIsGeneratingAI(true);
    setError(null);
    try {
      const res = await chatbotApi.generateQnAPost({
        postType,
        topic: topic.trim(),
        level,
        description: description.trim() || undefined,
      });
      if (res.data) {
        const { title, content, tags, categoryName } = res.data;
        if (title) setTitle(title);
        if (content) setContent(content);
        if (tags && Array.isArray(tags)) setGeneratedTags(tags);
        if (categoryName && categories.length > 0) {
          const catNameLower = categoryName.toLowerCase();
          const found = categories.find(
            (c) => c.name.toLowerCase().includes(catNameLower)
          );
          if (found) setCategoryId(found.id);
        }
        setHasGenerated(true);
      }
    } catch (err: unknown) {
      console.error("AI Generation error", err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr?.response?.data?.message || "Không thể sinh bài viết bằng AI. Vui lòng thử lại!");
    } finally {
      setIsGeneratingAI(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Vui lòng sinh bài hoặc nhập tiêu đề bài viết");
      return;
    }
    if (!categoryId) {
      setError("Vui lòng chọn danh mục");
      return;
    }
    if (!content.trim()) {
      setError("Vui lòng sinh bài hoặc nhập nội dung bài viết");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    try {
      await postService.create({
        title: title.trim(),
        categoryId,
        content: content.trim(),
        tags: generatedTags,
      });
      onSuccess();
      onClose();
    } catch (err: unknown) {
      console.error("Create Q&A post error", err);
      const apiErr = err as { response?: { data?: { message?: string } } };
      setError(apiErr?.response?.data?.message || "Không thể tạo bài viết. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedCategoryObj = categories.find((c) => c.id === categoryId);
  const activeGroup = BACKEND_ROADMAP_GROUPS.find((g) => g.id === activeGroupId) || BACKEND_ROADMAP_GROUPS[0];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Sleek Minimal Header */}
        <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-accent/10 rounded-xl text-accent">
              <Wand2 className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-foreground flex items-center gap-2">
                Tạo Thách Thức Bằng AI
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/10 text-accent border border-accent/20">
                  Spring AI
                </span>
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted-foreground hover:text-foreground rounded-lg transition"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 space-y-5">
          {error && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-xs text-destructive">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Section 1: Template Type & Difficulty Selector */}
          <div className="space-y-3">
            {/* Post Type Selector Pills */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Loại bài viết
              </label>
              <div className="flex flex-wrap items-center gap-1.5">
                {(Object.keys(TEMPLATES) as TemplateType[]).map((key) => {
                  const tmpl = TEMPLATES[key];
                  const Icon = tmpl.icon;
                  const isSelected = postType === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPostType(key)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                        isSelected
                          ? "bg-accent text-white border-accent shadow-sm"
                          : "bg-background border-border text-muted-foreground hover:text-foreground hover:border-accent/40"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{tmpl.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level Selector Pills */}
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Độ khó
              </label>
              <div className="flex items-center gap-1.5">
                {(["EASY", "MEDIUM", "HARD"] as const).map((lvl) => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setLevel(lvl)}
                    className={`flex-1 py-1.5 px-3 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center justify-center gap-1 ${
                      level === lvl
                        ? lvl === "EASY"
                          ? "bg-emerald-500 text-white border-emerald-500 shadow-sm"
                          : lvl === "MEDIUM"
                          ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                          : "bg-red-500 text-white border-red-500 shadow-sm"
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <span>{lvl === "EASY" ? "🟢 Dễ" : lvl === "MEDIUM" ? "🟡 Trung Bình" : "🔴 Khó"}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2: Clean Topic Group & Quick-Select Items */}
          <div className="space-y-2.5 pt-1">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-foreground">
                Gợi ý chủ đề thực tế
              </label>
              <span className="text-[11px] text-muted-foreground">Bấm chọn nhanh</span>
            </div>

            {/* Category Filter Pills (Flex Wrap for all screen sizes) */}
            <div className="flex flex-wrap items-center gap-1.5">
              {BACKEND_ROADMAP_GROUPS.map((group) => {
                const GroupIcon = group.icon;
                const isActive = activeGroupId === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveGroupId(group.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all border ${
                      isActive
                        ? "bg-accent/10 border-accent text-accent font-semibold"
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <GroupIcon className="w-3.5 h-3.5" />
                    <span>{group.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Active Group Topic List Cards */}
            <div className="space-y-1.5 pt-1">
              {activeGroup.topics.map((tItem, idx) => {
                const isSelected = topic === tItem.title;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSuggestedTopic(tItem)}
                    className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${
                      isSelected
                        ? "bg-accent/10 border-accent text-accent font-semibold shadow-sm"
                        : "bg-background border-border/80 hover:border-accent/40 text-foreground hover:bg-accent/5"
                    }`}
                  >
                    <span className="font-medium text-foreground leading-snug">{tItem.title}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        tItem.level === "EASY" ? "bg-emerald-500/10 text-emerald-500" :
                        tItem.level === "MEDIUM" ? "bg-amber-500/10 text-amber-500" :
                        "bg-red-500/10 text-red-500"
                      }`}>
                        {tItem.level}
                      </span>
                      <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? "text-accent" : "text-muted-foreground/40"}`} />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Topic Input & Description Context & Generate Trigger Button */}
          <div className="space-y-3 pt-2 border-t border-border">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Chủ đề bài viết <span className="text-destructive">*</span>
              </label>
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Chọn gợi ý trên hoặc tự nhập chủ đề..."
                className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-sm"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleGenerateAI();
                  }
                }}
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">
                Mô tả / Context & Ý tưởng bổ sung <span className="text-[10px] normal-case text-muted-foreground/70">(Tùy chọn)</span>
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập bối cảnh dự án, yêu cầu cụ thể, gợi ý hướng tiếp cận hoặc cách bạn muốn AI thiết kế bài viết..."
                className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-foreground text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent shadow-sm resize-none"
              />
            </div>

            <div className="flex justify-end pt-1">
              <Button
                type="button"
                variant="accent"
                size="default"
                onClick={handleGenerateAI}
                disabled={isGeneratingAI || !topic.trim()}
                className="w-full sm:w-auto gap-2 whitespace-nowrap text-xs h-10 px-6 font-bold shadow-sm rounded-xl"
              >
                {isGeneratingAI ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang tạo bài...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="w-4 h-4" />
                    <span>{hasGenerated ? "Tạo lại bài mới" : "✨ AI Sinh Bài Viết"}</span>
                  </>
                )}
              </Button>
            </div>
            {/* Generated Tags */}
            {generatedTags.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground">Tags đề xuất:</span>
                {generatedTags.map((tag, idx) => (
                  <span key={idx} className="px-2 py-0.5 rounded text-[10px] font-semibold bg-accent/10 text-accent border border-accent/20">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
            
            {/* Tags Selection */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1 flex items-center">
                <TagIcon className="w-3.5 h-3.5 mr-1 text-accent" />
                Tags bài viết
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddTag(tagInput);
                    }
                  }}
                  placeholder="Nhập tag kỹ thuật và nhấn Enter..."
                  className="w-full px-3 py-1.5 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-xs shadow-sm transition-colors"
                />
                {isLoadingTags && (
                  <div className="absolute right-2.5 top-2">
                    <Loader2 className="animate-spin w-3.5 h-3.5 text-accent" />
                  </div>
                )}
                {tagSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-xl shadow-2xl max-h-40 overflow-y-auto p-1 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                    {tagSuggestions.map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleAddTag(t.name)}
                        className="w-full flex items-center gap-2 px-2.5 py-1.5 text-xs rounded-lg text-left text-foreground hover:bg-muted transition-colors"
                      >
                        <TagIcon className="w-3 h-3 text-accent shrink-0" />
                        <span>{t.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {generatedTags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {generatedTags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center px-2 py-0.5 bg-accent/15 border border-accent/20 text-accent rounded-md text-[11px] font-semibold"
                    >
                      <TagIcon className="w-3 h-3 mr-1" />
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="ml-1.5 text-accent/80 hover:text-accent hover:bg-accent/20 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-2.5 h-2.5" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Form Result Fields */}
          {hasGenerated && (
            <div className="space-y-4 pt-3 border-t border-border animate-in fade-in duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-start">
                {/* Title */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Tiêu đề bài viết <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Nhập tiêu đề bài viết..."
                    className="w-full px-3.5 py-2.5 bg-background border border-input rounded-xl text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent text-xs shadow-sm"
                  />
                </div>

                {/* Category Custom Dropdown */}
                <div className="sm:col-span-1 relative" ref={dropdownRef}>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Danh mục <span className="text-destructive">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                    disabled={isLoadingCategories}
                    className="w-full px-3 py-2.5 bg-background border border-input rounded-xl text-foreground flex items-center justify-between text-xs hover:border-accent/50 focus:outline-none focus:ring-2 focus:ring-accent shadow-sm"
                  >
                    <span className="truncate">
                      {isLoadingCategories
                        ? "Đang tải..."
                        : selectedCategoryObj
                        ? selectedCategoryObj.name
                        : "Chọn danh mục"}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-muted-foreground shrink-0 transition-transform duration-200 ${
                        isCatDropdownOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {/* Floating Custom Dropdown Menu */}
                  {isCatDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-2xl z-30 max-h-60 overflow-y-auto p-1.5 space-y-0.5 animate-in fade-in zoom-in-95 duration-150">
                      {categories.length === 0 ? (
                        <p className="p-2 text-xs text-muted-foreground text-center">Không có danh mục nào</p>
                      ) : (
                        categories.map((cat) => {
                          const isSelected = cat.id === categoryId;
                          return (
                            <button
                              key={cat.id}
                              type="button"
                              onClick={() => {
                                setCategoryId(cat.id);
                                setIsCatDropdownOpen(false);
                              }}
                              className={`w-full flex items-center justify-between px-3 py-1.5 text-xs rounded-lg text-left transition-colors ${
                                isSelected
                                  ? "bg-accent/10 text-accent font-semibold"
                                  : "text-foreground hover:bg-muted"
                              }`}
                            >
                              <span className="truncate">{cat.name}</span>
                              {isSelected && <Check className="w-3.5 h-3.5 text-accent shrink-0" />}
                            </button>
                          );
                        })
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* System MarkdownEditor */}
              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Nội dung bài viết (Markdown) <span className="text-destructive">*</span>
                </label>
                <MarkdownEditor
                  value={content}
                  onChange={(val) => setContent(val)}
                  placeholder="Nhập nội dung bài viết bằng định dạng Markdown..."
                  height={360}
                />
              </div>
            </div>
          )}
        </form>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 border-t border-border flex items-center justify-end gap-2.5 bg-muted/20">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting || isGeneratingAI}>
            Hủy bỏ
          </Button>
          {hasGenerated && (
            <Button type="button" variant="accent" size="sm" onClick={handleSubmit} disabled={isSubmitting || isGeneratingAI}>
              {isSubmitting ? (
                <div className="flex items-center gap-1.5">
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang đăng bài...</span>
                </div>
              ) : (
                <span>🚀 Đăng Bài Viết Bằng AI</span>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
