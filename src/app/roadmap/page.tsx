"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import RoadmapTabs from "@/components/roadmap/RoadmapTabs";

export default function RoadmapPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      <Header />
      <RoadmapTabs />
      <Footer />
    </div>
  );
}
