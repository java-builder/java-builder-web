"use client";

import { useState } from "react";
import RoadmapSection from "./RoadmapSection";
import RoadmapHero from "./RoadmapHero";

const tabs = [
  { id: "intern", label: "Intern", icon: "🌱", desc: "Thực tập sinh" },
  { id: "fresher", label: "Fresher", icon: "🚀", desc: "Mới ra trường" },
  { id: "junior", label: "Junior", icon: "⭐", desc: "1-2 năm KN" },
  { id: "middle", label: "Middle", icon: "🔥", desc: "2-4 năm KN" },
  { id: "senior", label: "Senior", icon: "👑", desc: "4+ năm KN" }
];

export default function RoadmapTabs() {
  const [activeTab, setActiveTab] = useState("intern");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <RoadmapHero />

      {/* Tabs Navigation */}
      <div id="roadmap-content" className="bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-700 shadow-sm py-3">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="flex overflow-x-auto scrollbar-hide gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 min-w-[110px] flex flex-col items-center justify-center gap-1 px-3 py-2.5 rounded-xl transition-all duration-300 border-2 ${
                  activeTab === tab.id
                    ? 'border-accent bg-blue-50 dark:bg-accent/10 shadow-md'
                    : 'border-transparent bg-white dark:bg-slate-800 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-500 hover:text-gray-900 dark:hover:text-white shadow-sm hover:shadow-md'
                }`}
              >
                <span className="text-2xl">{tab.icon}</span>
                <span className={`font-bold text-xs ${activeTab === tab.id ? 'text-accent' : 'text-gray-700 dark:text-gray-200'}`}>
                  {tab.label}
                </span>
                <span className={`text-[10px] ${activeTab === tab.id ? 'text-accent-600 dark:text-accent-400 font-medium' : 'text-gray-400 dark:text-gray-500'}`}>
                  {tab.desc}
                </span>
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
