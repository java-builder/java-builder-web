"use client";

import { useState } from "react";
import MotionWrapper from "@/components/MotionWrapper";
import { FaRocket } from "react-icons/fa";
import RoadmapSection from "./RoadmapSection";

const tabs = [
  { id: "backend", label: "Backend Full", icon: "🎯" },
  { id: "javaCore", label: "Java Core", icon: "☕" },
  { id: "springBoot", label: "Spring Boot", icon: "🍃" },
  { id: "springSecurity", label: "Spring Security", icon: "🔒" },
  { id: "microservices", label: "Microservices", icon: "🔷" }
];

export default function RoadmapTabs() {
  const [activeTab, setActiveTab] = useState("backend");

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div className="text-center max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-full mb-6">
                <FaRocket className="text-accent" />
                <span className="text-sm font-medium text-accent">Lộ trình học Backend Java</span>
              </div>
              
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                Từ Zero đến Hero
                <span className="block text-accent mt-2">Backend Developer</span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                Lộ trình học tập toàn diện từ Java Core đến Microservices, 
                được thiết kế dành riêng cho người mới bắt đầu và những ai muốn nâng cao kỹ năng Backend
              </p>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* Tabs Navigation */}
      <div className="sticky top-0 z-40 bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-shrink-0 px-4 py-3 font-medium transition-all duration-300 border-b-2 whitespace-nowrap text-sm ${
                  activeTab === tab.id
                    ? 'text-accent border-accent bg-blue-50 dark:bg-accent/10'
                    : 'text-gray-600 dark:text-gray-400 border-transparent hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700/50'
                }`}
              >
                <span className="mr-1.5">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Roadmap Content */}
      <RoadmapSection activeTab={activeTab} />
    </div>
  );
}
