import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Play, Compass } from "lucide-react";

interface Stage {
  week: string;
  title: string;
  status: string;
  progress: number;
  outcome: string;
  topics: string[];
  exercises: string[];
}

interface LearningRoadmapProps {
  stages: Stage[];
  completedItems: string[];
  onToggleItem: (itemKey: string) => void;
  getStageProgress: (index: number) => number;
  getStageStatus: (index: number) => { label: string; colorClass: string };
}

export function LearningRoadmap({
  stages,
  completedItems,
  onToggleItem,
  getStageProgress,
  getStageStatus,
}: LearningRoadmapProps) {
  const [activeStageIndex, setActiveStageIndex] = useState<number | null>(0);

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <Compass className="w-5 h-5 text-accent" />
        <h3 className="text-lg font-bold text-gray-950 dark:text-white">
          Lộ trình học tập
        </h3>
      </div>

      <div className="space-y-3">
        {stages.map((stage, index) => {
          const isActive = activeStageIndex === index;
          const stageProg = getStageProgress(index);
          const stageStatus = getStageStatus(index);

          return (
            <div
              key={index}
              className="border border-gray-200 dark:border-slate-700 rounded-lg overflow-hidden bg-white dark:bg-slate-800"
            >
              {/* Stage Header */}
              <button
                onClick={() => setActiveStageIndex(isActive ? null : index)}
                className="w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-slate-900 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  {/* Left Side - Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-medium text-gray-500 dark:text-slate-400">
                        {stage.week}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${stageStatus.colorClass}`}>
                        {stageStatus.label}
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-1">
                      {stage.title}
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-slate-400 line-clamp-2">
                      {stage.outcome}
                    </p>
                  </div>

                  {/* Right Side - Progress */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className="text-2xl font-bold text-accent">{stageProg}%</div>
                      <div className="text-xs text-gray-500 dark:text-slate-400">
                        {stage.topics.filter((t) =>
                          completedItems.includes(`${index}-topic-${t}`)
                        ).length +
                          stage.exercises.filter((e) =>
                            completedItems.includes(`${index}-exercise-${e}`)
                          ).length}
                        /{stage.topics.length + stage.exercises.length}
                      </div>
                    </div>
                    {isActive ? (
                      <ArrowLeft className="w-5 h-5 text-accent rotate-[-90deg]" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>
              </button>

              {/* Stage Details - Expand when active */}
              {isActive && (
                <div className="px-4 pb-4 pt-0">
                  <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Topics */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                            📚 Chủ đề ({stage.topics.length})
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            {
                              stage.topics.filter((t) =>
                                completedItems.includes(`${index}-topic-${t}`)
                              ).length
                            }{" "}
                            hoàn thành
                          </span>
                        </div>
                        <div className="space-y-2">
                          {stage.topics.map((topic) => {
                            const itemKey = `${index}-topic-${topic}`;
                            const isDone = completedItems.includes(itemKey);
                            return (
                              <button
                                key={topic}
                                onClick={() => onToggleItem(itemKey)}
                                className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg border text-left text-sm transition-all ${
                                  isDone
                                    ? "bg-blue-50/50 border-blue-200/50 text-blue-700 dark:bg-blue-950/20 dark:border-blue-800/30 dark:text-blue-300 line-through opacity-60"
                                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-blue-400/50 hover:bg-blue-50/30"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                                    isDone
                                      ? "bg-blue-500 border-blue-500"
                                      : "border-gray-300 dark:border-slate-600"
                                  }`}
                                >
                                  {isDone && (
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className="flex-1">{topic}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Exercises */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                            ✍️ Bài tập ({stage.exercises.length})
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-slate-400">
                            {
                              stage.exercises.filter((e) =>
                                completedItems.includes(`${index}-exercise-${e}`)
                              ).length
                            }{" "}
                            hoàn thành
                          </span>
                        </div>
                        <div className="space-y-2">
                          {stage.exercises.map((exercise) => {
                            const itemKey = `${index}-exercise-${exercise}`;
                            const isDone = completedItems.includes(itemKey);
                            return (
                              <button
                                key={exercise}
                                onClick={() => onToggleItem(itemKey)}
                                className={`w-full flex items-start gap-2.5 p-2.5 rounded-lg border text-left text-sm transition-all ${
                                  isDone
                                    ? "bg-emerald-50/50 border-emerald-200/50 text-emerald-700 dark:bg-emerald-950/20 dark:border-emerald-800/30 dark:text-emerald-300 line-through opacity-60"
                                    : "bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 hover:border-emerald-400/50 hover:bg-emerald-50/30"
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded-full flex items-center justify-center border flex-shrink-0 mt-0.5 ${
                                    isDone
                                      ? "bg-emerald-500 border-emerald-500"
                                      : "border-gray-300 dark:border-slate-600"
                                  }`}
                                >
                                  {isDone && (
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                  )}
                                </div>
                                <span className="flex-1">{exercise}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-slate-700">
                      <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-600 text-white rounded-lg text-sm font-semibold transition-colors">
                        <Play className="w-4 h-4" />
                        {stageProg > 0 ? "Tiếp tục học" : "Bắt đầu giai đoạn này"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
