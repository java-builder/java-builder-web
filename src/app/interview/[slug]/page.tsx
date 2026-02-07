"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionWrapper from "@/components/MotionWrapper";
import Link from "next/link";

interface QuestionSet {
  id: string;
  title: string;
  level: "Junior" | "Middle" | "Senior";
  totalQuestions: number;
  duration: number; // minutes
  description: string;
  topics: string[];
  difficulty: "easy" | "medium" | "hard";
  attempts: number;
  bestScore?: number;
}

const CATEGORY_DATA: Record<string, { name: string; icon: string; color: string; questionSets: QuestionSet[] }> = {
  "java-core": {
    name: "Java Core",
    icon: "☕",
    color: "from-orange-500 to-red-500",
    questionSets: [
      {
        id: "1",
        title: "Java Basics & OOP",
        level: "Junior",
        totalQuestions: 20,
        duration: 30,
        description: "Kiến thức cơ bản về Java, OOP principles, Class, Object, Inheritance",
        topics: ["Syntax", "Data Types", "OOP", "Inheritance", "Polymorphism"],
        difficulty: "easy",
        attempts: 0,
      },
      {
        id: "2",
        title: "Collections Framework",
        level: "Junior",
        totalQuestions: 25,
        duration: 40,
        description: "List, Set, Map, Queue và các implementation phổ biến",
        topics: ["ArrayList", "HashMap", "HashSet", "LinkedList", "TreeMap"],
        difficulty: "medium",
        attempts: 0,
      },
      {
        id: "3",
        title: "Exception Handling & I/O",
        level: "Middle",
        totalQuestions: 20,
        duration: 35,
        description: "Try-catch, Custom exceptions, File I/O, Streams",
        topics: ["Exception", "Try-Catch", "File I/O", "Streams", "Serialization"],
        difficulty: "medium",
        attempts: 0,
      },
      {
        id: "4",
        title: "Multithreading & Concurrency",
        level: "Middle",
        totalQuestions: 30,
        duration: 50,
        description: "Thread, Runnable, Synchronization, Executor Framework",
        topics: ["Thread", "Synchronization", "Locks", "Executor", "Concurrent Collections"],
        difficulty: "hard",
        attempts: 0,
      },
      {
        id: "5",
        title: "Advanced Java Concepts",
        level: "Senior",
        totalQuestions: 35,
        duration: 60,
        description: "Generics, Reflection, Annotations, Lambda, Stream API",
        topics: ["Generics", "Reflection", "Annotations", "Lambda", "Stream API"],
        difficulty: "hard",
        attempts: 0,
      },
    ],
  },
  "spring-boot": {
    name: "Spring Boot",
    icon: "🍃",
    color: "from-green-500 to-emerald-500",
    questionSets: [
      {
        id: "6",
        title: "Spring Core & DI",
        level: "Junior",
        totalQuestions: 20,
        duration: 30,
        description: "Dependency Injection, IoC Container, Bean Lifecycle",
        topics: ["DI", "IoC", "Bean", "Autowired", "Component"],
        difficulty: "easy",
        attempts: 0,
      },
      {
        id: "7",
        title: "Spring Boot Basics",
        level: "Junior",
        totalQuestions: 25,
        duration: 40,
        description: "Auto-configuration, Starters, Application Properties",
        topics: ["Auto-config", "Starters", "Properties", "Profiles", "Actuator"],
        difficulty: "medium",
        attempts: 0,
      },
      {
        id: "8",
        title: "Spring Data JPA",
        level: "Middle",
        totalQuestions: 30,
        duration: 45,
        description: "JPA, Hibernate, Repository, Query Methods, Transactions",
        topics: ["JPA", "Hibernate", "Repository", "Query", "Transaction"],
        difficulty: "medium",
        attempts: 0,
      },
      {
        id: "9",
        title: "Spring Security",
        level: "Senior",
        totalQuestions: 35,
        duration: 55,
        description: "Authentication, Authorization, JWT, OAuth2, Security Config",
        topics: ["Authentication", "Authorization", "JWT", "OAuth2", "Security"],
        difficulty: "hard",
        attempts: 0,
      },
    ],
  },
  "database": {
    name: "Database",
    icon: "🗄️",
    color: "from-blue-500 to-cyan-500",
    questionSets: [
      {
        id: "10",
        title: "SQL Fundamentals",
        level: "Junior",
        totalQuestions: 25,
        duration: 35,
        description: "SELECT, JOIN, WHERE, GROUP BY, Aggregate Functions",
        topics: ["SELECT", "JOIN", "WHERE", "GROUP BY", "Aggregate"],
        difficulty: "easy",
        attempts: 0,
      },
      {
        id: "11",
        title: "Database Design & Normalization",
        level: "Middle",
        totalQuestions: 20,
        duration: 40,
        description: "ER Diagram, Normalization, Indexes, Constraints",
        topics: ["ER Diagram", "Normalization", "Indexes", "Constraints", "Keys"],
        difficulty: "medium",
        attempts: 0,
      },
      {
        id: "12",
        title: "Query Optimization",
        level: "Senior",
        totalQuestions: 30,
        duration: 50,
        description: "Execution Plans, Indexes, Query Tuning, Performance",
        topics: ["Execution Plan", "Index Optimization", "Query Tuning", "Performance"],
        difficulty: "hard",
        attempts: 0,
      },
    ],
  },
  "system-design": {
    name: "System Design",
    icon: "🏗️",
    color: "from-purple-500 to-pink-500",
    questionSets: [
      {
        id: "13",
        title: "System Design Basics",
        level: "Middle",
        totalQuestions: 15,
        duration: 45,
        description: "Scalability, Load Balancing, Caching, CDN",
        topics: ["Scalability", "Load Balancer", "Caching", "CDN", "Database"],
        difficulty: "medium",
        attempts: 0,
      },
      {
        id: "14",
        title: "Microservices Architecture",
        level: "Senior",
        totalQuestions: 20,
        duration: 60,
        description: "Service Discovery, API Gateway, Message Queue, Event-Driven",
        topics: ["Microservices", "API Gateway", "Message Queue", "Event-Driven", "CQRS"],
        difficulty: "hard",
        attempts: 0,
      },
    ],
  },
  "algorithm": {
    name: "Algorithm",
    icon: "🧮",
    color: "from-yellow-500 to-orange-500",
    questionSets: [
      {
        id: "15",
        title: "Array & String",
        level: "Junior",
        totalQuestions: 30,
        duration: 45,
        description: "Array manipulation, String operations, Two Pointers",
        topics: ["Array", "String", "Two Pointers", "Sliding Window"],
        difficulty: "easy",
        attempts: 0,
      },
      {
        id: "16",
        title: "Linked List & Stack & Queue",
        level: "Junior",
        totalQuestions: 25,
        duration: 40,
        description: "Linked List operations, Stack, Queue implementations",
        topics: ["Linked List", "Stack", "Queue", "Deque"],
        difficulty: "medium",
        attempts: 0,
      },
      {
        id: "17",
        title: "Tree & Graph",
        level: "Middle",
        totalQuestions: 35,
        duration: 60,
        description: "Binary Tree, BST, Graph Traversal, DFS, BFS",
        topics: ["Binary Tree", "BST", "Graph", "DFS", "BFS"],
        difficulty: "hard",
        attempts: 0,
      },
      {
        id: "18",
        title: "Dynamic Programming",
        level: "Senior",
        totalQuestions: 30,
        duration: 70,
        description: "DP patterns, Memoization, Tabulation, Optimization",
        topics: ["DP", "Memoization", "Tabulation", "Optimization"],
        difficulty: "hard",
        attempts: 0,
      },
    ],
  },
};

export default function InterviewCategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [selectedLevel, setSelectedLevel] = useState<string>("all");

  const categoryData = CATEGORY_DATA[slug];

  if (!categoryData) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-900">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Không tìm thấy chủ đề
          </h1>
          <Link href="/interview" className="text-accent hover:underline">
            Quay lại trang chủ
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const filteredSets = selectedLevel === "all" 
    ? categoryData.questionSets 
    : categoryData.questionSets.filter(set => set.level === selectedLevel);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy": return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20";
      case "medium": return "text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20";
      case "hard": return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Junior": return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20";
      case "Middle": return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20";
      case "Senior": return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20";
      default: return "text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />

      {/* Hero Section */}
      <section className={`relative bg-gradient-to-r ${categoryData.color} py-12 md:py-16`}>
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <MotionWrapper animation="fadeInUp" duration={0.8} mode="mount">
            <Link
              href="/interview"
              className="inline-flex items-center text-white/90 hover:text-white mb-4 text-sm"
            >
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Quay lại
            </Link>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center text-4xl">
                {categoryData.icon}
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                  {categoryData.name}
                </h1>
                <p className="text-white/90 mt-2">
                  {categoryData.questionSets.length} bộ câu hỏi • {categoryData.questionSets.reduce((sum, set) => sum + set.totalQuestions, 0)} câu hỏi
                </p>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Filter Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setSelectedLevel("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLevel === "all"
                ? "bg-accent text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            Tất cả
          </button>
          <button
            onClick={() => setSelectedLevel("Junior")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLevel === "Junior"
                ? "bg-accent text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            Junior
          </button>
          <button
            onClick={() => setSelectedLevel("Middle")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLevel === "Middle"
                ? "bg-accent text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            Middle
          </button>
          <button
            onClick={() => setSelectedLevel("Senior")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedLevel === "Senior"
                ? "bg-accent text-white shadow-md"
                : "bg-white dark:bg-slate-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700"
            }`}
          >
            Senior
          </button>
        </div>

        {/* Question Sets Grid */}
        <div className="space-y-4">
          {filteredSets.map((set) => (
            <Link
              key={set.id}
              href={`/interview/${slug}/${set.id}`}
              className="block group"
            >
              <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-5 hover:shadow-lg hover:border-accent/50 dark:hover:border-accent/50 transition-all duration-300">
                <div className="flex items-start justify-between gap-4">
                  {/* Left Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-accent transition-colors">
                        {set.title}
                      </h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getLevelColor(set.level)}`}>
                        {set.level}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(set.difficulty)}`}>
                        {set.difficulty === "easy" ? "Dễ" : set.difficulty === "medium" ? "Trung bình" : "Khó"}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {set.description}
                    </p>

                    {/* Topics */}
                    <div className="flex flex-wrap gap-2">
                      {set.topics.slice(0, 5).map((topic) => (
                        <span
                          key={topic}
                          className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded"
                        >
                          {topic}
                        </span>
                      ))}
                      {set.topics.length > 5 && (
                        <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-400">
                          +{set.topics.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Right Stats */}
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">
                        {set.totalQuestions}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        câu hỏi
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>~{set.duration} phút</span>
                    </div>
                  </div>
                </div>

                {/* Progress (if attempted) */}
                {set.attempts > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">
                        Đã ôn tập {set.attempts} lần
                      </span>
                      {set.bestScore && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          ✓ Hoàn thành
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredSets.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-700 dark:text-gray-300 font-medium mb-1">
              Không có bộ câu hỏi nào cho cấp độ này
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Thử chọn cấp độ khác
            </p>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
