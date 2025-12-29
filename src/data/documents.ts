import { Document, DocumentType } from "@/types/document";

export const sampleDocuments: Document[] = [
  {
    id: "1",
    title: "Spring Boot in Action",
    description: "Cuốn sách chi tiết về Spring Boot framework, hướng dẫn từ cơ bản đến nâng cao với các ví dụ thực tế. Bao gồm Spring MVC, Spring Data, Spring Security và deployment.",
    type: DocumentType.BOOK,
    url: "https://www.manning.com/books/spring-boot-in-action",
    author: "Craig Walls",
    category: "Spring Boot",
    tags: ["Spring Boot", "Java", "Backend", "Framework"],
    coverImage: undefined,
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: "2",
    title: "Building Microservices: Designing Fine-Grained Systems",
    description: "Cuốn sách kinh điển về kiến trúc microservices, giải thích chi tiết cách thiết kế, phát triển và triển khai hệ thống microservices. Bao gồm các pattern và best practices.",
    type: DocumentType.BOOK,
    url: "https://www.oreilly.com/library/view/building-microservices-2nd/9781492034025/",
    author: "Sam Newman",
    category: "Microservices",
    tags: ["Microservices", "Architecture", "System Design", "Backend"],
    coverImage: undefined,
    createdAt: "2024-01-10T14:30:00Z",
    updatedAt: "2024-01-10T14:30:00Z"
  },
  {
    id: "3",
    title: "Spring Microservices in Action",
    description: "Hướng dẫn toàn diện về phát triển microservices với Spring Boot và Spring Cloud. Bao gồm service discovery, configuration management, circuit breaker patterns.",
    type: DocumentType.BOOK,
    url: "https://www.manning.com/books/spring-microservices-in-action",
    author: "John Carnell",
    category: "Microservices",
    tags: ["Spring Boot", "Microservices", "Spring Cloud", "Java"],
    coverImage: undefined,
    createdAt: "2024-01-08T09:15:00Z",
    updatedAt: "2024-01-08T09:15:00Z"
  },
  {
    id: "4",
    title: "Spring Boot: Up and Running",
    description: "Hướng dẫn toàn diện để xây dựng ứng dụng Spring Boot production-ready. Bao gồm configuration, testing, deployment và best practices.",
    type: DocumentType.BOOK,
    url: "https://www.oreilly.com/library/view/spring-boot-up/9781492076965/",
    author: "Mark Heckler",
    category: "Spring Boot",
    tags: ["Spring Boot", "Java", "Production", "Best Practices"],
    coverImage: undefined,
    createdAt: "2024-01-05T11:20:00Z",
    updatedAt: "2024-01-05T11:20:00Z"
  },
  {
    id: "5",
    title: "Microservices Patterns: With examples in Java",
    description: "Tập hợp các pattern thiết kế microservices với ví dụ cụ thể bằng Java. Bao gồm decomposition patterns, integration patterns, database patterns.",
    type: DocumentType.BOOK,
    url: "https://www.manning.com/books/microservices-patterns",
    author: "Chris Richardson",
    category: "Microservices",
    tags: ["Microservices", "Design Patterns", "Java", "Architecture"],
    coverImage: undefined,
    createdAt: "2024-01-03T08:45:00Z",
    updatedAt: "2024-01-03T08:45:00Z"
  }
];

export const documentCategories = [
  {
    id: "spring-boot",
    name: "Spring Boot",
    description: "Spring Boot Framework, Configuration, Auto-configuration",
    icon: "🌱"
  },
  {
    id: "microservices",
    name: "Microservices",
    description: "Microservices Architecture, Design Patterns, Implementation",
    icon: "🔧"
  },
  {
    id: "java-backend",
    name: "Java Backend",
    description: "Java, Spring Framework, Enterprise Applications",
    icon: "☕"
  },
  {
    id: "cloud-native",
    name: "Cloud Native",
    description: "Cloud-native applications, containers, orchestration",
    icon: "☁️"
  },
  {
    id: "system-design",
    name: "System Design",
    description: "System architecture, scalability, distributed systems",
    icon: "🏗️"
  },
  {
    id: "devops",
    name: "DevOps",
    description: "CI/CD, containerization, infrastructure as code",
    icon: "🚀"
  }
];
