import {
  Clock,
  Trophy,
  CheckCircle2,
  ArrowRight,
  FileQuestion,
  Flag,
  Sparkles,
  Timer,
  ListChecks,
  ShieldCheck,
} from 'lucide-react';
import {
  ExerciseDetailResponse,
  Difficulty,
  ExerciseType,
  QuestionType,
} from '@/types/exercise';
import { Button } from '@/components/ui/button';

interface ExerciseStartScreenProps {
  exercise: ExerciseDetailResponse;
  onStart: () => void;
  onExit: () => void;
  getDifficultyColor: (difficulty: Difficulty) => string;
  getDifficultyLabel: (difficulty: Difficulty) => string;
  getExerciseTypeLabel: (type: ExerciseType) => string;
}

export default function ExerciseStartScreen({
  exercise,
  onStart,
  onExit,
  getDifficultyColor,
  getDifficultyLabel,
  getExerciseTypeLabel,
}: ExerciseStartScreenProps) {
  const totalQuestions = exercise.questions.length;
  const singleChoiceCount = exercise.questions.filter(
    (q) => q.questionType === QuestionType.SINGLE_CHOICE
  ).length;
  const multiChoiceCount = exercise.questions.filter(
    (q) => q.questionType === QuestionType.MULTIPLE_CHOICE
  ).length;
  const avgMinutesPerQuestion =
    totalQuestions > 0
      ? Number((exercise.timeLimit / totalQuestions).toFixed(1))
      : 0;

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-background py-5 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
          {/* Left Column: Main Overview & Structure (2 cols) */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* Hero Overview Card */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
              <div className="p-5 sm:p-8 border-b border-border">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold border ${getDifficultyColor(
                      exercise.difficulty
                    )}`}
                  >
                    {getDifficultyLabel(exercise.difficulty)}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-primary-soft text-primary border border-primary/20">
                    {getExerciseTypeLabel(exercise.exerciseType)}
                  </span>
                </div>

                <h1 className="text-xl sm:text-3xl font-bold text-foreground tracking-tight">
                  {exercise.title}
                </h1>

                {exercise.description && (
                  <p className="text-sm sm:text-base text-text-secondary mt-2.5 sm:mt-3 leading-relaxed">
                    {exercise.description}
                  </p>
                )}
              </div>

              {/* KPI Strip - Sleek 3-col on both Mobile & Desktop */}
              <div className="grid grid-cols-3 divide-x divide-border bg-muted/25">
                <div className="p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-surface border border-border flex items-center justify-center text-primary shrink-0 shadow-2xs">
                    <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-2xl font-bold text-foreground leading-none">
                      {exercise.timeLimit}{' '}
                      <span className="text-xs sm:text-sm font-medium text-text-secondary">
                        phút
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-text-muted mt-1 sm:mt-1.5 truncate">
                      Thời gian làm bài
                    </div>
                  </div>
                </div>

                <div className="p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-surface border border-border flex items-center justify-center text-primary shrink-0 shadow-2xs">
                    <FileQuestion className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-2xl font-bold text-foreground leading-none">
                      {totalQuestions}{' '}
                      <span className="text-xs sm:text-sm font-medium text-text-secondary">
                        câu
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-text-muted mt-1 sm:mt-1.5 truncate">
                      Tổng số câu hỏi
                    </div>
                  </div>
                </div>

                <div className="p-3.5 sm:p-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-lg sm:rounded-xl bg-surface border border-border flex items-center justify-center text-primary shrink-0 shadow-2xs">
                    <Trophy className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-base sm:text-2xl font-bold text-foreground leading-none">
                      {exercise.maxScore}{' '}
                      <span className="text-xs sm:text-sm font-medium text-text-secondary">
                        điểm
                      </span>
                    </div>
                    <div className="text-[11px] sm:text-xs text-text-muted mt-1 sm:mt-1.5 truncate">
                      Điểm số tối đa
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Quick CTA Bar (Above the fold on < lg) */}
              <div className="lg:hidden p-4 sm:p-5 border-t border-border bg-surface flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5">
                <Button
                  type="button"
                  size="lg"
                  onClick={onStart}
                  className="flex-1 gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Bắt đầu làm bài
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={onExit}
                  className="sm:w-auto"
                >
                  Quay lại danh sách
                </Button>
              </div>
            </div>

            {/* Structure & Rules Card */}
            <div className="bg-surface rounded-2xl border border-border p-5 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-foreground mb-3.5 sm:mb-4">
                  Cấu trúc đề & Hướng dẫn làm bài
                </h2>

                {/* Question Type Breakdown */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-5 sm:mb-6">
                  <div className="p-3 sm:p-4 rounded-xl bg-background border border-border">
                    <div className="text-[11px] sm:text-xs text-text-muted mb-1 truncate">
                      Chọn 1 đáp án
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-foreground">
                      {singleChoiceCount} câu
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-background border border-border">
                    <div className="text-[11px] sm:text-xs text-text-muted mb-1 truncate">
                      Chọn nhiều đáp án
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-foreground">
                      {multiChoiceCount} câu
                    </div>
                  </div>
                  <div className="p-3 sm:p-4 rounded-xl bg-background border border-border">
                    <div className="text-[11px] sm:text-xs text-text-muted mb-1 truncate">
                      Phân bổ TB
                    </div>
                    <div className="text-sm sm:text-lg font-bold text-foreground">
                      ~{avgMinutesPerQuestion}p/câu
                    </div>
                  </div>
                </div>

                {/* 2x2 Guidelines Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-muted/25 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Timer className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Tính giờ tự động
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        Đồng hồ đếm ngược {exercise.timeLimit} phút ngay khi bắt đầu và tự động nộp khi hết giờ.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-muted/25 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Flag className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Đánh dấu câu hỏi
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        Dễ dàng gắn cờ các câu hỏi còn phân vân để rà soát lại trên bảng điều hướng.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-muted/25 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <ListChecks className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Nộp bài chủ động
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        Bạn có thể nộp bài sớm bất cứ lúc nào sau khi đã hoàn thành các câu hỏi.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3.5 sm:p-4 rounded-xl bg-muted/25 border border-border">
                    <div className="w-8 h-8 rounded-lg bg-primary-soft text-primary flex items-center justify-center shrink-0 mt-0.5">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-foreground">
                        Kết quả & Đáp án chi tiết
                      </div>
                      <p className="text-xs text-text-secondary mt-1 leading-relaxed">
                        Hệ thống chấm điểm tức thì và hiển thị chi tiết đáp án đúng cho từng câu.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Assessment Summary & Action Card (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-20">
            <div className="bg-surface rounded-2xl border border-border p-6 shadow-xs space-y-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary mb-1.5">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Thông tin bài kiểm tra</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Sẵn sàng làm bài?
                </h3>
                <p className="text-xs text-text-secondary mt-1">
                  Kiểm tra lại thông số trước khi bắt đầu tính giờ
                </p>
              </div>

              <div className="divide-y divide-border border-y border-border text-sm">
                <div className="py-3 flex items-center justify-between">
                  <span className="text-text-secondary">Hình thức</span>
                  <span className="font-semibold text-foreground">
                    {getExerciseTypeLabel(exercise.exerciseType)}
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="text-text-secondary">Độ khó</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${getDifficultyColor(
                      exercise.difficulty
                    )}`}
                  >
                    {getDifficultyLabel(exercise.difficulty)}
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="text-text-secondary">Số lượng câu hỏi</span>
                  <span className="font-semibold text-foreground">
                    {totalQuestions} câu
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="text-text-secondary">Thời gian làm bài</span>
                  <span className="font-semibold text-foreground">
                    {exercise.timeLimit} phút
                  </span>
                </div>
                <div className="py-3 flex items-center justify-between">
                  <span className="text-text-secondary">Điểm tối đa</span>
                  <span className="font-bold text-primary">
                    {exercise.maxScore} điểm
                  </span>
                </div>
              </div>

              <div className="space-y-2.5 pt-1">
                <Button
                  type="button"
                  size="lg"
                  onClick={onStart}
                  className="w-full gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Bắt đầu làm bài
                  <ArrowRight className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={onExit}
                  className="w-full"
                >
                  Quay lại danh sách
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
