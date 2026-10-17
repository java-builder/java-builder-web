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
  Target,
  GitPullRequest,
  Award,
  FileCheck2,
  Users,
  Calendar,
  ExternalLink,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function MentorClient() {
  const { t } = useI18n();

  const credlyUrl =
    "https://www.credly.com/earner/earned/badge/9f9b7ac4-845d-46cb-a2d5-277e0f0c7baf";

  // 1-on-1 Highlights (in familiar card grid style)
  const mentorshipHighlights = [
    {
      icon: <GitPullRequest className="w-5 h-5 text-blue-500" />,
      badge: "Code Quality",
      title: "Code Review 1-1 Từng Pull Request",
      desc: "Review trực tiếp từng dòng code trên GitHub, chỉ ra code smells, tối ưu Clean Code & SOLID.",
    },
    {
      icon: <Users className="w-5 h-5 text-purple-500" />,
      badge: "Cá nhân hóa",
      title: "Lộ Trình Tùy Biến Theo Năng Lực",
      desc: "Thiết kế theo mục tiêu và nền tảng cụ thể (Fresher lên Junior, hoặc Junior bứt phá lên Senior).",
    },
    {
      icon: <Target className="w-5 h-5 text-emerald-500" />,
      badge: "Thực chiến",
      title: "1 Dự Án Capstone Đưa Vào CV",
      desc: "Tự tay xây dựng hệ thống hoàn chỉnh từ Core API đến Cloud AWS, sẵn sàng mang đi phỏng vấn.",
    },
    {
      icon: <FileCheck2 className="w-5 h-5 text-amber-500" />,
      badge: "Sẵn sàng việc làm",
      title: "Mock Interview & Chuẩn Hóa CV",
      desc: "Phỏng vấn kỹ thuật 1-1 sát thực tế doanh nghiệp, gọt giũa CV theo chuẩn ATS để tăng tỷ lệ đậu.",
    },
  ];

  // 6 Roadmap Modules with Period, Tech Badges, and Deliverables
  const modules = [
    {
      phase: "Chặng 1",
      period: "Tuần 1 - 2",
      icon: <Layers className="w-6 h-6 text-blue-500" />,
      title: t("mentorPage.curriculum.module1.title"),
      tags: ["Java 21", "Spring Boot 3.4", "Spring Data JPA", "PostgreSQL", "n-tier"],
      items: [
        t("mentorPage.curriculum.module1.item1"),
        t("mentorPage.curriculum.module1.item2"),
        t("mentorPage.curriculum.module1.item3"),
      ],
      deliverable: "Bộ Core RESTful API chuẩn n-tier, Global Exception Handling và triệt tiêu hoàn toàn lỗi N+1 Query.",
    },
    {
      phase: "Chặng 2",
      period: "Tuần 3 - 4",
      icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
      title: t("mentorPage.curriculum.module2.title"),
      tags: ["Spring Security 6", "JWT", "OAuth2", "TOTP 2FA", "Passkey WebAuthn"],
      items: [
        t("mentorPage.curriculum.module2.item1"),
        t("mentorPage.curriculum.module2.item2"),
        t("mentorPage.curriculum.module2.item3"),
        t("mentorPage.curriculum.module2.item4"),
      ],
      deliverable: "Module xác thực phân quyền đa lớp: JWT an toàn, OTP 2FA và đăng nhập sinh trắc học Passkey.",
    },
    {
      phase: "Chặng 3",
      period: "Tuần 5 - 6",
      icon: <Cpu className="w-6 h-6 text-emerald-500" />,
      title: t("mentorPage.curriculum.module3.title"),
      tags: ["Redis Caching", "Cache Fallback", "AWS S3", "Spring Scheduler", "Java Mail"],
      items: [
        t("mentorPage.curriculum.module3.item1"),
        t("mentorPage.curriculum.module3.item2"),
        t("mentorPage.curriculum.module3.item3"),
        t("mentorPage.curriculum.module3.item4"),
        t("mentorPage.curriculum.module3.item5"),
        t("mentorPage.curriculum.module3.item6"),
      ],
      deliverable: "Hệ thống chịu tải cao kết hợp Redis Cache với cơ chế Fallback tự động khi lỗi và upload AWS S3.",
    },
    {
      phase: "Chặng 4",
      period: "Tuần 7 - 8",
      icon: <Sparkles className="w-6 h-6 text-pink-500" />,
      title: t("mentorPage.curriculum.module4.title"),
      tags: ["Spring AI", "LLM", "RAG", "Vector DB", "Tool Calling"],
      items: [
        t("mentorPage.curriculum.module4.item1"),
        t("mentorPage.curriculum.module4.item2"),
        t("mentorPage.curriculum.module4.item3"),
        t("mentorPage.curriculum.module4.item4"),
        t("mentorPage.curriculum.module4.item5"),
        t("mentorPage.curriculum.module4.item6"),
      ],
      deliverable: "Chatbot AI nghiệp vụ thông minh: RAG truy vấn tri thức nội bộ và Tool Calling tự động gọi Backend API.",
    },
    {
      phase: "Chặng 5",
      period: "Tuần 9 - 10",
      icon: <Settings className="w-6 h-6 text-orange-500" />,
      title: t("mentorPage.curriculum.module5.title"),
      tags: ["Docker", "Multi-stage Build", "Docker Compose", "GitHub Actions"],
      items: [
        t("mentorPage.curriculum.module5.item1"),
        t("mentorPage.curriculum.module5.item2"),
        "Kiểm tra chất lượng mã nguồn tự động qua SonarQube & Unit Test coverage.",
        "Thiết lập Docker Compose khởi chạy trọn gói Backend, Postgres và Redis trên môi trường thử nghiệm.",
      ],
      deliverable: "Container hóa tối ưu (~150MB) và một lệnh docker-compose up chạy trọn bộ dịch vụ dự án.",
    },
    {
      phase: "Chặng 6",
      period: "Tuần 11 - 12",
      icon: <Cloud className="w-6 h-6 text-sky-500" />,
      title: t("mentorPage.curriculum.module6.title"),
      tags: ["AWS EC2", "VPC & Security Group", "Nginx", "SSL Certbot", "Domain"],
      items: [
        t("mentorPage.curriculum.module6.item1"),
        t("mentorPage.curriculum.module6.item2"),
        t("mentorPage.curriculum.module6.item3"),
        t("mentorPage.curriculum.module6.item4"),
        t("mentorPage.curriculum.module6.item5"),
      ],
      deliverable: "Dự án chạy thực tế 24/7 trên AWS Cloud với domain riêng, HTTPS SSL và hoàn thiện hồ sơ CV phỏng vấn.",
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

      {/* Hero Section - Full Width, borderless on sides */}
      <section className="relative py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800/40 dark:to-slate-900 border-b border-border overflow-hidden text-center transition-all duration-300">
        {/* Subtle Dynamic Ambient Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-transparent pointer-events-none" />

        {/* Logo Brand Integration */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-xs">
            <Image
              src="/logos/java-logo.png"
              alt="JavaBuilder Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center mt-2.5 -space-y-0.5">
            <span className="text-xs font-bold text-foreground tracking-widest uppercase">
              JavaBuilder
            </span>
            <span className="text-[0.6rem] font-semibold text-muted-foreground tracking-widest uppercase">
              Learning Platform
            </span>
          </div>
        </div>

        {/* Special Program Badge */}
        <div className="inline-block mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            {t("mentorPage.hero.badge")}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight max-w-4xl mx-auto">
          {t("mentorPage.hero.title")} <span className="text-accent">{t("mentorPage.hero.titleAccent")}</span>
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
          {t("mentorPage.hero.description")}
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap relative z-10">
          <a
            href="#contact-info"
            onClick={(e) => scrollToSection(e, "contact-info")}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 !rounded-xl bg-accent text-white font-semibold shadow-sm hover:bg-accent-600 transition-all duration-200 active:scale-[0.98] text-sm cursor-pointer w-full sm:w-auto"
          >
            {t("mentorPage.hero.ctaContact")}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#curriculum"
            onClick={(e) => scrollToSection(e, "curriculum")}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 !rounded-xl border border-input bg-background hover:bg-muted text-foreground font-semibold shadow-xs transition-all duration-200 active:scale-[0.98] text-sm cursor-pointer w-full sm:w-auto"
          >
            {t("mentorPage.hero.ctaCurriculum")}
          </a>
        </div>
      </section>

      {/* Main Content Area - Boxed width */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12 sm:space-y-16">

        {/* 1. 1-on-1 Mentorship Highlights Grid */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-xl sm:text-2xl font-extrabold text-foreground tracking-tight">
              Đặc Quyền Vượt Trội Của Hình Thức 1-1
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Tập trung tối đa vào hiệu quả cá nhân, giải đáp trực tiếp và đồng hành sát sao suốt khóa học.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {mentorshipHighlights.map((item, idx) => (
              <div
                key={idx}
                className="bg-card text-card-foreground border border-border rounded-2xl sm:rounded-3xl p-5 space-y-3 shadow-xs hover:border-accent/30 hover:shadow-sm transition-all"
              >
                <div className="w-10 h-10 rounded-xl bg-muted/70 border border-border flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. Curriculum Roadmap Section (Preserving the 2-column card grid style, enriched with clear timeline & deliverables) */}
        <section id="curriculum" className="space-y-6 scroll-mt-24">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              {t("mentorPage.curriculum.title")}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Lộ trình 6 chặng chuẩn chỉnh (12 tuần) từ kiến trúc backend nền tảng đến trí tuệ nhân tạo và triển khai cloud AWS.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modules.map((mod, idx) => (
              <div
                key={idx}
                className="bg-card text-card-foreground border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-xs hover:border-accent/40 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Card Header: Stage badge & Period */}
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-accent/10 text-accent border border-accent/20">
                      {mod.phase}
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground bg-muted/60 px-2.5 py-0.5 rounded-md">
                      <Calendar className="w-3.5 h-3.5" />
                      {mod.period}
                    </span>
                  </div>

                  {/* Title & Icon */}
                  <div className="flex items-start gap-3">
                    <div className="p-3 bg-muted/70 border border-border rounded-2xl shrink-0 mt-0.5">
                      {mod.icon}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground leading-snug">
                        {mod.title}
                      </h3>
                    </div>
                  </div>

                  {/* Tech Stack Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {mod.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-muted text-foreground border border-border/70"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Knowledge Checklist */}
                  <ul className="space-y-2 pt-2 border-t border-border/70">
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

                {/* Milestone Deliverable Box */}
                <div className="pt-2">
                  <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/80 flex items-start gap-2.5">
                    <Target className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[11px] font-bold text-accent uppercase tracking-wider block">
                        Sản phẩm đầu ra:
                      </span>
                      <p className="text-xs text-foreground font-medium mt-0.5 leading-relaxed">
                        {mod.deliverable}
                      </p>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>
        </section>

        {/* 3. Mentor Profile Card */}
        <section className="bg-card text-card-foreground border border-border rounded-3xl p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            <div className="shrink-0 flex flex-col items-center text-center">
              <div className="relative w-24 h-24 sm:w-28 sm:h-28 flex items-center justify-center">
                <Image
                  src="/certificates/ssa-c03.webp"
                  alt="AWS Certified Solutions Architect Associate"
                  width={112}
                  height={112}
                  className="object-contain drop-shadow-sm hover:scale-105 transition-transform"
                />
              </div>
            </div>

            <div className="flex-1 min-w-0 space-y-2.5 text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                  <Award className="w-3.5 h-3.5" />
                  AWS Certified Architect
                </span>
                <span className="text-xs font-semibold text-accent uppercase tracking-wider">
                  Mentor Trực Tiếp
                </span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold text-foreground">
                Lê Khánh Đức
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Senior Java Developer & Cloud Architect • Founder JavaBuilder.online. Hướng dẫn trực tiếp, code review từng Pull Request, chia sẻ kinh nghiệm thiết kế kiến trúc thực tế doanh nghiệp.
              </p>

              <div className="pt-1 flex flex-wrap items-center justify-center sm:justify-start gap-3">
                <a
                  href={credlyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground font-semibold text-xs border border-border transition-all cursor-pointer"
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Xác thực trên Credly</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground" />
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-accent hover:underline"
                >
                  <span>Xem hồ sơ chi tiết</span>
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Contact Info Section */}
        <div
          id="contact-info"
          className="max-w-4xl mx-auto bg-card text-card-foreground rounded-3xl border border-border shadow-xs overflow-hidden scroll-mt-24"
        >
          <div className="p-6 sm:p-10 border-b border-border bg-gradient-to-r from-blue-600/5 to-purple-600/5 text-center">
            <GraduationCap className="w-10 h-10 mx-auto text-accent mb-3" />
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("mentorPage.contact.title")}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
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
                className="flex items-center gap-4 p-4 bg-background border border-border hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-blue-950/20 hover:-translate-y-0.5 rounded-2xl transition-all duration-300 group active:scale-[0.98] text-left cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/social/facebook.webp"
                    alt="Facebook"
                    width={28}
                    height={28}
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
                className="flex items-center gap-4 p-4 bg-background border border-border hover:border-teal-500/50 hover:shadow-lg dark:hover:shadow-teal-950/20 hover:-translate-y-0.5 rounded-2xl transition-all duration-300 group active:scale-[0.98] text-left cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/social/zalo.png"
                    alt="Zalo"
                    width={28}
                    height={28}
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
                className="flex items-center gap-4 p-4 bg-background border border-border hover:border-rose-500/50 hover:shadow-lg dark:hover:shadow-rose-950/20 hover:-translate-y-0.5 rounded-2xl transition-all duration-300 group active:scale-[0.98] text-left cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/social/email.webp"
                    alt="Email"
                    width={28}
                    height={28}
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
