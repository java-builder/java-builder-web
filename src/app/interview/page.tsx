"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MotionWrapper from "@/components/MotionWrapper";
import { InterviewHero, InterviewTopicsList } from "@/components/interview";
import { useInterviewTopics } from "@/hooks/useInterviewTopics";

export default function InterviewPage() {
  const [searchText, setSearchText] = useState("");
  const { topics, isLoading, totalQuestions } = useInterviewTopics();

  const filteredTopics = topics.filter(
    (topic) =>
      topic.name.toLowerCase().includes(searchText.toLowerCase()) ||
      (topic.description?.toLowerCase() || "").includes(searchText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-slate-900 dark:to-slate-800">
      <Header />

      <InterviewHero
        totalQuestions={totalQuestions}
        totalCategories={topics.length}
        searchText={searchText}
        onSearchChange={setSearchText}
      />

      {/* Categories Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <MotionWrapper animation="fadeInUp" duration={0.6} mode="mount">
          <InterviewTopicsList topics={filteredTopics} isLoading={isLoading} />
        </MotionWrapper>
      </div>

      <Footer />
    </div>
  );
}
