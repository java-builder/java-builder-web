export interface RoadmapStep {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "beginner" | "intermediate" | "advanced";
  topics: string[];
}

export interface RoadmapLevel {
  description: string;
  motivation: string;
  steps: RoadmapStep[];
}

export const roadmapData: Record<string, RoadmapLevel> = {
  intern: {
    description: "Giai đoạn thực tập sinh - Học đủ kiến thức cơ bản để có thể làm việc được với dự án thực tế. Mục tiêu: Có thể làm CRUD đơn giản với Spring Boot.",
    motivation: "Mỗi dòng code bạn viết hôm nay là nền tảng cho sự nghiệp ngày mai. Hãy kiên trì!",
    steps: [
      {
        id: "java-core",
        title: "1. Java Core",
        description: "Nền tảng lập trình Java",
        duration: "3 tuần",
        level: "beginner",
        topics: [
          "Cú pháp Java, biến, kiểu dữ liệu",
          "OOP: Class, Object, Inheritance, Polymorphism, Encapsulation",
          "Collections: ArrayList, HashMap, HashSet",
          "Exception Handling (try-catch-finally)",
          "Lambda & Stream API cơ bản"
        ]
      },
      {
        id: "sql-basics",
        title: "2. SQL & Database",
        description: "Làm việc với cơ sở dữ liệu",
        duration: "2 tuần",
        level: "beginner",
        topics: [
          "DDL: CREATE, ALTER, DROP",
          "DML: SELECT, INSERT, UPDATE, DELETE",
          "WHERE, ORDER BY, LIMIT",
          "JOIN (INNER, LEFT, RIGHT)",
          "Aggregate Functions (COUNT, SUM, AVG)",
          "GROUP BY, HAVING"
        ]
      },
      {
        id: "jdbc",
        title: "3. JDBC",
        description: "Kết nối Java với Database",
        duration: "1 tuần",
        level: "beginner",
        topics: [
          "JDBC Architecture",
          "Connection, Statement, ResultSet",
          "PreparedStatement",
          "CRUD Operations với JDBC",
          "Connection Pooling cơ bản"
        ]
      },
      {
        id: "hibernate-jpa-basics",
        title: "4. Hibernate & JPA cơ bản",
        description: "Object-Relational Mapping",
        duration: "2 tuần",
        level: "beginner",
        topics: [
          "ORM Concepts",
          "Entity & Annotations (@Entity, @Table, @Id)",
          "CRUD với Hibernate/JPA",
          "Relationships: @OneToMany, @ManyToOne",
          "HQL/JPQL cơ bản"
        ]
      },
      {
        id: "spring-core",
        title: "5. Spring Core & DI",
        description: "Dependency Injection",
        duration: "1 tuần",
        level: "beginner",
        topics: [
          "IoC Container",
          "Dependency Injection (DI)",
          "@Component, @Service, @Repository, @Controller",
          "Bean Lifecycle",
          "@Autowired"
        ]
      },
      {
        id: "spring-boot-basics",
        title: "6. Spring Boot cơ bản",
        description: "Xây dựng ứng dụng CRUD",
        duration: "3 tuần",
        level: "intermediate",
        topics: [
          "Spring Boot Project Structure",
          "application.properties/yml",
          "@RestController, @RequestMapping",
          "Spring Data JPA (JpaRepository)",
          "CRUD REST API",
          "@RequestBody, @PathVariable, @RequestParam"
        ]
      },
      {
        id: "validation-exception",
        title: "7. Validation & Exception Handling",
        description: "Xử lý lỗi và validate",
        duration: "1 tuần",
        level: "beginner",
        topics: [
          "@Valid, @NotNull, @NotBlank, @Size",
          "@ControllerAdvice",
          "@ExceptionHandler",
          "Custom Exception",
          "Error Response Structure"
        ]
      },
      {
        id: "git-postman",
        title: "8. Git & Postman",
        description: "Tools cơ bản",
        duration: "1 tuần",
        level: "beginner",
        topics: [
          "Git: clone, add, commit, push, pull",
          "Branching & Merging",
          "Resolve Conflicts",
          "Postman: Test API",
          "Postman Collections"
        ]
      }
    ]
  },
  fresher: {
    description: "Giai đoạn mới ra trường - Làm chủ Spring Boot và các tính năng nâng cao. Có thể làm việc độc lập với các task vừa phải. Bắt đầu tìm hiểu Docker.",
    motivation: "Bạn đã có nền tảng, giờ là lúc xây dựng những kỹ năng thực chiến. Cứ tiến lên!",
    steps: [
      {
        id: "jpa-advanced",
        title: "1. Spring Data JPA nâng cao",
        description: "Làm chủ JPA",
        duration: "2 tuần",
        level: "intermediate",
        topics: [
          "JPA Relationships (@OneToOne, @ManyToMany)",
          "Fetch Types (LAZY vs EAGER)",
          "Cascade Types & Orphan Removal",
          "JPA Specifications",
          "Pagination & Sorting",
          "JPA Auditing (@CreatedDate, @LastModifiedDate)",
          "N+1 Query Problem"
        ]
      },
      {
        id: "dto-mapping",
        title: "2. DTO Pattern & Mapping",
        description: "Chuyển đổi Entity-DTO",
        duration: "1 tuần",
        level: "intermediate",
        topics: [
          "DTO Pattern & Best Practices",
          "ModelMapper",
          "MapStruct",
          "Builder Pattern",
          "API Response Structure chuẩn"
        ]
      },
      {
        id: "spring-security-jwt",
        title: "3. Spring Security & JWT",
        description: "Bảo mật ứng dụng",
        duration: "3 tuần",
        level: "intermediate",
        topics: [
          "Authentication vs Authorization",
          "UserDetails & UserDetailsService",
          "JWT Token Generation & Validation",
          "JWT Filter",
          "Refresh Token",
          "Role-Based Access Control (RBAC)",
          "@PreAuthorize"
        ]
      },
      {
        id: "file-email",
        title: "4. File Upload & Email Service",
        description: "Xử lý file và email",
        duration: "2 tuần",
        level: "intermediate",
        topics: [
          "MultipartFile",
          "File Validation (size, type)",
          "Local Storage",
          "Cloud Storage (AWS S3, Cloudinary)",
          "JavaMailSender",
          "HTML Email Templates",
          "Async Email Sending"
        ]
      },
      {
        id: "testing",
        title: "5. Testing",
        description: "Viết test cho ứng dụng",
        duration: "2 tuần",
        level: "intermediate",
        topics: [
          "JUnit 5",
          "Mockito (@Mock, @InjectMocks)",
          "Unit Testing (Service Layer)",
          "Integration Testing (@SpringBootTest)",
          "MockMvc (Controller Testing)",
          "Test Coverage"
        ]
      },
      {
        id: "api-docs-logging",
        title: "6. API Documentation & Logging",
        description: "Tài liệu hóa và logging",
        duration: "1 tuần",
        level: "intermediate",
        topics: [
          "Swagger/OpenAPI Setup",
          "API Annotations (@Operation, @ApiResponse)",
          "Swagger UI",
          "SLF4J & Logback",
          "Log Levels & Configuration",
          "Spring Boot Actuator"
        ]
      },
      {
        id: "docker-basics",
        title: "7. Docker cơ bản",
        description: "Containerization",
        duration: "2 tuần",
        level: "intermediate",
        topics: [
          "Docker Concepts",
          "Dockerfile for Spring Boot",
          "Docker Compose",
          "Multi-stage Build",
          "Environment Variables",
          "Docker Networks",
          "Docker Volumes"
        ]
      },
      {
        id: "query-optimization",
        title: "8. Query Optimization cơ bản",
        description: "Tối ưu database queries",
        duration: "1 tuần",
        level: "intermediate",
        topics: [
          "N+1 Query Problem",
          "@EntityGraph",
          "Fetch Join",
          "Index cơ bản",
          "Query Performance Analysis"
        ]
      }
    ]
  },
  junior: {
    description: "Giai đoạn Junior (1-2 năm KN) - Làm việc độc lập, xử lý các tính năng phức tạp. Bắt đầu tìm hiểu Redis, Cloud, CI/CD.",
    motivation: "Bạn đang trên con đường trở thành developer chuyên nghiệp. Mỗi bug bạn fix là một bài học quý giá!",
    steps: [
      {
        id: "design-patterns",
        title: "1. Design Patterns",
        description: "Các mẫu thiết kế phổ biến",
        duration: "2 tuần",
        level: "intermediate",
        topics: [
          "Singleton, Factory, Builder",
          "Strategy, Observer, Decorator",
          "Repository Pattern",
          "Service Layer Pattern",
          "SOLID Principles",
          "Dependency Inversion"
        ]
      },
      {
        id: "redis-basics",
        title: "2. Redis cơ bản",
        description: "Caching với Redis",
        duration: "2 tuần",
        level: "intermediate",
        topics: [
          "Redis Setup & Configuration",
          "Spring Cache Abstraction",
          "@Cacheable, @CachePut, @CacheEvict",
          "Redis Data Structures (String, Hash, List, Set)",
          "Cache Strategies (Cache-Aside)",
          "TTL & Expiration"
        ]
      },
      {
        id: "advanced-spring",
        title: "3. Spring Boot nâng cao",
        description: "Các tính năng nâng cao",
        duration: "2 tuần",
        level: "intermediate",
        topics: [
          "@Async & CompletableFuture",
          "Task Scheduling (@Scheduled)",
          "Cron Expressions",
          "Event Handling (ApplicationEvent)",
          "Interceptors & Filters",
          "Custom Annotations"
        ]
      },
      {
        id: "transaction-aop",
        title: "4. Transaction & AOP",
        description: "Quản lý giao dịch và AOP",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "@Transactional Deep Dive",
          "Propagation Types",
          "Isolation Levels",
          "Rollback Rules",
          "AOP Concepts",
          "@Aspect, @Around, @Before, @After",
          "Pointcut Expressions",
          "Logging Aspect"
        ]
      },
      {
        id: "oauth2-social",
        title: "5. OAuth2 & Social Login",
        description: "Third-party Authentication",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "OAuth2 Protocol",
          "Authorization Code Grant",
          "Google Login Integration",
          "Facebook Login",
          "GitHub Login",
          "OpenID Connect",
          "Account Linking"
        ]
      },
      {
        id: "cloud-basics",
        title: "6. Cloud Platform cơ bản",
        description: "AWS/GCP/Azure",
        duration: "2 tuần",
        level: "intermediate",
        topics: [
          "Cloud Concepts",
          "AWS: EC2, S3, RDS",
          "Deployment lên Cloud",
          "Environment Variables",
          "Cloud Storage Integration",
          "Cloud Database"
        ]
      },
      {
        id: "cicd-basics",
        title: "7. CI/CD cơ bản",
        description: "GitHub Actions, Jenkins, GitLab CI",
        duration: "2 tuần",
        level: "intermediate",
        topics: [
          "CI/CD Concepts",
          "GitHub Actions Basics",
          "Jenkins Pipeline cơ bản",
          "GitLab CI/CD",
          "Automated Testing",
          "Build & Deploy Automation"
        ]
      },
      {
        id: "docker-advanced",
        title: "8. Docker nâng cao",
        description: "Docker Compose & Optimization",
        duration: "1 tuần",
        level: "intermediate",
        topics: [
          "Docker Compose Multi-service",
          "Docker Networking",
          "Docker Volumes",
          "Image Optimization",
          "Docker Registry",
          "Docker Best Practices"
        ]
      },
      {
        id: "api-design",
        title: "9. API Design & Versioning",
        description: "Thiết kế API chuẩn",
        duration: "1 tuần",
        level: "intermediate",
        topics: [
          "RESTful API Best Practices",
          "API Versioning Strategies",
          "HATEOAS",
          "Rate Limiting cơ bản",
          "API Pagination Best Practices",
          "Error Handling Standards"
        ]
      }
    ]
  },
  middle: {
    description: "Giai đoạn Middle (2-4 năm KN) - Thiết kế kiến trúc, mentor junior, xử lý các vấn đề phức tạp về performance và scalability. Nắm vững Redis, Cloud, CI/CD.",
    motivation: "Bạn không chỉ viết code, bạn đang xây dựng hệ thống. Hãy suy nghĩ như một kiến trúc sư!",
    steps: [
      {
        id: "redis-advanced",
        title: "1. Redis nâng cao",
        description: "Distributed Caching & Advanced Features",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "Redis Cluster",
          "Redis Sentinel (High Availability)",
          "Pub/Sub Pattern",
          "Redis Transactions",
          "Lua Scripting",
          "Cache Invalidation Strategies",
          "Distributed Locking"
        ]
      },
      {
        id: "messaging-kafka",
        title: "2. Message Queue & Kafka",
        description: "Event-driven Architecture",
        duration: "3 tuần",
        level: "advanced",
        topics: [
          "Message Queue Concepts",
          "Kafka Architecture",
          "Producers & Consumers",
          "Topics, Partitions, Offsets",
          "Consumer Groups",
          "Kafka Connect",
          "Event Sourcing Pattern",
          "CQRS Pattern",
          "Dead Letter Queue"
        ]
      },
      {
        id: "microservices-basics",
        title: "3. Microservices Fundamentals",
        description: "Kiến trúc Microservices",
        duration: "3 tuần",
        level: "advanced",
        topics: [
          "Monolith vs Microservices",
          "Service Boundaries",
          "Database per Service",
          "API Gateway Pattern",
          "Service Discovery",
          "Inter-service Communication",
          "Saga Pattern",
          "Circuit Breaker Pattern"
        ]
      },
      {
        id: "spring-cloud",
        title: "4. Spring Cloud",
        description: "Microservices Infrastructure",
        duration: "3 tuần",
        level: "advanced",
        topics: [
          "Eureka Server & Client (Service Discovery)",
          "Spring Cloud Gateway",
          "Config Server (Centralized Configuration)",
          "OpenFeign (Declarative REST Client)",
          "Resilience4J (Circuit Breaker, Retry, Rate Limiter)",
          "Load Balancing",
          "Spring Cloud Sleuth (Distributed Tracing)"
        ]
      },
      {
        id: "cloud-advanced",
        title: "5. Cloud Platform nâng cao",
        description: "AWS/GCP/Azure Deep Dive",
        duration: "3 tuần",
        level: "advanced",
        topics: [
          "AWS: Lambda, ECS, EKS, CloudWatch",
          "Auto Scaling",
          "Load Balancers",
          "VPC & Networking",
          "IAM & Security",
          "Cost Optimization",
          "Multi-region Deployment"
        ]
      },
      {
        id: "cicd-advanced",
        title: "6. CI/CD nâng cao",
        description: "Advanced Pipeline & Deployment",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "Pipeline as Code",
          "Multi-stage Pipelines",
          "Automated Testing in CI/CD",
          "Blue-Green Deployment",
          "Canary Deployment",
          "Rollback Strategies",
          "Infrastructure as Code (Terraform basics)"
        ]
      },
      {
        id: "monitoring-observability",
        title: "7. Monitoring & Observability",
        description: "Theo dõi hệ thống",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "Prometheus & Grafana",
          "Metrics Collection",
          "Custom Metrics",
          "Zipkin (Distributed Tracing)",
          "ELK Stack (Elasticsearch, Logstash, Kibana)",
          "Centralized Logging",
          "Alerting & Notifications"
        ]
      },
      {
        id: "performance-optimization",
        title: "8. Performance Optimization",
        description: "Tối ưu hiệu suất",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "Application Profiling",
          "Memory Management & GC Tuning",
          "Thread Pool Optimization",
          "Database Query Optimization",
          "Connection Pooling (HikariCP)",
          "Load Testing (JMeter, Gatling)",
          "Performance Monitoring"
        ]
      },
      {
        id: "security-advanced",
        title: "9. Advanced Security",
        description: "Bảo mật nâng cao",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "OAuth2 Authorization Server",
          "Multi-tenancy",
          "API Rate Limiting & Throttling",
          "Security Best Practices",
          "OWASP Top 10",
          "Penetration Testing Basics",
          "Secret Management (Vault)"
        ]
      },
      {
        id: "testing-advanced",
        title: "10. Advanced Testing",
        description: "Testing strategies",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "TestContainers",
          "Contract Testing (Pact)",
          "Performance Testing",
          "Chaos Engineering Basics",
          "Test Automation",
          "Mutation Testing"
        ]
      }
    ]
  },
  senior: {
    description: "Giai đoạn Senior (4+ năm KN) - Technical Leader, thiết kế kiến trúc hệ thống lớn, mentor team, đưa ra quyết định kỹ thuật quan trọng. Master Redis, Cloud, CI/CD.",
    motivation: "Bạn là người dẫn đường cho team. Kinh nghiệm của bạn là tài sản quý giá. Hãy chia sẻ và truyền cảm hứng!",
    steps: [
      {
        id: "system-design",
        title: "1. System Design",
        description: "Thiết kế hệ thống lớn",
        duration: "4 tuần",
        level: "advanced",
        topics: [
          "Scalability Patterns",
          "High Availability & Fault Tolerance",
          "CAP Theorem",
          "Database Sharding & Partitioning",
          "Load Balancing Strategies",
          "CDN & Edge Computing",
          "Rate Limiting & Throttling",
          "Distributed Systems Challenges"
        ]
      },
      {
        id: "ddd-architecture",
        title: "2. Domain-Driven Design",
        description: "DDD & Clean Architecture",
        duration: "3 tuần",
        level: "advanced",
        topics: [
          "Domain-Driven Design Principles",
          "Bounded Context",
          "Aggregates & Entities",
          "Value Objects",
          "Domain Events",
          "Hexagonal Architecture",
          "Clean Architecture",
          "CQRS in Practice"
        ]
      },
      {
        id: "kubernetes",
        title: "3. Kubernetes & Orchestration",
        description: "Container Orchestration",
        duration: "4 tuần",
        level: "advanced",
        topics: [
          "Kubernetes Architecture",
          "Pods, Services, Deployments",
          "ConfigMaps & Secrets",
          "Ingress & Load Balancing",
          "StatefulSets & DaemonSets",
          "Helm Charts",
          "Auto-scaling (HPA, VPA)",
          "Service Mesh (Istio basics)"
        ]
      },
      {
        id: "event-driven-advanced",
        title: "4. Event-Driven Architecture",
        description: "Kiến trúc hướng sự kiện nâng cao",
        duration: "3 tuần",
        level: "advanced",
        topics: [
          "Event Sourcing in Production",
          "CQRS Implementation",
          "Saga Pattern (Choreography vs Orchestration)",
          "Event Store Design",
          "Eventual Consistency",
          "Compensating Transactions",
          "Event Versioning",
          "Outbox Pattern"
        ]
      },
      {
        id: "distributed-systems",
        title: "5. Distributed Systems",
        description: "Hệ thống phân tán",
        duration: "3 tuần",
        level: "advanced",
        topics: [
          "Distributed Transactions",
          "Consensus Algorithms (Raft, Paxos)",
          "Distributed Locks (Redis, Zookeeper)",
          "Data Replication",
          "Consistency Models",
          "Vector Clocks",
          "Gossip Protocol",
          "Service Mesh Deep Dive"
        ]
      },
      {
        id: "cloud-native",
        title: "6. Cloud-Native Architecture",
        description: "AWS/GCP/Azure Master",
        duration: "3 tuần",
        level: "advanced",
        topics: [
          "Cloud Services Deep Dive",
          "Serverless Architecture (Lambda, Cloud Functions)",
          "Infrastructure as Code (Terraform, CloudFormation)",
          "Cloud Security Best Practices",
          "Cost Optimization Strategies",
          "Multi-cloud Strategy",
          "Disaster Recovery"
        ]
      },
      {
        id: "cicd-mastery",
        title: "7. CI/CD Mastery",
        description: "Advanced DevOps",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "GitOps (ArgoCD, Flux)",
          "Advanced Pipeline Optimization",
          "Security in CI/CD (SAST, DAST)",
          "Artifact Management",
          "Release Management",
          "Feature Flags",
          "Progressive Delivery"
        ]
      },
      {
        id: "data-engineering",
        title: "8. Data Engineering Basics",
        description: "Big Data & Analytics",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "Data Pipeline Design",
          "ETL vs ELT",
          "Apache Spark Basics",
          "Data Warehousing Concepts",
          "Real-time Analytics",
          "Data Lake Architecture"
        ]
      },
      {
        id: "security-architecture",
        title: "9. Security Architecture",
        description: "Enterprise Security",
        duration: "2 tuần",
        level: "advanced",
        topics: [
          "Zero Trust Architecture",
          "mTLS (Mutual TLS)",
          "API Security Best Practices",
          "Threat Modeling",
          "Security Auditing",
          "Compliance (GDPR, SOC2)",
          "Incident Response"
        ]
      },
      {
        id: "leadership",
        title: "10. Technical Leadership",
        description: "Kỹ năng lãnh đạo",
        duration: "Liên tục",
        level: "advanced",
        topics: [
          "Code Review Best Practices",
          "Mentoring & Coaching",
          "Technical Documentation",
          "Architecture Decision Records (ADR)",
          "Team Collaboration",
          "Agile/Scrum Leadership",
          "Stakeholder Communication",
          "Technical Debt Management"
        ]
      },
      {
        id: "innovation",
        title: "11. Innovation & Research",
        description: "Nghiên cứu công nghệ mới",
        duration: "Liên tục",
        level: "advanced",
        topics: [
          "Technology Radar",
          "POC (Proof of Concept)",
          "Tech Stack Evaluation",
          "Industry Trends",
          "Open Source Contribution",
          "Technical Blogging",
          "Conference Speaking"
        ]
      }
    ]
  }
};
