"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Coffee,
  QrCode,
  Smartphone,
  Download,
  Server,
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

type PaymentMethod = "mb" | "momo";

interface SupportTier {
  amount: string;
  label: string;
  icon: string;
}

const SUPPORT_TIERS: SupportTier[] = [
  { amount: "20.000đ", label: "Ly cà phê sáng", icon: "☕" },
  { amount: "50.000đ", label: "Ly trà sữa tiếp sức", icon: "🧋" },
  { amount: "100.000đ", label: "Bữa ăn ấm lòng", icon: "🍕" },
  { amount: "Tùy tâm", label: "Tấm lòng yêu quý", icon: "💖" },
];

export default function AboutClient() {
  const [method, setMethod] = useState<PaymentMethod>("mb");
  const [selectedTier, setSelectedTier] = useState<SupportTier>(SUPPORT_TIERS[0]);

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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 items-stretch">

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
              <div className="flex items-center gap-2">
                <a
                  href="#donate"
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 transition-all cursor-pointer active:scale-95"
                >
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  <span>Ủng hộ dự án</span>
                </a>
                <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Active
                </span>
              </div>
            </div>
          </div>

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

        {/* 3. DONATE & SUPPORT SECTION - Tiếp sức cho tác giả & JavaBuilder */}
        <div id="donate" className="pt-4 sm:pt-6 scroll-mt-20">
          <div className="bg-card text-card-foreground border border-border rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl shadow-accent/5 relative overflow-hidden">
            {/* Ambient Background Accent Glow */}
            <div className="absolute -top-24 -right-24 w-60 h-60 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-12">
              {/* Left Column: Intro & Mission */}
              <div className="w-full lg:w-5/12 text-left space-y-4 sm:space-y-5">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Tiếp sức cho tác giả</span>
                  <Heart className="w-3 h-3 fill-rose-500 text-rose-500 ml-0.5" />
                </div>

                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                  Tiếp Sức Cho <br className="hidden sm:inline" />
                  <span className="text-accent">JavaBuilder</span>
                </h2>

                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Mỗi sự đóng góp — dù chỉ là một ly cà phê — đều trực tiếp giúp Đức duy trì hạ tầng máy chủ,
                  database và tiếp tục cung cấp nội dung học lập trình Java Backend chất lượng cao hoàn toàn miễn phí tới cộng đồng.
                </p>

                {/* Mission points */}
                <div className="pt-2 sm:pt-4 space-y-3.5 border-t border-border/70">
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                      <Server className="w-4 h-4" />
                    </div>
                    <span>Duy trì máy chủ & hạ tầng cloud 24/7</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span>100% ủng hộ tự nguyện, không ràng buộc</span>
                  </div>

                  <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                    <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
                      <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    </div>
                    <span>Chân thành cảm ơn sự đồng hành và tin tưởng của bạn</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Payment Station Card */}
              <div className="w-full lg:w-7/12 max-w-lg mx-auto lg:max-w-none">
                <div className="bg-muted/30 dark:bg-muted/20 border border-border/80 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs">
                  {/* Method Tabs */}
                  <div className="flex items-center justify-center p-1 bg-muted/80 dark:bg-muted/50 rounded-2xl border border-border max-w-xs mx-auto mb-5">
                    <button
                      type="button"
                      onClick={() => setMethod("mb")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        method === "mb"
                          ? "bg-card text-foreground shadow-xs border border-border/60"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                      <QrCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                      <span className="whitespace-nowrap">MB Bank</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setMethod("momo")}
                      className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                        method === "momo"
                          ? "bg-card text-foreground shadow-xs border border-border/60"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                      <Smartphone className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                      <span className="whitespace-nowrap">Ví MoMo</span>
                    </button>
                  </div>

                  {/* Method Header: Bank Name & Badge */}
                  <div className="flex items-center justify-between gap-3 pb-3 mb-5 border-b border-border">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-foreground truncate">
                        {method === "mb" ? "Ngân hàng Quân Đội (MB Bank)" : "Ví Điện Tử MoMo"}
                      </h3>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {method === "mb"
                          ? "Quét bằng app ngân hàng bất kỳ để chuyển khoản 24/7"
                          : "Quét bằng app MoMo để chuyển tiền tức thì"}
                      </p>
                    </div>
                    <span
                      className={`shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        method === "mb"
                          ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                          : "bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20"
                      }`}
                    >
                      {method === "mb" ? "VietQR 24/7" : "MoMo Pay"}
                    </span>
                  </div>

                  {/* QR Code Container */}
                  <div className="flex flex-col items-center mb-5">
                    <div className="relative p-2.5 bg-white rounded-2xl border border-border shadow-xs group">
                      {/* Camera Viewfinder Corners */}
                      <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-accent rounded-tl-md pointer-events-none" />
                      <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-accent rounded-tr-md pointer-events-none" />
                      <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-accent rounded-bl-md pointer-events-none" />
                      <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-accent rounded-br-md pointer-events-none" />

                      <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-xl overflow-hidden">
                        <Image
                          src={method === "mb" ? "/donate/qrcode.jpg" : "/donate/momo-qr.jpg"}
                          alt={method === "mb" ? "MB Bank VietQR" : "MoMo QR"}
                          fill
                          className="object-contain"
                          sizes="(max-width: 640px) 176px, 192px"
                        />
                      </div>
                    </div>

                    <a
                      href={method === "mb" ? "/donate/qrcode.jpg" : "/donate/momo-qr.jpg"}
                      download={method === "mb" ? "JavaBuilder-MB-VietQR.jpg" : "JavaBuilder-MoMo-QR.jpg"}
                      className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Tải ảnh mã QR</span>
                    </a>
                  </div>

                  {/* Coffee Tiers */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-500" />
                      <span>Chọn mức tiếp sức yêu thích:</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SUPPORT_TIERS.map((tier) => {
                        const isSelected = selectedTier.amount === tier.amount;
                        return (
                          <button
                            key={tier.amount}
                            type="button"
                            onClick={() => setSelectedTier(tier)}
                            className={`text-center p-2 rounded-xl border transition-all text-xs cursor-pointer ${
                              isSelected
                                ? "bg-accent/10 border-accent/50 text-foreground ring-1 ring-accent/30 shadow-xs font-semibold"
                                : "bg-card hover:bg-muted/60 border-border text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <div className="flex items-center justify-center gap-1 font-bold text-foreground">
                              <span>{tier.icon}</span>
                              <span className="whitespace-nowrap">{tier.amount}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                              {tier.label}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
