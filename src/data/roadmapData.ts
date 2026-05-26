import { Locale } from "@/i18n/config";

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

const translations: Record<string, Record<string, string>> = {
  en: {
    "Giai đoạn thực tập sinh - Học đủ kiến thức cơ bản để có thể làm việc được với dự án thực tế. Mục tiêu: Có thể làm CRUD đơn giản với Spring Boot.": "Intern stage - Learn enough basic knowledge to work on real-world projects. Goal: Able to perform simple CRUD operations with Spring Boot.",
    "Mỗi dòng code bạn viết hôm nay là nền tảng cho sự nghiệp ngày mai. Hãy kiên trì!": "Every line of code you write today is the foundation for tomorrow's career. Stay persistent!",
    "Nền tảng lập trình Java": "Java Programming Foundation",
    "3 tuần": "3 weeks",
    "Cú pháp Java, biến, kiểu dữ liệu": "Java syntax, variables, data types",
    "Lambda & Stream API cơ bản": "Basic Lambda & Stream API",
    "Làm việc với cơ sở dữ liệu": "Working with Databases",
    "2 tuần": "2 weeks",
    "Kết nối Java với Database": "Connecting Java with Database",
    "1 tuần": "1 week",
    "CRUD Operations với JDBC": "CRUD Operations with JDBC",
    "Connection Pooling cơ bản": "Basic Connection Pooling",
    "4. Hibernate & JPA cơ bản": "4. Basic Hibernate & JPA",
    "CRUD với Hibernate/JPA": "CRUD with Hibernate/JPA",
    "HQL/JPQL cơ bản": "Basic HQL/JPQL",
    "6. Spring Boot cơ bản": "6. Basic Spring Boot",
    "Xây dựng ứng dụng CRUD": "Building CRUD Applications",
    "Xử lý lỗi và validate": "Error Handling & Validation",
    "Tools cơ bản": "Basic Tools",
    "Giai đoạn mới ra trường - Làm chủ Spring Boot và các tính năng nâng cao. Có thể làm việc độc lập với các task vừa phải. Bắt đầu tìm hiểu Docker.": "Fresher stage - Master Spring Boot and advanced features. Able to work independently on moderate tasks. Start learning Docker.",
    "Bạn đã có nền tảng, giờ là lúc xây dựng những kỹ năng thực chiến. Cứ tiến lên!": "You have the foundation, now it's time to build practical skills. Keep moving forward!",
    "1. Spring Data JPA nâng cao": "1. Advanced Spring Data JPA",
    "Làm chủ JPA": "Mastering JPA",
    "Chuyển đổi Entity-DTO": "Entity-DTO Mapping",
    "API Response Structure chuẩn": "Standard API Response Structure",
    "Bảo mật ứng dụng": "Application Security",
    "Xử lý file và email": "File & Email Handling",
    "Viết test cho ứng dụng": "Writing Application Tests",
    "Tài liệu hóa và logging": "API Documentation & Logging",
    "7. Docker cơ bản": "7. Basic Docker",
    "8. Query Optimization cơ bản": "8. Basic Query Optimization",
    "Tối ưu database queries": "Optimizing Database Queries",
    "Giai đoạn Junior (1-2 năm KN) - Làm việc độc lập, xử lý các tính năng phức tạp. Bắt đầu tìm hiểu Redis, Cloud, CI/CD.": "Junior stage (1-2 years exp) - Work independently, handle complex features. Start learning Redis, Cloud, CI/CD.",
    "Bạn đang trên con đường trở thành developer chuyên nghiệp. Mỗi bug bạn fix là một bài học quý giá!": "You are on the path to becoming a professional developer. Every bug you fix is a valuable lesson!",
    "Các mẫu thiết kế phổ biến": "Common Design Patterns",
    "2. Redis cơ bản": "2. Basic Redis",
    "Caching với Redis": "Caching with Redis",
    "Các tính năng nâng cao": "Advanced Features",
    "Quản lý giao dịch và AOP": "Transaction Management & AOP",
    "6. Cloud Platform cơ bản": "6. Basic Cloud Platform",
    "Deployment lên Cloud": "Deployment to Cloud",
    "7. CI/CD cơ bản": "7. Basic CI/CD",
    "8. Docker nâng cao": "8. Advanced Docker",
    "Thiết kế API chuẩn": "Standard API Design",
    "Rate Limiting cơ bản": "Basic Rate Limiting",
    "Giai đoạn Middle (2-4 năm KN) - Thiết kế kiến trúc, mentor junior, xử lý các vấn đề phức tạp về performance và scalability. Nắm vững Redis, Cloud, CI/CD.": "Middle stage (2-4 years exp) - Design architecture, mentor juniors, handle complex performance and scalability issues. Master Redis, Cloud, CI/CD.",
    "Bạn không chỉ viết code, bạn đang xây dựng hệ thống. Hãy suy nghĩ như một kiến trúc sư!": "You are not just writing code, you are building systems. Think like an architect!",
    "1. Redis nâng cao": "1. Advanced Redis",
    "Kiến trúc Microservices": "Microservices Architecture",
    "5. Cloud Platform nâng cao": "5. Advanced Cloud Platform",
    "6. CI/CD nâng cao": "6. Advanced CI/CD",
    "Theo dõi hệ thống": "System Monitoring",
    "Tối ưu hiệu suất": "Performance Optimization",
    "Bảo mật nâng cao": "Advanced Security",
    "Giai đoạn Senior (4+ năm KN) - Technical Leader, thiết kế kiến trúc hệ thống lớn, mentor team, đưa ra quyết định kỹ thuật quan trọng. Master Redis, Cloud, CI/CD.": "Senior stage (4+ years exp) - Technical Leader, design large-scale architectures, mentor teams, make critical technical decisions. Master Redis, Cloud, CI/CD.",
    "Bạn là người dẫn đường cho team. Kinh nghiệm của bạn là tài sản quý giá. Hãy chia sẻ và truyền cảm hứng!": "You are the guide for the team. Your experience is a valuable asset. Share and inspire!",
    "Thiết kế hệ thống lớn": "Large-Scale System Design",
    "4 tuần": "4 weeks",
    "4. Kiến trúc hướng sự kiện nâng cao": "4. Advanced Event-Driven Architecture",
    "Kiến trúc hướng sự kiện nâng cao": "Advanced Event-Driven Architecture",
    "Hệ thống phân tán": "Distributed Systems",
    "Kỹ năng lãnh đạo": "Leadership Skills",
    "Liên tục": "Ongoing",
    "Nghiên cứu công nghệ mới": "New Technology Research"
  },
  ja: {
    "Giai đoạn thực tập sinh - Học đủ kiến thức cơ bản để có thể làm việc được với dự án thực tế. Mục tiêu: Có thể làm CRUD đơn giản với Spring Boot.": "インターン段階 - 実際のプロジェクトで働くための十分な基礎知識を習得します。目標：Spring BootでシンプルなCRUDを作成できること。",
    "Mỗi dòng code bạn viết hôm nay là nền tảng cho sự nghiệp ngày mai. Hãy kiên trì!": "今日書くコードの1行1行が、明日のキャリアの基盤となります。粘り強く続けましょう！",
    "Nền tảng lập trình Java": "Javaプログラミングの基礎",
    "3 tuần": "3週間",
    "Cú pháp Java, biến, kiểu dữ liệu": "Java構文、変数、データ型",
    "Lambda & Stream API cơ bản": "基本的なLambdaとStream API",
    "Làm việc với cơ sở dữ liệu": "データベースの操作",
    "2 tuần": "2週間",
    "Kết nối Java với Database": "Javaとデータベースの接続",
    "1 tuần": "1週間",
    "CRUD Operations với JDBC": "JDBCによるCRUD操作",
    "Connection Pooling cơ bản": "基本的なコネクションプーリング",
    "4. Hibernate & JPA cơ bản": "4. Hibernate & JPA 基礎",
    "CRUD với Hibernate/JPA": "Hibernate/JPAによるCRUD",
    "HQL/JPQL cơ bản": "基本的なHQL/JPQL",
    "6. Spring Boot cơ bản": "6. Spring Boot 基礎",
    "Xây dựng ứng dụng CRUD": "CRUDアプリケーションの構築",
    "Xử lý lỗi và validate": "エラー処理とバリデーション",
    "Tools cơ bản": "基本ツール",
    "Giai đoạn mới ra trường - Làm chủ Spring Boot và các tính năng nâng cao. Có thể làm việc độc lập với các task vừa phải. Bắt đầu tìm hiểu Docker.": "新卒・フレッシャー段階 - Spring Bootと高度な機能をマスターします。中程度のタスクで独立して作業できます。Dockerの学習を開始します。",
    "Bạn đã có nền tảng, giờ là lúc xây dựng những kỹ năng thực chiến. Cứ tiến lên!": "基礎はできました。次は実戦スキルを身につける番です。前進し続けましょう！",
    "1. Spring Data JPA nâng cao": "1. Spring Data JPA 応用",
    "Làm chủ JPA": "JPAの習得",
    "Chuyển đổi Entity-DTO": "Entity-DTOの変換",
    "API Response Structure chuẩn": "標準のAPIレスポンス構造",
    "Bảo mật ứng dụng": "アプリケーションセキュリティ",
    "Xử lý file và email": "ファイルとメールの処理",
    "Viết test cho ứng dụng": "アプリケーションのテスト作成",
    "Tài liệu hóa và logging": "ドキュメント化とロギング",
    "7. Docker cơ bản": "7. Docker 基礎",
    "8. Query Optimization cơ bản": "8. クエリ最適化基礎",
    "Tối ưu database queries": "データベースクエリの最適化",
    "Giai đoạn Junior (1-2 năm KN) - Làm việc độc lập, xử lý các tính năng phức tạp. Bắt đầu tìm hiểu Redis, Cloud, CI/CD.": "ジュニア段階 (実務1〜2年) - 独立して作業し、複雑な機能を処理します。Redis、クラウド、CI/CDの学習を開始します。",
    "Bạn đang trên con đường trở thành developer chuyên nghiệp. Mỗi bug bạn fix là một bài học quý giá!": "あなたはプロの開発者への道を歩んでいます。修正するすべてのバグが貴重な教訓です！",
    "Các mẫu thiết kế phổ biến": "一般的なデザインパターン",
    "2. Redis cơ bản": "2. Redis 基礎",
    "Caching với Redis": "Redisによるキャッシュ",
    "Các tính năng nâng cao": "高度な機能",
    "Quản lý giao dịch và AOP": "トランザクション管理とAOP",
    "6. Cloud Platform cơ bản": "6. クラウドプラットフォーム基礎",
    "Deployment lên Cloud": "クラウドへのデプロイ",
    "7. CI/CD cơ bản": "7. CI/CD 基礎",
    "8. Docker nâng cao": "8. Docker 応用",
    "Thiết kế API chuẩn": "標準API設計",
    "Rate Limiting cơ bản": "基本的なレート制限",
    "Giai đoạn Middle (2-4 năm KN) - Thiết kế kiến trúc, mentor junior, xử lý các vấn đề phức tạp về performance và scalability. Nắm vững Redis, Cloud, CI/CD.": "ミドル段階 (実務2〜4年) - アーキテクチャの設計、ジュニアのメンター、パフォーマンスとスケーラビリティの複雑な問題の処理。Redis、クラウド、CI/CDの習得。",
    "Bạn không chỉ viết code, bạn đang xây dựng hệ thống. Hãy suy nghĩ như một kiến trúc sư!": "単にコードを書くだけでなく、システムを構築しています。建築家のように考えましょう！",
    "1. Redis nâng cao": "1. Redis 応用",
    "Kiến trúc Microservices": "マイクロサービスアーキテクチャ",
    "5. Cloud Platform nâng cao": "5. クラウドプラットフォーム応用",
    "6. CI/CD nâng cao": "6. CI/CD 応用",
    "Theo dõi hệ thống": "システムモニタリング",
    "Tối ưu hiệu suất": "パフォーマンス最適化",
    "Bảo mật nâng cao": "高度なセキュリティ",
    "Giai đoạn Senior (4+ năm KN) - Technical Leader, thiết kế kiến trúc hệ thống lớn, mentor team, đưa ra quyết định kỹ thuật quan trọng. Master Redis, Cloud, CI/CD.": "シニア段階 (実務4年以上) - テクニカルリーダー、大規模なアーキテクチャの設計、チームのメンター、重要な技術的決定。Redis、クラウド、CI/CDのマスター。",
    "Bạn là người dẫn đường cho team. Kinh nghiệm của bạn là tài sản quý giá. Hãy chia sẻ và truyền cảm hứng!": "あなたはチームの指導者です。あなたの経験は貴重な資産です。共有し、インスピレーションを与えましょう！",
    "Thiết kế hệ thống lớn": "大規模システム設計",
    "4 tuần": "4週間",
    "4. Kiến trúc hướng sự kiện nâng cao": "4. イベント駆動型アーキテクチャ応用",
    "Kiến trúc hướng sự kiện nâng cao": "イベント駆動型アーキテクチャ応用",
    "Hệ thống phân tán": "分散システム",
    "Kỹ năng lãnh đạo": "リーダーシップスキル",
    "Liên tục": "継続的",
    "Nghiên cứu công nghệ mới": "新しい技術の研究"
  },
  ko: {
    "Giai đoạn thực tập sinh - Học đủ kiến thức cơ bản để có thể làm việc được với dự án thực tế. Mục tiêu: Có thể làm CRUD đơn giản với Spring Boot.": "인턴 단계 - 실제 프로젝트에서 일할 수 있는 충분한 기본 지식을 습득합니다. 목표: Spring Boot로 간단한 CRUD를 작성할 수 있음.",
    "Mỗi dòng code bạn viết hôm nay là nền tảng cho sự nghiệp ngày mai. Hãy kiên trì!": "오늘 작성하는 코드 한 줄 한 줄이 내일의 커리어의 기반이 됩니다. 끈기 있게 나아가세요!",
    "Nền tảng lập trình Java": "Java 프로그래밍 기초",
    "3 tuần": "3주",
    "Cú pháp Java, biến, kiểu dữ liệu": "Java 구문, 변수, 데이터 타입",
    "Lambda & Stream API cơ bản": "기본 Lambda 및 Stream API",
    "Làm việc với cơ sở dữ liệu": "데이터베이스 작업",
    "2 tuần": "2주",
    "Kết nối Java với Database": "Java와 데이터베이스 연결",
    "1 tuần": "1주",
    "CRUD Operations với JDBC": "JDBC를 사용한 CRUD 작업",
    "Connection Pooling cơ bản": "기본 커넥션 풀링",
    "4. Hibernate & JPA cơ bản": "4. Hibernate & JPA 기초",
    "CRUD với Hibernate/JPA": "Hibernate/JPA를 사용한 CRUD",
    "HQL/JPQL cơ bản": "기본 HQL/JPQL",
    "6. Spring Boot cơ bản": "6. Spring Boot 기초",
    "Xây dựng ứng dụng CRUD": "CRUD 애플리케이션 구축",
    "Xử lý lỗi và validate": "에러 처리 및 검증",
    "Tools cơ bản": "기본 툴",
    "Giai đoạn mới ra trường - Làm chủ Spring Boot và các tính năng nâng cao. Có thể làm việc độc lập với các task vừa phải. Bắt đầu tìm hiểu Docker.": "신입/프레셔 단계 - Spring Boot 및 고급 기능을 마스터합니다. 적절한 작업에 대해 독립적으로 작업할 수 있습니다. Docker 학습을 시작합니다.",
    "Bạn đã có nền tảng, giờ là lúc xây dựng những kỹ năng thực chiến. Cứ tiến lên!": "기본은 갖추었습니다. 이제 실전 기술을 구축할 때입니다. 계속 전진하세요!",
    "1. Spring Data JPA nâng cao": "1. Spring Data JPA 심화",
    "Làm chủ JPA": "JPA 마스터",
    "Chuyển đổi Entity-DTO": "Entity-DTO 변환",
    "API Response Structure chuẩn": "표준 API 응답 구조",
    "Bảo mật ứng dụng": "애플리케이션 보안",
    "Xử lý file và email": "파일 및 이메일 처리",
    "Viết test cho ứng dụng": "애플리케이션 테스트 작성",
    "Tài liệu hóa và logging": "문서화 및 로깅",
    "7. Docker cơ bản": "7. Docker 기초",
    "8. Query Optimization cơ bản": "8. 쿼리 최적화 기초",
    "Tối ưu database queries": "데이터베이스 쿼리 최적화",
    "Giai đoạn Junior (1-2 năm KN) - Làm việc độc lập, xử lý các tính năng phức tạp. Bắt đầu tìm hiểu Redis, Cloud, CI/CD.": "주니어 단계 (경력 1~2년) - 독립적으로 작업하며 복잡한 기능을 처리합니다. Redis, 클라우드, CI/CD 학습을 시작합니다.",
    "Bạn đang trên con đường trở thành developer chuyên nghiệp. Mỗi bug bạn fix là một bài học quý giá!": "당신은 전문 개발자가 되는 길에 있습니다. 수정하는 모든 버그는 귀중한 교훈입니다!",
    "Các mẫu thiết kế phổ biến": "공통 디자인 패턴",
    "2. Redis cơ bản": "2. Redis 기초",
    "Caching với Redis": "Redis를 사용한 캐싱",
    "Các tính năng nâng cao": "고급 기능",
    "Quản lý giao dịch và AOP": "트랜잭션 관리 및 AOP",
    "6. Cloud Platform cơ bản": "6. 클라우드 플랫폼 기초",
    "Deployment lên Cloud": "클라우드 배포",
    "7. CI/CD cơ bản": "7. CI/CD 기초",
    "8. Docker nâng cao": "8. Docker 심화",
    "Thiết kế API chuẩn": "표준 API 설계",
    "Rate Limiting cơ bản": "기본 처리율 제한",
    "Giai đoạn Middle (2-4 năm KN) - Thiết kế kiến trúc, mentor junior, xử lý các vấn đề phức tạp về performance và scalability. Nắm vững Redis, Cloud, CI/CD.": "미들 단계 (경력 2~4년) - 아키텍처 설계, 주니어 멘토링, 복잡한 성능 및 확장성 문제 처리. Redis, 클라우드, CI/CD 마스터.",
    "Bạn không chỉ viết code, bạn đang xây dựng hệ thống. Hãy suy nghĩ như một kiến trúc sư!": "단순히 코드를 작성하는 것이 아니라 시스템을 구축하고 있습니다. 설계자처럼 생각하세요!",
    "1. Redis nâng cao": "1. Redis 심화",
    "Kiến trúc Microservices": "마이크로서비스 아키텍처",
    "5. Cloud Platform nâng cao": "5. 클라우드 플랫폼 심화",
    "6. CI/CD nâng cao": "6. CI/CD 심화",
    "Theo dõi hệ thống": "시스템 모니터링",
    "Tối ưu hiệu suất": "성능 최적화",
    "Bảo mật nâng cao": "고급 보안",
    "Giai đoạn Senior (4+ năm KN) - Technical Leader, thiết kế kiến trúc hệ thống lớn, mentor team, đưa ra quyết định kỹ thuật quan trọng. Master Redis, Cloud, CI/CD.": "시니어 단계 (경력 4년 이상) - 테크니컬 리더, 대규모 아키텍처 설계, 팀 멘토링, 중요 기술 결정. Redis, 클라우드, CI/CD 마스터.",
    "Bạn là người dẫn đường cho team. Kinh nghiệm của bạn là tài sản quý giá. Hãy chia sẻ và truyền cảm hứng!": "귀하는 팀의 가이드입니다. 귀하의 경험은 소중한 자산입니다. 공유하고 영감을 주세요!",
    "Thiết kế hệ thống lớn": "대규모 시스템 설계",
    "4 tuần": "4주",
    "4. Kiến trúc hướng sự kiện nâng cao": "4. 이벤트 기반 아키텍처 심화",
    "Kiến trúc hướng sự kiện nâng cao": "이벤트 기반 아키텍처 심화",
    "Hệ thống phân tán": "분산 시스템",
    "Kỹ năng lãnh đạo": "리더십 기술",
    "Liên tục": "지속적",
    "Nghiên cứu công nghệ mới": "신기술 연구"
  }
};

export function getLocalizedRoadmapData(locale: Locale): Record<string, RoadmapLevel> {
  const translate = (text: string): string => {
    if (locale === "vi") return text;
    return translations[locale]?.[text] || translations["en"]?.[text] || text;
  };

  const localizedData: Record<string, RoadmapLevel> = {};

  for (const [key, level] of Object.entries(roadmapData)) {
    localizedData[key] = {
      description: translate(level.description),
      motivation: translate(level.motivation),
      steps: level.steps.map(step => ({
        ...step,
        title: translate(step.title),
        description: translate(step.description),
        duration: translate(step.duration),
        topics: step.topics.map(topic => translate(topic))
      }))
    };
  }

  return localizedData;
}
