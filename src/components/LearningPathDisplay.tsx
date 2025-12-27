"use client";

import { useMemo, useState } from "react";
import {
  LearningPathPlan,
  PeriodPlan,
  TopicOutline,
  LessonDetail,
  ExerciseDetail,
  QuizItem,
} from "@/types/learning-path";
import { LearningPathService } from "@/services/learning-path.service";
import MotionWrapper from "@/components/MotionWrapper";

interface LearningPathDisplayProps {
  learningPath: LearningPathPlan;
  answer: string;
  onCreateNew?: () => void;
  onStartLearning?: () => void;
}

export default function LearningPathDisplay({
  learningPath,
  answer,
  onCreateNew,
  onStartLearning,
}: LearningPathDisplayProps) {
  const [expandedPeriods, setExpandedPeriods] = useState<Set<number>>(
    new Set([1]),
  ); // First period expanded by default
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [expandedTopics, setExpandedTopics] = useState<Set<string>>(new Set());
  const [expandedLessons, setExpandedLessons] = useState<Set<string>>(
    new Set(),
  );
  const [expandedExercises, setExpandedExercises] = useState<Set<string>>(
    new Set(),
  );
  const [expandedQuizzes, setExpandedQuizzes] = useState<Set<string>>(
    new Set(),
  );

  // Local progress states (UI only)
  type ItemStatus = "todo" | "progress" | "done";
  const [lessonStatus, setLessonStatus] = useState<Record<string, ItemStatus>>(
    {},
  );
  const [exerciseStatus, setExerciseStatus] = useState<
    Record<string, ItemStatus>
  >({});
  const [quizStatus, setQuizStatus] = useState<Record<string, ItemStatus>>({});

  const setStatus = (
    type: "lesson" | "exercise" | "quiz",
    id: string,
    status: ItemStatus,
  ) => {
    if (type === "lesson")
      setLessonStatus((prev) => ({ ...prev, [id]: status }));
    if (type === "exercise")
      setExerciseStatus((prev) => ({ ...prev, [id]: status }));
    if (type === "quiz") setQuizStatus((prev) => ({ ...prev, [id]: status }));
  };

  const getStatus = (
    type: "lesson" | "exercise" | "quiz",
    id: string,
  ): ItemStatus => {
    if (type === "lesson") return lessonStatus[id] || "todo";
    if (type === "exercise") return exerciseStatus[id] || "todo";
    return quizStatus[id] || "todo";
  };

  const togglePeriod = (periodNumber: number) => {
    const newExpanded = new Set(expandedPeriods);
    if (newExpanded.has(periodNumber)) {
      newExpanded.delete(periodNumber);
    } else {
      newExpanded.add(periodNumber);
    }
    setExpandedPeriods(newExpanded);
  };

  const toggleTopic = (topicId: string) => {
    const newExpanded = new Set(expandedTopics);
    if (newExpanded.has(topicId)) {
      newExpanded.delete(topicId);
    } else {
      newExpanded.add(topicId);
    }
    setExpandedTopics(newExpanded);
  };

  const toggleLesson = (lessonId: string) => {
    const newExpanded = new Set(expandedLessons);
    if (newExpanded.has(lessonId)) {
      newExpanded.delete(lessonId);
    } else {
      newExpanded.add(lessonId);
    }
    setExpandedLessons(newExpanded);
  };

  const toggleExercise = (exerciseId: string) => {
    const newExpanded = new Set(expandedExercises);
    if (newExpanded.has(exerciseId)) {
      newExpanded.delete(exerciseId);
    } else {
      newExpanded.add(exerciseId);
    }
    setExpandedExercises(newExpanded);
  };

  const toggleQuiz = (quizId: string) => {
    const newExpanded = new Set(expandedQuizzes);
    if (newExpanded.has(quizId)) {
      newExpanded.delete(quizId);
    } else {
      newExpanded.add(quizId);
    }
    setExpandedQuizzes(newExpanded);
  };

  const getTimeUnitText = (timeUnit: string) => {
    switch (timeUnit) {
      case "DAY":
        return "ngày";
      case "WEEK":
        return "tuần";
      case "MONTH":
        return "tháng";
      case "YEAR":
        return "năm";
      default:
        return timeUnit.toLowerCase();
    }
  };

  const handleStartLearning = async () => {
    try {
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Call the save API
      const response = await LearningPathService.saveLearningPath({
        learningPathPlan: learningPath,
      });

      if (response.code === 200) {
        setSaveSuccess(true);

        // Call the optional callback if provided
        if (onStartLearning) {
          onStartLearning();
        }

        // Show success message briefly then redirect or hide it
        setTimeout(() => {
          setSaveSuccess(false);
          // You could redirect to learning paths page here
          // window.location.href = '/my-learning-path';
        }, 2000);
      } else {
        throw new Error("Không thể lưu lộ trình học tập.");
      }
    } catch (error) {
      console.error("Error saving learning path:", error);
      setSaveError(
        error instanceof Error
          ? error.message
          : "Có lỗi xảy ra khi lưu lộ trình. Vui lòng thử lại.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  // Compute overall progress from local statuses
  const overall = useMemo(() => {
    const periods = learningPath.periods || [];
    let total = 0;
    let done = 0;
    periods.forEach((p) => {
      p.topics?.forEach((t) => {
        total +=
          (t.lessons?.length || 0) +
          (t.exercises?.length || 0) +
          (t.quizzes?.length || 0);
        (t.lessons || []).forEach((_, i) => {
          if (
            lessonStatus[`${p.periodNumber}-${t.title}-lesson-${i}`] === "done"
          )
            done++;
        });
        (t.exercises || []).forEach((_, i) => {
          if (
            exerciseStatus[`${p.periodNumber}-${t.title}-exercise-${i}`] ===
            "done"
          )
            done++;
        });
        (t.quizzes || []).forEach((_, i) => {
          if (quizStatus[`${p.periodNumber}-${t.title}-quiz-${i}`] === "done")
            done++;
        });
      });
    });
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent };
  }, [learningPath, lessonStatus, exerciseStatus, quizStatus]);

  if (!learningPath) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 via-white to-neutral-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <MotionWrapper animation="fadeInUp" duration={0.6}>
            <div className="text-center">
              <div className="w-16 h-16 bg-neutral-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎯</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">
                {learningPath.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center gap-4 text-gray-600 mb-6 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">⏱️</span>
                  <span>
                    {learningPath.duration}{" "}
                    {getTimeUnitText(learningPath.timeUnit)}
                  </span>
                </div>
                <span className="w-1 h-1 rounded-full bg-gray-400"></span>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600">📚</span>
                  <span>{learningPath.periods?.length || 0} giai đoạn</span>
                </div>
              </div>

              {/* Overall progress */}
              <div className="max-w-xl mx-auto mb-6">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>Tiến độ tổng</span>
                  <span className="font-semibold text-gray-900">
                    {overall.done}/{overall.total} • {overall.percent}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all"
                    style={{ width: `${overall.percent}%` }}
                  ></div>
                </div>
              </div>

              {answer && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-left max-w-3xl mx-auto mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">AI</span>
                    </div>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {answer}
                    </p>
                  </div>
                </div>
              )}

              {/* Success Message */}
              {saveSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-left max-w-3xl mx-auto mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">✓</span>
                    </div>
                    <div>
                      <p className="text-green-800 font-semibold text-sm mb-1">
                        Lưu thành công!
                      </p>
                      <p className="text-green-700 text-sm">
                        Lộ trình học tập đã được lưu vào tài khoản của bạn.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {saveError && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-left max-w-3xl mx-auto mb-6">
                  <div className="flex items-start gap-3">
                    <div className="w-7 h-7 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <div>
                      <p className="text-red-800 font-semibold text-sm mb-1">
                        Có lỗi xảy ra
                      </p>
                      <p className="text-red-700 text-sm">{saveError}</p>
                      <button
                        onClick={() => setSaveError(null)}
                        className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
                      >
                        Đóng
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3">
                {onCreateNew && (
                  <button
                    onClick={onCreateNew}
                    className="px-5 py-2.5 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium rounded-lg transition-all shadow-sm"
                  >
                    Tạo lộ trình mới
                  </button>
                )}
                <button
                  onClick={handleStartLearning}
                  disabled={isSaving || saveSuccess}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg transition-all shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Đang lưu...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <span className="text-white">✓</span>
                      Đã lưu thành công
                    </>
                  ) : (
                    "Bắt đầu học ngay"
                  )}
                </button>
              </div>
            </div>
          </MotionWrapper>
        </div>
      </div>

      {/* Learning Path Content */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="space-y-6">
          {learningPath.periods?.map((period, periodIndex) => (
            <PeriodCard
              key={period.periodNumber}
              period={period}
              isExpanded={expandedPeriods.has(period.periodNumber)}
              onToggle={() => togglePeriod(period.periodNumber)}
              expandedTopics={expandedTopics}
              expandedLessons={expandedLessons}
              expandedExercises={expandedExercises}
              expandedQuizzes={expandedQuizzes}
              onToggleTopic={toggleTopic}
              onToggleLesson={toggleLesson}
              onToggleExercise={toggleExercise}
              onToggleQuiz={toggleQuiz}
              animationDelay={periodIndex * 100}
              onSetStatus={setStatus}
              getStatus={getStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface PeriodCardProps {
  period: PeriodPlan;
  isExpanded: boolean;
  onToggle: () => void;
  expandedTopics: Set<string>;
  expandedLessons: Set<string>;
  expandedExercises: Set<string>;
  expandedQuizzes: Set<string>;
  onToggleTopic: (topicId: string) => void;
  onToggleLesson: (lessonId: string) => void;
  onToggleExercise: (exerciseId: string) => void;
  onToggleQuiz: (quizId: string) => void;
  animationDelay: number;
  onSetStatus: (
    type: "lesson" | "exercise" | "quiz",
    id: string,
    status: "todo" | "progress" | "done",
  ) => void;
  getStatus: (
    type: "lesson" | "exercise" | "quiz",
    id: string,
  ) => "todo" | "progress" | "done";
}

function PeriodCard({
  period,
  isExpanded,
  onToggle,
  expandedTopics,
  expandedLessons,
  expandedExercises,
  expandedQuizzes,
  onToggleTopic,
  onToggleLesson,
  onToggleExercise,
  onToggleQuiz,
  animationDelay,
  onSetStatus,
  getStatus,
}: PeriodCardProps) {
  // Calculate period progress (UI-only) - must be before early return
  const periodStats = useMemo(() => {
    if (!period) return { total: 0, done: 0, percent: 0 };
    let total = 0;
    const done = 0;
    period.topics?.forEach((t) => {
      total +=
        (t.lessons?.length || 0) +
        (t.exercises?.length || 0) +
        (t.quizzes?.length || 0);
    });
    const percent = total === 0 ? 0 : Math.round((done / total) * 100);
    return { total, done, percent };
  }, [period]);

  if (!period) return null;

  return (
    <MotionWrapper animation="fadeInUp" duration={0.6} delay={animationDelay}>
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
        {/* Period Header */}
        <button
          onClick={onToggle}
          className="w-full p-6 bg-white hover:bg-gray-50 transition-colors text-left border-b border-gray-100"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-900 font-bold text-base">
                  {period.periodNumber || 0}
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-0.5">
                  {period.title || "Chưa có tiêu đề"}
                </h2>
                <p className="text-gray-500 text-sm">
                  {period.topics?.length || 0} chủ đề
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:block w-40">
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600"
                    style={{ width: `${periodStats.percent}%` }}
                  ></div>
                </div>
              </div>
              <div
                className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>
        </button>

        {/* Period Content */}
        {isExpanded && period.topics && period.topics.length > 0 && (
          <div className="p-6 space-y-5">
            {period.topics.map((topic, topicIndex) => (
              <TopicCard
                key={`${period.periodNumber}-${topicIndex}`}
                topic={topic}
                topicId={`${period.periodNumber}-${topicIndex}`}
                isExpanded={expandedTopics.has(
                  `${period.periodNumber}-${topicIndex}`,
                )}
                onToggle={() =>
                  onToggleTopic(`${period.periodNumber}-${topicIndex}`)
                }
                expandedLessons={expandedLessons}
                expandedExercises={expandedExercises}
                expandedQuizzes={expandedQuizzes}
                onToggleLesson={onToggleLesson}
                onToggleExercise={onToggleExercise}
                onToggleQuiz={onToggleQuiz}
                onSetStatus={onSetStatus}
                getStatus={getStatus}
              />
            ))}
          </div>
        )}

        {isExpanded && (!period.topics || period.topics.length === 0) && (
          <div className="p-6 text-center text-gray-500">
            Chưa có chủ đề nào cho giai đoạn này
          </div>
        )}
      </div>
    </MotionWrapper>
  );
}

interface TopicCardProps {
  topic: TopicOutline;
  topicId: string;
  isExpanded: boolean;
  onToggle: () => void;
  expandedLessons: Set<string>;
  expandedExercises: Set<string>;
  expandedQuizzes: Set<string>;
  onToggleLesson: (lessonId: string) => void;
  onToggleExercise: (exerciseId: string) => void;
  onToggleQuiz: (quizId: string) => void;
  // status helpers
  onSetStatus: (
    type: "lesson" | "exercise" | "quiz",
    id: string,
    status: "todo" | "progress" | "done",
  ) => void;
  getStatus: (
    type: "lesson" | "exercise" | "quiz",
    id: string,
  ) => "todo" | "progress" | "done";
}

function TopicCard({
  topic,
  topicId,
  isExpanded,
  onToggle,
  expandedLessons,
  expandedExercises,
  expandedQuizzes,
  onToggleLesson,
  onToggleExercise,
  onToggleQuiz,
  onSetStatus,
  getStatus,
}: TopicCardProps) {
  if (!topic) return null;

  const lessonCount = topic.lessons?.length || 0;
  const exerciseCount = topic.exercises?.length || 0;
  const quizCount = topic.quizzes?.length || 0;

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white/60 backdrop-blur-sm hover:shadow-md transition-all">
      {/* Topic Header */}
      <button
        onClick={onToggle}
        className="w-full p-6 bg-white/70 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {topic.title || "Chưa có tiêu đề"}
            </h3>
            {topic.explanation && (
              <p className="text-gray-600 text-sm">{topic.explanation}</p>
            )}
            <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
              {lessonCount > 0 && (
                <span className="flex items-center space-x-1">
                  <span className="text-blue-500">📖</span>
                  <span>{lessonCount} bài học</span>
                </span>
              )}
              {exerciseCount > 0 && (
                <span className="flex items-center space-x-1">
                  <span className="text-accent">💪</span>
                  <span>{exerciseCount} bài tập</span>
                </span>
              )}
              {quizCount > 0 && (
                <span className="flex items-center space-x-1">
                  <span className="text-purple-500">🧠</span>
                  <span>{quizCount} câu hỏi</span>
                </span>
              )}
            </div>
          </div>
          <div
            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          >
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Topic Content */}
      {isExpanded && (
        <div className="p-6 border-t border-gray-100 bg-white/70 backdrop-blur-sm space-y-6">
          {/* Lessons */}
          {topic.lessons && topic.lessons.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-blue-500">📖</span>
                <span>Bài học</span>
              </h4>
              <div className="space-y-3">
                {topic.lessons.map((lesson, lessonIndex) => (
                  <LessonCard
                    key={`${topicId}-lesson-${lessonIndex}`}
                    lesson={lesson}
                    lessonId={`${topicId}-lesson-${lessonIndex}`}
                    isExpanded={expandedLessons.has(
                      `${topicId}-lesson-${lessonIndex}`,
                    )}
                    onToggle={() =>
                      onToggleLesson(`${topicId}-lesson-${lessonIndex}`)
                    }
                    onSetStatus={onSetStatus}
                    getStatus={getStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Exercises */}
          {topic.exercises && topic.exercises.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-accent">💪</span>
                <span>Bài tập thực hành</span>
              </h4>
              <div className="space-y-3">
                {topic.exercises.map((exercise, exerciseIndex) => (
                  <ExerciseCard
                    key={`${topicId}-exercise-${exerciseIndex}`}
                    exercise={exercise}
                    exerciseId={`${topicId}-exercise-${exerciseIndex}`}
                    isExpanded={expandedExercises.has(
                      `${topicId}-exercise-${exerciseIndex}`,
                    )}
                    onToggle={() =>
                      onToggleExercise(`${topicId}-exercise-${exerciseIndex}`)
                    }
                    onSetStatus={onSetStatus}
                    getStatus={getStatus}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quizzes */}
          {topic.quizzes && topic.quizzes.length > 0 && (
            <div>
              <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                <span className="text-purple-500">🧠</span>
                <span>Câu hỏi trắc nghiệm</span>
              </h4>
              <div className="space-y-3">
                {topic.quizzes.map((quiz, quizIndex) => (
                  <QuizCard
                    key={`${topicId}-quiz-${quizIndex}`}
                    quiz={quiz}
                    quizId={`${topicId}-quiz-${quizIndex}`}
                    isExpanded={expandedQuizzes.has(
                      `${topicId}-quiz-${quizIndex}`,
                    )}
                    onToggle={() =>
                      onToggleQuiz(`${topicId}-quiz-${quizIndex}`)
                    }
                    onSetStatus={onSetStatus}
                    getStatus={getStatus}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface LessonCardProps {
  lesson: LessonDetail;
  lessonId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSetStatus: (
    type: "lesson" | "exercise" | "quiz",
    id: string,
    status: "todo" | "progress" | "done",
  ) => void;
  getStatus: (
    type: "lesson" | "exercise" | "quiz",
    id: string,
  ) => "todo" | "progress" | "done";
}

function LessonCard({
  lesson,
  lessonId,
  isExpanded,
  onToggle,
  onSetStatus,
  getStatus,
}: LessonCardProps) {
  if (!lesson) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-sm transition-all">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h5 className="font-semibold text-gray-900 truncate">
              {lesson.name || "Chưa có tên bài học"}
            </h5>
            <p className="text-sm text-gray-600 mt-1 line-clamp-2">
              {lesson.explanation || "Chưa có mô tả"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${getStatus("lesson", lessonId) === "done" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : getStatus("lesson", lessonId) === "progress" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
            >
              {getStatus("lesson", lessonId) === "done"
                ? "Hoàn thành"
                : getStatus("lesson", lessonId) === "progress"
                  ? "Đang làm"
                  : "Chưa làm"}
            </span>
            <div
              className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-100 bg-white/80 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">Đánh dấu:</span>
            <button
              onClick={() => onSetStatus("lesson", lessonId, "todo")}
              className={`text-xs px-2 py-1 rounded border ${getStatus("lesson", lessonId) === "todo" ? "border-gray-400 text-gray-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              Chưa làm
            </button>
            <button
              onClick={() => onSetStatus("lesson", lessonId, "progress")}
              className={`text-xs px-2 py-1 rounded border ${getStatus("lesson", lessonId) === "progress" ? "border-amber-400 text-amber-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              Đang làm
            </button>
            <button
              onClick={() => onSetStatus("lesson", lessonId, "done")}
              className={`text-xs px-2 py-1 rounded border ${getStatus("lesson", lessonId) === "done" ? "border-emerald-500 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              Hoàn thành
            </button>
          </div>

          {lesson.keywords && lesson.keywords.length > 0 && (
            <>
              <h6 className="font-semibold text-gray-900">Khái niệm chính:</h6>
              <div className="space-y-2">
                {lesson.keywords.map((keyword, index) => (
                  <div
                    key={index}
                    className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="font-medium text-gray-900">
                      {keyword.term}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      {keyword.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface ExerciseCardProps {
  exercise: ExerciseDetail;
  exerciseId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSetStatus: (
    type: "lesson" | "exercise" | "quiz",
    id: string,
    status: "todo" | "progress" | "done",
  ) => void;
  getStatus: (
    type: "lesson" | "exercise" | "quiz",
    id: string,
  ) => "todo" | "progress" | "done";
}

function ExerciseCard({
  exercise,
  exerciseId,
  isExpanded,
  onToggle,
  onSetStatus,
  getStatus,
}: ExerciseCardProps) {
  if (!exercise) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-sm transition-all">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-gray-900">
              {exercise.title || "Chưa có tiêu đề bài tập"}
            </h5>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-xs bg-accent-200 text-accent-800 px-2 py-1 rounded-full">
                {exercise.type || "Bài tập"}
              </span>
              <span className="text-sm text-gray-600">
                {exercise.instructions?.length || 0} bước
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${getStatus("exercise", exerciseId) === "done" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : getStatus("exercise", exerciseId) === "progress" ? "bg-amber-50 text-amber-700 border-amber-200" : "bg-gray-50 text-gray-600 border-gray-200"}`}
            >
              {getStatus("exercise", exerciseId) === "done"
                ? "Hoàn thành"
                : getStatus("exercise", exerciseId) === "progress"
                  ? "Đang làm"
                  : "Chưa làm"}
            </span>
            <div
              className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
            >
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-100 bg-white/80">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500">Đánh dấu:</span>
            <button
              onClick={() => onSetStatus("exercise", exerciseId, "todo")}
              className={`text-xs px-2 py-1 rounded border ${getStatus("exercise", exerciseId) === "todo" ? "border-gray-400 text-gray-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              Chưa làm
            </button>
            <button
              onClick={() => onSetStatus("exercise", exerciseId, "progress")}
              className={`text-xs px-2 py-1 rounded border ${getStatus("exercise", exerciseId) === "progress" ? "border-amber-400 text-amber-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              Đang làm
            </button>
            <button
              onClick={() => onSetStatus("exercise", exerciseId, "done")}
              className={`text-xs px-2 py-1 rounded border ${getStatus("exercise", exerciseId) === "done" ? "border-emerald-500 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              Hoàn thành
            </button>
          </div>
          {exercise.instructions && exercise.instructions.length > 0 && (
            <>
              <h6 className="font-semibold text-gray-900 mb-3">
                Hướng dẫn thực hiện:
              </h6>
              <div className="space-y-3">
                {exercise.instructions.map((step, index) => (
                  <div key={index} className="flex space-x-3">
                    <div className="w-6 h-6 bg-accent text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {step.stepNumber}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700">{step.description}</p>
                      {step.command && (
                        <div className="mt-2 p-2 bg-gray-100 rounded-lg font-mono text-sm">
                          {step.command}
                        </div>
                      )}
                      {step.codeBlock && (
                        <div className="mt-2 p-3 bg-gray-900 text-green-400 rounded-lg font-mono text-sm overflow-x-auto">
                          <pre>{step.codeBlock}</pre>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface QuizCardProps {
  quiz: QuizItem;
  quizId: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSetStatus: (
    type: "lesson" | "exercise" | "quiz",
    id: string,
    status: "todo" | "progress" | "done",
  ) => void;
  getStatus: (
    type: "lesson" | "exercise" | "quiz",
    id: string,
  ) => "todo" | "progress" | "done";
}

function QuizCard({
  quiz,
  quizId,
  isExpanded,
  onToggle,
  onSetStatus,
  getStatus,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowExplanation(true);
  };

  if (!quiz) return null;

  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 bg-white hover:shadow-sm transition-all">
      <button
        onClick={onToggle}
        className="w-full p-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-gray-900">
              {quiz.question || "Chưa có câu hỏi"}
            </h5>
            <span className="text-sm text-gray-600 mt-1">
              {quiz.options?.length || 0} lựa chọn
            </span>
          </div>
          <div
            className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
          >
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="p-4 border-t border-gray-100 bg-white">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs text-gray-500">Đánh dấu:</span>
            <button
              onClick={() => onSetStatus("quiz", quizId, "todo")}
              className={`text-xs px-2 py-1 rounded border ${getStatus("quiz", quizId) === "todo" ? "border-gray-400 text-gray-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              Chưa làm
            </button>
            <button
              onClick={() => onSetStatus("quiz", quizId, "progress")}
              className={`text-xs px-2 py-1 rounded border ${getStatus("quiz", quizId) === "progress" ? "border-amber-400 text-amber-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              Đang làm
            </button>
            <button
              onClick={() => onSetStatus("quiz", quizId, "done")}
              className={`text-xs px-2 py-1 rounded border ${getStatus("quiz", quizId) === "done" ? "border-emerald-500 text-emerald-700" : "border-gray-200 text-gray-500 hover:border-gray-300"}`}
            >
              Hoàn thành
            </button>
          </div>
          {quiz.options && quiz.options.length > 0 && (
            <div className="space-y-2">
              {quiz.options.map((option, index) => {
                const isCorrect = option.label === quiz.correctAnswer;
                const isSelected = selectedAnswer === option.label;

                return (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(option.label)}
                    className={`w-full p-3 text-left rounded-lg border-2 transition-all duration-200 ${
                      showExplanation
                        ? isCorrect
                          ? "border-green-500 bg-green-50"
                          : isSelected
                            ? "border-red-500 bg-red-50"
                            : "border-gray-200 bg-gray-50"
                        : "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          showExplanation
                            ? isCorrect
                              ? "border-green-500 bg-green-500 text-white"
                              : isSelected
                                ? "border-red-500 bg-red-500 text-white"
                                : "border-gray-300 text-gray-600"
                            : "border-gray-300 text-gray-600"
                        }`}
                      >
                        {option.label}
                      </span>
                      <span className="text-gray-900">{option.option}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {showExplanation && quiz.explanation && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <span className="text-blue-500 text-sm">💡</span>
                <p className="text-sm text-gray-700">{quiz.explanation}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
