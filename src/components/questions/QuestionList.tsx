"use client";

import Link from "next/link";
import { Question } from "@/types/qna";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

// Mock data for questions
const MOCK_QUESTIONS: Question[] = [
  {
    id: "1",
    title: "Lỗi NullPointer khi khởi tạo Bean trong Spring Boot",
    content: "Chi tiết: khi khởi tạo bean X, gặp NullPointer. Các bước tái tạo...",
    author: "UserA",
    authorId: "user1",
    tags: ["spring-boot", "java", "dependency-injection"],
    createdAt: "2024-01-20T10:00:00Z",
    updatedAt: "2024-01-20T10:00:00Z",
    answersCount: 2,
    views: 45,
    isResolved: true,
    votes: 5,
  },
  {
    id: "2",
    title: "Cách cấu hình CORS cho Spring Security 6",
    content: "Chi tiết cấu hình CORS với Spring Security 6...",
    author: "UserB",
    authorId: "user2",
    tags: ["spring-security", "cors", "java"],
    createdAt: "2024-01-19T15:30:00Z",
    updatedAt: "2024-01-19T15:30:00Z",
    answersCount: 0,
    views: 23,
    isResolved: false,
    votes: 2,
  },
  {
    id: "3",
    title: "Lỗi kết nối database PostgreSQL trong Docker",
    content: "Container PostgreSQL không kết nối được từ Spring Boot app...",
    author: "DevC",
    authorId: "user3",
    tags: ["docker", "postgresql", "spring-boot"],
    createdAt: "2024-01-18T09:15:00Z",
    updatedAt: "2024-01-18T09:15:00Z",
    answersCount: 1,
    views: 67,
    isResolved: false,
    votes: 3,
  },
  {
    id: "4",
    title: "Cách tối ưu hóa query JPA với N+1 problem",
    content: "Query JPA gặp vấn đề N+1, làm chậm performance...",
    author: "CoderX",
    authorId: "user4",
    tags: ["jpa", "hibernate", "performance"],
    createdAt: "2024-01-17T14:20:00Z",
    updatedAt: "2024-01-17T14:20:00Z",
    answersCount: 3,
    views: 89,
    isResolved: true,
    votes: 8,
  },
  {
    id: "5",
    title: "Lỗi 404 khi deploy React app lên Nginx",
    content: "Deploy React app với React Router lên Nginx gặp lỗi 404...",
    author: "FrontendDev",
    authorId: "user5",
    tags: ["react", "nginx", "deployment"],
    createdAt: "2024-01-16T11:45:00Z",
    updatedAt: "2024-01-16T11:45:00Z",
    answersCount: 2,
    views: 34,
    isResolved: false,
    votes: 1,
  },
];

interface QuestionListProps {
  questions?: Question[];
  searchQuery?: string;
  sortBy?: string;
  filterTag?: string;
}

export default function QuestionList({
  questions = MOCK_QUESTIONS,
  searchQuery = "",
  sortBy = "newest",
  filterTag = "all"
}: QuestionListProps) {
  // Filter questions based on search query and tag
  let filteredQuestions = questions.filter(question => {
    const matchesSearch = searchQuery === "" ||
      question.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      question.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTag = filterTag === "all" || question.tags.includes(filterTag);

    return matchesSearch && matchesTag;
  });

  // Sort questions based on sortBy parameter
  filteredQuestions = [...filteredQuestions].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.votes - a.votes;
      case "unanswered":
        return a.answersCount - b.answersCount;
      case "resolved":
        return b.isResolved ? 1 : -1;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });
  return (
    <div className="space-y-4">
      {filteredQuestions.map((question) => (
        <div
          key={question.id}
          className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Link
                href={`/qna/${question.id}`}
                className="text-lg font-semibold text-gray-900 dark:text-white hover:text-accent transition-colors"
              >
                {question.title}
              </Link>

              <div className="mt-2 flex flex-wrap gap-2">
                {question.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-md"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                <span>{formatDistanceToNow(new Date(question.createdAt), { addSuffix: true, locale: vi })}</span>
              </div>
            </div>

            <div className="ml-4 flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">{question.answersCount}</div>
                <div>câu trả lời</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">{question.views}</div>
                <div>lượt xem</div>
              </div>
              <div className="text-center">
                <div className="font-semibold text-gray-900 dark:text-white">{question.votes}</div>
                <div>bình chọn</div>
              </div>
            </div>
          </div>

          {question.isResolved && (
            <div className="mt-3 inline-flex items-center px-2 py-1 text-xs font-medium text-green-800 bg-green-100 dark:bg-green-900 dark:text-green-200 rounded-full">
              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Đã giải quyết
            </div>
          )}
        </div>
      ))}

      {filteredQuestions.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 dark:text-gray-400">
            Chưa có câu hỏi nào. Hãy là người đầu tiên đặt câu hỏi!
          </div>
        </div>
      )}
    </div>
  );
}
