"use client";

import { useState } from "react";
import Image from "next/image";
import MotionWrapper from "@/components/MotionWrapper";
import { FaCheckCircle, FaClock, FaChevronDown, FaChevronUp } from "react-icons/fa";

interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  topics: string[];
  logo: string;
  phase: "foundation" | "spring" | "advanced";
}

const roadmapSteps: RoadmapStep[] = [
  {
    id: "java-core",
    title: "Java Core",
    description: "Nền tảng vững chắc với Java cơ bản, OOP và các khái niệm quan trọng",
    duration: "2 tháng",
    topics: [
      "Cú pháp Java, biến, kiểu dữ liệu",
      "OOP: Class, Inheritance, Polymorphism, Encapsulation",
      "Collections Framework: List, Set, Map",
      "Exception Handling",
      "Lambda Expressions & Stream API",
      "Generics và Annotations"
    ],
    logo: "/logos/logo-java.png",
    phase: "foundation"
  },
  {
    id: "sql",
    title: "SQL & Database",
    description: "Cơ sở dữ liệu quan hệ và ngôn ngữ truy vấn SQL",
    duration: "1 tháng",
    topics: [
      "DDL: CREATE, ALTER, DROP",
      "DML: SELECT, INSERT, UPDATE, DELETE",
      "JOIN, Subquery, Aggregate Functions",
      "Index, View, Stored Procedures",
      "Transaction & ACID Properties",
      "PostgreSQL / MySQL"
    ],
    logo: "/logos/logo-posgtres.png",
    phase: "foundation"
  },
  {
    id: "jdbc",
    title: "JDBC",
    description: "Kết nối Java với Database thông qua JDBC API",
    duration: "2 tuần",
    topics: [
      "JDBC Architecture",
      "Connection, Statement, ResultSet",
      "PreparedStatement & CallableStatement",
      "Transaction Management",
      "Connection Pooling (HikariCP)"
    ],
    logo: "/logos/logo-jdbc.png",
    phase: "foundation"
  },
  {
    id: "hibernate",
    title: "Hibernate ORM",
    description: "Object-Relational Mapping Framework",
    duration: "1 tháng",
    topics: [
      "ORM Concepts & Benefits",
      "Entity Mapping & Annotations",
      "Relationships: OneToOne, OneToMany, ManyToMany",
      "HQL & Criteria API",
      "Lazy vs Eager Loading",
      "Caching Strategies (First-level, Second-level)"
    ],
    logo: "/logos/logo-hibernate.png",
    phase: "foundation"
  },
  {
    id: "spring-boot",
    title: "Spring Boot",
    description: "Framework xây dựng ứng dụng production-ready",
    duration: "2 tháng",
    topics: [
      "IoC Container & Dependency Injection",
      "Auto-configuration & Starter Dependencies",
      "Spring MVC & RESTful API",
      "Spring Data JPA",
      "Exception Handling & Validation",
      "Testing: Unit & Integration Tests",
      "Spring Boot Actuator"
    ],
    logo: "/logos/logo-springboot.png",
    phase: "spring"
  },
  {
    id: "spring-security",
    title: "Spring Security",
    description: "Bảo mật ứng dụng với Authentication & Authorization",
    duration: "1.5 tháng",
    topics: [
      "Security Architecture & Filter Chain",
      "Authentication: Form Login, HTTP Basic",
      "JWT Token Authentication",
      "OAuth2 & OpenID Connect",
      "Method-level Security (@PreAuthorize, @Secured)",
      "RBAC (Role-Based Access Control)",
      "CORS & CSRF Protection"
    ],
    logo: "/logos/logo-security-black.webp",
    phase: "spring"
  },
  {
    id: "cache-messaging",
    title: "Caching & Messaging",
    description: "Redis, Message Queue và xử lý bất đồng bộ",
    duration: "1.5 tháng",
    topics: [
      "Redis: Caching Strategies",
      "Spring Cache Abstraction",
      "RabbitMQ / Apache Kafka",
      "Event-Driven Architecture",
      "Async Processing với @Async",
      "WebSocket cho Real-time Communication"
    ],
    logo: "/logos/logo-cache.png",
    phase: "spring"
  },
  {
    id: "microservices",
    title: "Microservices Architecture",
    description: "Kiến trúc Microservices và Design Patterns",
    duration: "2 tháng",
    topics: [
      "Monolith vs Microservices",
      "Service Discovery Pattern",
      "API Gateway Pattern",
      "Circuit Breaker Pattern (Resilience4j)",
      "Saga Pattern cho Distributed Transactions",
      "Database per Service",
      "Event Sourcing & CQRS"
    ],
    logo: "/logos/logo-microservices.png",
    phase: "advanced"
  },
  {
    id: "spring-cloud",
    title: "Spring Cloud",
    description: "Spring Cloud cho hệ thống phân tán",
    duration: "1.5 tháng",
    topics: [
      "Eureka Server & Client (Service Discovery)",
      "Spring Cloud Gateway",
      "Spring Cloud Config Server",
      "OpenFeign for Service Communication",
      "Spring Cloud Sleuth & Zipkin (Distributed Tracing)",
      "Spring Cloud Stream"
    ],
    logo: "/logos/aws-logo.png",
    phase: "advanced"
  },
  {
    id: "docker",
    title: "Docker & Containerization",
    description: "Container hóa ứng dụng với Docker",
    duration: "1 tháng",
    topics: [
      "Docker Fundamentals",
      "Dockerfile Best Practices",
      "Docker Compose",
      "Multi-stage Builds",
      "Docker Networking & Volumes",
      "Container Orchestration Basics"
    ],
    logo: "/logos/logo-docker.png",
    phase: "advanced"
  },
  {
    id: "devops",
    title: "DevOps & Cloud",
    description: "CI/CD, Kubernetes và Cloud Deployment",
    duration: "1.5 tháng",
    topics: [
      "Kubernetes Fundamentals",
      "CI/CD Pipeline (Jenkins, GitLab CI)",
      "AWS Services: EC2, RDS, S3, ECS",
      "Monitoring: Prometheus & Grafana",
      "Logging: ELK Stack",
      "Infrastructure as Code (Terraform)"
    ],
    logo: "/logos/logo-docker.png",
    phase: "advanced"
  }
];

export default function RoadmapTimeline() {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case "foundation": return "orange";
      case "spring": return "green";
      case "advanced": return "purple";
      default: return "blue";
    }
  };

  const getPhaseLabel = (phase: string) => {
    switch (phase) {
      case "foundation": return "Nền tảng";
      case "spring": return "Spring Ecosystem";
      case "advanced": return "Nâng cao";
      default: return "";
    }
  };

  return (
    <section id="timeline" className="py-16 md:py-20 bg-white dark:bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Lộ trình chi tiết
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Click vào từng bước để xem chi tiết nội dung cần học
            </p>
          </div>
        </MotionWrapper>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-orange-500 via-green-500 to-purple-500" />

          <div className="space-y-6">
            {roadmapSteps.map((step, index) => {
              const isExpanded = expandedStep === step.id;
              const phaseColor = getPhaseColor(step.phase);
              
              return (
                <MotionWrapper key={step.id} animation="fadeInUp" delay={index * 0.05} duration={0.5}>
                  <div className="relative pl-20">
                    {/* Timeline dot */}
                    <div className={`absolute left-6 top-6 w-5 h-5 rounded-full border-4 border-white dark:border-slate-900 ${
                      phaseColor === 'orange' ? 'bg-orange-500' :
                      phaseColor === 'green' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`} />

                    {/* Step number */}
                    <div className={`absolute left-3 top-2 w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                      phaseColor === 'orange' ? 'bg-orange-500' :
                      phaseColor === 'green' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`}>
                      {index + 1}
                    </div>

                    <div 
                      className={`bg-gray-50 dark:bg-slate-800 rounded-xl border-2 transition-all duration-300 cursor-pointer ${
                        isExpanded 
                          ? phaseColor === 'orange' ? 'border-orange-500 shadow-lg' :
                            phaseColor === 'green' ? 'border-green-500 shadow-lg' :
                            'border-purple-500 shadow-lg'
                          : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                      }`}
                      onClick={() => setExpandedStep(isExpanded ? null : step.id)}
                    >
                      <div className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white dark:bg-slate-700 p-2">
                            <Image 
                              src={step.logo} 
                              alt={step.title} 
                              width={64} 
                              height={64} 
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-2">
                              <div>
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                  {step.title}
                                </h3>
                                <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                                  phaseColor === 'orange' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' :
                                  phaseColor === 'green' ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300' :
                                  'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                }`}>
                                  {getPhaseLabel(step.phase)}
                                </span>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm">
                                  <FaClock className="text-accent" />
                                  <span>{step.duration}</span>
                                </div>
                                {isExpanded ? (
                                  <FaChevronUp className="text-gray-400" />
                                ) : (
                                  <FaChevronDown className="text-gray-400" />
                                )}
                              </div>
                            </div>

                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                              {step.description}
                            </p>

                            {isExpanded && (
                              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                  Nội dung chi tiết:
                                </h4>
                                <ul className="grid md:grid-cols-2 gap-2">
                                  {step.topics.map((topic, i) => (
                                    <li key={i} className="flex items-start gap-2 text-sm">
                                      <FaCheckCircle className={`mt-0.5 flex-shrink-0 ${
                                        phaseColor === 'orange' ? 'text-orange-500' :
                                        phaseColor === 'green' ? 'text-green-500' :
                                        'text-purple-500'
                                      }`} />
                                      <span className="text-gray-700 dark:text-gray-300">{topic}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
