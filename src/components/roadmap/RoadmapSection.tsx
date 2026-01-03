"use client";

import { useState } from "react";
import Image from "next/image";
import MotionWrapper from "@/components/MotionWrapper";
import { FaCheckCircle, FaClock } from "react-icons/fa";

interface RoadmapStep {
  id: string;
  title: string;
  shortTitle: string;
  description: string;
  duration: string;
  topics: string[];
  logo: string;
  bgColor: string;
  logoSize?: string;
}

const roadmapData: RoadmapStep[] = [
  {
    id: "java-core",
    title: "Java Core",
    shortTitle: "Java Core",
    description: "Nền tảng vững chắc với Java cơ bản, OOP và các khái niệm quan trọng",
    duration: "2 tháng",
    topics: ["Cú pháp Java, biến, kiểu dữ liệu", "OOP: Class, Inheritance, Polymorphism", "Collections: List, Set, Map", "Exception Handling", "Lambda, Stream API, Optional", "Generics và Annotations"],
    logo: "/logos/logo-java.png",
    bgColor: "bg-orange-500",
  },
  {
    id: "sql",
    title: "SQL & Database",
    shortTitle: "SQL",
    description: "Cơ sở dữ liệu quan hệ và ngôn ngữ truy vấn SQL",
    duration: "1 tháng",
    topics: ["DDL: CREATE, ALTER, DROP", "DML: SELECT, INSERT, UPDATE, DELETE", "JOIN, Subquery, Aggregate", "Index, View, Transaction", "PostgreSQL / MySQL"],
    logo: "/logos/logo-posgtres.png",
    bgColor: "bg-blue-500",
  },
  {
    id: "jdbc",
    title: "JDBC",
    shortTitle: "JDBC",
    description: "Kết nối Java với Database thông qua JDBC API",
    duration: "2 tuần",
    topics: ["JDBC Architecture", "Connection, Statement, ResultSet", "PreparedStatement", "Transaction Management", "Connection Pooling"],
    logo: "/logos/logo-jdbc.png",
    bgColor: "bg-sky-600",
    logoSize: "w-14 h-14 sm:w-16 sm:h-16",
  },
  {
    id: "hibernate",
    title: "Hibernate",
    shortTitle: "Hibernate",
    description: "ORM Framework để mapping Object với Database",
    duration: "1 tháng",
    topics: ["ORM Concept", "Entity, Annotations", "Relationships mapping", "HQL Query", "Caching strategies"],
    logo: "/logos/logo-hibernate.png",
    bgColor: "bg-amber-600",
  },
  {
    id: "spring-boot",
    title: "Spring Boot",
    shortTitle: "Spring Boot",
    description: "Framework xây dựng ứng dụng production-ready",
    duration: "2 tháng",
    topics: ["IoC Container, DI", "Auto-configuration", "Spring Data JPA", "REST API, MVC", "Exception Handling", "Validation, Testing"],
    logo: "/logos/logo-springboot.png",
    bgColor: "bg-green-600",
  },
  {
    id: "jpa",
    title: "JPA",
    shortTitle: "JPA",
    description: "Java Persistence API - Specification chuẩn cho ORM",
    duration: "2 tuần",
    topics: ["JPA Specification", "JPQL, Criteria API", "Lazy vs Eager Loading", "Entity Lifecycle", "Spring Data JPA"],
    logo: "/logos/logo-jpa.jpg",
    bgColor: "bg-gradient-to-r from-sky-600 to-orange-500",
  },
  {
    id: "security",
    title: "Spring Security",
    shortTitle: "Security",
    description: "Bảo mật ứng dụng với Authentication & Authorization",
    duration: "1 tháng",
    topics: ["Security Filter Chain", "JWT Token", "OAuth2, OpenID Connect", "Method Security", "RBAC"],
    logo: "/logos/logo-security-black.webp",
    bgColor: "bg-green-700",
    logoSize: "w-14 h-14 sm:w-16 sm:h-16",
  },
  {
    id: "cache",
    title: "Caching & Message Queue",
    shortTitle: "Cache",
    description: "Redis, Kafka, WebSocket và các chủ đề nâng cao",
    duration: "1.5 tháng",
    topics: ["Redis Caching", "RabbitMQ / Kafka", "WebSocket", "Async Processing", "Docker basics"],
    logo: "/logos/logo-cache.png",
    bgColor: "bg-red-600",
  },
  {
    id: "microservices",
    title: "Microservices",
    shortTitle: "Microservices",
    description: "Kiến trúc Microservices và các patterns",
    duration: "2 tháng",
    topics: ["Service Discovery", "API Gateway", "Circuit Breaker", "Distributed Tracing", "Event-Driven"],
    logo: "/logos/logo-microservices.png",
    bgColor: "bg-indigo-600",
  },
  {
    id: "cloud",
    title: "Spring Cloud",
    shortTitle: "Cloud",
    description: "Spring Cloud cho hệ thống phân tán",
    duration: "1.5 tháng",
    topics: ["Eureka, Gateway", "Config Server", "OpenFeign", "Sleuth & Zipkin", "Spring Cloud Stream"],
    logo: "/logos/aws-logo.png",
    bgColor: "bg-blue-500",
  },
  {
    id: "devops",
    title: "DevOps",
    shortTitle: "DevOps",
    description: "CI/CD, Docker, Kubernetes và Cloud",
    duration: "1.5 tháng",
    topics: ["Docker & Compose", "Kubernetes", "CI/CD Pipeline", "AWS Services", "Monitoring"],
    logo: "/logos/logo-docker.png",
    bgColor: "bg-sky-600",
    logoSize: "w-16 h-16 sm:w-20 sm:h-20",
  },
];

export default function RoadmapSection() {
  const [hoveredStep, setHoveredStep] = useState<RoadmapStep | null>(null);

  return (
    <section className="py-12 bg-gray-100 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="text-center mb-6 md:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2 md:mb-3">
              Sơ đồ lộ trình học tập
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm md:text-base max-w-2xl mx-auto">
              Di chuột vào từng bước để xem chi tiết nội dung cần học
            </p>
          </div>
        </MotionWrapper>

        <MotionWrapper animation="fadeInUp" delay={0.2}>
          {/* Desktop View */}
          <div className="hidden xl:block relative bg-white dark:bg-slate-800 rounded-2xl p-6 xl:p-10 border border-gray-200 dark:border-slate-700">
            <div className="flex flex-col items-center gap-6">
              {/* Row 1 */}
              <div className="relative flex items-center justify-center gap-3">
                {roadmapData.slice(0, 4).map((step, index) => (
                  <RoadmapCard key={step.id} step={step} index={index + 1} isHovered={hoveredStep?.id === step.id} onHover={setHoveredStep} showArrow={index < 3} />
                ))}
              </div>

              <svg className="w-5 h-10 text-accent" viewBox="0 0 20 40" fill="none">
                <path d="M10 0V36M10 36L3 28M10 36L17 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Row 2 */}
              <div className="relative flex items-center justify-center gap-3">
                {roadmapData.slice(4, 8).map((step, index) => (
                  <RoadmapCard key={step.id} step={step} index={index + 5} isHovered={hoveredStep?.id === step.id} onHover={setHoveredStep} showArrow={index < 3} />
                ))}
              </div>

              <svg className="w-5 h-10 text-accent" viewBox="0 0 20 40" fill="none">
                <path d="M10 0V36M10 36L3 28M10 36L17 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {/* Row 3 */}
              <div className="relative flex items-center justify-center gap-3">
                {roadmapData.slice(8, 11).map((step, index) => (
                  <RoadmapCard key={step.id} step={step} index={index + 9} isHovered={hoveredStep?.id === step.id} onHover={setHoveredStep} showArrow={index < 2} />
                ))}
              </div>

              {/* Labels */}
              <div className="flex justify-center gap-4 mt-6">
                <span className="text-xs font-medium text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 px-4 py-1.5 rounded-full">Nền tảng</span>
                <span className="text-xs font-medium text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-4 py-1.5 rounded-full">Spring Ecosystem</span>
                <span className="text-xs font-medium text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-4 py-1.5 rounded-full">Nâng cao & DevOps</span>
              </div>
            </div>
          </div>

          {/* Tablet View */}
          <div className="hidden md:block xl:hidden">
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-gray-200 dark:border-slate-700">
              <div className="grid grid-cols-2 gap-4">
                {roadmapData.map((step, index) => (
                  <TabletRoadmapCard key={step.id} step={step} index={index + 1} />
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                <span className="text-xs font-medium text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 px-3 py-1 rounded-full">Nền tảng</span>
                <span className="text-xs font-medium text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full">Spring Ecosystem</span>
                <span className="text-xs font-medium text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-full">Nâng cao & DevOps</span>
              </div>
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden">
            <div className="relative">
              <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-accent/30" />
              <div className="space-y-4">
                {roadmapData.map((step, index) => (
                  <MobileRoadmapCard key={step.id} step={step} index={index + 1} />
                ))}
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-8">
              <span className="text-xs font-medium text-orange-800 dark:text-orange-300 bg-orange-100 dark:bg-orange-900/40 px-3 py-1 rounded-full">Nền tảng</span>
              <span className="text-xs font-medium text-green-800 dark:text-green-300 bg-green-100 dark:bg-green-900/40 px-3 py-1 rounded-full">Spring Ecosystem</span>
              <span className="text-xs font-medium text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-900/40 px-3 py-1 rounded-full">Nâng cao & DevOps</span>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}


// Desktop Roadmap Card
function RoadmapCard({ step, index, isHovered, onHover, showArrow }: { 
  step: RoadmapStep; index: number; isHovered: boolean; onHover: (step: RoadmapStep | null) => void; showArrow: boolean;
}) {
  const logoSizeClass = step.logoSize || "w-12 h-12 sm:w-14 sm:h-14";
  
  return (
    <div className="flex items-center">
      <div className="relative group">
        <div
          onMouseEnter={() => onHover(step)}
          onMouseLeave={() => onHover(null)}
          className={`relative flex flex-col items-center justify-center w-28 h-28 sm:w-32 sm:h-32 rounded-2xl border-2 transition-all duration-300 bg-gray-50 dark:bg-slate-700 cursor-pointer ${
            isHovered ? "border-accent shadow-xl scale-105 ring-4 ring-accent/20" : "border-gray-200 dark:border-slate-600 hover:border-accent/50 hover:shadow-lg"
          }`}
        >
          <div className={`${logoSizeClass} rounded-lg overflow-hidden mb-2`}>
            <Image src={step.logo} alt={step.title} width={72} height={72} className="w-full h-full object-contain" />
          </div>
          <span className="text-xs sm:text-sm font-semibold text-gray-800 dark:text-white text-center leading-tight">{step.shortTitle}</span>
          <span className="absolute -top-2 -left-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold shadow">
            {index}
          </span>
        </div>

        {isHovered && (
          <div className="absolute z-50 left-1/2 -translate-x-1/2 bottom-full mb-3 pointer-events-none">
            <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 w-80 animate-fadeIn">
              <div className="absolute left-1/2 -translate-x-1/2 -bottom-2 w-4 h-4 bg-white dark:bg-slate-800 border-r border-b border-gray-200 dark:border-slate-700 rotate-45" />
              <div className="relative p-5">
                <div className="text-center mb-4">
                  <span className="inline-block text-accent text-xs font-bold tracking-wider uppercase mb-1">Giai đoạn {index}</span>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{step.title}</h3>
                  <div className="flex items-center justify-center gap-1 text-gray-500 dark:text-gray-400 text-sm mt-1">
                    <FaClock className="w-3 h-3" />
                    <span>{step.duration}</span>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm text-center italic mb-4">&ldquo;{step.description}&rdquo;</p>
                <div className="space-y-2">
                  {step.topics.map((topic, i) => (
                    <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <FaCheckCircle className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                      <span>{topic}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {showArrow && (
        <svg className="w-8 h-5 text-accent mx-1" viewBox="0 0 32 20" fill="none">
          <path d="M0 10H28M28 10L20 3M28 10L20 17" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )}
    </div>
  );
}

// Mobile Roadmap Card
function MobileRoadmapCard({ step, index }: { step: RoadmapStep; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="relative pl-14">
      <div className="absolute left-4 top-4 w-5 h-5 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold shadow z-10">
        {index}
      </div>
      
      <div 
        className={`bg-white dark:bg-slate-800 rounded-xl border-2 transition-all duration-300 ${isExpanded ? "border-accent shadow-lg" : "border-gray-200 dark:border-slate-700"}`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="p-4 flex items-center gap-3 cursor-pointer">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={step.logo} alt={step.title} width={48} height={48} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{step.title}</h3>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mt-0.5">
              <FaClock className="w-3 h-3" />
              <span>{step.duration}</span>
            </div>
          </div>
          <svg className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isExpanded && (
          <div className="px-4 pb-4 border-t border-gray-200 dark:border-slate-700 pt-3">
            <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-3">&ldquo;{step.description}&rdquo;</p>
            <div className="space-y-2">
              {step.topics.map((topic, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FaCheckCircle className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Tablet Roadmap Card
function TabletRoadmapCard({ step, index }: { step: RoadmapStep; index: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div 
      className={`relative bg-white dark:bg-slate-800 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
        isExpanded ? "border-accent shadow-lg" : "border-gray-200 dark:border-slate-700 hover:border-accent/50 hover:shadow-md"
      }`}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      <span className="absolute -top-2 -left-2 w-6 h-6 rounded-full bg-accent text-white text-xs flex items-center justify-center font-bold shadow z-10">
        {index}
      </span>
      
      <div className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0">
            <Image src={step.logo} alt={step.title} width={48} height={48} className="w-full h-full object-contain" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 dark:text-white text-sm">{step.title}</h3>
            <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-xs mt-0.5">
              <FaClock className="w-3 h-3" />
              <span>{step.duration}</span>
            </div>
          </div>
          <svg className={`w-5 h-5 text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
        
        {isExpanded && (
          <div className="border-t border-gray-200 dark:border-slate-700 pt-3 mt-2">
            <p className="text-gray-600 dark:text-gray-400 text-sm italic mb-3">&ldquo;{step.description}&rdquo;</p>
            <div className="space-y-2">
              {step.topics.map((topic, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <FaCheckCircle className="w-3.5 h-3.5 text-accent mt-0.5 flex-shrink-0" />
                  <span>{topic}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
