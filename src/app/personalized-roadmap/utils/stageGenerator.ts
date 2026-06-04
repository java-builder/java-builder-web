import { Stage } from "../types";

export function generateStagesForGoal(goal: string): Stage[] {
  if (goal.includes("Backend Java")) {
    return [
      {
        week: "Tuần 1-2",
        title: "Củng cố nền tảng Java Core",
        status: "Đang học",
        progress: 0,
        outcome: "Viết code rõ ràng, xử lý collection, exception và OOP chắc hơn.",
        topics: ["OOP thực chiến", "Collections API", "Exception handling"],
        exercises: [
          "Refactor class quản lý học viên",
          "Bài tập Map/List xử lý dữ liệu",
          "Viết custom exception cho service",
        ],
      },
      {
        week: "Tuần 3-5",
        title: "Spring Boot API thực chiến",
        status: "Kế tiếp",
        progress: 0,
        outcome: "Xây dựng REST API có validation, DTO, service layer và response chuẩn.",
        topics: ["REST API", "Validation", "Layered architecture"],
        exercises: [
          "CRUD khóa học có phân trang",
          "Chuẩn hóa error response",
          "Viết unit test cho service",
        ],
      },
      {
        week: "Tuần 6-8",
        title: "Database, JPA và tối ưu query",
        status: "Sắp tới",
        progress: 0,
        outcome: "Nắm entity relationship, transaction và biết phát hiện query kém hiệu quả.",
        topics: ["JPA mapping", "Transaction", "Query optimization"],
        exercises: [
          "Thiết kế schema mini LMS",
          "Sửa lỗi N+1 query",
          "Viết report bằng JPQL",
        ],
      },
      {
        week: "Tuần 9-12",
        title: "Dự án tổng hợp và phỏng vấn",
        status: "Sắp tới",
        progress: 0,
        outcome: "Hoàn thiện project portfolio và luyện giải thích quyết định kỹ thuật.",
        topics: ["Project review", "Security căn bản", "Interview drill"],
        exercises: [
          "Hoàn thiện API quản lý lộ trình",
          "Thêm JWT authentication",
          "Mock interview 20 câu Java/Spring",
        ],
      },
    ];
  } else if (goal.includes("Fullstack")) {
    return [
      {
        week: "Tuần 1-2",
        title: "Giao diện React & Next.js hiện đại",
        status: "Đang học",
        progress: 0,
        outcome:
          "Xây dựng giao diện responsive bằng React hooks, Tailwind CSS và routing Next.js.",
        topics: ["React hooks & state", "Next.js routing", "Tailwind CSS"],
        exercises: [
          "Cấu trúc trang dashboard người dùng",
          "Call API hiển thị danh sách khóa học",
          "Xử lý state form đăng ký học viên",
        ],
      },
      {
        week: "Tuần 3-5",
        title: "Spring Boot Backend API",
        status: "Kế tiếp",
        progress: 0,
        outcome:
          "Xây dựng hệ thống API backend bảo mật và chuẩn Restful phục vụ Frontend.",
        topics: ["RESTful Controllers", "Spring Data JPA", "Spring Security"],
        exercises: [
          "Viết API CRUD khóa học và đăng ký",
          "Cấu hình JWT authentication",
          "Tích hợp CORS với React app",
        ],
      },
      {
        week: "Tuần 6-8",
        title: "Tích hợp & Dockerize ứng dụng",
        status: "Sắp tới",
        progress: 0,
        outcome:
          "Đóng gói container Docker, cấu hình docker-compose và deploy lên VPS.",
        topics: ["Docker", "Docker Compose", "CI/CD căn bản"],
        exercises: [
          "Viết Dockerfile cho React & Spring Boot",
          "Cấu hình Database container trong compose",
          "Deploy thử nghiệm lên server staging",
        ],
      },
    ];
  } else if (goal.includes("Spring Boot Developer")) {
    return [
      {
        week: "Tuần 1-3",
        title: "RESTful API nâng cao & Security",
        status: "Đang học",
        progress: 0,
        outcome:
          "Làm chủ cấu hình bảo mật Spring Security JWT và phân quyền chi tiết.",
        topics: [
          "Spring Security",
          "JWT Authentication",
          "Role-based Access Control",
        ],
        exercises: [
          "Tự viết JWT filter và validation",
          "Phân quyền method level với PreAuthorize",
          "Xử lý Exception Spring Security",
        ],
      },
      {
        week: "Tuần 4-6",
        title: "Tối ưu hóa Database & Caching",
        status: "Sắp tới",
        progress: 0,
        outcome:
          "Sử dụng Spring Cache với Redis để tăng tốc độ phản hồi API.",
        topics: [
          "Spring Cache & Redis",
          "JPA Query Tuning",
          "Transaction Management",
        ],
        exercises: [
          "Cấu hình Redis Cache cho API danh mục",
          "Tối ưu N+1 query với EntityGraph",
          "Viết transaction cô lập nâng cao",
        ],
      },
      {
        week: "Tuần 7-9",
        title: "Testing & Monitoring",
        status: "Sắp tới",
        progress: 0,
        outcome:
          "Viết Integration tests chuẩn, monitor service với Actuator & Prometheus.",
        topics: ["MockMvc Testing", "Spring Boot Actuator", "JUnit 5 & Mockito"],
        exercises: [
          "Viết Unit test cho Layered Service",
          "Viết Integration test sử dụng Testcontainers",
          "Cấu hình Actuator endpoint đo hiệu năng",
        ],
      },
    ];
  } else if (goal.includes("Intern") || goal.includes("Fresher")) {
    return [
      {
        week: "Tuần 1-2",
        title: "Củng cố OOP & Cấu trúc dữ liệu",
        status: "Đang học",
        progress: 0,
        outcome:
          "Làm chủ OOP, collection cơ bản và giải các thuật toán phổ biến trong phỏng vấn.",
        topics: ["OOP Principles", "Java Collections", "Algorithms & DSA basics"],
        exercises: [
          "Giải 15 bài toán LeetCode Java phổ biến",
          "Xây dựng thư viện mini bằng console",
          "Luyện giải thích Interface vs Abstract Class",
        ],
      },
      {
        week: "Tuần 3-5",
        title: "Làm quen Spring Boot & Database",
        status: "Sắp tới",
        progress: 0,
        outcome:
          "Hiểu mô hình MVC, viết REST API CRUD đơn giản và kết nối MySQL/PostgreSQL.",
        topics: ["Spring Boot MVC", "REST Controllers", "SQL & JDBC"],
        exercises: [
          "Xây dựng backend mini to-do list",
          "Viết câu query SQL JOIN nâng cao",
          "Tìm hiểu Dependency Injection là gì",
        ],
      },
      {
        week: "Tuần 6-8",
        title: "Luyện phỏng vấn thử",
        status: "Sắp tới",
        progress: 0,
        outcome:
          "Sẵn sàng trả lời các câu hỏi phỏng vấn về Java Core, Spring Boot và Database.",
        topics: [
          "Java OOP Interview Q&A",
          "Spring Framework Concepts",
          "CV Review",
        ],
        exercises: [
          "Trả lời 50 câu hỏi Java Core kinh điển",
          "Chuẩn bị mô tả đồ án trong CV",
          "Tham gia mock interview cùng Mentor",
        ],
      },
    ];
  } else if (goal.includes("Microservices") || goal.includes("DevOps")) {
    return [
      {
        week: "Tuần 1-3",
        title: "Kiến trúc Microservices",
        status: "Đang học",
        progress: 0,
        outcome:
          "Thiết kế hệ thống phân tán giao tiếp qua Gateway, Service Discovery và Config Server.",
        topics: [
          "Spring Cloud Gateway",
          "Eureka Discovery",
          "Spring Cloud Config",
        ],
        exercises: [
          "Cấu hình API Gateway định tuyến request",
          "Đăng ký service và cấu hình tập trung",
          "Cấu hình Circuit Breaker với Resilience4j",
        ],
      },
      {
        week: "Tuần 4-6",
        title: "Giao tiếp bất đồng bộ & Caching",
        status: "Sắp tới",
        progress: 0,
        outcome:
          "Tích hợp Apache Kafka/RabbitMQ truyền nhận event, đồng bộ dữ liệu qua Redis cluster.",
        topics: ["Apache Kafka", "Redis Cache", "Event-driven Architecture"],
        exercises: [
          "Viết Producer/Consumer gửi nhận message",
          "Thiết kế Saga pattern cho transaction phân tán",
          "Đồng bộ cache khi dữ liệu DB thay đổi",
        ],
      },
      {
        week: "Tuần 7-10",
        title: "DevOps & Deployment",
        status: "Sắp tới",
        progress: 0,
        outcome:
          "Deploy container lên Kubernetes, cấu hình CI/CD pipeline tự động.",
        topics: ["Kubernetes (K8s)", "Jenkins/GitHub Actions", "Docker Compose"],
        exercises: [
          "Viết manifest file deploy k8s",
          "Cấu hình ingress và load balancer",
          "Viết script tự động build docker image",
        ],
      },
    ];
  } else {
    return [
      {
        week: "Tuần 1-3",
        title: "Nhập môn Lập trình Java",
        status: "Đang học",
        progress: 0,
        outcome:
          "Nắm vững cú pháp cơ bản, cách biên dịch, chạy ứng dụng Java và hiểu tư duy lập trình.",
        topics: ["Java Syntax", "Variables & Types", "Control Flow & Loops"],
        exercises: [
          "Viết chương trình tính toán số học",
          "Bài tập thao tác và xử lý mảng",
          "Giải quyết bài toán logic cơ bản",
        ],
      },
      {
        week: "Tuần 4-6",
        title: "Hướng đối tượng OOP & Collections",
        status: "Sắp tới",
        progress: 0,
        outcome:
          "Hiểu tư duy thiết kế Class, Interface, tính kế thừa, đa hình và thao tác với cấu trúc dữ liệu Java.",
        topics: [
          "Encapsulation, Inheritance, Polymorphism",
          "List, Set, Map",
          "File I/O & Exception",
        ],
        exercises: [
          "Xây dựng chương trình quản lý cửa hàng",
          "Sử dụng Map để lưu trữ cặp key-value",
          "Bắt lỗi Exception khi nhập liệu sai",
        ],
      },
      {
        week: "Tuần 7-10",
        title: "Spring Boot & Dự án thực tế",
        status: "Sắp tới",
        progress: 0,
        outcome:
          "Xây dựng và chạy thành công ứng dụng Web API đơn giản bằng Spring Boot.",
        topics: ["Spring Boot Web", "H2 In-memory Database", "REST Controller"],
        exercises: [
          "Viết API quản lý danh sách công việc cá nhân",
          "Kết nối và lưu dữ liệu vào database",
          "Deploy ứng dụng lên localhost",
        ],
      },
    ];
  }
}
