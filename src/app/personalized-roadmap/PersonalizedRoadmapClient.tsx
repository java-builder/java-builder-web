"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  BarChart3,
  Brain,
  CalendarDays,
  Compass,
  ListChecks,
  Sparkles,
  Target,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { Roadmap, WeakPoint, Task } from "./types";
import { mockRoadmapsInitial } from "./data/mockRoadmaps";
import { weakPoints as baseWeakPoints, todayTasks } from "./data/constants";
import {
  getStageProgress,
  getRoadmapProgress,
  getStageStatus,
  computeFocusAreas,
  computeTargetMonths as calculateTargetMonths,
  computeConfidence as calculateConfidence,
} from "./utils/roadmapHelpers";
import { generateStagesForGoal } from "./utils/stageGenerator";
import { CombinedHeader } from "./components/CombinedHeader";
import { TodayTasks } from "./components/TodayTasks";
import { WeaknessAreas } from "./components/WeaknessAreas";
import { AICoach } from "./components/AICoach";
import { LearningRoadmap } from "./components/LearningRoadmap";
import { AICoachModal } from "./components/AICoachModal";
import { ExerciseQuizModal } from "./components/ExerciseQuizModal";
import { TaskSuggestionModal } from "./components/TaskSuggestionModal";
import ConfirmModal from "@/components/ui/ConfirmModal";

export default function PersonalizedRoadmapClient() {
  const [roadmaps, setRoadmaps] = useState<Roadmap[]>(mockRoadmapsInitial);
  const [selectedRoadmapId, setSelectedRoadmapId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  
  // Quiz Modal state
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [selectedWeakPoint, setSelectedWeakPoint] = useState<WeakPoint | null>(null);
  
  // Task Suggestion Modal state
  const [isTaskSuggestionOpen, setIsTaskSuggestionOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Delete Confirmation Modal state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [roadmapToDelete, setRoadmapToDelete] = useState<Roadmap | null>(null);

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [wizardStep, setWizardStep] = useState(1);

  // Form states (used during new roadmap wizard flow)
  const [selectedGoal, setSelectedGoal] = useState("");
  const [customGoal, setCustomGoal] = useState("");
  const [currentLevel, setCurrentLevel] = useState("");
  const [dailyHours, setDailyHours] = useState("");
  const [focusSkills, setFocusSkills] = useState<string[]>([]);
  const [weaknessesInput, setWeaknessesInput] = useState("");


  const activeRoadmap = useMemo(() => {
    return roadmaps.find((r) => r.id === selectedRoadmapId) || null;
  }, [roadmaps, selectedRoadmapId]);

  const overallProgress = useMemo(() => {
    if (!activeRoadmap) return 0;
    return getRoadmapProgress(activeRoadmap);
  }, [activeRoadmap]);

  const computedFocusAreas = useMemo(() => {
    if (!activeRoadmap) {
      return [
        { label: "Java Core", value: 0, color: "bg-blue-500" },
        { label: "Spring Boot", value: 0, color: "bg-emerald-500" },
        { label: "Database & JPA", value: 0, color: "bg-amber-500" },
        { label: "System Design", value: 0, color: "bg-rose-500" },
      ];
    }
    return computeFocusAreas(activeRoadmap);
  }, [activeRoadmap]);

  const computedTargetMonths = useMemo(() => {
    const hours = activeRoadmap ? activeRoadmap.dailyHours : dailyHours;
    return calculateTargetMonths(hours);
  }, [activeRoadmap, dailyHours]);

  const computedConfidence = useMemo(() => {
    const level = activeRoadmap ? activeRoadmap.currentLevel : currentLevel;
    return calculateConfidence(level);
  }, [activeRoadmap, currentLevel]);

  const computedWeakPoints = useMemo(() => {
    const base = [...baseWeakPoints];
    const weaknesses = activeRoadmap ? activeRoadmap.weaknessesInput : weaknessesInput;
    if (weaknesses.trim()) {
      base.unshift({
        title: "Khó khăn tự nhận thấy",
        description: weaknesses.trim(),
        priority: "Cá nhân hóa",
        tone: "blue" as const,
      });
    }
    return base;
  }, [activeRoadmap, weaknessesInput]);

  const startAIGeneration = () => {
    setIsGenerating(true);
    setGenerationStep(0);

    let progress = 0;
    const timer = setInterval(() => {
      progress += 2.5;
      if (progress >= 100) {
        clearInterval(timer);
        setGenerationStep(100);
        setIsGenerating(false);

        const newId = `roadmap-${Date.now()}`;
        const newTitle = selectedGoal === "custom" ? customGoal || "Tự thiết lập" : selectedGoal;
        const newRoadmap: Roadmap = {
          id: newId,
          title: newTitle,
          currentLevel,
          dailyHours,
          computedTargetMonths,
          focusSkills,
          weaknessesInput,
          createdAt: new Date().toLocaleDateString("vi-VN"),
          progress: 0,
          confidence: computedConfidence,
          selectedPace: "Cân bằng",
          activeStage: 0,
          stages: generateStagesForGoal(newTitle),
          completedItems: [],
        };

        setRoadmaps((prev) => [newRoadmap, ...prev]);
        setSelectedRoadmapId(newId);
        setIsCreatingNew(false);

        toast.success("AI đã tạo lộ trình học tập cá nhân hóa thành công!", {
          duration: 4000,
          position: "top-center",
        });
      } else {
        setGenerationStep(progress);
      }
    }, 150);
  };

  const toggleRoadmapItem = (roadmapId: string, itemKey: string) => {
    setRoadmaps((prev) =>
      prev.map((r) => {
        if (r.id !== roadmapId) return r;
        const completedItems = r.completedItems.includes(itemKey)
          ? r.completedItems.filter((id) => id !== itemKey)
          : [...r.completedItems, itemKey];
        return { ...r, completedItems };
      })
    );
  };

  const handleGenerateExercise = (weakPoint: WeakPoint) => {
    // Open quiz modal immediately
    setSelectedWeakPoint(weakPoint);
    setIsQuizModalOpen(true);
  };

  const handleViewTaskSuggestion = (task: Task) => {
    setSelectedTask(task);
    setIsTaskSuggestionOpen(true);
  };

  const handleDeleteRoadmap = (roadmap: Roadmap) => {
    setRoadmapToDelete(roadmap);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteRoadmap = () => {
    if (roadmapToDelete) {
      setRoadmaps((prev) => prev.filter((r) => r.id !== roadmapToDelete.id));
      toast.success(`Đã xóa lộ trình "${roadmapToDelete.title}"`);
      setRoadmapToDelete(null);
    }
  };

  const startNewRoadmapFlow = () => {
    setWizardStep(1);
    setSelectedGoal("");
    setCustomGoal("");
    setCurrentLevel("");
    setDailyHours("");
    setFocusSkills([]);
    setWeaknessesInput("");
    setIsCreatingNew(true);
  };

  const renderWizard = () => {
    return (
      <div className="w-full py-4 sm:py-8">
        {/* Progress header */}
        <div className="mb-8">
          <div className="flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-slate-400 mb-3">
            <span>BƯỚC {wizardStep} / 5</span>
            <span>
              {wizardStep === 1
                ? "Định hướng mục tiêu"
                : wizardStep === 2
                  ? "Trình độ hiện tại"
                  : wizardStep === 3
                    ? "Kế hoạch học tập"
                    : wizardStep === 4
                      ? "Kỹ năng mong muốn"
                      : "Khó khăn & Hoàn tất"}
            </span>
          </div>
          <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-accent rounded-full transition-all duration-300"
              style={{ width: `${(wizardStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* Wizard Card */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 shadow-xl overflow-hidden p-6 sm:p-8">
          {wizardStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white flex items-center gap-2">
                  <Target className="w-6 h-6 text-accent" />
                  Mục tiêu nghề nghiệp của bạn là gì?
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Chọn mục tiêu phù hợp nhất để AI thiết kế lộ trình học sát thực tế nhất.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  {
                    id: "Backend Java Developer",
                    title: "Backend Java Developer",
                    desc: "Học bài bản từ Java core, Spring Boot, Databases đến Microservices và Docker.",
                  },
                  {
                    id: "Spring Boot Developer",
                    title: "Spring Boot Developer",
                    desc: "Tập trung REST API chuyên sâu, Spring Boot JPA, Spring Security và Testing.",
                  },
                  {
                    id: "Java Intern/Fresher",
                    title: "Thực tập sinh Java",
                    desc: "Luyện phỏng vấn cơ bản, OOP thực chiến, cấu trúc dữ liệu và làm đồ án nhanh.",
                  },
                  {
                    id: "Fullstack Developer (Java & React)",
                    title: "Fullstack Developer",
                    desc: "Kết hợp giao diện Next.js/React hiện đại với hệ thống API Java Backend mạnh mẽ.",
                  },
                  {
                    id: "Chuyển ngành sang Java Backend",
                    title: "Chuyển ngành sang Java",
                    desc: "Dành cho dev ngôn ngữ khác hoặc người ngoài ngành muốn chuyển hướng sang Java.",
                  },
                  {
                    id: "Microservices & DevOps Architect",
                    title: "Microservices & DevOps",
                    desc: "Kiến trúc hệ thống lớn, DevOps, CI/CD, Kafka, Redis, K8s và tối ưu hiệu suất.",
                  },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setSelectedGoal(item.id);
                      setWizardStep(2);
                    }}
                    className={`text-left p-5 rounded-xl border-2 transition-all duration-200 flex flex-col justify-between h-full cursor-pointer hover:scale-[1.01] active:scale-[0.99] hover:shadow-md ${selectedGoal === item.id
                      ? "border-accent bg-accent/5 dark:bg-accent/10 shadow-md ring-1 ring-accent/30"
                      : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-gray-50/50 dark:bg-slate-900/50"
                      }`}
                  >
                    <div>
                      <p className="font-bold text-gray-955 dark:text-white text-base">{item.title}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
                        {item.desc}
                      </p>
                    </div>
                  </button>
                ))}

                <button
                  type="button"
                  onClick={() => setSelectedGoal("custom")}
                  className={`text-left p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer hover:scale-[1.01] active:scale-[0.99] hover:shadow-md md:col-span-3 ${selectedGoal === "custom"
                    ? "border-accent bg-accent/5 dark:bg-accent/10 shadow-md ring-1 ring-accent/30"
                    : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-gray-50/50 dark:bg-slate-900/50"
                    }`}
                >
                  <p className="font-bold text-gray-955 dark:text-white text-base">Mục tiêu khác</p>
                  <p className="text-xs text-gray-500 dark:text-slate-400 mt-2 leading-relaxed">
                    Tự nhập định hướng học tập riêng biệt theo nhu cầu cá nhân của bạn.
                  </p>
                </button>
              </div>

              {selectedGoal === "custom" && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Nhập mục tiêu học tập cụ thể
                  </label>
                  <input
                    type="text"
                    value={customGoal}
                    onChange={(e) => setCustomGoal(e.target.value)}
                    placeholder="Ví dụ: Học Java để chuyển ngành từ PHP, hoặc học Spring Boot nâng cao..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-300 dark:border-slate-600 rounded-lg text-sm text-gray-950 dark:text-white focus:ring-2 focus:ring-accent focus:border-transparent focus:outline-none"
                  />
                </div>
              )}

              <div className="flex justify-end pt-4 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="button"
                  disabled={!selectedGoal || (selectedGoal === "custom" && !customGoal.trim())}
                  onClick={() => setWizardStep(2)}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-colors inline-flex items-center gap-2 shadow-lg ${(!selectedGoal || (selectedGoal === "custom" && !customGoal.trim()))
                    ? "bg-gray-300 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-accent hover:bg-accent-600 text-white shadow-accent/20"
                    }`}
                >
                  Tiếp theo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {wizardStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-955 dark:text-white flex items-center gap-2">
                  <BarChart3 className="w-6 h-6 text-accent" />
                  Trình độ hiện tại của bạn
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Đánh giá trung thực để AI thiết lập bài tập và độ khó lộ trình phù hợp.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: "Chưa biết gì",
                    title: "Chưa biết gì / Mới bắt đầu",
                    desc: "Bắt đầu học lập trình hoặc học Java từ con số 0.",
                  },
                  {
                    id: "Sinh viên năm 1-2",
                    title: "Sinh viên CNTT năm 1-2",
                    desc: "Đang học tại trường nhưng chưa vững lý thuyết nền tảng.",
                  },
                  {
                    id: "Mất gốc Java",
                    title: "Bị mất gốc Java",
                    desc: "Đã từng học qua nhưng hổng kiến thức nghiêm trọng.",
                  },
                  {
                    id: "Mới học cơ bản",
                    title: "Đã biết cú pháp cơ bản",
                    desc: "Nắm được biến, điều kiện, vòng lặp, mảng cơ bản.",
                  },
                  {
                    id: "OOP & Collections",
                    title: "Nắm vững OOP & Collections",
                    desc: "Hiểu sâu OOP, Abstract Class, Interface, List, Set, Map.",
                  },
                  {
                    id: "Chuyển từ ngôn ngữ khác",
                    title: "Chuyển từ ngôn ngữ khác",
                    desc: "Đã vững JS, Python, C#... nay muốn chuyển sang Java.",
                  },
                  {
                    id: "JDBC & Database",
                    title: "Đã biết JDBC & Database",
                    desc: "Biết viết câu lệnh Query SQL cơ bản, kết nối DB bằng JDBC.",
                  },
                  {
                    id: "DSA cơ bản",
                    title: "Cấu trúc dữ liệu giải thuật",
                    desc: "Hiểu đệ quy, Stack, Queue, thuật toán tìm kiếm/sắp xếp cơ bản.",
                  },
                  {
                    id: "Junior nền tảng",
                    title: "Đã học Spring Boot cơ bản",
                    desc: "Biết viết REST API CRUD cơ bản, Dependency Injection.",
                  },
                  {
                    id: "Có kinh nghiệm dự án",
                    title: "Đã làm dự án thực tế",
                    desc: "Đã hoàn thành đồ án môn học hoặc project mini (Spring Boot).",
                  },
                  {
                    id: "Chuẩn bị phỏng vấn",
                    title: "Luyện phỏng vấn xin việc",
                    desc: "Đã học xong lý thuyết, cần ôn tập phỏng vấn fresher/junior.",
                  },
                  {
                    id: "Đã đi làm cần nâng cao",
                    title: "Đã đi làm (Middle+)",
                    desc: "Muốn học tối ưu hệ thống lớn, Microservices, CI/CD, DevOps.",
                  },
                ].map((level) => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => {
                      setCurrentLevel(level.id);
                      setWizardStep(3);
                    }}
                    className={`text-left p-4 rounded-xl border cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:shadow-md flex flex-col justify-between ${currentLevel === level.id
                      ? "border-accent bg-accent/5 dark:bg-accent/10 font-medium ring-1 ring-accent/30"
                      : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-gray-50/50 dark:bg-slate-900/50"
                      }`}
                  >
                    <div>
                      <p className="text-sm font-bold text-gray-955 dark:text-white">{level.title}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">{level.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setWizardStep(1)}
                  className="px-5 py-3 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-white rounded-lg font-semibold text-sm cursor-pointer transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
                <button
                  type="button"
                  disabled={!currentLevel}
                  onClick={() => setWizardStep(3)}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-colors inline-flex items-center gap-2 shadow-lg ${!currentLevel
                    ? "bg-gray-300 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-accent hover:bg-accent-600 text-white shadow-accent/20"
                    }`}
                >
                  Tiếp theo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {wizardStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-955 dark:text-white flex items-center gap-2">
                  <CalendarDays className="w-6 h-6 text-accent" />
                  Kế hoạch học tập
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Thiết lập thời gian biểu của bạn để AI chia khối lượng học tập hợp lý nhất.
                </p>
              </div>

              <div className="max-w-3xl mx-auto space-y-4">
                <label className="block text-sm font-semibold text-center text-gray-955 dark:text-white mb-3">
                  Thời gian học tập mỗi ngày (Chọn 1)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    { id: "30 phút / ngày", label: "30 phút / ngày (Rất bận)" },
                    { id: "1 giờ / ngày", label: "1 giờ / ngày (Nhẹ nhàng)" },
                    { id: "1.5 giờ / ngày", label: "1.5 giờ / ngày (Cân bằng)" },
                    { id: "2 giờ / ngày", label: "2 giờ / ngày (Tiêu chuẩn)" },
                    { id: "2.5 giờ / ngày", label: "2.5 giờ / ngày (Tập trung)" },
                    { id: "3 giờ / ngày", label: "3 giờ / ngày (Nỗ lực cao)" },
                    { id: "4 giờ / ngày", label: "4 giờ / ngày (Toàn thời gian)" },
                    { id: "6 giờ / ngày", label: "6 giờ / ngày (Cường độ cao)" },
                    { id: "8 giờ / ngày", label: "8 giờ / ngày (Bootcamp cấp tốc)" },
                  ].map((time) => (
                    <button
                      key={time.id}
                      type="button"
                      onClick={() => {
                        setDailyHours(time.id);
                        setWizardStep(4);
                      }}
                      className={`w-full text-left p-4 rounded-lg border cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:shadow-md text-sm font-medium ${dailyHours === time.id
                        ? "border-accent bg-accent/5 dark:bg-accent/10 text-accent font-semibold ring-1 ring-accent/30"
                        : "border-gray-200 dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-900 text-gray-700 dark:text-slate-300"
                        }`}
                    >
                      {time.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setWizardStep(2)}
                  className="px-5 py-3 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-white rounded-lg font-semibold text-sm cursor-pointer transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
                <button
                  type="button"
                  disabled={!dailyHours}
                  onClick={() => setWizardStep(4)}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-colors inline-flex items-center gap-2 shadow-lg ${!dailyHours
                    ? "bg-gray-300 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-accent hover:bg-accent-600 text-white shadow-accent/20"
                    }`}
                >
                  Tiếp theo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {wizardStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-955 dark:text-white flex items-center gap-2">
                  <ListChecks className="w-6 h-6 text-accent" />
                  Kỹ năng mong muốn
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Chọn các kỹ năng bạn muốn tập trung nhất (Chọn nhiều).
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  "Java Core & OOP thực chiến",
                  "RESTful API & Spring Boot",
                  "Cơ sở dữ liệu & JPA",
                  "Spring Security & OAuth2",
                  "Distributed & Microservices",
                  "Docker, CI/CD & Deploy Cloud",
                  "Cấu trúc dữ liệu & Giải thuật",
                  "Unit Test & Integration Test",
                  "Design Patterns & Clean Code",
                ].map((skill) => {
                  const isSelected = focusSkills.includes(skill);
                  return (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          setFocusSkills(focusSkills.filter((s) => s !== skill));
                        } else {
                          setFocusSkills([...focusSkills, skill]);
                        }
                      }}
                      className={`p-3.5 rounded-lg border text-left text-xs sm:text-sm font-semibold cursor-pointer transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] hover:shadow-md ${isSelected
                        ? "border-accent bg-accent/5 text-accent shadow-sm ring-1 ring-accent/30"
                        : "border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 bg-gray-50/50 dark:bg-slate-900/50 text-gray-700 dark:text-slate-300"
                        }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-4 h-4 rounded flex items-center justify-center border ${isSelected
                            ? "bg-accent border-accent text-white"
                            : "border-gray-300 dark:border-slate-600"
                            }`}
                        >
                          {isSelected && <span className="text-[10px] font-bold">✓</span>}
                        </div>
                        {skill}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setWizardStep(3)}
                  className="px-5 py-3 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-white rounded-lg font-semibold text-sm cursor-pointer transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
                <button
                  type="button"
                  disabled={focusSkills.length === 0}
                  onClick={() => setWizardStep(5)}
                  className={`px-6 py-3 rounded-lg font-semibold text-sm cursor-pointer transition-colors inline-flex items-center gap-2 shadow-lg ${focusSkills.length === 0
                    ? "bg-gray-300 dark:bg-slate-700 text-gray-400 dark:text-slate-500 cursor-not-allowed"
                    : "bg-accent hover:bg-accent-600 text-white shadow-accent/20"
                    }`}
                >
                  Tiếp theo
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {wizardStep === 5 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <Brain className="w-6 h-6 text-accent" />
                  Khó khăn & Điểm yếu tự nhận thấy
                </h2>
                <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
                  Mô tả ngắn gọn khó khăn bạn đang gặp phải để AI cá nhân hóa kỹ lưỡng hơn.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-slate-300 uppercase tracking-wider mb-2">
                  Bạn cảm thấy khó khăn nhất ở phần nào khi học Java? (Không bắt buộc)
                </label>
                <textarea
                  value={weaknessesInput}
                  onChange={(e) => setWeaknessesInput(e.target.value)}
                  placeholder="Ví dụ: Chưa rành OOP, chưa biết cách kết nối Database, lúng túng khi viết API..."
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-slate-900 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-accent focus:border-transparent focus:outline-none placeholder-gray-400 dark:placeholder-slate-500 text-gray-900 dark:text-white transition-all resize-none"
                />
              </div>

              <div className="bg-gray-50 dark:bg-slate-900/50 rounded-xl p-5 border border-gray-150 dark:border-slate-800 space-y-4">
                <h3 className="text-xs font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider">
                  Tóm tắt thông tin lộ trình
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600 dark:text-slate-300">
                  <p>
                    📊 <span className="font-semibold text-gray-900 dark:text-white">Trình độ:</span>{" "}
                    {currentLevel}
                  </p>
                  <p>
                    ⏰ <span className="font-semibold text-gray-900 dark:text-white">Thời lượng:</span>{" "}
                    {dailyHours}
                  </p>
                  <p>
                    📅 <span className="font-semibold text-gray-900 dark:text-white">Đích đến:</span>{" "}
                    {computedTargetMonths}
                  </p>
                  <p className="sm:col-span-2">
                    💡{" "}
                    <span className="font-semibold text-gray-900 dark:text-white">
                      Kỹ năng muốn học:
                    </span>{" "}
                    {focusSkills.length > 0 ? focusSkills.join(", ") : "Chưa chọn kỹ năng cụ thể"}
                  </p>
                </div>
              </div>

              <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-slate-700">
                <button
                  type="button"
                  onClick={() => setWizardStep(4)}
                  className="px-5 py-3 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-white rounded-lg font-semibold text-sm cursor-pointer transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Quay lại
                </button>
                <button
                  type="button"
                  onClick={startAIGeneration}
                  className="px-6 py-3 bg-gradient-to-r from-accent to-accent-600 hover:from-accent-600 hover:to-accent-700 text-white rounded-lg font-semibold text-sm cursor-pointer transition-colors inline-flex items-center gap-2 shadow-lg shadow-accent/20"
                >
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  Tạo lộ trình AI của tôi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGenerating = () => {
    let loadingMessage = "🤖 Đang phân tích hồ sơ và trình độ đầu vào...";
    if (generationStep >= 25 && generationStep < 50) {
      loadingMessage = "🧠 Đánh giá các lỗ hổng kỹ năng cần củng cố...";
    } else if (generationStep >= 50 && generationStep < 75) {
      loadingMessage = "📅 Thiết kế lộ trình học tập chi tiết theo từng tuần...";
    } else if (generationStep >= 75 && generationStep < 99) {
      loadingMessage = "⚙️ Tối ưu hóa các bài tập & gợi ý AI tiếp theo...";
    } else if (generationStep >= 99) {
      loadingMessage = "✨ Hoàn tất lộ trình cá nhân hóa của bạn!";
    }

    return (
      <div className="max-w-md mx-auto py-12 sm:py-20 text-center space-y-8">
        <div className="relative inline-flex items-center justify-center">
          <div className="absolute inset-0 rounded-full bg-accent/20 animate-ping" />
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent via-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-2xl shadow-accent/40 animate-pulse relative z-10">
            <Sparkles
              className="w-10 h-10 animate-spin"
              style={{ animationDuration: "3s" }}
            />
          </div>
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl font-extrabold tracking-tight text-gray-955 dark:text-white">
            AI đang phân tích & tạo lộ trình
          </h2>
          <p className="text-sm font-semibold text-accent animate-pulse">{loadingMessage}</p>
          <p className="text-xs text-gray-500 dark:text-slate-400">
            Quá trình này mất khoảng vài giây. Vui lòng giữ nguyên màn hình.
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-bold text-gray-600 dark:text-slate-300 px-1">
            <span>Tiến trình</span>
            <span>{Math.min(100, Math.round(generationStep))}%</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden p-0.5 border border-gray-300/20 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-blue-500 via-accent to-purple-600 rounded-full transition-all duration-100 ease-out"
              style={{ width: `${Math.min(100, generationStep)}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  const renderRoadmapList = () => {
    return (
      <div className="max-w-6xl mx-auto space-y-6 py-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 p-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Compass className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-950 dark:text-white">
                    Lộ trình học tập của bạn
                  </h1>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400 leading-relaxed max-w-2xl">
                Quản lý các lộ trình học tập được AI cá nhân hóa theo mục tiêu nghề nghiệp của bạn. 
                Theo dõi tiến độ, hoàn thành từng giai đoạn và đạt được mục tiêu đã đề ra.
              </p>
            </div>
            <button
              onClick={startNewRoadmapFlow}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-600 text-white rounded-lg font-semibold cursor-pointer transition-colors whitespace-nowrap"
            >
              <Sparkles className="w-4 h-4" />
              Tạo lộ trình mới
            </button>
          </div>
        </div>

        {roadmaps.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700">
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-700 flex items-center justify-center mx-auto mb-4">
              <Compass className="w-8 h-8 text-gray-400 dark:text-slate-500" />
            </div>
            <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-2">
              Chưa có lộ trình nào
            </h2>
            <p className="text-sm text-gray-600 dark:text-slate-400 max-w-md mx-auto mb-6">
              Tạo lộ trình học tập đầu tiên được cá nhân hóa theo mục tiêu của bạn
            </p>
            <button
              onClick={startNewRoadmapFlow}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-accent hover:bg-accent-600 text-white rounded-lg font-semibold cursor-pointer transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              Bắt đầu ngay
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {roadmaps.map((roadmap) => {
              const progressVal = getRoadmapProgress(roadmap);

              return (
                <div
                  key={roadmap.id}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-all overflow-hidden group flex flex-col"
                >
                  {/* Card Header */}
                  <div className="p-5 space-y-3 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-1.5">
                          Ngày tạo: {roadmap.createdAt}
                        </p>
                        <h2 className="text-base font-bold text-gray-950 dark:text-white line-clamp-2 min-h-[2.5rem] group-hover:text-accent transition-colors">
                          {roadmap.title}
                        </h2>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                        progressVal >= 17 
                          ? "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300"
                          : "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                      }`}>
                        Tiến độ {progressVal}%
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-2">
                      <div className="h-1.5 bg-gray-100 dark:bg-slate-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-accent rounded-full transition-all duration-500"
                          style={{ width: `${progressVal}%` }}
                        />
                      </div>
                    </div>

                    {/* Roadmap Info */}
                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-gray-100 dark:border-slate-700">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Trình độ
                        </p>
                        <p className="text-xs font-bold text-gray-950 dark:text-white truncate" title={roadmap.currentLevel}>
                          {roadmap.currentLevel}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Thời lượng
                        </p>
                        <p className="text-xs font-bold text-gray-950 dark:text-white truncate" title={roadmap.dailyHours}>
                          {roadmap.dailyHours}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold text-gray-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                          Đích đến
                        </p>
                        <p className="text-xs font-bold text-gray-950 dark:text-white truncate" title={roadmap.computedTargetMonths}>
                          {roadmap.computedTargetMonths}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer */}
                  <div className="px-5 py-3 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between gap-3">
                    <button
                      onClick={() => handleDeleteRoadmap(roadmap)}
                      className="text-xs font-medium text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 cursor-pointer transition-colors"
                    >
                      Xóa lộ trình
                    </button>
                    <button
                      onClick={() => setSelectedRoadmapId(roadmap.id)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-accent hover:bg-accent-600 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                    >
                      Xem chi tiết
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {isGenerating && renderGenerating()}

        {!isGenerating && isCreatingNew && (
          <div className="max-w-5xl mx-auto space-y-6">
            <div className="mb-6 flex items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-accent/10 text-accent text-xs font-semibold mb-3">
                  <Sparkles className="w-4 h-4 animate-pulse" />
                  AI Personalized Learning
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-955 dark:text-white">
                  Tạo lộ trình học tập mới
                </h1>
                <p className="text-sm sm:text-base text-gray-600 dark:text-slate-300 mt-2 max-w-3xl">
                  Biến mục tiêu học lập trình thành kế hoạch rõ ràng: biết đang yếu ở đâu, tuần này học
                  gì, bài tập nào cần làm và khi nào nên chuyển sang giai đoạn tiếp theo.
                </p>
              </div>
              <button
                onClick={() => setIsCreatingNew(false)}
                className="px-4 py-2 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-700 dark:text-white rounded-lg text-sm font-semibold cursor-pointer transition-colors"
              >
                Quay lại danh sách
              </button>
            </div>
            {renderWizard()}
          </div>
        )}

        {!isGenerating && !isCreatingNew && selectedRoadmapId === null && renderRoadmapList()}

        {!isGenerating && !isCreatingNew && selectedRoadmapId !== null && activeRoadmap && (
          <>
            {/* Combined Header */}
            <CombinedHeader
              onBack={() => setSelectedRoadmapId(null)}
              roadmapTitle={activeRoadmap.title}
              currentLevel={activeRoadmap.currentLevel}
              dailyHours={activeRoadmap.dailyHours}
              targetMonths={activeRoadmap.computedTargetMonths}
              startDate={activeRoadmap.createdAt}
              overallProgress={overallProgress}
              focusAreas={computedFocusAreas}
              streak={7}
              weeklyGoal={{ current: 15, target: 20 }}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              {/* Left Column - Today's Tasks & Learning Roadmap (2/3 width) */}
              <div className="lg:col-span-2 space-y-6">
                <TodayTasks 
                  tasks={todayTasks} 
                  onViewSuggestion={handleViewTaskSuggestion}
                />
                
                <LearningRoadmap
                  stages={activeRoadmap.stages}
                  completedItems={activeRoadmap.completedItems}
                  onToggleItem={(itemKey) => toggleRoadmapItem(activeRoadmap.id, itemKey)}
                  getStageProgress={(index) => getStageProgress(activeRoadmap, index)}
                  getStageStatus={(index) => getStageStatus(activeRoadmap, index)}
                />
              </div>

              {/* Right Sidebar - Weakness & AI (1/3 width) */}
              <aside className="space-y-6">
                <WeaknessAreas 
                  weakPoints={computedWeakPoints} 
                  onGenerateExercise={handleGenerateExercise}
                />
                
                <AICoach onOpenChat={() => setIsAICoachOpen(true)} />
              </aside>
            </div>

          </>
        )}
      </div>

      {/* AI Coach Modal */}
      {activeRoadmap && (
        <AICoachModal
          isOpen={isAICoachOpen}
          onClose={() => setIsAICoachOpen(false)}
          roadmapTitle={activeRoadmap.title}
          currentProgress={overallProgress}
          weaknesses={activeRoadmap.weaknessesInput}
        />
      )}

      {/* Exercise Quiz Modal */}
      {selectedWeakPoint && (
        <ExerciseQuizModal
          isOpen={isQuizModalOpen}
          onClose={() => {
            setIsQuizModalOpen(false);
            setSelectedWeakPoint(null);
          }}
          weakPointTitle={selectedWeakPoint.title}
          difficulty="Trung bình"
        />
      )}

      {/* Task Suggestion Modal */}
      <TaskSuggestionModal
        isOpen={isTaskSuggestionOpen}
        onClose={() => {
          setIsTaskSuggestionOpen(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRoadmapToDelete(null);
        }}
        onConfirm={confirmDeleteRoadmap}
        title="Xác nhận xóa lộ trình"
        message={`Bạn có chắc chắn muốn xóa lộ trình "<strong>${roadmapToDelete?.title}</strong>"?<br/>Hành động này không thể hoàn tác.`}
        confirmText="Xóa lộ trình"
        cancelText="Hủy"
        type="danger"
      />
    </div>
  );
}
