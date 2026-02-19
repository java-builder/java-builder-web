"use client";

import { useState } from "react";
import MotionWrapper from "@/components/MotionWrapper";
import { FaCheckCircle, FaClock, FaChevronDown, FaChevronRight } from "react-icons/fa";

const allRoadmaps = {
  backend: [
    {
      id: "java-core",
      title: "1. Java Core",
      description: "Nền tảng lập trình Java cơ bản",
      duration: "2 tháng",
      level: "beginner" as const,
      topics: [
        "Cú pháp Java, biến, kiểu dữ liệu",
        "OOP: Class, Inheritance, Polymorphism, Encapsulation",
        "Collections Framework: List, Set, Map",
        "Exception Handling",
        "Lambda Expressions & Stream API",
        "Generics và Annotations"
      ]
    },
    {
      id: "sql",
      title: "2. SQL & Database",
      description: "Cơ sở dữ liệu quan hệ",
      duration: "1 tháng",
      level: "beginner" as const,
      topics: [
        "DDL: CREATE, ALTER, DROP",
        "DML: SELECT, INSERT, UPDATE, DELETE",
        "JOIN, Subquery, Aggregate Functions",
        "Index, View, Transaction",
        "PostgreSQL / MySQL"
      ]
    },
    {
      id: "jdbc",
      title: "3. JDBC",
      description: "Kết nối Java với Database",
      duration: "2 tuần",
      level: "beginner" as const,
      topics: [
        "JDBC Architecture",
        "Connection, Statement, ResultSet",
        "PreparedStatement",
        "Transaction Management",
        "Connection Pooling"
      ]
    },
    {
      id: "hibernate",
      title: "4. Hibernate ORM",
      description: "Object-Relational Mapping",
      duration: "1 tháng",
      level: "intermediate" as const,
      topics: [
        "ORM Concepts",
        "Entity Mapping & Annotations",
        "Relationships: OneToOne, OneToMany, ManyToMany",
        "HQL & Criteria API",
        "Caching Strategies"
      ]
    },
    {
      id: "spring-boot",
      title: "5. Spring Boot",
      description: "Framework xây dựng ứng dụng",
      duration: "2 tháng",
      level: "intermediate" as const,
      topics: [
        "IoC Container & Dependency Injection",
        "Auto-configuration",
        "Spring Data JPA",
        "REST API & Spring MVC",
        "Exception Handling & Validation",
        "Testing"
      ]
    },
    {
      id: "spring-security",
      title: "6. Spring Security",
      description: "Bảo mật ứng dụng",
      duration: "1.5 tháng",
      level: "intermediate" as const,
      topics: [
        "Authentication & Authorization",
        "JWT Token",
        "OAuth2 & OpenID Connect",
        "Method Security",
        "RBAC"
      ]
    },
    {
      id: "cache-messaging",
      title: "7. Caching & Messaging",
      description: "Redis, Kafka, WebSocket",
      duration: "1.5 tháng",
      level: "advanced" as const,
      topics: [
        "Redis Caching",
        "RabbitMQ / Apache Kafka",
        "WebSocket",
        "Async Processing",
        "Event-Driven Architecture"
      ]
    },
    {
      id: "microservices",
      title: "8. Microservices",
      description: "Kiến trúc Microservices",
      duration: "2 tháng",
      level: "advanced" as const,
      topics: [
        "Microservices Patterns",
        "Service Discovery",
        "API Gateway",
        "Circuit Breaker",
        "Distributed Tracing"
      ]
    },
    {
      id: "spring-cloud",
      title: "9. Spring Cloud",
      description: "Hệ thống phân tán",
      duration: "1.5 tháng",
      level: "advanced" as const,
      topics: [
        "Eureka Server & Client",
        "Spring Cloud Gateway",
        "Config Server",
        "OpenFeign",
        "Sleuth & Zipkin"
      ]
    },
    {
      id: "devops",
      title: "10. DevOps",
      description: "CI/CD, Docker, Kubernetes",
      duration: "1.5 tháng",
      level: "advanced" as const,
      topics: [
        "Docker & Docker Compose",
        "Kubernetes Basics",
        "CI/CD Pipeline",
        "AWS Services",
        "Monitoring & Logging"
      ]
    }
  ],
  javaCore: [
    {
      id: "syntax",
      title: "1. Cú pháp Java cơ bản",
      description: "Biến, kiểu dữ liệu, toán tử",
      duration: "2 tuần",
      level: "beginner" as const,
      topics: ["Variables & Data Types", "Operators", "Control Flow (if, switch)", "Loops (for, while)", "Arrays"]
    },
    {
      id: "oop",
      title: "2. Lập trình hướng đối tượng",
      description: "OOP Principles",
      duration: "1 tháng",
      level: "beginner" as const,
      topics: ["Class & Object", "Inheritance", "Polymorphism", "Encapsulation", "Abstraction", "Interface"]
    },
    {
      id: "collections",
      title: "3. Collections Framework",
      description: "Cấu trúc dữ liệu trong Java",
      duration: "3 tuần",
      level: "intermediate" as const,
      topics: ["ArrayList, LinkedList", "HashSet, TreeSet", "HashMap, TreeMap", "Iterator", "Comparable & Comparator"]
    },
    {
      id: "exception",
      title: "4. Exception Handling",
      description: "Xử lý ngoại lệ",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["try-catch-finally", "Checked vs Unchecked Exceptions", "Custom Exceptions", "throw & throws"]
    },
    {
      id: "advanced",
      title: "5. Java nâng cao",
      description: "Lambda, Stream, Generics",
      duration: "2 tuần",
      level: "advanced" as const,
      topics: ["Lambda Expressions", "Stream API", "Optional", "Generics", "Annotations"]
    }
  ],
  springBoot: [
    {
      id: "spring-core",
      title: "1. Spring Core & IoC Container",
      description: "Hiểu về Dependency Injection và IoC",
      duration: "1 tuần",
      level: "beginner" as const,
      topics: ["IoC Container", "Dependency Injection (DI)", "Bean Lifecycle", "ApplicationContext", "@Component, @Service, @Repository, @Controller"]
    },
    {
      id: "spring-configuration",
      title: "2. Spring Configuration",
      description: "Cấu hình ứng dụng Spring Boot",
      duration: "1 tuần",
      level: "beginner" as const,
      topics: ["@Configuration & @Bean", "Component Scanning", "@Value & @ConfigurationProperties", "Profiles (dev, prod, test)", "application.yml vs application.properties"]
    },
    {
      id: "spring-mvc-basics",
      title: "3. Spring MVC Basics",
      description: "Xây dựng Web Application",
      duration: "1 tuần",
      level: "beginner" as const,
      topics: ["@Controller & @RestController", "@RequestMapping, @GetMapping, @PostMapping", "@PathVariable & @RequestParam", "View Resolvers", "Thymeleaf Templates"]
    },
    {
      id: "rest-api-basics",
      title: "4. RESTful API Basics",
      description: "Xây dựng REST API cơ bản",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["REST Principles", "HTTP Methods (GET, POST, PUT, DELETE, PATCH)", "HTTP Status Codes", "@RequestBody & @ResponseBody", "Content Negotiation (JSON, XML)"]
    },
    {
      id: "dto-mapping",
      title: "5. DTO & Object Mapping",
      description: "Chuyển đổi giữa Entity và DTO",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["DTO Pattern", "ModelMapper", "MapStruct", "Manual Mapping", "Builder Pattern"]
    },
    {
      id: "spring-data-jpa",
      title: "6. Spring Data JPA",
      description: "Tương tác với Database",
      duration: "2 tuần",
      level: "intermediate" as const,
      topics: ["JpaRepository & CrudRepository", "Query Methods", "Custom Queries với @Query", "Native Queries", "Derived Query Methods"]
    },
    {
      id: "jpa-relationships",
      title: "7. JPA Relationships",
      description: "Quan hệ giữa các Entity",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["@OneToOne", "@OneToMany & @ManyToOne", "@ManyToMany", "Cascade Types", "Fetch Types (LAZY vs EAGER)", "Orphan Removal"]
    },
    {
      id: "pagination-sorting",
      title: "8. Pagination & Sorting",
      description: "Phân trang và sắp xếp dữ liệu",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["Pageable & Page", "Sort & Sorting", "Custom Pagination Response", "PageRequest", "Slice vs Page"]
    },
    {
      id: "jpa-auditing",
      title: "9. JPA Auditing",
      description: "Tự động tracking thời gian và người dùng",
      duration: "3 ngày",
      level: "intermediate" as const,
      topics: ["@CreatedDate & @LastModifiedDate", "@CreatedBy & @LastModifiedBy", "@EntityListeners", "AuditorAware", "@EnableJpaAuditing"]
    },
    {
      id: "specifications",
      title: "10. JPA Specifications",
      description: "Dynamic Queries với Criteria API",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Specification Interface", "Criteria API", "Dynamic Filtering", "Complex Queries", "Predicate Builder"]
    },
    {
      id: "validation",
      title: "11. Bean Validation",
      description: "Validate dữ liệu đầu vào",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["@Valid & @Validated", "@NotNull, @NotBlank, @NotEmpty", "@Size, @Min, @Max", "@Email, @Pattern", "Custom Validators", "Group Validation"]
    },
    {
      id: "exception-handling",
      title: "12. Exception Handling",
      description: "Xử lý lỗi toàn cục",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["@ControllerAdvice", "@ExceptionHandler", "Custom Exception Classes", "ResponseEntityExceptionHandler", "Handling Validation Errors"]
    },
    {
      id: "api-response",
      title: "13. Chuẩn hóa API Response",
      description: "Thiết kế Response Structure chuẩn",
      duration: "3 ngày",
      level: "intermediate" as const,
      topics: ["ApiResponse<T> Generic Class", "Success Response Structure", "Error Response Structure", "Pagination Response", "ResponseEntity & HttpStatus"]
    },
    {
      id: "file-upload",
      title: "14. File Upload & Download",
      description: "Xử lý file trong Spring Boot",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["MultipartFile", "File Storage (Local)", "File Validation (size, type)", "Image Processing", "Download Files", "Serving Static Files"]
    },
    {
      id: "cloud-storage",
      title: "15. Cloud Storage Integration",
      description: "Lưu trữ file trên Cloud",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["AWS S3 Integration", "Cloudinary", "Firebase Storage", "Pre-signed URLs", "CDN Integration"]
    },
    {
      id: "email-service",
      title: "16. Email Service",
      description: "Gửi email trong ứng dụng",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["JavaMailSender", "SMTP Configuration", "HTML Email Templates", "Thymeleaf Email Templates", "Email Attachments", "Async Email Sending"]
    },
    {
      id: "scheduling",
      title: "17. Task Scheduling",
      description: "Lập lịch tác vụ tự động",
      duration: "3 ngày",
      level: "intermediate" as const,
      topics: ["@Scheduled Annotation", "Cron Expressions", "Fixed Rate vs Fixed Delay", "@EnableScheduling", "Async Scheduling"]
    },
    {
      id: "async-processing",
      title: "18. Async Processing",
      description: "Xử lý bất đồng bộ",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["@Async Annotation", "CompletableFuture", "Thread Pool Configuration", "Async Exception Handling", "@EnableAsync"]
    },
    {
      id: "caching",
      title: "19. Caching",
      description: "Cache để tăng performance",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["@Cacheable, @CachePut, @CacheEvict", "Cache Providers (Caffeine, EhCache)", "Cache Configuration", "Cache Key Generation", "TTL & Eviction Policies"]
    },
    {
      id: "redis-cache",
      title: "20. Redis Caching",
      description: "Distributed Caching với Redis",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Redis Setup", "RedisTemplate", "Spring Data Redis", "Redis Serialization", "Redis Cache Manager", "Cache Aside Pattern"]
    },
    {
      id: "interceptors",
      title: "21. Interceptors & Filters",
      description: "Xử lý request/response",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["HandlerInterceptor", "Filter vs Interceptor", "Request/Response Logging", "CORS Configuration", "Custom Headers"]
    },
    {
      id: "aop",
      title: "22. Aspect-Oriented Programming (AOP)",
      description: "Cross-cutting Concerns",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["@Aspect & @Around", "Pointcut Expressions", "Logging Aspect", "Performance Monitoring", "Transaction Management"]
    },
    {
      id: "transaction",
      title: "23. Transaction Management",
      description: "Quản lý giao dịch Database",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["@Transactional", "Propagation Types", "Isolation Levels", "Rollback Rules", "Programmatic Transactions"]
    },
    {
      id: "actuator",
      title: "24. Spring Boot Actuator",
      description: "Monitoring & Health Checks",
      duration: "3 ngày",
      level: "intermediate" as const,
      topics: ["Actuator Endpoints", "Health Indicators", "Metrics", "Custom Endpoints", "Actuator Security"]
    },
    {
      id: "logging",
      title: "25. Logging",
      description: "Application Logging",
      duration: "3 ngày",
      level: "intermediate" as const,
      topics: ["SLF4J & Logback", "Log Levels", "Logback Configuration", "Log Patterns", "Rolling File Appender", "MDC (Mapped Diagnostic Context)"]
    },
    {
      id: "api-documentation",
      title: "26. API Documentation",
      description: "Swagger/OpenAPI",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["Swagger UI Setup", "OpenAPI 3.0 Annotations", "@Operation, @ApiResponse", "Request/Response Examples", "Authentication in Swagger", "Grouping APIs"]
    },
    {
      id: "testing-unit",
      title: "27. Unit Testing",
      description: "Test các component riêng lẻ",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["JUnit 5", "Mockito", "@Mock & @InjectMocks", "Test Service Layer", "Test Repository Layer", "AssertJ"]
    },
    {
      id: "testing-integration",
      title: "28. Integration Testing",
      description: "Test toàn bộ ứng dụng",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["@SpringBootTest", "@WebMvcTest", "MockMvc", "@DataJpaTest", "TestContainers", "Test Database (H2)"]
    },
    {
      id: "testing-api",
      title: "29. API Testing",
      description: "Test REST APIs",
      duration: "3 ngày",
      level: "intermediate" as const,
      topics: ["RestAssured", "MockMvc for REST", "Testing Controllers", "Testing Request/Response", "Test Coverage"]
    },
    {
      id: "profiles-env",
      title: "30. Profiles & Environment",
      description: "Quản lý môi trường",
      duration: "3 ngày",
      level: "intermediate" as const,
      topics: ["Spring Profiles", "application-{profile}.yml", "Environment Variables", "@Profile Annotation", "External Configuration"]
    },
    {
      id: "docker",
      title: "31. Docker & Containerization",
      description: "Đóng gói ứng dụng",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Dockerfile for Spring Boot", "Multi-stage Build", "Docker Compose", "Environment Variables in Docker", "Docker Networks"]
    },
    {
      id: "deployment",
      title: "32. Deployment",
      description: "Deploy ứng dụng lên Production",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["JAR vs WAR", "Embedded Server vs External", "Cloud Deployment (AWS, Heroku)", "CI/CD Pipeline", "Health Checks & Monitoring"]
    }
  ],
  springSecurity: [
    {
      id: "security-basics",
      title: "1. Security Fundamentals",
      description: "Authentication & Authorization",
      duration: "1 tuần",
      level: "beginner" as const,
      topics: ["Authentication vs Authorization", "Security Filter Chain", "Password Encoding", "Security Context", "UserDetails & UserDetailsService"]
    },
    {
      id: "jwt",
      title: "2. JWT Authentication",
      description: "Token-based Authentication",
      duration: "2 tuần",
      level: "intermediate" as const,
      topics: ["JWT Structure", "Token Generation", "Token Validation", "Refresh Token", "Token Storage", "JWT Filter"]
    },
    {
      id: "oauth2-basics",
      title: "3. OAuth2 Fundamentals",
      description: "OAuth2 Protocol & Grant Types",
      duration: "2 tuần",
      level: "advanced" as const,
      topics: ["OAuth2 Overview", "Authorization Code Grant", "Client Credentials Grant", "Password Grant", "Implicit Grant", "Refresh Token Grant", "PKCE"]
    },
    {
      id: "oauth2-social",
      title: "4. OAuth2 Social Login",
      description: "Third-party Authentication",
      duration: "2 tuần",
      level: "advanced" as const,
      topics: ["OAuth2 Client Setup", "Google Login", "Facebook Login", "GitHub Login", "Account Linking", "Custom OAuth2 Provider"]
    },
    {
      id: "openid-connect",
      title: "5. OpenID Connect",
      description: "Identity Layer on OAuth2",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["OIDC vs OAuth2", "ID Token", "UserInfo Endpoint", "OIDC Scopes", "Claims", "Discovery Document"]
    },
    {
      id: "rbac",
      title: "6. Role-Based Access Control",
      description: "Authorization & Permissions",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["Roles & Authorities", "Method Security", "@PreAuthorize", "@Secured", "@RolesAllowed", "Permission-Based Access"]
    },
    {
      id: "method-security",
      title: "7. Method Security",
      description: "Securing Service Layer",
      duration: "1 tuần",
      level: "intermediate" as const,
      topics: ["@EnableMethodSecurity", "SpEL Expressions", "@PostAuthorize", "@PreFilter", "@PostFilter", "Custom Security Expressions"]
    },
    {
      id: "cors-csrf",
      title: "8. CORS & CSRF",
      description: "Cross-Origin & CSRF Protection",
      duration: "3 ngày",
      level: "intermediate" as const,
      topics: ["CORS Configuration", "CSRF Token", "CSRF Protection", "SameSite Cookies", "Custom CORS Filter"]
    },
    {
      id: "session-management",
      title: "9. Session Management",
      description: "Session Security",
      duration: "3 ngày",
      level: "intermediate" as const,
      topics: ["Session Fixation", "Concurrent Session Control", "Session Timeout", "Remember Me", "Session Registry"]
    },
    {
      id: "two-factor",
      title: "10. Two-Factor Authentication",
      description: "2FA Implementation",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["TOTP (Time-based OTP)", "QR Code Generation", "Google Authenticator", "SMS OTP", "Email OTP", "Backup Codes"]
    },
    {
      id: "password-security",
      title: "11. Password Security",
      description: "Password Management",
      duration: "3 ngày",
      level: "intermediate" as const,
      topics: ["Password Encoding (BCrypt)", "Password Validation", "Password Reset Flow", "Forgot Password", "Password History"]
    },
    {
      id: "api-security",
      title: "12. API Security",
      description: "Securing REST APIs",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["API Key Authentication", "Bearer Token", "Rate Limiting", "IP Whitelisting", "API Versioning Security"]
    }
  ],
  microservices: [
    {
      id: "architecture",
      title: "1. Microservices Architecture",
      description: "Design Patterns & Principles",
      duration: "2 tuần",
      level: "advanced" as const,
      topics: ["Monolith vs Microservices", "Service Boundaries", "Database per Service", "API Design", "Domain-Driven Design (DDD)", "Bounded Context"]
    },
    {
      id: "service-discovery",
      title: "2. Service Discovery",
      description: "Eureka Server & Client",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Eureka Server Setup", "Service Registration", "Service Discovery", "Load Balancing", "Health Checks", "Self-Preservation Mode"]
    },
    {
      id: "config-server",
      title: "3. Config Server",
      description: "Centralized Configuration",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Config Server Setup", "Git Backend", "Refresh Configuration", "Encryption & Decryption", "Multiple Profiles", "@RefreshScope"]
    },
    {
      id: "api-gateway",
      title: "4. API Gateway",
      description: "Spring Cloud Gateway",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Gateway Routing", "Predicates & Filters", "Rate Limiting", "Request/Response Modification", "Load Balancing"]
    },
    {
      id: "rest-communication",
      title: "5. REST Communication",
      description: "Synchronous Communication",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["OpenFeign Client", "RestTemplate", "WebClient (Reactive)", "Load Balancing", "Error Handling", "Timeouts & Retries"]
    },
    {
      id: "circuit-breaker",
      title: "6. Circuit Breaker & Resilience",
      description: "Resilience4J",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Circuit Breaker Pattern", "Resilience4J Setup", "Fallback Methods", "Retry Mechanism", "Rate Limiter", "Bulkhead Pattern", "Timeout"]
    },
    {
      id: "messaging",
      title: "7. Message Queue & Event Streaming",
      description: "Kafka & RabbitMQ",
      duration: "2 tuần",
      level: "advanced" as const,
      topics: ["Kafka Architecture", "Producers & Consumers", "Topics & Partitions", "Consumer Groups", "RabbitMQ Setup", "Exchanges & Queues", "Routing Keys", "Dead Letter Queue"]
    },
    {
      id: "data-management",
      title: "8. Data Management",
      description: "Database Strategies",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Database per Service", "Shared Database Anti-pattern", "Data Consistency", "Eventual Consistency", "Distributed Transactions", "API Composition"]
    },
    {
      id: "saga-pattern",
      title: "9. Saga Pattern",
      description: "Distributed Transactions",
      duration: "2 tuần",
      level: "advanced" as const,
      topics: ["Saga Pattern Overview", "Choreography-based Saga", "Orchestration-based Saga", "Compensating Transactions", "Saga State Management", "Failure Handling"]
    },
    {
      id: "security",
      title: "10. Microservices Security",
      description: "Authentication & Authorization",
      duration: "2 tuần",
      level: "advanced" as const,
      topics: ["JWT in Microservices", "OAuth2 & OpenID Connect", "API Gateway Authentication", "Service-to-Service Auth", "mTLS", "Secret Management"]
    },
    {
      id: "distributed-tracing",
      title: "11. Distributed Tracing",
      description: "Zipkin & Sleuth",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Spring Cloud Sleuth", "Zipkin Server Setup", "Trace ID & Span ID", "Sampling", "Jaeger Integration", "Trace Visualization"]
    },
    {
      id: "centralized-logging",
      title: "12. Centralized Logging",
      description: "ELK Stack",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Elasticsearch", "Logstash", "Kibana", "Log Aggregation", "Log Parsing", "Log Visualization", "Alerting"]
    },
    {
      id: "monitoring",
      title: "13. Monitoring & Metrics",
      description: "Prometheus & Grafana",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Prometheus Setup", "Metrics Collection", "Grafana Dashboards", "Alerting Rules", "Service Health Monitoring", "Custom Metrics"]
    },
    {
      id: "testing",
      title: "14. Microservices Testing",
      description: "Testing Strategies",
      duration: "2 tuần",
      level: "advanced" as const,
      topics: ["Unit Testing", "Integration Testing", "Contract Testing (Pact)", "End-to-End Testing", "TestContainers", "Chaos Engineering"]
    },
    {
      id: "deployment",
      title: "15. Deployment Strategies",
      description: "CI/CD & Orchestration",
      duration: "2 tuần",
      level: "advanced" as const,
      topics: ["Docker & Docker Compose", "Kubernetes Basics", "Helm Charts", "Blue-Green Deployment", "Canary Deployment", "Rolling Updates"]
    },
    {
      id: "service-mesh",
      title: "16. Service Mesh",
      description: "Istio & Linkerd",
      duration: "1 tuần",
      level: "advanced" as const,
      topics: ["Service Mesh Concepts", "Istio Architecture", "Traffic Management", "Security Policies", "Observability", "Sidecar Pattern"]
    }
  ]
};

interface RoadmapSectionProps {
  activeTab: string;
}

export default function RoadmapSection({ activeTab }: RoadmapSectionProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  
  const roadmapData = allRoadmaps[activeTab as keyof typeof allRoadmaps] || allRoadmaps.backend;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "intermediate": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "advanced": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "beginner": return "Cơ bản";
      case "intermediate": return "Trung cấp";
      case "advanced": return "Nâng cao";
      default: return "";
    }
  };

  return (
    <section className="py-8 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6} key={activeTab}>
          <div className="text-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
              Lộ trình học tập
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Click vào từng bước để xem chi tiết
            </p>
          </div>
        </MotionWrapper>

        <div className="space-y-3">
          {roadmapData.map((step, index) => (
            <MotionWrapper key={step.id} animation="fadeInUp" delay={index * 0.03} duration={0.3}>
              <div 
                className={`bg-white dark:bg-slate-800 rounded-lg border transition-all duration-200 ${
                  expandedStep === step.id 
                    ? 'border-gray-200 dark:border-slate-700 shadow-sm' 
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <button
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className="w-full p-3 sm:p-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-accent">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        {expandedStep === step.id ? (
                          <FaChevronDown className="text-gray-400 flex-shrink-0 mt-1" />
                        ) : (
                          <FaChevronRight className="text-gray-400 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {step.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getLevelColor(step.level)}`}>
                          {getLevelLabel(step.level)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300">
                          <FaClock className="w-3 h-3" />
                          {step.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {expandedStep === step.id && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100 dark:border-slate-700 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      Nội dung chi tiết:
                    </h4>
                    <ul className="space-y-2">
                      {step.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <FaCheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
