import { ExerciseSubmissionResponse, QuestionResultResponse } from '@/types/submission';
import { ExerciseDetailResponse } from '@/types/exercise';
import { CheckCircle, XCircle, Trophy, Clock, Target } from 'lucide-react';
import PublicMarkdownRenderer from '@/components/blogs/PublicMarkdownRenderer';

interface ExerciseResultScreenProps {
  exercise: ExerciseDetailResponse;
  result: ExerciseSubmissionResponse;
  onExit: () => void;
}

export default function ExerciseResultScreen({
  exercise,
  result,
  onExit
}: ExerciseResultScreenProps) {
  const scorePercentage = result.maxScore > 0 
    ? Math.round(((result.totalScore || 0) / result.maxScore) * 100) 
    : 0;

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600 dark:text-green-400';
    if (percentage >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700';
    if (percentage >= 50) return 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-700';
    return 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-700';
  };

  const getResultMessage = (percentage: number) => {
    if (percentage >= 80) return 'Xuất sắc! 🎉';
    if (percentage >= 50) return 'Khá tốt! 👍';
    return 'Cần cố gắng thêm! 💪';
  };

  const getQuestionResult = (questionId: string): QuestionResultResponse | undefined => {
    return result.results?.find(r => r.questionId === questionId);
  };

  const getOptionLabel = (questionId: string, optionId: string): string => {
    const question = exercise.questions.find(q => q.id === questionId);
    const option = question?.options.find(o => o.id === optionId);
    return option?.content || '';
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header - Kết quả tổng quan */}
        <div className={`bg-white dark:bg-slate-800 rounded-lg shadow-md p-8 mb-6 border-2 ${getScoreBgColor(scorePercentage)}`}>
          <div className="text-center mb-6">
            <Trophy className={`w-16 h-16 mx-auto mb-4 ${getScoreColor(scorePercentage)}`} />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {getResultMessage(scorePercentage)}
            </h1>
            <p className="text-gray-600 dark:text-gray-300">{exercise.title}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Điểm số */}
            <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Điểm số</span>
              </div>
              <p className={`text-2xl font-bold ${getScoreColor(scorePercentage)}`}>
                {result.totalScore}/{result.maxScore}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{scorePercentage}%</p>
            </div>

            {/* Số câu đúng */}
            <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Câu đúng</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {result.correctCount}/{result.totalQuestions}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {result.totalQuestions && result.correctCount 
                  ? Math.round((result.correctCount / result.totalQuestions) * 100)
                  : 0}% chính xác
              </p>
            </div>

            {/* Thời gian */}
            <div className="bg-white dark:bg-slate-700 rounded-lg p-4 border border-gray-200 dark:border-slate-600">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm text-gray-600 dark:text-gray-300">Thời gian</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {exercise.timeLimit} phút
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Giới hạn</p>
            </div>
          </div>
        </div>

        {/* Chi tiết từng câu hỏi */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Chi tiết bài làm</h2>
          
          {exercise.questions.map((question, index) => {
            const questionResult = getQuestionResult(question.id);
            const isCorrect = questionResult?.isCorrect || false;
            const userSelectedIds = questionResult?.userSelectedOptionIds || [];
            const correctIds = questionResult?.correctOptionIds || [];

            return (
              <div
                key={question.id}
                className={`bg-white dark:bg-slate-800 rounded-lg shadow-sm p-6 border-2 ${
                  isCorrect ? 'border-green-200 dark:border-green-700' : 'border-red-200 dark:border-red-700'
                }`}
              >
                {/* Question header */}
                <div className="flex items-start gap-3 mb-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                  }`}>
                    {isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">
                        Câu {index + 1}
                      </h3>
                      <span className={`text-sm font-medium ${
                        isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {isCorrect ? `+${questionResult?.score || 0}` : '0'} điểm
                      </span>
                    </div>
                    <div className="text-gray-700 dark:text-gray-300 mb-4">
                      <PublicMarkdownRenderer content={question.content} className="prose-sm sm:prose max-w-none text-gray-700 dark:text-gray-300 [&>p]:my-1" />
                    </div>

                    {/* Options */}
                    <div className="space-y-2">
                      {question.options.map((option) => {
                        const isUserSelected = userSelectedIds.includes(option.id);
                        const isCorrectOption = correctIds.includes(option.id);
                        
                        let optionClass = 'bg-gray-50 dark:bg-slate-700 border-gray-200 dark:border-slate-600';
                        if (isCorrectOption) {
                          optionClass = 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700';
                        } else if (isUserSelected && !isCorrectOption) {
                          optionClass = 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700';
                        }

                        return (
                          <div
                            key={option.id}
                            className={`p-3 rounded-lg border-2 ${optionClass}`}
                          >
                            <div className="flex items-center gap-2">
                              {isCorrectOption && (
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0" />
                              )}
                              {isUserSelected && !isCorrectOption && (
                                <XCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                              )}
                              <div className={`text-sm flex-1 min-w-0 ${
                                isCorrectOption ? 'text-green-900 dark:text-green-300 font-medium' : 
                                isUserSelected ? 'text-red-900 dark:text-red-300' : 'text-gray-700 dark:text-gray-300'
                              }`}>
                                <PublicMarkdownRenderer content={option.content} className="prose-sm sm:prose max-w-none [&>p]:mb-0 [&>p]:inline" />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Explanation */}
                    {!isCorrect && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg">
                        <p className="text-sm text-blue-900 dark:text-blue-300">
                          <span className="font-medium">Đáp án đúng: </span>
                          {correctIds.map(id => getOptionLabel(question.id, id)).join(', ')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-center gap-4">
          <button
            onClick={onExit}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Quay lại danh sách
          </button>
        </div>
      </div>
    </div>
  );
}
