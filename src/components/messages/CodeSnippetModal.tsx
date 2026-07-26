"use client";

import { useState, useRef, useEffect } from "react";
import {
  Code2,
  X,
  Send,
  Eye,
  Edit3,
  ChevronDown,
  Check,
  Coffee,
  Layers,
  Database,
  FileCode,
  Terminal,
  FileJson,
} from "lucide-react";
import { CodeSnippetData } from "./types";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";

interface CodeSnippetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSendCode: (codeData: CodeSnippetData, commentText: string) => void;
}

const LANGUAGES = [
  { id: "java", label: "Java Core", icon: Coffee, desc: "Standard Java Syntax" },
  { id: "springboot", label: "Spring Boot (Java)", icon: Layers, desc: "REST API & Beans" },
  { id: "sql", label: "SQL / Database", icon: Database, desc: "MySQL, Postgres, H2" },
  { id: "javascript", label: "JavaScript / TypeScript", icon: FileCode, desc: "Frontend & Node.js" },
  { id: "python", label: "Python 3", icon: Terminal, desc: "Scripting & AI" },
  { id: "html", label: "HTML5 / CSS3", icon: Code2, desc: "Markup & Styling" },
  { id: "json", label: "JSON Config", icon: FileJson, desc: "Settings & Specs" },
];

const DEFAULT_SNIPPETS: Record<string, { title: string; code: string }> = {
  java: {
    title: "Main.java",
    code: `public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello JavaBuilder!");
    }
}`,
  },
  springboot: {
    title: "UserController.java",
    code: `@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(List.of());
    }
}`,
  },
  sql: {
    title: "schema.sql",
    code: `SELECT u.id, u.username, u.email, s.streak_count
FROM users u
JOIN user_streaks s ON u.id = s.user_id
WHERE s.streak_count > 5
ORDER BY s.streak_count DESC;`,
  },
  javascript: {
    title: "app.ts",
    code: `interface User {
  id: string;
  name: string;
}

async function fetchUserData(userId: string): Promise<User> {
  const response = await fetch(\`/api/users/\${userId}\`);
  return response.json();
}`,
  },
  python: {
    title: "solution.py",
    code: `def calculate_streak(user_logs):
    count = 0
    for log in user_logs:
        if log.get("active"):
            count += 1
    return count

print(calculate_streak([{"active": True}]))`,
  },
  html: {
    title: "index.html",
    code: `<div className="p-4 bg-card rounded-2xl border border-border shadow-xs">
  <h3 className="text-sm font-bold text-foreground">JavaBuilder Community</h3>
  <p className="text-xs text-muted-foreground">Hỗ trợ học tập lập trình Java</p>
</div>`,
  },
  json: {
    title: "config.json",
    code: `{\n  "appName": "JavaBuilder",\n  "version": "1.0.0",\n  "features": {\n    "aiAssistance": true,\n    "syntaxHighlighting": true\n  }\n}`,
  },
};

export default function CodeSnippetModal({
  isOpen,
  onClose,
  onSendCode,
}: CodeSnippetModalProps) {
  const [language, setLanguage] = useState("java");
  const [title, setTitle] = useState("Main.java");
  const [code, setCode] = useState(`public class Solution {
    public static void main(String[] args) {
        System.out.println("Hello JavaBuilder!");
    }
}`);
  const [comment, setComment] = useState("");
  const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
  const [isLangDropdownOpen, setIsLangDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsLangDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    onSendCode(
      {
        language,
        title: title.trim() || undefined,
        code: code.trim(),
      },
      comment.trim()
    );
    onClose();
  };

  const markdownPreviewContent = `\`\`\`${language}\n// File: ${title || "Snippet"}\n${code}\n\`\`\``;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-card text-card-foreground rounded-3xl shadow-2xl border border-border overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-muted/40">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-accent/10 text-accent">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                Chia sẻ đoạn code Java
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">
                  Syntax Highlighting
                </span>
              </h3>
              <p className="text-xs text-muted-foreground">
                Đoạn code sẽ được định dạng đẹp mắt bằng Markdown chuẩn để thảo luận
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Custom Language Selection Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Ngôn ngữ lập trình
              </label>

              <button
                type="button"
                onClick={() => setIsLangDropdownOpen(!isLangDropdownOpen)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background hover:bg-muted/40 text-foreground text-sm flex items-center justify-between transition-all shadow-2xs focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {(() => {
                    const currentLang = LANGUAGES.find((l) => l.id === language) || LANGUAGES[0];
                    const Icon = currentLang.icon;
                    return (
                      <>
                        <div className="p-1.5 rounded-lg bg-accent/10 text-accent shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-xs truncate">{currentLang.label}</span>
                      </>
                    );
                  })()}
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${
                    isLangDropdownOpen ? "rotate-180 text-accent" : ""
                  }`}
                />
              </button>

              {/* Dropdown Menu Popover */}
              {isLangDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1.5 z-50 p-1.5 rounded-2xl bg-popover border border-border shadow-2xl animate-in fade-in zoom-in-95 duration-150 max-h-64 overflow-y-auto custom-scrollbar">
                  {LANGUAGES.map((langItem) => {
                    const Icon = langItem.icon;
                    const isSelected = language === langItem.id;
                    return (
                      <button
                        key={langItem.id}
                        type="button"
                        onClick={() => {
                          setLanguage(langItem.id);
                          setIsLangDropdownOpen(false);
                          const snippet = DEFAULT_SNIPPETS[langItem.id];
                          if (snippet) {
                            setTitle(snippet.title);
                            setCode(snippet.code);
                          }
                        }}
                        className={`w-full p-2 rounded-xl text-left flex items-center justify-between gap-3 transition-all cursor-pointer ${
                          isSelected
                            ? "bg-accent/15 text-accent font-bold"
                            : "text-foreground hover:bg-muted/60"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`p-1.5 rounded-lg shrink-0 ${
                              isSelected
                                ? "bg-accent text-white shadow-xs"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-xs font-semibold truncate">{langItem.label}</div>
                            <div className="text-[10px] text-muted-foreground truncate">
                              {langItem.desc}
                            </div>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-accent shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* File Title */}
            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5">
                Tên file / Tiêu đề (Tùy chọn)
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ví dụ: UserService.java"
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>

          {/* Code Textarea & Tab Header */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-foreground">
                Nội dung Source Code <span className="text-red-500">*</span>
              </label>
              <div className="flex items-center gap-1 bg-muted p-0.5 rounded-xl text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab("edit")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "edit"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" /> Soạn thảo
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("preview")}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    activeTab === "preview"
                      ? "bg-background text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" /> Xem trước Markdown
                </button>
              </div>
            </div>

            {activeTab === "edit" ? (
              <div className="relative rounded-2xl border border-border overflow-hidden">
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={10}
                  required
                  placeholder="Dán đoạn code cần hỏi đáp vào đây..."
                  className="w-full p-4 !bg-slate-950 !text-slate-100 font-mono text-xs leading-relaxed focus:outline-none resize-none selection:bg-accent selection:text-white"
                  style={{ tabSize: 4, color: "#f8fafc", backgroundColor: "#020617" }}
                />
              </div>
            ) : (
              <div className="rounded-2xl border border-border p-4 bg-card max-h-[300px] overflow-y-auto">
                <PublicMarkdownRenderer content={markdownPreviewContent} />
              </div>
            )}
          </div>

          {/* Optional Comment */}
          <div>
            <label className="block text-xs font-bold text-foreground mb-1.5">
              Lời nhắn đính kèm (Tùy chọn)
            </label>
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Nhập ghi chú hoặc câu hỏi về đoạn code này..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors cursor-pointer"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!code.trim()}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-accent text-white hover:bg-accent/90 disabled:opacity-50 text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
