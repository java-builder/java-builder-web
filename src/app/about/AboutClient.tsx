"use client";

import Image from "next/image";
import {
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Cloud,
  Database,
  Cpu,
  Terminal,
  Layers,
  Code2,
  Radio,
  CheckCircle2,
} from "lucide-react";

export default function AboutClient() {
  const credlyUrl =
    "https://www.credly.com/earner/earned/badge/9f9b7ac4-845d-46cb-a2d5-277e0f0c7baf";


  const skillRows = [
    {
      title: "Language & Backend",
      subtitle: "Ngôn ngữ & Nền tảng Backend",
      icon: <Code2 className="w-5 h-5" />,
      colorClass: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      content: (
        <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-normal">
          <strong className="font-bold text-gray-950 dark:text-white">Java Core:</strong>{" "}
          OOP principles, Collections Framework, Stream API, Lambda Expressions, Exception Handling, Multithreading.
        </p>
      ),
    },
    {
      title: "Spring Framework",
      subtitle: "Khung phát triển ứng dụng Java",
      icon: <Layers className="w-5 h-5" />,
      colorClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
      content: (
        <div className="space-y-1.5 text-xs sm:text-sm text-gray-800 dark:text-gray-100 leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <p>
              <strong className="font-bold text-gray-950 dark:text-white">Spring Boot</strong>{" "}
              – RESTful APIs, Dependency Injection
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <p>
              <strong className="font-bold text-gray-950 dark:text-white">Spring Security</strong>{" "}
              – Authentication, Authorization, JWT, OAuth2, 2FA(TOTP), Passkey
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <p>
              <strong className="font-bold text-gray-950 dark:text-white">Spring Data JPA</strong>{" "}
              – Query Method, Projections, Specifications, Pagination & Sorting, Auditing, N+1 optimization
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <p>
              <strong className="font-bold text-gray-950 dark:text-white">Spring Cloud</strong>{" "}
              – Microservices design & implementation
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <p>
              <strong className="font-bold text-gray-950 dark:text-white">Spring WebSocket, SocketIO</strong>{" "}
              – Real-time communication
            </p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-500 font-bold">•</span>
            <p>
              <strong className="font-bold text-gray-950 dark:text-white">Spring AI</strong>{" "}
              – AI integration (LLM, Chat Memory, RAG, Tool Calling, MCP)
            </p>
          </div>
        </div>
      ),
    },
    {
      title: "API & Communication",
      subtitle: "Giao thức truyền thông & Dịch vụ",
      icon: <Cpu className="w-5 h-5" />,
      colorClass: "bg-sky-500/10 text-sky-600 dark:text-sky-400 border-sky-500/20",
      content: (
        <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-normal">
          REST, gRPC, Message Queue
        </p>
      ),
    },
    {
      title: "Identity & Access Management",
      subtitle: "Bảo mật & Quản lý định danh",
      icon: <ShieldCheck className="w-5 h-5" />,
      colorClass: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
      content: (
        <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-normal">
          Keycloak, Cognito
        </p>
      ),
    },
    {
      title: "Database",
      subtitle: "Cơ sở dữ liệu & Caching",
      icon: <Database className="w-5 h-5" />,
      colorClass: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
      content: (
        <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-normal">
          MySQL, Postgres, Redis
        </p>
      ),
    },
    {
      title: "DevOps / Tools",
      subtitle: "Hạ tầng & Công cụ vận hành",
      icon: <Terminal className="w-5 h-5" />,
      colorClass: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
      content: (
        <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-normal">
          Git, Docker, CI/CD(Jenkins, Github Action), SonarQube, ELK Stack (Elasticsearch, Logstash, Kibana), Grafana
        </p>
      ),
    },
    {
      title: "Cloud Platforms",
      subtitle: "Hạ tầng đám mây",
      icon: <Cloud className="w-5 h-5" />,
      colorClass: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
      content: (
        <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-normal">
          Amazon Web Services (AWS), Google Cloud Platform (GCP)
        </p>
      ),
    },
    {
      title: "Messaging & Streaming",
      subtitle: "Hàng đợi thông điệp & Xử lý sự kiện",
      icon: <Radio className="w-5 h-5" />,
      colorClass: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
      content: (
        <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-100 leading-relaxed font-normal">
          Apache Kafka, Redis Pub/Sub
        </p>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-3.5 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-8">

        {/* 1. TOP 2-COLUMN SECTION: Java Developer & AWS Certified Solutions Architect */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          
          {/* Col 1: Java Developer Profile */}
          <div className="bg-card text-card-foreground border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xs hover:border-accent/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start sm:items-center justify-between gap-2.5 mb-3.5 sm:mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-2xl bg-muted/60 border border-border flex items-center justify-center shrink-0">
                    <Image
                      src="/logos/java-logo.png"
                      alt="JavaBuilder Logo"
                      width={28}
                      height={28}
                      className="object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                      Founder & Author
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      JavaBuilder Platform
                    </span>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-accent/10 text-accent border border-accent/20 shrink-0">
                  <Sparkles className="w-3 h-3" />
                  Java Developer
                </span>
              </div>

              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-foreground tracking-tight">
                Lê Khánh Đức
              </h1>
              <p className="text-xs sm:text-sm font-semibold text-accent mt-0.5">
                Java Developer & Cloud Solutions Architect
              </p>

              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Java Developer chuyên sâu về <strong className="text-gray-950 dark:text-white font-semibold">Java</strong> và <strong className="text-gray-950 dark:text-white font-semibold">Spring Framework Ecosystem</strong>,{" "}
                <strong className="text-gray-950 dark:text-white font-semibold">DevOps & Cloud Computing (AWS, GCP)</strong>. Người sáng lập và phát triển nền tảng học tập trực tuyến{" "}
                <a
                  href="https://javabuilder.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent underline hover:opacity-80 font-semibold break-all sm:break-normal"
                >
                  javabuilder.online
                </a>
                .
              </p>

              {/* Focus tags */}
              <div className="flex flex-wrap gap-1.5 mt-3.5 sm:mt-4">
                {[
                  "Java Core",
                  "Spring Boot",
                  "Microservices",
                  "Spring Security",
                  "Spring AI",
                  "DevOps & CI/CD",
                  "Kafka",
                  "Redis",
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 sm:pt-5 sm:mt-5 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs text-muted-foreground">
              <span>
                🌐 Nền tảng:{" "}
                <a
                  href="https://javabuilder.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline font-semibold"
                >
                  javabuilder.online
                </a>
              </span>
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Active
              </span>
            </div>
          </div>

          {/* Col 2: AWS Certified Solutions Architect – Associate */}
          <div className="bg-card text-card-foreground border border-border rounded-2xl sm:rounded-3xl p-5 sm:p-6 lg:p-7 shadow-xs hover:border-accent/30 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-start justify-between gap-2.5 mb-3.5 sm:mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 sm:w-14 sm:h-14 shrink-0 flex items-center justify-center">
                    <Image
                      src="/ssa-c03.webp"
                      alt="AWS Certified Solutions Architect Associate"
                      width={56}
                      height={56}
                      className="object-contain drop-shadow-sm hover:scale-105 transition-transform"
                      priority
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider block">
                      Amazon Web Services
                    </span>
                    <span className="text-xs font-semibold text-muted-foreground">
                      Training & Certification
                    </span>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 shrink-0">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>

              <h2 className="text-lg sm:text-xl font-bold text-foreground leading-snug">
                AWS Certified Solutions Architect – Associate
              </h2>
              <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">
                Người nhận: <strong className="text-gray-950 dark:text-white font-semibold">Le Khanh Duc</strong> • Ngày cấp: <strong className="text-gray-950 dark:text-white font-semibold">Sep 10, 2026</strong>
              </p>

              <p className="mt-2 text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                Chứng nhận năng lực toàn diện trong việc thiết kế các giải pháp điện toán đám mây an toàn, bền vững, tối ưu chi phí và đạt tính sẵn sàng cao (High Availability) trên AWS.
              </p>

              {/* AWS tags */}
              <div className="flex flex-wrap gap-1.5 mt-3.5">
                {[
                  "AWS Cloud",
                  "Cloud Architecture",
                  "High Availability",
                  "Cost Optimization",
                  "Cloud Security",
                  "CI/CD",
                  "Serverless Application",
                ].map((tag, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 dark:bg-slate-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-slate-700"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-4 sm:pt-5 sm:mt-5 border-t border-border/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <span className="text-xs text-muted-foreground">
                AWS Training & Certification
              </span>
              <a
                href={credlyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 h-8 px-3.5 rounded-lg bg-accent text-white font-medium shadow-xs hover:bg-accent-600 transition-all duration-200 active:scale-[0.98] text-xs cursor-pointer w-full sm:w-auto"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Xác thực trên Credly</span>
                <ExternalLink className="w-3 h-3 ml-0.5 opacity-80" />
              </a>
            </div>
          </div>

        </div>

        {/* 2. TECHNICAL SKILLS SECTION - Chuẩn Style Bảng Kỹ Năng CV */}
        <div id="skills" className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2 border-b border-border pb-3">
            <div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-extrabold text-foreground">
                Kỹ Năng Kỹ Thuật Chuyên Môn
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Chi tiết các công nghệ và kỹ năng chuyên sâu được đúc kết từ kinh nghiệm phát triển thực tế
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20">
              Technical Expertise
            </span>
          </div>

          <div className="bg-card text-card-foreground border border-border rounded-2xl sm:rounded-3xl divide-y divide-border overflow-hidden shadow-xs">
            {skillRows.map((row, idx) => (
              <div
                key={idx}
                className="p-4 sm:p-5 lg:p-6 flex flex-col md:flex-row md:items-start gap-3 sm:gap-4 md:gap-6 lg:gap-8 hover:bg-muted/30 transition-colors"
              >
                {/* Left Column: Icon + Title + Subtitle */}
                <div className="w-full md:w-72 lg:w-80 md:min-w-[260px] shrink-0 flex items-start gap-3">
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${row.colorClass}`}
                  >
                    {row.icon}
                  </div>
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-foreground leading-snug">
                      {row.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {row.subtitle}
                    </p>
                  </div>
                </div>

                {/* Right Column: Detailed Skill Content */}
                <div className="flex-1 min-w-0">
                  {row.content}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
