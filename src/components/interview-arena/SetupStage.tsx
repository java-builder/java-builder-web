import React from "react";
import {
  Code2,
  Cpu,
  GitBranch,
  Terminal as TerminalIcon,
  Layers,
  Shield,
  Activity,
  ExternalLink,
  Sparkles,
  Box,
  Laptop,
  Database,
  Server,
  Zap,
  MessageSquare,
  Globe,
  Cloud,
  RefreshCw,
  HelpCircle,
  Video,
  ArrowRight,
  Award,
  BookOpen,
  Briefcase,
  Trophy
} from "lucide-react";
import { Interviewer, categoryGroups } from "./types";

interface SetupStageProps {
  selectedTopics: string[];
  selectedLevel: "fresher" | "junior" | "middle" | "senior";
  currentInterviewer: Interviewer;
  onToggleTopic: (id: string) => void;
  onSetLevel: (level: "fresher" | "junior" | "middle" | "senior") => void;
  onStartInterview: () => void;
}

export const SetupStage: React.FC<SetupStageProps> = ({
  selectedTopics,
  selectedLevel,
  currentInterviewer,
  onToggleTopic,
  onSetLevel,
  onStartInterview
}) => {
  const renderTopicIcon = (id: string) => {
    const sizeClass = "w-4 h-4 text-indigo-600 dark:text-indigo-400";
    switch (id) {
      case "java": return <Code2 className={sizeClass} />;
      case "networking": return <Cpu className={sizeClass} />;
      case "git": return <GitBranch className={sizeClass} />;
      case "linux": return <TerminalIcon className={sizeClass} />;
      case "spring-boot": return <Layers className={sizeClass} />;
      case "security": return <Shield className={sizeClass} />;
      case "testing": return <Activity className={sizeClass} />;
      case "api-design": return <ExternalLink className={sizeClass} />;
      case "design-pattern": return <Sparkles className={sizeClass} />;
      case "ddd": return <Layers className={sizeClass} />;
      case "microservices": return <Box className={sizeClass} />;
      case "system-design": return <Laptop className={sizeClass} />;
      case "sql": return <Database className={sizeClass} />;
      case "nosql": return <Server className={sizeClass} />;
      case "redis": return <Zap className={sizeClass} />;
      case "messaging": return <MessageSquare className={sizeClass} />;
      case "docker": return <Box className={sizeClass} />;
      case "kubernetes": return <Globe className={sizeClass} />;
      case "aws": return <Cloud className={sizeClass} />;
      case "ci-cd": return <RefreshCw className={sizeClass} />;
      case "monitoring": return <Activity className={sizeClass} />;
      case "nginx": return <Cpu className={sizeClass} />;
      default: return <Code2 className={sizeClass} />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">

      {/* Step 1: Chọn Cấp độ Phỏng vấn Card */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl p-6 sm:p-8 shadow-sm space-y-5">
        <h3 className="text-sm font-black uppercase tracking-wider text-gray-900 dark:text-white pb-1.5 border-b border-gray-100 dark:border-slate-750/70 flex items-center gap-2">
          <span className="text-indigo-600 dark:text-indigo-400 font-mono">01</span>
          Chọn Cấp độ Phỏng vấn
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {([
            { id: "fresher", title: "Fresher", desc: "Mới tốt nghiệp / Dưới 1 năm", icon: <Award className="w-4 h-4 text-indigo-500" /> },
            { id: "junior", title: "Junior", desc: "Từ 1 - 2 năm kinh nghiệm", icon: <BookOpen className="w-4 h-4 text-indigo-500" /> },
            { id: "middle", title: "Middle", desc: "Từ 2 - 4 năm kinh nghiệm", icon: <Briefcase className="w-4 h-4 text-indigo-500" /> },
            { id: "senior", title: "Senior", desc: "Trên 4 năm kinh nghiệm", icon: <Trophy className="w-4 h-4 text-indigo-500" /> }
          ] as const).map((lvl) => {
            const isSelected = selectedLevel === lvl.id;
            return (
              <div
                key={lvl.id}
                onClick={() => onSetLevel(lvl.id)}
                className={`p-2.5 rounded-xl border transition-all duration-200 flex items-center gap-3 cursor-pointer select-none relative group ${isSelected
                    ? "bg-indigo-50/20 dark:bg-indigo-950/20 border-indigo-500 shadow-sm ring-1 ring-indigo-500/20"
                    : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700/60"
                  }`}
              >
                {/* Icon circle bg */}
                <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-850 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                  {lvl.icon}
                </div>

                {/* Labels */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs font-black text-slate-850 dark:text-slate-100 uppercase tracking-wide truncate">
                    {lvl.title}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-450 truncate mt-0.5">
                    {lvl.desc}
                  </p>
                </div>

                {/* Small indicator dot overlay */}
                {isSelected && (
                  <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 2: Topic Selector Card */}
      <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-850 rounded-2xl shadow-sm p-6 sm:p-8 space-y-6">

        {/* Header block matching the screenshot */}
        <div className="flex items-start gap-4 border-b border-gray-100 dark:border-slate-750 pb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 shadow-inner">
            <Layers className="w-5 h-5" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base sm:text-lg font-black text-gray-900 dark:text-white leading-tight flex items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-mono">02</span>
              Theo kiến thức
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Chọn tối đa 3 chủ đề để đảm bảo câu hỏi không bị pha loãng
            </p>
          </div>
        </div>

        {/* Categorized Lists */}
        <div className="space-y-6">
          {categoryGroups.map((group, gIdx) => (
            <div key={gIdx} className="space-y-3">
              <h4 className="text-[11px] font-black uppercase tracking-wider text-slate-450 dark:text-slate-500">
                {group.title}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {group.topics.map((t) => {
                  const isSelected = selectedTopics.includes(t.id);
                  return (
                    <div
                      key={t.id}
                      onClick={() => onToggleTopic(t.id)}
                      className={`p-2 px-3 rounded-xl border transition-all duration-200 flex items-center gap-2.5 cursor-pointer select-none relative group ${isSelected
                          ? "bg-indigo-50/20 dark:bg-indigo-950/20 border-indigo-500 dark:border-indigo-500 shadow-sm ring-1 ring-indigo-500/20"
                          : "bg-white dark:bg-slate-900 border-gray-200 dark:border-slate-800 hover:border-gray-300 dark:hover:border-slate-700/60"
                        }`}
                    >
                      {/* Icon Container */}
                      <div className="w-7 h-7 rounded-md bg-slate-50 dark:bg-slate-850 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                        {renderTopicIcon(t.id)}
                      </div>

                      {/* Labels */}
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-black text-slate-850 dark:text-slate-100 truncate leading-snug">
                          {t.name}
                        </p>
                      </div>

                      {/* Optional Info Icon */}
                      {t.hasInfo && (
                        <HelpCircle className="w-3.5 h-3.5 text-slate-400 dark:text-slate-650 flex-shrink-0 ml-auto" />
                      )}

                      {/* Small Check indicator overlay */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] animate-pulse" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Config Panel & Start Call CTA Card */}
      <div className="bg-slate-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-800 rounded-2xl p-4.5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Selection Summary */}
        <div className="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left">
          <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">Cấu hình:</span>
          <div className="flex flex-wrap justify-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100/50 dark:border-indigo-900/30">
              Level: {selectedLevel}
            </span>
            <span className="px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-lg border border-indigo-100/50 dark:border-indigo-900/30 flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full bg-gradient-to-tr ${currentInterviewer.avatarGradient}`} />
              AI: {currentInterviewer.name}
            </span>
            {selectedTopics.map(topicId => {
              const topic = categoryGroups.flatMap(g => g.topics).find(t => t.id === topicId);
              return (
                <span key={topicId} className="px-2.5 py-1 text-[10px] font-bold bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg border border-gray-250/10 shadow-sm">
                  {topic ? topic.name : topicId}
                </span>
              );
            })}
          </div>
        </div>

        {/* Start Button */}
        <button
          onClick={onStartInterview}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-xs rounded-xl shadow-md hover:shadow-indigo-500/15 transition cursor-pointer select-none group uppercase tracking-wider"
        >
          <Video className="w-4 h-4 text-white" />
          Bắt đầu phỏng vấn
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

    </div>
  );
};
