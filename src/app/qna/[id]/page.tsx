"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { QuestionDetail, Answer, AnswerFormData } from "@/types/qna";
import AnswerForm from "@/components/questions/AnswerForm";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Mock data for questions with answers
const MOCK_QUESTIONS: Record<string, QuestionDetail> = {
  "1": {
    id: "1",
    title: "Lỗi NullPointer khi khởi tạo Bean trong Spring Boot",
    content: "<p>Khi tôi khởi tạo bean X trong Spring Boot, gặp lỗi NullPointerException. Đây là code của tôi:</p><pre><code>@Service\npublic class MyService {\n    @Autowired\n    private SomeDependency dependency;\n\n    public void doSomething() {\n        dependency.someMethod(); // NullPointer here\n    }\n}</code></pre><p>Các bước tái tạo lỗi:</p><ol><li>Khởi động ứng dụng</li><li>Gọi API endpoint sử dụng MyService</li><li>Gặp NullPointerException</li></ol><p>Tôi đã kiểm tra cấu hình component scan và dependency injection. Bạn có thể giúp tôi không?</p>",
    author: "UserA",
    authorId: "user1",
    tags: ["spring-boot", "java", "dependency-injection"],
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    answersCount: 2,
    views: 45,
    isResolved: true,
    votes: 5,
    answers: [
      {
        id: "a1",
        questionId: "1",
        content: "<p>Bạn cần kiểm tra một số điểm sau:</p><ol><li><strong>@Autowired annotation:</strong> Đảm bảo rằng <code>SomeDependency</code> được Spring quản lý (có @Component, @Service, @Repository, etc.)</li><li><strong>Component scan:</strong> Kiểm tra xem package chứa <code>SomeDependency</code> có được scan bởi Spring không</li><li><strong>Constructor injection:</strong> Thử sử dụng constructor injection thay vì field injection</li></ol><p>Đây là cách sửa:</p><pre><code>@Service\npublic class MyService {\n    private final SomeDependency dependency;\n\n    @Autowired\n    public MyService(SomeDependency dependency) {\n        this.dependency = dependency;\n    }\n\n    public void doSomething() {\n        if (dependency != null) {\n            dependency.someMethod();\n        }\n    }\n}</code></pre>",
        author: "SpringExpert",
        authorId: "helper1",
        createdAt: "2024-01-20T11:30:00Z",
        updatedAt: "2024-01-20T11:30:00Z",
        votes: 8,
        isAccepted: true,
      },
      {
        id: "a2",
        questionId: "1",
        content: "<p>Thêm nữa, bạn cũng nên kiểm tra log của Spring Boot khi khởi động. Nếu bean không được tạo, bạn sẽ thấy warning trong log.</p><p>Sử dụng <code>@RequiredArgsConstructor</code> từ Lombok cũng là một lựa chọn tốt:</p><pre><code>@Service\n@RequiredArgsConstructor\npublic class MyService {\n    private final SomeDependency dependency;\n\n    public void doSomething() {\n        dependency.someMethod();\n    }\n}</code></pre>",
        author: "JavaDev",
        authorId: "helper2",
        createdAt: "2024-01-20T12:15:00Z",
        updatedAt: "2024-01-20T12:15:00Z",
        votes: 3,
        isAccepted: false,
      },
    ],
  },
  "2": {
    id: "2",
    title: "Cách cấu hình CORS cho Spring Security 6",
    content: "<p>Tôi đang sử dụng Spring Security 6 và cần cấu hình CORS để frontend React có thể gọi API. Đây là cấu hình hiện tại của tôi:</p><pre><code>@Configuration\n@EnableWebSecurity\npublic class SecurityConfig {\n    @Bean\n    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {\n        http\n            .csrf().disable()\n            .authorizeHttpRequests(auth -> auth\n                .requestMatchers(\"/api/public/**\").permitAll()\n                .anyRequest().authenticated()\n            )\n            .httpBasic();\n        return http.build();\n    }\n}</code></pre><p>Nhưng frontend vẫn gặp lỗi CORS. Làm thế nào để cấu hình CORS đúng cách?</p>",
    author: "UserB",
    authorId: "user2",
    tags: ["spring-security", "cors", "java"],
    createdAt: "2024-01-19T15:30:00Z",
    updatedAt: "2024-01-19T15:30:00Z",
    answersCount: 0,
    views: 23,
    isResolved: false,
    votes: 2,
    answers: [],
  },
  "3": {
    id: "3",
    title: "Lỗi kết nối database PostgreSQL trong Docker",
    content: "<p>Container PostgreSQL của tôi không kết nối được từ Spring Boot app. Đây là docker-compose.yml:</p><pre><code>version: '3.8'\nservices:\n  postgres:\n    image: postgres:13\n    environment:\n      POSTGRES_DB: mydb\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: password\n    ports:\n      - \"5432:5432\"\n\n  app:\n    build: .\n    depends_on:\n      - postgres\n    environment:\n      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mydb</code></pre><p>Lỗi: <code>Connection refused</code>. Tôi đã thử thêm healthcheck nhưng vẫn không được.</p>",
    author: "DevC",
    authorId: "user3",
    tags: ["docker", "postgresql", "spring-boot"],
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-18T09:15:00Z",
    answersCount: 1,
    views: 67,
    isResolved: false,
    votes: 3,
    answers: [
      {
        id: "a3",
        questionId: "3",
        content: "<p>Có vài vấn đề trong cấu hình của bạn:</p><ol><li><strong>depends_on không đảm bảo service sẵn sàng:</strong> <code>depends_on</code> chỉ đảm bảo container khởi động theo thứ tự, không phải là service sẵn sàng</li><li><strong>Thiếu healthcheck:</strong> Thêm healthcheck cho PostgreSQL</li><li><strong>Network timing:</strong> Spring Boot có thể khởi động trước khi PostgreSQL sẵn sàng</li></ol><p>Cấu hình đúng:</p><pre><code>version: '3.8'\nservices:\n  postgres:\n    image: postgres:13\n    environment:\n      POSTGRES_DB: mydb\n      POSTGRES_USER: user\n      POSTGRES_PASSWORD: password\n    ports:\n      - \"5432:5432\"\n    healthcheck:\n      test: [\"CMD-SHELL\", \"pg_isready -U user -d mydb\"]\n      interval: 30s\n      timeout: 10s\n      retries: 3\n\n  app:\n    build: .\n    depends_on:\n      postgres:\n        condition: service_healthy\n    environment:\n      SPRING_DATASOURCE_URL: jdbc:postgresql://postgres:5432/mydb</code></pre><p>Hoặc sử dụng <code>restart: on-failure</code> trong application.properties của Spring Boot.</p>",
        author: "DockerPro",
        authorId: "helper3",
        createdAt: "2024-01-18T10:45:00Z",
        updatedAt: "2024-01-18T10:45:00Z",
        votes: 5,
        isAccepted: false,
      },
    ],
  },
};

export default function QuestionDetailPage() {
  const params = useParams();
  const id = params?.id || "1";
  const [showAnswerForm, setShowAnswerForm] = useState(false);

  const normalizedId = Array.isArray(id) ? id[0] : id;
  const question = MOCK_QUESTIONS[normalizedId] || MOCK_QUESTIONS["1"];

  const handleAnswerSubmit = (data: AnswerFormData) => {
    // Mock submission - in real app this would call an API
    console.log("Answer submitted:", data);
    setShowAnswerForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <Header />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href="/"
                  className="inline-flex items-center text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-accent"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-3 h-3 text-gray-400 mx-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <Link
                    href="/qna"
                    className="text-sm font-medium text-gray-700 dark:text-gray-400 hover:text-accent"
                  >
                    Q&A
                  </Link>
                </div>
              </li>
            </ol>
          </nav>
        </div>

        {/* Question */}
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2 leading-snug">
                {question.title}
              </h1>

              <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
                <time className="whitespace-nowrap">
                  {formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: vi })}
                </time>
                <span className="text-gray-300">•</span>
                <span className="whitespace-nowrap">{question.views} lượt xem</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-0.5 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex-shrink-0 flex items-start gap-4">
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900 dark:text-white">{question.votes}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">bình chọn</div>
              </div>
            </div>
          </div>

          <div
            className="prose max-w-none dark:prose-invert break-words"
            dangerouslySetInnerHTML={{ __html: question.content }}
          />

          {question.isResolved && (
            <div className="mt-4 inline-flex items-center px-3 py-1 text-sm font-medium text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-full">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Đã giải quyết
            </div>
          )}
        </div>

        {/* Answers */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {question.answersCount} câu trả lời
            </h2>
            <button
              onClick={() => setShowAnswerForm(!showAnswerForm)}
              className="px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              {showAnswerForm ? "Hủy trả lời" : "Viết câu trả lời"}
            </button>
          </div>

          {/* Answer Form */}
          {showAnswerForm && (
            <div className="mb-6">
              <AnswerForm
                onSubmit={handleAnswerSubmit}
                onCancel={() => setShowAnswerForm(false)}
              />
            </div>
          )}

          {/* Answers List */}
          {question.answers.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 text-center">
              <div className="text-gray-500 dark:text-gray-400 mb-4">
                Chưa có câu trả lời nào.
              </div>
              <p className="text-sm text-gray-400 dark:text-gray-500">
                Hãy là người đầu tiên trả lời câu hỏi này!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {question.answers.map((answer) => (
                <AnswerItem key={answer.id} answer={answer} />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

function AnswerItem({ answer }: { answer: Answer }) {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-medium">
            {answer.author.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-medium text-gray-900 dark:text-white">{answer.author}</div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {formatDistanceToNow(new Date(answer.createdAt), { addSuffix: true, locale: vi })}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {answer.isAccepted && (
            <span className="inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-full">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Câu trả lời được chấp nhận
            </span>
          )}
          <div className="text-center">
            <div className="text-sm font-semibold text-gray-900 dark:text-white">{answer.votes}</div>
            <div className="text-xs text-gray-500 dark:text-gray-400">bình chọn</div>
          </div>
        </div>
      </div>

      <div
        className="prose max-w-none dark:prose-invert"
        dangerouslySetInnerHTML={{ __html: answer.content }}
      />
    </div>
  );
}


