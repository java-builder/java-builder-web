"use client";

import Image from "next/image";
import {
  Layers,
  ShieldCheck,
  Cpu,
  Settings,
  Cloud,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Calendar,
  Terminal,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

import { buttonVariants } from "@/components/ui/button";

export default function MentorClient() {
  const { t } = useI18n();

  // 6 Roadmap Modules with Period and Tech Badges (No 'Chặng', No 'Sản phẩm đầu ra')
  const modules = [
    {
      moduleNumber: "Module 01",
      period: "Tuần 1 - 2",
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      title: "Java 25, Spring Boot 4 & Core Architecture",
      tags: ["Java 25", "Spring Boot 4", "Virtual Threads", "Spring Data JPA", "PostgreSQL", "RESTful API"],
      items: [
        "Thiết kế RESTful API chuẩn quốc tế, DTO pattern và chuẩn hóa tầng kiến trúc chuyên nghiệp.",
        "Làm chủ tính năng Java 25 mới nhất: Virtual Threads (Project Loom), Pattern Matching, Scoped Values.",
        "Data Validation (Bean Validation) & cơ chế Global Exception Handling tập trung.",
        "Spring Data JPA: Tối ưu hóa truy vấn, triệt tiêu hoàn toàn lỗi N+1 query problem, indexing, projection.",
      ],
    },
    {
      moduleNumber: "Module 02",
      period: "Tuần 3 - 4",
      icon: <ShieldCheck className="w-5 h-5 text-purple-500" />,
      title: "Advanced Security, Auth & Passkey",
      tags: ["Spring Security", "JWT", "OAuth2", "TOTP 2FA", "Passkey WebAuthn"],
      items: [
        "Spring Security: Cơ chế lọc Filter Chain, SecurityContext và AuthenticationManager.",
        "JWT (Json Web Token) an toàn với Access Token / Refresh Token rotation.",
        "Xác thực 2 yếu tố TOTP (Two-Factor Authentication) với Google Authenticator.",
        "Đăng nhập sinh trắc học hiện đại không mật khẩu với WebAuthn (Passkey).",
      ],
    },
    {
      moduleNumber: "Module 03",
      period: "Tuần 5 - 6",
      icon: <Cpu className="w-5 h-5 text-emerald-500" />,
      title: "High Performance Caching & Core Utilities",
      tags: ["Redis Caching", "Cache Fallback", "AWS S3", "Spring Scheduler", "Java Mail"],
      items: [
        "Quản lý Token, Blacklisting & Caching chịu tải cao với Redis, chống Cache Stampede/Penetration.",
        "Kỹ thuật Caching nâng cao & Xử lý Fallback Database tự động khi Redis gặp sự cố.",
        "Gửi Email tự động chuyên nghiệp với HTML Email Templates & async event.",
        "Spring Scheduler: Lập lịch và tự động hóa tác vụ ngầm (Background Jobs).",
        "Tích hợp AWS S3: Upload file chuyên nghiệp với Pre-signed URLs và quản trị Object Key.",
      ],
    },
    {
      moduleNumber: "Module 04",
      period: "Tuần 7 - 8",
      icon: <Sparkles className="w-5 h-5 text-pink-500" />,
      title: "Spring AI & Generative AI Integration",
      tags: ["Spring AI", "LLM", "RAG", "Vector DB (pgvector)", "Tool Calling"],
      items: [
        "Spring AI: Tích hợp LLM, cấu hình tham số AI chuyên nghiệp.",
        "PromptTemplate & StructuredOutput: Định cấu trúc dữ liệu đầu ra từ LLM (JSON, DTO).",
        "ChatMemory: Quản lý ngữ cảnh và lịch sử hội thoại nhiều người dùng cho Chatbot.",
        "Tool Calling: Cho phép LLM tự động gọi API/Service nghiệp vụ nội bộ.",
        "RAG (Retrieval-Augmented Generation): Document indexing & truy vấn tri thức nội bộ với pgvector.",
      ],
    },
    {
      moduleNumber: "Module 05",
      period: "Tuần 9 - 10",
      icon: <Settings className="w-5 h-5 text-orange-500" />,
      title: "Git Flow, Docker & CI/CD DevOps",
      tags: ["Git Flow", "Pull Request", "Docker Multi-stage", "Docker Compose", "GitHub Actions"],
      items: [
        "Thực hành chuẩn Git Flow doanh nghiệp: Feature branch, conventional commits, rebase interactive, giải quyết merge conflict.",
        "Quy chuẩn mở Pull Request, review checklist và thực hành clean code trực tiếp trên GitHub.",
        "Dockerfile: Viết và tối ưu hóa Multi-stage Build cho Java 25 siêu nhẹ (~150MB).",
        "Docker Compose: Khởi chạy trọn gói Backend, PostgreSQL và Redis chỉ với một lệnh.",
        "GitHub Actions CI/CD: Tự động hóa kiểm thử, build Docker image & kiểm tra SonarQube quality gate.",
      ],
    },
    {
      moduleNumber: "Module 06",
      period: "Tuần 11 - 12",
      icon: <Cloud className="w-5 h-5 text-sky-500" />,
      title: "AWS Cloud Deployment & Production",
      tags: ["AWS EC2", "VPC & Security Group", "Nginx", "Cloudflare", "HTTPS"],
      items: [
        "Thiết lập hạ tầng mạng trên AWS Cloud: VPC, Subnet, Internet Gateway & Security Groups.",
        "Triển khai Backend lên môi trường thực tế AWS EC2 với Docker container.",
        "Nginx: Cấu hình Reverse Proxy.",
        "Cloudflare: Quản lý bản ghi DNS, phân giải tên miền, tối ưu hóa lưu lượng và kích hoạt bảo mật HTTPS.",
      ],
    },
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 dark:bg-slate-900 transition-colors duration-300">

      {/* Hero Section */}
      <section className="relative py-12 md:py-16 px-4 bg-gradient-to-r from-white to-blue-50/60 dark:from-slate-900 dark:to-slate-850 border-b border-border/80 text-center">
        <div className="max-w-4xl mx-auto space-y-5">
          {/* Tech Stack Pills Banner */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200/60 dark:border-slate-700 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            <span className="text-muted-foreground font-normal">Chương trình đào tạo:</span>
            <span className="font-semibold text-foreground">Java 25</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="font-semibold text-accent">Spring Boot 4</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="font-semibold text-foreground">Redis</span>
            <span className="text-muted-foreground/50">•</span>
            <span className="text-muted-foreground">AWS Cloud</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.2]">
            Đào Tạo Mentor 1-1{" "}
            <span className="text-accent">
              Java 25 & Spring Boot 4
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-sm sm:text-base md:text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
            Chương trình đồng hành 1-1 chuyên sâu: Thiết kế RESTful API chuẩn quốc tế, tối ưu Redis Caching, Spring Security, Spring AI, kỹ năng Git & PR thực tế doanh nghiệp đến triển khai 24/7 trên Cloud AWS.
          </p>

          {/* Value Props Row */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-1 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 dark:bg-slate-800 border border-blue-200/60 dark:border-slate-700 text-blue-700 dark:text-blue-300">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              Mentor 1-1 trực tiếp
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-slate-800 border border-emerald-200/60 dark:border-slate-700 text-emerald-700 dark:text-emerald-300">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Review 100% Pull Request
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-purple-50 dark:bg-slate-800 border border-purple-200/60 dark:border-slate-700 text-purple-700 dark:text-purple-300">
              <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
              RESTful API & Redis Caching
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-slate-800 border border-amber-200/60 dark:border-slate-700 text-amber-700 dark:text-amber-300">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              1 Dự án Capstone thực tế
            </span>
          </div>

          {/* CTAs */}
          <div className="pt-2 flex justify-center gap-3 flex-wrap">
            <a
              href="#contact-info"
              onClick={(e) => scrollToSection(e, "contact-info")}
              className={buttonVariants({ variant: "accent", size: "lg" })}
            >
              Liên hệ tư vấn 1-1
              <ArrowRight className="w-4 h-4 ml-1" />
            </a>
            <a
              href="#curriculum"
              onClick={(e) => scrollToSection(e, "curriculum")}
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Xem chi tiết lộ trình
            </a>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16">

        {/* Curriculum Roadmap Section */}
        <section id="curriculum" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider">
              <Terminal className="w-3.5 h-3.5" />
              <span>Lộ Trình Đào Tạo Chi Tiết</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Lộ trình chuyên sâu 12 tuần làm chủ Java 25 & Spring Boot 4
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Thực chiến từ RESTful API chuẩn quốc tế, Spring Security, Redis Caching, Spring AI đến DevOps & triển khai Cloud AWS.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {modules.map((mod, idx) => (
              <div
                key={idx}
                className="bg-card text-card-foreground border border-border/80 rounded-xl p-6 space-y-5 shadow-xs hover:border-accent/40 hover:shadow-sm transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header: Module label & Period */}
                  <div className="flex items-center justify-between gap-2 flex-wrap pb-1 border-b border-border/60">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-accent bg-accent/10 border border-accent/20 px-2.5 py-1 rounded-md">
                        {mod.moduleNumber}
                      </span>
                      <h3 className="text-base font-bold text-foreground leading-snug">
                        {mod.title}
                      </h3>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted px-2.5 py-0.5 rounded-md border border-border/60 shrink-0">
                      <Calendar className="w-3.5 h-3.5" />
                      {mod.period}
                    </span>
                  </div>

                  {/* Tech Stack Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {mod.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-mono font-medium bg-muted text-foreground border border-border/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Knowledge Checklist */}
                  <ul className="space-y-2.5 pt-1">
                    {mod.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Info Section */}
        <div
          id="contact-info"
          className="max-w-4xl mx-auto bg-card text-card-foreground rounded-xl border border-border/80 shadow-xs overflow-hidden scroll-mt-24"
        >
          <div className="p-6 sm:p-8 border-b border-border bg-gradient-to-r from-blue-600/5 via-transparent to-purple-600/5 text-center space-y-2">
            <GraduationCap className="w-9 h-9 mx-auto text-accent" />
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("mentorPage.contact.title")}
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              {t("mentorPage.contact.description")}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Facebook Card */}
              <a
                href="https://www.facebook.com/le.khanh.uc.10632"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-background border border-border hover:border-blue-500/50 hover:shadow-sm rounded-xl transition-all duration-200 group active:scale-[0.98] text-left cursor-pointer"
              >
                <div className="w-11 h-11 rounded-lg bg-white dark:bg-slate-800 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src="/social/facebook.webp"
                    alt="Facebook"
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t("mentorPage.contact.facebook")}</p>
                  <p className="text-sm font-bold text-foreground truncate mt-0.5">Lê Khánh Đức</p>
                  <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t("mentorPage.contact.facebookAction")}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>

              {/* Zalo Card */}
              <a
                href="https://zalo.me/0368103455"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-background border border-border hover:border-teal-500/50 hover:shadow-sm rounded-xl transition-all duration-200 group active:scale-[0.98] text-left cursor-pointer"
              >
                <div className="w-11 h-11 rounded-lg bg-white dark:bg-slate-800 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src="/social/zalo.png"
                    alt="Zalo"
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{t("mentorPage.contact.zalo")}</p>
                  <p className="text-sm font-bold text-foreground truncate mt-0.5">0368 103 455</p>
                  <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground mt-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {t("mentorPage.contact.zaloAction")}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:javabuilder.platform@gmail.com"
                className="flex items-center gap-4 p-4 bg-background border border-border hover:border-rose-500/50 hover:shadow-sm rounded-xl transition-all duration-200 group active:scale-[0.98] text-left cursor-pointer"
              >
                <div className="w-11 h-11 rounded-lg bg-white dark:bg-slate-800 border border-border flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
                  <Image
                    src="/social/email.webp"
                    alt="Email"
                    width={26}
                    height={26}
                    className="object-contain"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">{t("mentorPage.contact.email")}</p>
                  <p className="text-sm font-bold text-foreground truncate mt-0.5">javabuilder.platform</p>
                  <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground mt-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {t("mentorPage.contact.emailAction")}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
