import { ExerciseSubmissionResponse, QuestionResultResponse } from '@/types/submission';
import { ExerciseDetailResponse } from '@/types/exercise';
import { CheckCircle2, XCircle, Trophy, Clock, Target } from 'lucide-react';
import PublicMarkdownRenderer from '@/components/blogs/PublicMarkdownRenderer';
import { Button } from '@/components/ui/button';

interface ExerciseResultScreenProps {
  exercise: ExerciseDetailResponse;
  result: ExerciseSubmissionResponse;
  onExit: () => void;
}

export default function ExerciseResultScreen({
  exercise,
  result,
  onExit,
}: ExerciseResultScreenProps) {
  const scorePercentage =
    result.maxScore > 0 ? Math.round(((result.totalScore || 0) / result.maxScore) * 100) : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-success';
    if (percentage >= 50) return 'text-warning';
    return 'text-error';
  };

  const getResultMessage = (percentage: number) => {
    if (percentage >= 80) return 'Xuất sắc! Bạn nắm rất vững kiến thức';
    if (percentage >= 50) return 'Khá tốt! Hãy ôn lại các câu chưa chính xác';
    return 'Cần cố gắng thêm! Hãy xem kỹ giải thích bên dưới';
  };

  const getQuestionResult = (questionId: string): QuestionResultResponse | undefined => {
    return result.results?.find((r) => r.questionId === questionId);
  };

  const getOptionLabel = (questionId: string, optionId: string): string => {
    const question = exercise.questions.find((q) => q.id === questionId);
    const option = question?.options.find((o) => o.id === optionId);
    return option?.content || '';
  };

  const scrollToQuestion = (index: number) => {
    const el = document.getElementById(`result-question-${index}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const renderNavigatorCard = () => (
    <div className="bg-surface rounded-2xl border border-border p-5 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <h3 className="text-sm font-bold text-foreground">
          Tổng quan câu hỏi
        </h3>
        <span className="text-xs font-semibold text-text-secondary">
          Đúng {result.correctCount}/{result.totalQuestions}
        </span>
      </div>

      <div className="grid grid-cols-5 gap-2">
        {exercise.questions.map((q, idx) => {
          const qr = getQuestionResult(q.id);
          const isCorrect = qr?.isCorrect || false;
          return (
            <button
              key={q.id}
              type="button"
              onClick={() => scrollToQuestion(idx)}
              className={`h-9 rounded-lg border font-semibold text-xs transition-colors cursor-pointer ${
                isCorrect
                  ? 'bg-success-soft text-success border-success/30'
                  : 'bg-error-soft text-error border-error/30'
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      <div className="pt-3 border-t border-border flex items-center gap-4 text-xs font-medium text-text-secondary">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-success-soft border border-success/30" />
          <span>Trả lời đúng</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded bg-error-soft border border-error/30" />
          <span>Trả lời sai</span>
        </div>
      </div>

      <Button
        type="button"
        size="lg"
        onClick={onExit}
        className="w-full mt-2"
      >
        Quay lại danh sách bài tập
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background py-5 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6 items-start">
          {/* Left Column: Summary Banner + Detailed Review (2 cols) */}
          <div className="lg:col-span-2 space-y-5 sm:space-y-6">
            {/* Summary Card */}
            <div className="bg-surface rounded-2xl border border-border overflow-hidden shadow-xs">
              <div className="p-5 sm:p-8 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary-soft text-primary border border-primary/20 mb-2">
                    <Trophy className="w-3.5 h-3.5" />
                    Kết quả bài làm
                  </div>
                  <h1 className="text-lg sm:text-2xl font-bold text-foreground tracking-tight">
                    {getResultMessage(scorePercentage)}
                  </h1>
                  <p className="text-sm text-text-secondary mt-1">{exercise.title}</p>
                </div>

                <div className="flex items-baseline gap-1.5 shrink-0">
                  <span
                    className={`text-3xl sm:text-4xl font-extrabold ${getScoreColor(
                      scorePercentage
                    )}`}
                  >
                    {scorePercentage}%
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-border bg-muted/25">
                <div className="p-3.5 sm:p-5">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-text-muted mb-1">
                    <Target className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">Điểm số</span>
                  </div>
                  <div
                    className={`text-base sm:text-2xl font-bold ${getScoreColor(
                      scorePercentage
                    )}`}
                  >
                    {result.totalScore}/{result.maxScore}
                  </div>
                </div>

                <div className="p-3.5 sm:p-5">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-text-muted mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-success shrink-0" />
                    <span className="truncate">Số câu đúng</span>
                  </div>
                  <div className="text-base sm:text-2xl font-bold text-foreground">
                    {result.correctCount}/{result.totalQuestions}
                  </div>
                </div>

                <div className="p-3.5 sm:p-5">
                  <div className="flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-text-muted mb-1">
                    <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">Thời gian</span>
                  </div>
                  <div className="text-base sm:text-2xl font-bold text-foreground">
                    {exercise.timeLimit}{' '}
                    <span className="text-xs sm:text-sm font-medium text-text-secondary">
                      phút
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Question Result Navigator (< lg) */}
            <div className="lg:hidden">{renderNavigatorCard()}</div>

            {/* Detailed Question Review */}
            <div className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Chi tiết bài làm
              </h2>

              {exercise.questions.map((question, index) => {
                const questionResult = getQuestionResult(question.id);
                const isCorrect = questionResult?.isCorrect || false;
                const userSelectedIds = questionResult?.userSelectedOptionIds || [];
                const correctIds = questionResult?.correctOptionIds || [];

                return (
                  <div
                    key={question.id}
                    id={`result-question-${index}`}
                    className="bg-surface rounded-2xl border border-border p-4 sm:p-6 shadow-2xs scroll-mt-24"
                  >
                    {/* Question Header */}
                    <div className="flex items-center justify-between gap-3 mb-3.5 pb-3 border-b border-border">
                      <div className="flex items-center gap-2">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-xs font-bold ${
                            isCorrect
                              ? 'bg-success-soft text-success'
                              : 'bg-error-soft text-error'
                          }`}
                        >
                          {isCorrect ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : (
                            <XCircle className="w-3.5 h-3.5" />
                          )}
                          Câu {index + 1}
                        </span>
                      </div>

                      <span
                        className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${
                          isCorrect
                            ? 'bg-success-soft text-success'
                            : 'bg-error-soft text-error'
                        }`}
                      >
                        {isCorrect ? `+${questionResult?.score || 0}` : '0'} điểm
                      </span>
                    </div>

                    {/* Question Content */}
                    <div className="text-foreground mb-4">
                      <PublicMarkdownRenderer
                        content={question.content}
                        className="prose prose-slate dark:prose-invert max-w-none text-foreground [&>p]:font-semibold [&>p]:my-1.5"
                      />
                    </div>

                    {/* Options */}
                    <div className="space-y-2.5">
                      {question.options.map((option) => {
                        const isUserSelected = userSelectedIds.includes(option.id);
                        const isCorrectOption = correctIds.includes(option.id);
                        const hasCodeBlock = option.content.includes('```');

                        let optionClass =
                          'bg-background/40 border-border text-text-secondary';
                        if (isCorrectOption) {
                          optionClass =
                            'bg-success-soft/50 border-success/40 text-foreground';
                        } else if (isUserSelected && !isCorrectOption) {
                          optionClass =
                            'bg-error-soft/50 border-error/40 text-foreground';
                        }

                        return (
                          <div
                            key={option.id}
                            className={`p-3.5 rounded-xl border ${optionClass}`}
                          >
                            <div className={`flex ${hasCodeBlock ? 'items-start' : 'items-center'} gap-2.5`}>
                              {isCorrectOption ? (
                                <CheckCircle2 className={`w-4 h-4 text-success shrink-0 ${hasCodeBlock ? 'mt-1.5' : ''}`} />
                              ) : isUserSelected ? (
                                <XCircle className={`w-4 h-4 text-error shrink-0 ${hasCodeBlock ? 'mt-1.5' : ''}`} />
                              ) : (
                                <span className="w-4 h-4 shrink-0" />
                              )}
                              <div className="text-sm flex-1 min-w-0">
                                <PublicMarkdownRenderer
                                  content={option.content}
                                  className={`prose prose-slate dark:prose-invert max-w-none ${
                                    hasCodeBlock
                                      ? '[&>div]:my-0'
                                      : '[&>p]:mb-0 [&>p]:inline'
                                  }`}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Correct Answer Summary if wrong */}
                    {!isCorrect && (
                      <div className="mt-3.5 p-3 bg-muted/50 border border-border rounded-xl text-xs sm:text-sm text-text-secondary">
                        <span className="font-semibold text-foreground">
                          Đáp án đúng:{' '}
                        </span>
                        {correctIds
                          .map((id) => getOptionLabel(question.id, id))
                          .join(', ')}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Sticky Question Result Navigator & Actions (Desktop) */}
          <div className="hidden lg:block lg:col-span-1 lg:sticky lg:top-20">
            {renderNavigatorCard()}
          </div>
        </div>
      </div>
    </div>
  );
}
