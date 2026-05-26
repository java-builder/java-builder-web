"use client";

import { useState } from "react";
import MotionWrapper from "@/components/MotionWrapper";
import { FaCheckCircle, FaClock, FaChevronDown, FaChevronRight } from "react-icons/fa";
import { getLocalizedRoadmapData, RoadmapLevel } from "@/data/roadmapData";
import { useI18n } from "@/contexts/I18nContext";

interface RoadmapSectionProps {
  activeTab: string;
}

export default function RoadmapSection({ activeTab }: RoadmapSectionProps) {
  const [expandedStep, setExpandedStep] = useState<string | null>(null);
  const { locale, t } = useI18n();
  
  const localizedData = getLocalizedRoadmapData(locale);
  const roadmapInfo = localizedData[activeTab as keyof typeof localizedData] as RoadmapLevel;

  // Fallback nếu không tìm thấy roadmap cho tab
  if (!roadmapInfo || !roadmapInfo.steps) {
    return (
      <section className="py-8 bg-white dark:bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-gray-600 dark:text-gray-400">{t("roadmapPage.updating")}</p>
        </div>
      </section>
    );
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300";
      case "intermediate": return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300";
      case "advanced": return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300";
      default: return "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300";
    }
  };

  const getLevelLabel = (level: string) => {
    switch (level) {
      case "beginner": return t("courseDetail.beginner");
      case "intermediate": return t("courseDetail.intermediate");
      case "advanced": return t("courseDetail.advanced");
      default: return "";
    }
  };

  return (
    <section className="py-8 bg-white dark:bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <MotionWrapper animation="fadeInUp" duration={0.6} key={activeTab}>
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {t("roadmapPage.roadmapOfLevel").replace("{level}", activeTab.charAt(0).toUpperCase() + activeTab.slice(1))}
            </h2>
            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 mb-4 max-w-3xl mx-auto">
              {roadmapInfo.description}
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 dark:bg-accent/20 rounded-lg">
              <span className="text-2xl">💪</span>
              <p className="text-sm md:text-base font-medium text-accent-700 dark:text-accent-300">
                {roadmapInfo.motivation}
              </p>
            </div>
          </div>
        </MotionWrapper>

        <div className="space-y-3">
          {roadmapInfo.steps.map((step, index) => (
            <MotionWrapper key={step.id} animation="fadeInUp" delay={index * 0.03} duration={0.3}>
              <div 
                className={`bg-white dark:bg-slate-800 rounded-lg border transition-all duration-200 ${
                  expandedStep === step.id 
                    ? 'border-gray-200 dark:border-slate-700 shadow-sm' 
                    : 'border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600'
                }`}
              >
                <button
                  onClick={() => setExpandedStep(expandedStep === step.id ? null : step.id)}
                  className="w-full p-3 sm:p-4 text-left"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 rounded-md bg-accent/10 dark:bg-accent/20 flex items-center justify-center">
                        <span className="text-lg font-bold text-accent">{index + 1}</span>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {step.title}
                        </h3>
                        {expandedStep === step.id ? (
                          <FaChevronDown className="text-gray-400 flex-shrink-0 mt-1" />
                        ) : (
                          <FaChevronRight className="text-gray-400 flex-shrink-0 mt-1" />
                        )}
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {step.description}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${getLevelColor(step.level)}`}>
                          {getLevelLabel(step.level)}
                        </span>
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300">
                          <FaClock className="w-3 h-3" />
                          {step.duration}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>

                {expandedStep === step.id && (
                  <div className="px-4 sm:px-5 pb-4 sm:pb-5 border-t border-gray-100 dark:border-slate-700 pt-4">
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                      {t("roadmapPage.detailedContent")}
                    </h4>
                    <ul className="space-y-2">
                      {step.topics.map((topic, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                          <FaCheckCircle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
