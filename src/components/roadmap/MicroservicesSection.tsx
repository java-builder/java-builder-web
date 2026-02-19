"use client";

import MotionWrapper from "@/components/MotionWrapper";
import { FaCubes, FaNetworkWired, FaCloud, FaDocker } from "react-icons/fa";

const architecturePatterns = [
  {
    icon: FaNetworkWired,
    title: "Service Discovery",
    description: "Eureka Server & Client",
    details: "Tự động phát hiện và đăng ký services trong hệ thống phân tán"
  },
  {
    icon: FaCloud,
    title: "API Gateway",
    description: "Spring Cloud Gateway",
    details: "Điểm vào duy nhất cho tất cả requests, routing và load balancing"
  },
  {
    icon: FaCubes,
    title: "Circuit Breaker",
    description: "Resilience4j",
    details: "Xử lý lỗi và tránh cascade failures trong hệ thống"
  },
  {
    icon: FaDocker,
    title: "Config Server",
    description: "Centralized Configuration",
    details: "Quản lý cấu hình tập trung cho tất cả microservices"
  }
];

const microservicesTopics = [
  {
    category: "Architecture & Design",
    topics: [
      "Monolith vs Microservices",
      "Domain-Driven Design (DDD)",
      "Database per Service",
      "Service Boundaries",
      "API Design Best Practices"
    ]
  },
  {
    category: "Communication",
    topics: [
      "Synchronous: REST, gRPC",
      "Asynchronous: Message Queue",
      "Event-Driven Architecture",
      "OpenFeign Client",
      "Service Mesh"
    ]
  },
  {
    category: "Data Management",
    topics: [
      "Saga Pattern",
      "Event Sourcing",
      "CQRS Pattern",
      "Distributed Transactions",
      "Data Consistency"
    ]
  },
  {
    category: "Observability",
    topics: [
      "Distributed Tracing (Zipkin)",
      "Centralized Logging (ELK)",
      "Metrics (Prometheus)",
      "Health Checks",
      "Monitoring Dashboards"
    ]
  }
];

const springCloudComponents = [
  { name: "Eureka", description: "Service Discovery" },
  { name: "Gateway", description: "API Gateway" },
  { name: "Config", description: "Configuration Server" },
  { name: "OpenFeign", description: "Declarative REST Client" },
  { name: "Sleuth", description: "Distributed Tracing" },
  { name: "Stream", description: "Message-Driven Microservices" }
];

export default function MicroservicesSection() {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-4">
              <FaCubes className="text-purple-600 dark:text-purple-400" />
              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Advanced Architecture</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Microservices với Spring Cloud
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Xây dựng hệ thống phân tán, có khả năng mở rộng cao với kiến trúc Microservices và Spring Cloud
            </p>
          </div>
        </MotionWrapper>

        {/* Architecture Patterns */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {architecturePatterns.map((pattern, index) => (
            <MotionWrapper key={index} animation="fadeInUp" delay={index * 0.1} duration={0.6}>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all hover:-translate-y-1">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <pattern.icon className="text-2xl text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  {pattern.title}
                </h3>
                <p className="text-sm font-medium text-purple-600 dark:text-purple-400 mb-2">
                  {pattern.description}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {pattern.details}
                </p>
              </div>
            </MotionWrapper>
          ))}
        </div>

        {/* Topics Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          {microservicesTopics.map((section, index) => (
            <MotionWrapper key={index} animation="fadeInUp" delay={index * 0.1} duration={0.6}>
              <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-slate-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400 text-sm font-bold">
                    {index + 1}
                  </span>
                  {section.category}
                </h3>
                <ul className="space-y-2">
                  {section.topics.map((topic, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mt-2 flex-shrink-0" />
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </MotionWrapper>
          ))}
        </div>

        {/* Spring Cloud Components */}
        <MotionWrapper animation="fadeInUp" duration={0.6}>
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-8 md:p-12 text-white shadow-2xl">
            <div className="text-center mb-8">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Spring Cloud Components
              </h3>
              <p className="text-purple-100">
                Bộ công cụ hoàn chỉnh để xây dựng microservices
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {springCloudComponents.map((component, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 border border-white/20">
                  <h4 className="font-bold text-lg mb-1">{component.name}</h4>
                  <p className="text-sm text-purple-100">{component.description}</p>
                </div>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <h4 className="text-xl font-bold mb-4 text-center">Dự án thực hành</h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h5 className="font-semibold mb-2">E-commerce Microservices</h5>
                  <ul className="space-y-1 text-sm text-purple-100">
                    <li>• Product Service</li>
                    <li>• Order Service</li>
                    <li>• Payment Service</li>
                    <li>• Notification Service</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold mb-2">Infrastructure</h5>
                  <ul className="space-y-1 text-sm text-purple-100">
                    <li>• Eureka Server</li>
                    <li>• API Gateway</li>
                    <li>• Config Server</li>
                    <li>• Zipkin Tracing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>

        {/* Tech Stack */}
        <MotionWrapper animation="fadeInUp" delay={0.2} duration={0.6}>
          <div className="mt-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
              Tech Stack cho Microservices
            </h3>
            <div className="flex flex-wrap justify-center gap-3">
              {["Spring Cloud", "Docker", "Kubernetes", "Kafka", "Redis", "PostgreSQL", "MongoDB", "Zipkin", "Prometheus", "Grafana", "ELK Stack"].map((tech, index) => (
                <span key={index} className="px-4 py-2 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg text-gray-700 dark:text-gray-300 font-medium shadow-sm hover:shadow-md transition-shadow">
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
