export interface Interviewer {
  id: string;
  name: string;
  title: string;
  company: string;
  experience: string;
  focus: string;
  description: string;
  personality: string;
  themeColor: string;
  borderColor: string;
  avatarGradient: string;
}

export interface Question {
  id: number;
  text: string;
  keyPoints: string[];
  sampleAnswer: string;
}

export interface QuestionResult {
  questionId: number;
  questionText: string;
  score: number;
  strengths: string[];
  weaknesses: string[];
  studentAnswer: string;
  sampleAnswer: string;
}

export interface TopicItem {
  id: string;
  name: string;
  icon: string;
  hasInfo?: boolean;
}

export interface CategoryGroup {
  title: string;
  topics: TopicItem[];
}

export const interviewers: Interviewer[] = [
  {
    id: "spring-boot-ai",
    name: "Spring Architect AI",
    title: "AI Technical Lead & Architect",
    company: "JavaBuilder Virtual Lab",
    experience: "Phân tích 50k+ dự án Spring Boot",
    focus: "Spring Boot, SQL Optimization, Transactions, Enterprise Patterns",
    description: "Nhà phỏng vấn ảo chuyên sâu về thiết kế hệ thống Spring Boot, tối ưu Hibernate JPA và kiểm soát giao dịch phân tán. Tính cách phân tích sắc sảo.",
    personality: "Sắc sảo, thực tế, tối ưu hiệu năng",
    themeColor: "from-orange-500 to-red-650",
    borderColor: "border-orange-500",
    avatarGradient: "from-orange-400 to-amber-500"
  },
  {
    id: "concurrency-ai",
    name: "Concurrency Expert AI",
    title: "AI Concurrency Specialist",
    company: "JavaBuilder Virtual Lab",
    experience: "Giả lập 1M+ tình huống đa luồng",
    focus: "Java Multithreading, JVM Memory Tuning, GC Algorithms",
    description: "Chuyên gia giả lập về đa luồng, xử lý bất đồng bộ, tối ưu Garbage Collection và phân tích hiện tượng Memory Leak. Đề cao tính đúng đắn của giải thuật.",
    personality: "Học thuật, đi sâu chi tiết hệ thống",
    themeColor: "from-emerald-600 to-teal-700",
    borderColor: "border-emerald-600",
    avatarGradient: "from-emerald-400 to-teal-500"
  },
  {
    id: "java-core-ai",
    name: "Java Core Mentor AI",
    title: "AI Java Core Specialist",
    company: "JavaBuilder Virtual Lab",
    experience: "Đánh giá 100k+ bài kiểm tra OOP",
    focus: "OOP, SOLID Principles, Design Patterns, Collection Framework",
    description: "Huấn luyện viên ảo tập trung vào tư duy hướng đối tượng, thiết kế Clean Code, các quy tắc SOLID và ứng dụng hiệu quả Collection Framework.",
    personality: "Đề cao code sạch, nguyên lý SOLID",
    themeColor: "from-indigo-500 to-purple-600",
    borderColor: "border-indigo-500",
    avatarGradient: "from-indigo-400 to-purple-500"
  }
];

export const questionPool: Record<string, Question[]> = {
  "java": [
    {
      id: 101,
      text: "Hãy giải thích sự khác biệt giữa Interface và Abstract Class trong Java? Khi nào nên sử dụng cái nào trong thiết kế hệ thống?",
      keyPoints: [
        "Interface biểu diễn hành vi (Contract), đa kế thừa.",
        "Abstract class biểu diễn bản chất, đơn kế thừa.",
        "Sử dụng interface khi các lớp không cùng phân cấp cần chung hành vi.",
        "Sử dụng abstract class khi muốn tái sử dụng mã nguồn và chia sẻ biến trạng thái."
      ],
      sampleAnswer: "Interface biểu diễn một cam kết hành vi, cho phép một lớp kế thừa nhiều interface. Abstract Class là một lớp cha chung đại diện cho bản chất thực thể, chỉ cho phép đơn kế thừa. Chọn Interface khi các lớp khác nhau cần chung hành vi nhưng không cùng nguồn gốc. Chọn Abstract Class khi muốn tái sử dụng mã nguồn và chia sẻ biến trạng thái chung giữa các lớp con có quan hệ kế thừa trực hệ."
    },
    {
      id: 102,
      text: "Cơ chế xử lý Exception trong Java hoạt động như thế nào? Phân biệt giữa Checked Exception và Unchecked Exception?",
      keyPoints: [
        "Exception là sự kiện bất thường phá vỡ luồng chạy bình thường của chương trình.",
        "Checked Exception: Bắt buộc phải khai báo (throws) hoặc bắt (try-catch) ngay lúc compile.",
        "Unchecked Exception: Xảy ra trong lúc runtime, không bắt buộc khai báo (kế thừa RuntimeException).",
        "Ví dụ Checked: IOException, SQLException. Ví dụ Unchecked: NullPointerException."
      ],
      sampleAnswer: "Checked Exception là các ngoại lệ mà trình biên dịch bắt buộc nhà phát triển phải xử lý bằng block 'try-catch' hoặc khai báo 'throws' ở chữ ký hàm. Unchecked Exception (kế thừa từ RuntimeException) xảy ra trong lúc ứng dụng đang chạy và thường do lỗi logic code, trình biên dịch không ép buộc phải xử lý trước. Cơ chế ném ngoại lệ đi qua cấu trúc Stack Trace để tìm bộ xử lý phù hợp."
    }
  ],
  "spring-boot": [
    {
      id: 201,
      text: "Em hãy giải thích vấn đề truy vấn N+1 (N+1 Query Problem) trong Hibernate/Spring Data JPA và đề xuất các giải pháp tối ưu hóa hiệu năng thực tế?",
      keyPoints: [
        "Lỗi N+1: Truy vấn 1 bảng chính sinh ra N câu select bảng phụ.",
        "Giải pháp Fetch Join: Ép Hibernate join bảng phụ trong 1 câu SQL.",
        "Giải pháp EntityGraph: Định nghĩa đồ thị load dữ liệu đi kèm trực quan.",
        "Giải pháp DTO Projection: Chỉ lấy các trường cần thiết."
      ],
      sampleAnswer: "Vấn đề N+1 xảy ra khi Hibernate thực hiện 1 truy vấn ban đầu để lấy N thực thể cha, sau đó với mỗi thực thể cha, nó tiếp tục gọi thêm N truy vấn con để lấy các thực thể liên kết (Lazy loading). Để khắc phục: 1) Sử dụng 'JOIN FETCH' trong câu truy vấn JPQL; 2) Sử dụng Annotation '@EntityGraph' trên Repository method để khai báo các mối quan hệ cần tải eager; 3) Sử dụng DTO Projection để chỉ select các cột cần dùng, giúp loại bỏ hoàn toàn cơ chế Lazy loading không cần thiết."
    },
    {
      id: 202,
      text: "Làm thế nào để quản lý giao dịch (Transaction Management) trong Spring Boot? Sự khác biệt giữa Transaction Propagation REQUIRED và REQUIRES_NEW là gì?",
      keyPoints: [
        "Sử dụng annotation @Transactional để quản lý declarative transaction.",
        "REQUIRED (Mặc định): Tham gia vào giao dịch hiện có nếu có, nếu chưa thì tạo mới.",
        "REQUIRES_NEW: Luôn tạm dừng giao dịch hiện có và tạo một giao dịch mới độc lập.",
        "Rủi ro rollback chéo và deadlock giữa các kết nối kết hợp."
      ],
      sampleAnswer: "Trong Spring Boot, giao dịch được quản lý thông qua Annotation '@Transactional' (Declarative). Với Propagation.REQUIRED (mặc định), nếu có một giao dịch đang chạy, method sẽ tham gia vào đó; nếu không sẽ tạo mới. Với Propagation.REQUIRES_NEW, Spring sẽ tạm dừng giao dịch hiện có, mở một giao dịch mới độc lập và commit/rollback độc lập. Nếu giao dịch mới rollback, nó không ảnh hưởng trực tiếp đến giao dịch cha ngoại trừ trường hợp Exception bị ném ngược lại."
    }
  ],
  "spring-security": [
    {
      id: 701,
      text: "Hãy giải thích cơ chế hoạt động của Spring Security Filter Chain? Phân biệt Authentication và Authorization?",
      keyPoints: [
        "Spring Security dựa trên một chuỗi các Filter (SecurityFilterChain).",
        "AuthenticationFilter trích xuất thông tin đăng nhập và chuyển cho AuthenticationManager.",
        "Authentication: Xác thực danh tính người dùng (Ai đây?).",
        "Authorization: Quyết định quyền truy cập tài nguyên (Được làm gì?)."
      ],
      sampleAnswer: "Spring Security hoạt động dựa trên cơ chế Filter Chain - một chuỗi các bộ lọc Servlet can thiệp vào Request trước khi tới Controller. Quá trình xác thực bắt đầu khi UsernamePasswordAuthenticationFilter chặn request, chuyển thông tin cho AuthenticationManager để xác thực danh tính (Authentication). Sau khi xác thực thành công, SecurityContextHolder lưu trữ thông tin Authentication. Quá trình phân quyền (Authorization) diễn ra sau đó nhờ FilterSecurityInterceptor để quyết định xem người dùng có đủ Authority/Role để truy cập API hay không."
    }
  ],
  "spring-data-jpa": [
    {
      id: 801,
      text: "Hãy giải thích sự khác biệt giữa các trạng thái Entity trong Hibernate JPA (Transient, Managed, Detached, Removed)?",
      keyPoints: [
        "Transient: Đối tượng mới tạo bằng code, chưa liên kết Session, chưa có ID db.",
        "Managed: Đang liên kết với Session, mọi thay đổi thuộc tính sẽ tự động cập nhật db (dirty checking).",
        "Detached: Từng liên kết nhưng Session đã đóng hoặc bị evict/clear.",
        "Removed: Được đánh dấu xóa trong Session và sẽ bị delete db khi flush."
      ],
      sampleAnswer: "Trong JPA/Hibernate, một Entity có 4 trạng thái vòng đời: 1) Transient: Thực thể mới được khởi tạo bằng toán tử 'new', chưa thuộc quản lý của Persistence Context và chưa có khóa chính; 2) Managed: Thực thể đã liên kết với Session và có ID db, Hibernate tự động theo dõi và cập nhật database thông qua cơ chế Dirty Checking khi commit; 3) Detached: Thực thể từng được managed nhưng Session đã bị đóng hoặc clear, các thay đổi thuộc tính sẽ không tự động đồng bộ xuống db; 4) Removed: Thực thể được đánh dấu xóa bằng Session.remove() và sẽ bị xóa khỏi database vật lý khi session flush."
    }
  ],
  "concurrency": [
    {
      id: 301,
      text: "Từ khóa 'volatile' trong Java Concurrency có ý nghĩa gì? Nó khác gì so với khối đồng bộ 'synchronized'?",
      keyPoints: [
        "Volatile đảm bảo tính hiển thị bộ nhớ (Memory Visibility) trực tiếp trên RAM.",
        "Volatile ngăn cản việc sắp xếp lại lệnh (Instruction Reordering).",
        "synchronized đảm bảo tính nguyên tử (Atomicity), volatile không đảm bảo.",
        "synchronized block luồng, volatile không gây block."
      ],
      sampleAnswer: "Từ khóa 'volatile' đảm bảo tính hiển thị giữa các luồng bằng cách ép việc đọc/ghi biến phải thực hiện trực tiếp trên bộ nhớ chính (RAM) thay vì cache của CPU. Nó cũng thiết lập ranh giới ngăn chặn Instruction Reordering. Khác với 'synchronized', volatile không cung cấp cơ chế khóa độc quyền và không đảm bảo tính nguyên tử cho các thao tác phức tạp như tăng giá trị."
    },
    {
      id: 302,
      text: "Garbage Collector (GC) trong Java hoạt động như thế nào? Hãy giải thích sự khác biệt giữa các giải thuật GC phổ biến như G1GC và ZGC?",
      keyPoints: [
        "GC dọn dẹp các đối tượng không còn tham chiếu trên bộ nhớ Heap.",
        "Heap chia thành Young Generation (Eden, Survivor) và Old Generation.",
        "G1GC: Chia nhỏ Heap thành các vùng kích thước bằng nhau, dọn dẹp vùng có nhiều rác trước.",
        "ZGC: Garbage Collector thế hệ mới (JDK 15+), thời gian dừng (Stop the World) dưới 10ms."
      ],
      sampleAnswer: "GC tự động giải phóng bộ nhớ Heap bằng cách quét và xóa các đối tượng mất liên kết gốc. Heap truyền thống được chia làm Young và Old Gen. G1GC chia bộ nhớ Heap thành hàng ngàn vùng nhỏ, dọn dẹp song song và đặt mục tiêu thời gian dừng định trước. ZGC là bộ dọn rác cực kỳ hiện đại, sử dụng kỹ thuật 'Colored Pointers' và 'Load Barriers' để dọn rác song song cùng luồng chạy ứng dụng, khống chế Stop-the-world tối đa dưới 10ms kể cả với Heap lớn hàng trăm GB."
    }
  ],
  "sql": [
    {
      id: 401,
      text: "Sự khác biệt giữa Clustered Index và Non-Clustered Index trong SQL Database là gì? Khi nào nên tạo Index?",
      keyPoints: [
        "Clustered Index: Sắp xếp vật lý các hàng dữ liệu trong bảng, chỉ có tối đa 1 clustered index.",
        "Non-Clustered Index: Tạo cấu trúc chỉ mục riêng biệt chỉ trỏ đến địa chỉ vật lý, có thể tạo nhiều.",
        "Tạo index khi cột thường xuyên xuất hiện ở mệnh đề WHERE, JOIN, ORDER BY.",
        "Hạn chế tạo quá nhiều index vì làm giảm hiệu năng của các câu lệnh ghi INSERT, UPDATE, DELETE."
      ],
      sampleAnswer: "Clustered Index xác định thứ tự sắp xếp vật lý của dữ liệu trong bảng, do đó mỗi bảng chỉ có duy nhất một chỉ mục này. Non-Clustered Index có cấu trúc riêng độc lập chứa khóa chỉ mục và con trỏ đến bản ghi vật lý. Nên tạo Index cho các cột thường xuyên tìm kiếm, nối bảng hoặc lọc dữ liệu. Tránh lạm dụng index trên các bảng có tần suất ghi cao vì thao tác INSERT/UPDATE sẽ phải cập nhật lại cấu trúc cây chỉ mục, làm chậm hiệu năng ghi."
    }
  ],
  "git": [
    {
      id: 501,
      text: "Sự khác biệt giữa `git merge` và `git rebase` là gì? Khi nào bạn nên sử dụng lệnh nào trong quy trình làm việc nhóm?",
      keyPoints: [
        "merge: Gộp các commit và tạo một merge commit mới, bảo toàn lịch sử nhánh gốc.",
        "rebase: Viết lại lịch sử bằng cách chuyển toàn bộ commit của nhánh hiện tại sang đầu nhánh mục tiêu, tạo lịch sử dạng tuyến tính.",
        "Sử dụng merge khi muốn bảo toàn lịch sử phát triển nhánh và khi nhánh đã được push public.",
        "Sử dụng rebase để dọn dẹp các commit rác cục bộ trước khi gộp vào nhánh chính."
      ],
      sampleAnswer: "Git merge kết hợp lịch sử hai nhánh bằng cách tạo ra một commit gộp mới, bảo tồn hoàn toàn lịch sử nhánh và các mốc thời gian. Git rebase di chuyển gốc của nhánh hiện tại lên đỉnh của nhánh mục tiêu, tạo ra một chuỗi commit phẳng và tuyến tính. Nên sử dụng merge cho các nhánh công cộng hoặc nhánh dùng chung để tránh xung đột lịch sử. Nên sử dụng rebase trên các nhánh tính năng cá hiện trước khi mở Pull Request để giữ lịch sử Git commit sạch sẽ."
    }
  ],
  "microservices": [
    {
      id: 601,
      text: "Trong kiến trúc Microservices, làm thế nào để giải quyết vấn đề phân tán dữ liệu và duy trì tính nhất quán giữa các dịch vụ (Distributed Transactions)? Hãy giải thích cơ chế của Saga Pattern?",
      keyPoints: [
        "Saga Pattern: Chuỗi các transaction cục bộ trong từng service.",
        "Choreography (Phối hợp dựa trên sự kiện): Mỗi service phát event sau transaction.",
        "Orchestration (Phối hợp tập trung): Có service điều phối trung tâm gửi lệnh.",
        "Compensating Transaction: Giao dịch bù trừ để rollback dữ liệu khi một bước thất bại."
      ],
      sampleAnswer: "Để duy trì tính nhất quán dữ liệu trong Microservices, giải pháp phổ biến nhất là sử dụng Saga Pattern thay vì dùng 2PC (Two-Phase Commit) vốn gây thắt nút cổ chai. Saga chia một giao dịch lớn thành một chuỗi các giao dịch cục bộ tại mỗi service. Nếu một bước thất bại, Saga sẽ kích hoạt các giao dịch bù trừ (Compensating Transactions) theo thứ tự ngược lại để khôi phục dữ liệu về trạng thái ban đầu. Có hai cách triển khai Saga là Choreography (dựa trên event) và Orchestration (dựa trên controller điều phối trung tâm)."
    }
  ]
};

export const categoryGroups: CategoryGroup[] = [
  {
    title: "NỀN TẢNG",
    topics: [
      { id: "java", name: "Java", icon: "java" },
      { id: "networking", name: "Networking", icon: "networking", hasInfo: true },
      { id: "git", name: "Git", icon: "git" },
      { id: "linux", name: "Linux", icon: "linux" }
    ]
  },
  {
    title: "BACKEND",
    topics: [
      { id: "spring-boot", name: "Spring Boot", icon: "spring-boot" },
      { id: "spring-security", name: "Spring Security", icon: "security" },
      { id: "spring-data-jpa", name: "Spring Data JPA", icon: "database" },
      { id: "testing", name: "Testing", icon: "testing" },
      { id: "api-design", name: "API Design", icon: "api-design", hasInfo: true }
    ]
  },
  {
    title: "KIẾN TRÚC",
    topics: [
      { id: "design-pattern", name: "Design Pattern", icon: "design-pattern", hasInfo: true },
      { id: "ddd", name: "DDD", icon: "ddd", hasInfo: true },
      { id: "microservices", name: "Microservices", icon: "microservices" },
      { id: "system-design", name: "System Design", icon: "system-design", hasInfo: true }
    ]
  },
  {
    title: "DỮ LIỆU",
    topics: [
      { id: "sql", name: "SQL", icon: "sql" },
      { id: "nosql", name: "NoSQL", icon: "nosql", hasInfo: true },
      { id: "redis", name: "Redis", icon: "redis", hasInfo: true },
      { id: "messaging", name: "Messaging", icon: "messaging" }
    ]
  },
  {
    title: "DEVOPS & CLOUD",
    topics: [
      { id: "docker", name: "Docker", icon: "docker" },
      { id: "kubernetes", name: "Kubernetes", icon: "kubernetes" },
      { id: "aws", name: "AWS", icon: "aws" },
      { id: "ci-cd", name: "CI/CD", icon: "ci-cd" },
      { id: "monitoring", name: "Monitoring", icon: "monitoring" },
      { id: "nginx", name: "Nginx", icon: "nginx", hasInfo: true }
    ]
  }
];
