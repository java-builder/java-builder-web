"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { CourseDetailResponse, CourseFormat, CourseLevel } from "@/types/course";
import { useI18n } from "@/contexts/I18nContext";

interface FeaturedCourseSlide {
  id: string;
  title: string;
  badge: string;
  description: string;
  imageUrl: string;
  authorName: string;
  authorAvatar: string;
  href: string;
}

interface FeaturedCourseCarouselProps {
  courses?: CourseDetailResponse[] | null;
  isLoading?: boolean;
}

const LEVEL_LABELS: Record<CourseLevel, string> = {
  [CourseLevel.BEGINNER]: "Cơ bản",
  [CourseLevel.INTERMEDIATE]: "Trung cấp",
  [CourseLevel.ADVANCED]: "Nâng cao",
  [CourseLevel.EXPERT]: "Chuyên sâu",
};

const FALLBACK_BANNERS = [
  "/banners/banner-microservices.jpg",
  "/banners/banner-websocket.jpg",
  "/banners/banner-spring-ai.jpg",
  "/banners/banner-git-github.jpg",
];

const DEFAULT_FEATURED_SLIDES: FeaturedCourseSlide[] = [
  {
    id: "microservices-spring-cloud",
    title: "Microservices với Spring Cloud",
    badge: "Chuyên sâu • Hệ thống phân tán",
    description:
      "Làm chủ kiến trúc Microservices phân tán: Service Discovery (Eureka), API Gateway, Distributed Tracing, Resilience4j và Event-Driven với Apache Kafka.",
    imageUrl: "/banners/banner-microservices.jpg",
    authorName: "JavaBuilder",
    authorAvatar: "/logos/java-logo.png",
    href: "/courses",
  },
  {
    id: "websocket-chat-app",
    title: "Xây dựng ứng dụng chat thời gian thực với WebSocket",
    badge: "Thực chiến • Real-time System",
    description:
      "Thiết kế hệ thống chat real-time với Spring Boot STOMP, Redis Pub/Sub đa instance, bảo mật WebSocket qua JWT handshake và xử lý tin nhắn chịu tải cao.",
    imageUrl: "/banners/banner-websocket.jpg",
    authorName: "JavaBuilder",
    authorAvatar: "/logos/java-logo.png",
    href: "/courses",
  },
  {
    id: "spring-ai-comprehensive",
    title: "Spring AI Toàn diện: Tích hợp LLM & RAG vào Java",
    badge: "Xu hướng mới • AI Integration",
    description:
      "Tích hợp LLM hàng đầu (OpenAI, Gemini, DeepSeek) vào hệ sinh thái Spring Boot. Triển khai kỹ thuật RAG, Vector Database (PgVector) và AI Agents thông minh.",
    imageUrl: "/banners/banner-spring-ai.jpg",
    authorName: "JavaBuilder",
    authorAvatar: "/logos/java-logo.png",
    href: "/courses",
  },
  {
    id: "git-github-mastery",
    title: "Làm chủ Git và GitHub trong dự án thực tế",
    badge: "Kỹ năng cốt lõi • Enterprise Workflow",
    description:
      "Thực hành Git chuyên nghiệp: Quy chuẩn Branching (GitFlow), Rebase, xử lý Conflict phức tạp, Interactive Staging, Cherry-pick và GitHub Actions CI/CD.",
    imageUrl: "/banners/banner-git-github.jpg",
    authorName: "JavaBuilder",
    authorAvatar: "/logos/java-logo.png",
    href: "/courses",
  },
];

export default function FeaturedCourseCarousel({
  courses,
  isLoading = false,
}: FeaturedCourseCarouselProps) {
  const { t } = useI18n();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Chỉ khi courses có dữ liệu từ API thì map các khóa học từ API
  // Còn khi courses bị null hoặc rỗng thì mới hiển thị data set mặc định hiện tại
  const hasApiCourses = Boolean(courses && Array.isArray(courses) && courses.length > 0);

  const slides: FeaturedCourseSlide[] = useMemo(() => {
    if (hasApiCourses && courses) {
      return courses.slice(0, 6).map((course, idx) => {
        const detailHref =
          course.courseFormat === CourseFormat.TEXT
            ? `/docs/${course.slug}`
            : `/courses/${course.slug}`;

        let levelLabel = "Thực chiến";
        if (course.level) {
          switch (course.level) {
            case CourseLevel.BEGINNER:
              levelLabel = t("courseDetail.beginner");
              break;
            case CourseLevel.INTERMEDIATE:
              levelLabel = t("courseDetail.intermediate");
              break;
            case CourseLevel.ADVANCED:
              levelLabel = t("courseDetail.advanced");
              break;
            case CourseLevel.EXPERT:
              levelLabel = t("courseDetail.expert");
              break;
            default:
              levelLabel = LEVEL_LABELS[course.level] || course.level;
          }
        }

        const formatLabel =
          course.courseFormat === CourseFormat.TEXT
            ? (t("sidebar.documents") || "Tài liệu")
            : (t("sidebar.courses") || "Khóa học");

        const bannerImage =
          course.thumbnailUrl || FALLBACK_BANNERS[idx % FALLBACK_BANNERS.length];

        return {
          id: course.id,
          title: course.title,
          badge: `${levelLabel} • ${formatLabel}`,
          description:
            course.description ||
            "Học tập và phát triển kỹ năng lập trình Java Backend từ cơ bản đến chuyên sâu cùng JavaBuilder.",
          imageUrl: bannerImage,
          authorName: "JavaBuilder",
          authorAvatar: "/logos/java-logo.png",
          href: detailHref,
        };
      });
    }

    // Courses mà null hoặc rỗng -> mới hiện data set hiện tại
    return DEFAULT_FEATURED_SLIDES;
  }, [courses, hasApiCourses, t]);

  const totalSlides = slides.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Reset index nếu slides thay đổi
  useEffect(() => {
    setCurrentIndex(0);
  }, [totalSlides]);

  useEffect(() => {
    if (isPaused || totalSlides <= 1) return;

    timerRef.current = setInterval(() => {
      nextSlide();
    }, 4500);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, nextSlide, totalSlides]);

  if (isLoading) {
    return (
      <div className="relative flex flex-col h-full bg-white dark:bg-slate-800/90 rounded-2xl border border-gray-200/80 dark:border-slate-700/60 shadow-sm overflow-hidden animate-pulse">
        <div className="aspect-[16/9] w-full bg-gray-200 dark:bg-slate-700" />
        <div className="p-4 sm:p-5 space-y-3">
          <div className="h-3 w-1/3 bg-gray-200 dark:bg-slate-700 rounded-sm" />
          <div className="h-5 w-3/4 bg-gray-200 dark:bg-slate-700 rounded-sm" />
          <div className="h-4 w-full bg-gray-200 dark:bg-slate-700 rounded-sm" />
          <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-700/60">
            <div className="h-4 w-20 bg-gray-200 dark:bg-slate-700 rounded-sm" />
            <div className="h-4 w-16 bg-gray-200 dark:bg-slate-700 rounded-sm" />
          </div>
        </div>
      </div>
    );
  }

  const current = slides[currentIndex] || DEFAULT_FEATURED_SLIDES[0];

  return (
    <div
      className="relative flex flex-col h-full bg-white dark:bg-slate-800/90 rounded-2xl border border-gray-200/80 dark:border-slate-700/60 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Top Banner Image with Carousel Controls */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-slate-950 group">
        <Link href={current.href} className="block relative w-full h-full">
          <Image
            src={current.imageUrl}
            alt={current.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 40vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            priority
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/10 pointer-events-none" />
        </Link>

        {/* Previous Button */}
        {totalSlides > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous slide"
            className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 dark:bg-slate-900/85 hover:bg-white dark:hover:bg-slate-900 text-gray-800 dark:text-gray-100 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-10 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}

        {/* Next Button */}
        {totalSlides > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next slide"
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/85 dark:bg-slate-900/85 hover:bg-white dark:hover:bg-slate-900 text-gray-800 dark:text-gray-100 shadow-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 z-10 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Indicator Dots */}
        {totalSlides > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/40 backdrop-blur-xs px-2.5 py-1 rounded-full">
            {slides.map((slide, index) => (
              <button
                key={slide.id + "-" + index}
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  goToSlide(index);
                }}
                className={`transition-all duration-300 rounded-full ${
                  index === currentIndex
                    ? "w-4 h-1.5 bg-accent"
                    : "w-1.5 h-1.5 bg-white/60 hover:bg-white"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Info Section */}
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="text-[11px] font-semibold text-accent tracking-wide uppercase mb-1">
            {current.badge}
          </div>
          <Link href={current.href}>
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white line-clamp-1 hover:text-accent dark:hover:text-accent transition-colors mb-1.5">
              {current.title}
            </h3>
          </Link>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {current.description}
          </p>
        </div>

        {/* Footer row with author and CTA */}
        <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full overflow-hidden bg-accent/10 flex items-center justify-center border border-gray-200 dark:border-slate-700">
              <Image
                src={current.authorAvatar}
                alt="JavaBuilder Logo"
                width={24}
                height={24}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
              {current.authorName}
            </span>
          </div>

          <Link
            href={current.href}
            className="group/link inline-flex items-center gap-1 text-xs font-semibold text-accent hover:text-accent-600 dark:hover:text-accent-400 transition-colors"
          >
            <span>{t("home.viewDetails")}</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
