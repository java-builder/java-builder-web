"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionWrapper from "@/components/MotionWrapper";

interface InterviewQuestion {
  id: string;
  question: string;
  answer: string;
  tips?: string[];
  relatedTopics?: string[];
  difficulty: "easy" | "medium" | "hard";
}

interface QuestionCategory {
  id: string;
  title: string;
  questions: InterviewQuestion[];
}

// Mock data - in real app, this would come from API
const MOCK_DATA: Record<string, { title: string; categories: QuestionCategory[] }> = {
  "1": {
    title: "Java Basics & OOP",
    categories: [
      {
        id: "cat1",
        title: "Java Fundamentals",
        questions: [
          {
            id: "q1",
            question: "Java là gì? Giải thích về JVM, JRE, JDK?",
            answer: "Java là ngôn ngữ lập trình hướng đối tượng, độc lập nền tảng.\n\n• JVM (Java Virtual Machine): Máy ảo Java, thực thi bytecode Java\n• JRE (Java Runtime Environment): Môi trường runtime, bao gồm JVM + thư viện chuẩn\n• JDK (Java Development Kit): Bộ công cụ phát triển, bao gồm JRE + compiler + tools\n\nQuá trình: Source code (.java) → Compiler → Bytecode (.class) → JVM → Machine code",
            tips: [
              "Nhấn mạnh tính độc lập nền tảng (Write Once, Run Anywhere)",
              "Giải thích rõ sự khác biệt giữa JVM, JRE, JDK",
              "Có thể vẽ sơ đồ quá trình compile và execute"
            ],
            relatedTopics: ["Bytecode", "Platform Independence", "Compilation Process"],
            difficulty: "easy"
          },
          {
            id: "q2",
            question: "Sự khác biệt giữa == và equals() trong Java?",
            answer: "• == (toán tử so sánh):\n  - So sánh địa chỉ bộ nhớ (reference)\n  - Với primitive types: so sánh giá trị\n  - Với objects: so sánh reference (có cùng trỏ đến 1 object không)\n\n• equals() (method):\n  - So sánh nội dung (content)\n  - Có thể override để custom logic so sánh\n  - Default implementation trong Object class: giống ==\n\nVí dụ:\nString s1 = new String(\"hello\");\nString s2 = new String(\"hello\");\ns1 == s2        // false (khác reference)\ns1.equals(s2)   // true (cùng content)",
            tips: [
              "Đưa ví dụ cụ thể với String",
              "Giải thích về String pool nếu được hỏi sâu",
              "Nhắc đến việc override equals() và hashCode() cùng nhau"
            ],
            relatedTopics: ["String Pool", "Object Comparison", "hashCode()"],
            difficulty: "easy"
          },
        ]
      },
      {
        id: "cat2",
        title: "OOP Principles",
        questions: [
          {
            id: "q3",
            question: "4 tính chất của OOP là gì? Giải thích từng tính chất.",
            answer: "1. Encapsulation (Đóng gói):\n   - Ẩn dữ liệu bên trong class\n   - Sử dụng access modifiers (private, protected, public)\n   - Truy cập qua getter/setter\n   - Lợi ích: Bảo vệ dữ liệu, dễ maintain\n\n2. Inheritance (Kế thừa):\n   - Class con kế thừa thuộc tính/method từ class cha\n   - Sử dụng từ khóa 'extends'\n   - Lợi ích: Tái sử dụng code, tạo hierarchy\n\n3. Polymorphism (Đa hình):\n   - Compile-time: Method overloading\n   - Runtime: Method overriding\n   - Lợi ích: Linh hoạt, mở rộng dễ dàng\n\n4. Abstraction (Trừu tượng):\n   - Ẩn implementation details\n   - Sử dụng abstract class hoặc interface\n   - Lợi ích: Giảm complexity, tập trung vào behavior",
            tips: [
              "Đưa ví dụ thực tế cho mỗi tính chất",
              "Giải thích lợi ích của từng tính chất",
              "Có thể vẽ class diagram để minh họa"
            ],
            relatedTopics: ["Access Modifiers", "Abstract Class", "Interface", "Method Overriding"],
            difficulty: "medium"
          },
        ]
      },
    ]
  },
};

const SET_INFO: Record<string, { title: string; level: string; totalQuestions: number }> = {
  "1": { title: "Java Basics & OOP", level: "Junior", totalQuestions: 20 },
  "2": { title: "Collections Framework", level: "Junior", totalQuestions: 25 },
  "3": { title: "Exception Handling & I/O", level: "Middle", totalQuestions: 20 },
};

export default function InterviewSetPage() {
  const params = useParams();
  const router = useRouter();
  const setId = params.setId as string;

  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<InterviewQuestion | null>(null);

  const setInfo = SET_INFO[setId];
  const data = MOCK_DATA[setId];

  if (!setInfo || !data) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy bộ câu hỏi
          </h1>
          <button
            onClick={() => router.back()}
            className="text-accent hover:underline"
          >
            Quay lại
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleQuestionClick = (question: InterviewQuestion) => {
    setSelectedQuestion(question);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "medium": return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "hard": return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "Dễ";
      case "medium": return "Trung bình";
      case "hard": return "Khó";
      default: return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
          {/* Back Button */}
          <button
            onClick={() => router.back()}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-accent mb-6 text-sm"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Quay lại
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-accent to-accent-600 rounded-xl p-6 text-white mb-8">
            <div className="flex items-center justify-between">
              <div>
                <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-sm font-medium mb-2">
                  {setInfo.level}
                </span>
                <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
                <p className="text-white/90">
                  {data.categories.reduce((sum, cat) => sum + cat.questions.length, 0)} câu hỏi phỏng vấn
                </p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Left Sidebar - Tree Navigation */}
            <div className="lg:col-span-1">
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden sticky top-4">
                <div className="p-4 bg-gray-50 dark:bg-slate-700/50 border-b border-gray-200 dark:border-slate-700">
                  <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Danh sách
                  </h2>
                </div>

                <div className="p-3 max-h-[calc(100vh-200px)] overflow-y-auto">
                  <div className="space-y-1">
                    {data.categories.map((category) => {
                      const isExpanded = expandedCategories.includes(category.id);
                      
                      return (
                        <div key={category.id}>
                          {/* Category Header */}
                          <button
                            onClick={() => toggleCategory(category.id)}
                            className="w-full flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors text-left group"
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <svg
                                className={`w-3.5 h-3.5 text-gray-400 dark:text-gray-500 transition-transform flex-shrink-0 ${isExpanded ? "rotate-90" : ""}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                              <span className="font-medium text-gray-900 dark:text-white text-sm truncate">
                                {category.title}
                              </span>
                            </div>
                            <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-slate-700 px-1.5 py-0.5 rounded flex-shrink-0 ml-2">
                              {category.questions.length}
                            </span>
                          </button>

                          {/* Questions List */}
                          {isExpanded && (
                            <div className="ml-5 mt-1 space-y-0.5 border-l-2 border-gray-200 dark:border-slate-700 pl-2">
                              {category.questions.map((question) => (
                                <button
                                  key={question.id}
                                  onClick={() => handleQuestionClick(question)}
                                  className={`w-full text-left p-2 rounded-md text-xs transition-colors ${
                                    selectedQuestion?.id === question.id
                                      ? "bg-accent/10 text-accent font-medium border-l-2 border-accent -ml-[2px] pl-[6px]"
                                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700/50 hover:text-gray-900 dark:hover:text-gray-200"
                                  }`}
                                >
                                  <span className="line-clamp-2">{question.question}</span>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Content - Question Detail */}
            <div className="lg:col-span-3">
              {selectedQuestion ? (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
                  {/* Question Header */}
                  <div className="p-6 border-b border-gray-200 dark:border-slate-700">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <span className={`px-2.5 py-1 text-xs font-medium rounded-md ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                        {getDifficultyLabel(selectedQuestion.difficulty)}
                      </span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-relaxed">
                      {selectedQuestion.question}
                    </h2>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {/* Answer Content */}
                    <div className="space-y-4">
                      {/* Answer */}
                      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <h3 className="font-bold text-blue-900 dark:text-blue-100">
                            Câu trả lời mẫu
                          </h3>
                        </div>
                        <div className="text-[15px] text-blue-900 dark:text-blue-100 whitespace-pre-line leading-relaxed">
                          {selectedQuestion.answer}
                        </div>
                      </div>

                      {/* Tips */}
                      {selectedQuestion.tips && selectedQuestion.tips.length > 0 && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-5">
                          <div className="flex items-center gap-2 mb-3">
                            <svg className="w-5 h-5 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                            <h3 className="font-bold text-amber-900 dark:text-amber-100">
                              💡 Mẹo trả lời tốt
                            </h3>
                          </div>
                          <ul className="space-y-2">
                            {selectedQuestion.tips.map((tip, index) => (
                              <li key={index} className="flex items-start gap-2 text-[15px] text-amber-900 dark:text-amber-100">
                                <span className="text-amber-600 dark:text-amber-400 font-bold mt-0.5">•</span>
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-16 text-center">
                  <div className="max-w-sm mx-auto">
                    <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 dark:bg-slate-700 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Chọn câu hỏi để bắt đầu
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Chọn một câu hỏi từ danh sách bên trái để xem câu trả lời mẫu và mẹo trả lời
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </MotionWrapper>
      </div>

      <Footer />
    </div>
  );
}
