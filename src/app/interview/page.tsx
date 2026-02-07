"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionWrapper from "@/components/MotionWrapper";
import {
  InterviewHero,
  InterviewCategoryCard,
  InterviewEmptyState,
} from "@/components/interview";

interface InterviewCategory {
  id: string;
  slug: string;
  name: string;
  iconPath: string;
  description: string;
  totalQuestions: number;
  levels: string[];
  color: string;
  bgGradient: string;
}

const INTERVIEW_CATEGORIES: InterviewCategory[] = [
  {
    id: "1",
    slug: "java-core",
    name: "Java Core",
    iconPath: "/logos/logo-java.png",
    description: "OOP, Collections, Exception, Multithreading, Stream API",
    totalQuestions: 150,
    levels: ["Junior", "Middle", "Senior"],
    color: "text-orange-600 dark:text-orange-400",
    bgGradient: "from-orange-500/10 to-red-500/10",
  },
  {
    id: "2",
    slug: "spring-boot",
    name: "Spring Boot",
    iconPath: "/logos/logo-springboot.png",
    description: "Spring Framework, Spring Data, Spring Security, Microservices",
    totalQuestions: 120,
    levels: ["Junior", "Middle", "Senior"],
    color: "text-green-600 dark:text-green-400",
    bgGradient: "from-green-500/10 to-emerald-500/10",
  },
  {
    id: "3",
    slug: "database",
    name: "Database",
    iconPath: "/logos/logo-posgtres.png",
    description: "SQL, MySQL, PostgreSQL, MongoDB, Redis, Query Optimization",
    totalQuestions: 100,
    levels: ["Junior", "Middle", "Senior"],
    color: "text-blue-600 dark:text-blue-400",
    bgGradient: "from-blue-500/10 to-cyan-500/10",
  },
  {
    id: "4",
    slug: "microservices",
    name: "Microservices",
    iconPath: "/logos/logo-microservices.png",
    description: "Architecture, Service Discovery, API Gateway, Message Queue",
    totalQuestions: 90,
    levels: ["Middle", "Senior"],
    color: "text-purple-600 dark:text-purple-400",
    bgGradient: "from-purple-500/10 to-pink-500/10",
  },
  {
    id: "5",
    slug: "aws",
    name: "AWS",
    iconPath: "/logos/aws-logo.png",
    description: "EC2, S3, Lambda, RDS, CloudFormation, DevOps",
    totalQuestions: 110,
    levels: ["Middle", "Senior"],
    color: "text-amber-600 dark:text-amber-400",
    bgGradient: "from-amber-500/10 to-orange-500/10",
  },
];

export default function InterviewPage() {
  const [searchText, setSearchText] = useState("");

  const filteredCategories = INTERVIEW_CATEGORIES.filter(
    (cat) =>
      cat.name.toLowerCase().includes(searchText.toLowerCase()) ||
      cat.description.toLowerCase().includes(searchText.toLowerCase())
  );

  const totalQuestions = INTERVIEW_CATEGORIES.reduce(
    (sum, cat) => sum + cat.totalQuestions,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <InterviewHero
        totalQuestions={totalQuestions}
        totalCategories={INTERVIEW_CATEGORIES.length}
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <MotionWrapper animation="fadeInUp" duration={0.6} mode="mount">
          {filteredCategories.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCategories.map((category) => (
                <InterviewCategoryCard key={category.id} {...category} />
              ))}
            </div>
          ) : (
            <InterviewEmptyState />
          )}
        </MotionWrapper>
      </div>

      <Footer />
    </div>
  );
}
