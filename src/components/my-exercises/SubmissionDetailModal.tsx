import { useEffect } from 'react';
import { X, CheckCircle, XCircle, Trophy, Target, Loader2 } from 'lucide-react';
import { useSubmissionById } from '@/hooks/useExerciseSubmissions';

interface SubmissionDetailModalProps {
  submissionId: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function SubmissionDetailModal({
  submissionId,
  isOpen,
  onClose
}: SubmissionDetailModalProps) {
  const { data: result, isLoading } = useSubmissionById(submissionId);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      window.addEventListener('keydown', handleEsc);
    }
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const scorePercentage = result 
    ? Math.round((result.totalScore / result.maxScore) * 100) 
    : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-blue-600 dark:text-blue-400';
    return 'text-rose-600 dark:text-rose-400';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
    if (percentage >= 50) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700';
    return 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700';
  };

  const getResultMessage = (percentage: number) => {
    if (percentage >= 80) return 'Xuất sắc! 🎉';
    if (percentage >= 50) return 'Khá tốt! 👍';
    return 'Cần cố gắng thêm! 💪';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-gray-900/10 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl my-8">
        {/* Modal Content */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 rounded-t-xl">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              Chi tiết bài làm
            </h2>
            <button
              onClick={onClose}
              className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 max-h-[calc(100vh-200px)] overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-blue-600 dark:text-blue-400 animate-spin" />
              </div>
            ) : !result ? (
              <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Không tìm thấy dữ liệu</p>
              </div>
            ) : (
              <>
                {/* Summary Section */}
                <div className={`rounded-lg p-6 mb-6 border-2 ${getScoreBgColor(scorePercentage)}`}>
                  <div className="text-center mb-4">
                    <Trophy className={`w-12 h-12 mx-auto mb-3 ${getScoreColor(scorePercentage)}`} />
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {getResultMessage(scorePercentage)}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    {/* Điểm số */}
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">Điểm số</span>
                      </div>
                      <p className={`text-xl font-bold ${getScoreColor(scorePercentage)}`}>
                        {result.totalScore}/{result.maxScore}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{scorePercentage}%</p>
                    </div>

                    {/* Số câu đúng */}
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">Câu đúng</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {result.correctCount}/{result.totalQuestions}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {Math.round((result.correctCount / result.totalQuestions) * 100)}% chính xác
                      </p>
                    </div>

                    {/* Số câu sai */}
                    <div className="bg-white dark:bg-slate-700 rounded-lg p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                        <span className="text-xs text-gray-600 dark:text-gray-300">Câu sai</span>
                      </div>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">
                        {result.totalQuestions - result.correctCount}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Cần xem lại</p>
                    </div>
                  </div>
                </div>

                {/* Questions List */}
                <div className="space-y-3">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Chi tiết từng câu hỏi
                  </h3>

                  {result.results.map((questionResult, index) => {
                    const isCorrect = questionResult.isCorrect;
                    const userSelectedIds = questionResult.userSelectedOptionIds || [];
                    const hasAnswer = userSelectedIds.length > 0;

                    return (
                      <div
                        key={questionResult.questionId}
                        className={`bg-white dark:bg-slate-800 rounded-lg p-4 border ${
                          isCorrect
                            ? 'border-green-200 dark:border-green-700 bg-green-50/20 dark:bg-green-900/10'
                            : hasAnswer
                            ? 'border-rose-200 dark:border-rose-700 bg-rose-50/20 dark:bg-rose-900/10'
                            : 'border-amber-200 dark:border-amber-700 bg-amber-50/20 dark:bg-amber-900/10'
                        }`}
                      >
                        {/* Question Header */}
                        <div className="flex items-start gap-3 mb-3">
                          <div
                            className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                              isCorrect
                                ? 'bg-green-500'
                                : hasAnswer
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                          >
                            {index + 1}
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white flex-1">
                                {questionResult.content}
                              </h4>

                              <div className="flex items-center gap-2 flex-shrink-0">
                                {hasAnswer ? (
                                  <span
                                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
                                      isCorrect
                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'
                                    }`}
                                  >
                                    {isCorrect ? (
                                      <>
                                        <CheckCircle className="w-3 h-3" />
                                        Đúng
                                      </>
                                    ) : (
                                      <>
                                        <XCircle className="w-3 h-3" />
                                        Sai
                                      </>
                                    )}
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                    Bỏ qua
                                  </span>
                                )}

                                <span className="text-xs font-bold text-gray-900 dark:text-white bg-gray-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                                  {questionResult.score}đ
                                </span>
                              </div>
                            </div>

                            {/* Options */}
                            <div className="space-y-1.5">
                              {questionResult.options
                                .sort((a, b) => a.orderIndex - b.orderIndex)
                                .map((option) => {
                                  const isUserSelected = userSelectedIds.includes(option.id);
                                  const isCorrectOption = option.isCorrect;

                                  let bgClass = 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600';
                                  let textClass = 'text-gray-700 dark:text-gray-300';
                                  let iconElement = null;

                                  if (isCorrectOption) {
                                    bgClass = 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
                                    textClass = 'text-green-900 dark:text-green-300 font-medium';
                                    iconElement = (
                                      <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                    );
                                  } else if (isUserSelected) {
                                    bgClass = 'bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-700';
                                    textClass = 'text-rose-900 dark:text-rose-300';
                                    iconElement = (
                                      <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                                    );
                                  }

                                  return (
                                    <div
                                      key={option.id}
                                      className={`flex items-center gap-2 p-2 rounded border ${bgClass}`}
                                    >
                                      {iconElement && <div className="flex-shrink-0">{iconElement}</div>}
                                      <p className={`text-sm flex-1 ${textClass}`}>{option.content}</p>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-6 py-4 rounded-b-xl">
            <button
              onClick={onClose}
              className="w-full px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
