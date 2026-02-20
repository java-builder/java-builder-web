"use client";

import { useState } from "react";
import DocsHeader from "@/components/docs/DocsHeader";
import DocsSidebar from "@/components/docs/DocsSidebar";
import DocsArticle from "@/components/docs/DocsArticle";
import DocsTableOfContents from "@/components/docs/DocsTableOfContents";

// Mock data cho documentation
const DOCS_CATEGORIES = [
  {
    id: "microservices",
    title: "Microservices",
    topics: [
      { id: "api-gateway", title: "API Gateway", slug: "api-gateway" },
      { id: "eureka", title: "Service Discovery (Eureka)", slug: "eureka" },
      { id: "config-server", title: "Config Server", slug: "config-server" },
      { id: "circuit-breaker", title: "Circuit Breaker", slug: "circuit-breaker" },
    ]
  },
  {
    id: "spring-boot",
    title: "Spring Boot",
    topics: [
      { id: "getting-started", title: "Bắt đầu với Spring Boot", slug: "getting-started" },
      { id: "rest-api", title: "Xây dựng REST API", slug: "rest-api" },
      { id: "jpa", title: "Spring Data JPA", slug: "jpa" },
      { id: "security", title: "Spring Security", slug: "security" },
    ]
  },
  {
    id: "database",
    title: "Database",
    topics: [
      { id: "mysql", title: "MySQL", slug: "mysql" },
      { id: "postgresql", title: "PostgreSQL", slug: "postgresql" },
      { id: "redis", title: "Redis Cache", slug: "redis" },
      { id: "mongodb", title: "MongoDB", slug: "mongodb" },
    ]
  }
];

const SAMPLE_CONTENT = {
  title: "API Gateway trong Microservices",
  description: "Tìm hiểu về API Gateway và cách triển khai với Spring Cloud Gateway",
  lastUpdated: "20/02/2026",
  readTime: "15 phút",
  content: `
## Giới thiệu về API Gateway

API Gateway là một pattern quan trọng trong kiến trúc Microservices, đóng vai trò như một điểm vào duy nhất (single entry point) cho tất cả các client requests.

### Tại sao cần API Gateway?

Trong kiến trúc Microservices, ứng dụng được chia thành nhiều service nhỏ. Nếu không có API Gateway, client sẽ phải:

- Gọi trực tiếp đến từng service
- Xử lý nhiều endpoint khác nhau
- Quản lý authentication cho từng service
- Đối mặt với vấn đề CORS

### Các tính năng chính

**1. Routing**
API Gateway định tuyến request đến đúng service backend dựa trên URL path, headers, hoặc các tiêu chí khác.

**2. Load Balancing**
Phân phối request đều đặn giữa các instance của service để tối ưu hiệu suất.

**3. Authentication & Authorization**
Tập trung xác thực và phân quyền ở một nơi thay vì mỗi service.

**4. Rate Limiting**
Giới hạn số lượng request để bảo vệ hệ thống khỏi bị quá tải.

## Cài đặt Spring Cloud Gateway

### Bước 1: Thêm Dependencies

\`\`\`xml
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-gateway</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
</dependency>
\`\`\`

### Bước 2: Cấu hình Routes

\`\`\`yaml
spring:
  cloud:
    gateway:
      routes:
        - id: user-service
          uri: lb://USER-SERVICE
          predicates:
            - Path=/api/users/**
          filters:
            - StripPrefix=1
        
        - id: order-service
          uri: lb://ORDER-SERVICE
          predicates:
            - Path=/api/orders/**
          filters:
            - StripPrefix=1
\`\`\`

### Bước 3: Tạo Custom Filter

\`\`\`java
@Component
public class AuthenticationFilter implements GatewayFilter {
    
    @Override
    public Mono<Void> filter(ServerWebExchange exchange, 
                            GatewayFilterChain chain) {
        ServerHttpRequest request = exchange.getRequest();
        
        if (!request.getHeaders().containsKey("Authorization")) {
            throw new RuntimeException("Missing authorization header");
        }
        
        String token = request.getHeaders()
            .getFirst("Authorization");
        
        // Validate token
        if (!isValidToken(token)) {
            throw new RuntimeException("Invalid token");
        }
        
        return chain.filter(exchange);
    }
}
\`\`\`

## Best Practices

### 1. Sử dụng Circuit Breaker
Kết hợp với Resilience4j để xử lý lỗi khi service backend không khả dụng.

### 2. Caching
Cache response để giảm tải cho backend services.

### 3. Monitoring
Sử dụng Spring Boot Actuator và Micrometer để theo dõi metrics.

### 4. Security
- Luôn validate và sanitize input
- Sử dụng HTTPS
- Implement rate limiting
- Log tất cả requests để audit

## Kết luận

API Gateway là thành phần không thể thiếu trong kiến trúc Microservices. Spring Cloud Gateway cung cấp một giải pháp mạnh mẽ, linh hoạt và dễ dàng tích hợp với Spring ecosystem.

### Bài tiếp theo
- [Service Discovery với Eureka](#)
- [Config Server](#)
- [Circuit Breaker Pattern](#)
  `
};

const TOC_ITEMS = [
  { id: "gioi-thieu", title: "Giới thiệu về API Gateway", level: 2 },
  { id: "tai-sao", title: "Tại sao cần API Gateway?", level: 3 },
  { id: "tinh-nang", title: "Các tính năng chính", level: 3 },
  { id: "cai-dat", title: "Cài đặt Spring Cloud Gateway", level: 2 },
  { id: "buoc-1", title: "Bước 1: Thêm Dependencies", level: 3 },
  { id: "buoc-2", title: "Bước 2: Cấu hình Routes", level: 3 },
  { id: "buoc-3", title: "Bước 3: Tạo Custom Filter", level: 3 },
  { id: "best-practices", title: "Best Practices", level: 2 },
  { id: "ket-luan", title: "Kết luận", level: 2 },
];

export default function DocsPage() {
  const [openCategories, setOpenCategories] = useState<string[]>([DOCS_CATEGORIES[0].id]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleCategoryToggle = (categoryId: string) => {
    setOpenCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <DocsHeader />

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 left-4 z-50 p-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700"
      >
        <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <div className="flex max-w-[1600px] mx-auto">
        <DocsSidebar
          categories={DOCS_CATEGORIES}
          openCategories={openCategories}
          onCategoryToggle={handleCategoryToggle}
          isOpen={isSidebarOpen}
        />

        <main className="flex-1 min-w-0">
          <DocsArticle
            title={SAMPLE_CONTENT.title}
            description={SAMPLE_CONTENT.description}
            readTime={SAMPLE_CONTENT.readTime}
            lastUpdated={SAMPLE_CONTENT.lastUpdated}
            content={SAMPLE_CONTENT.content}
            breadcrumbs={[
              { label: "Tài liệu", href: "/docs" },
              { label: "Microservices" },
              { label: "API Gateway" }
            ]}
          />
        </main>

        <DocsTableOfContents items={TOC_ITEMS} />
      </div>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
}
