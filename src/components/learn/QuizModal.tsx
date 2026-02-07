"use client";

import { useState, useEffect } from "react";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizModalProps {
  questions: Question[];
  onClose: () => void;
}

export default function QuizModal({ questions, onClose }: QuizModalProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResult, setShowResult] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    if (showResult) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [showResult]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

  const handleAnswerSelect = (optionIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = optionIndex;
    setUserAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = () => {
    setShowResult(true);
  };

  const calculateScore = () => {
    let correct = 0;
    questions.forEach((q, index) => {
      if (userAnswers[index] === q.correctAnswer) {
        correct++;
      }
    });
    return {
      correct,
      total: questions.length,
      percentage: Math.round((correct / questions.length) * 100),
    };
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const answeredCount = userAnswers.filter((a) => a !== null).length;

  if (showResult) {
    const score = calculateScore();
    const isPassed = score.percentage >= 70;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          {/* Result Header */}
          <div className={`p-8 text-center ${isPassed ? "bg-gradient-to-r from-green-500 to-emerald-500" : "bg-gradient-to-r from-red-500 to-orange-500"} text-white rounded-t-xl`}>
            <div className="text-6xl mb-4">
              {isPassed ? "🎉" : "📚"}
            </div>
            <h2 className="text-3xl font-bold mb-2">
              {isPassed ? "Chúc mừng! Bạn đã vượt qua" : "Chưa đạt yêu cầu"}
            </h2>
            <p className="text-white/90">
              {isPassed 
                ? "Bạn đã hoàn thành xuất sắc bài kiểm tra này" 
                : "Hãy ôn tập thêm và thử lại nhé"}
            </p>
          </div>

          {/* Score Summary */}
          <div className="p-8">
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                  {score.percentage}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Điểm số</div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-1">
                  {score.correct}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Câu đúng</div>
              </div>
              <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4 text-center">
                <div className="text-3xl font-bold text-red-600 dark:text-red-400 mb-1">
                  {score.total - score.correct}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Câu sai</div>
              </div>
            </div>

            {/* Review Answers */}
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                Xem lại đáp án
              </h3>
              {questions.map((q, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="border border-gray-200 dark:border-slate-700 rounded-lg p-4"
                  >
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCorrect 
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400" 
                          : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                      }`}>
                        {isCorrect ? "✓" : "✗"}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 dark:text-white mb-3">
                          {index + 1}. {q.question}
                        </p>
                        <div className="space-y-2">
                          {q.options.map((option, optIndex) => {
                            const isUserAnswer = userAnswer === optIndex;
                            const isCorrectAnswer = q.correctAnswer === optIndex;

                            return (
                              <div
                                key={optIndex}
                                className={`p-3 rounded-lg border ${
                                  isCorrectAnswer
                                    ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                                    : isUserAnswer
                                    ? "border-red-500 bg-red-50 dark:bg-red-900/20"
                                    : "border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-700"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {isCorrectAnswer && (
                                    <span className="text-green-600 dark:text-green-400 font-medium">✓</span>
                                  )}
                                  {isUserAnswer && !isCorrectAnswer && (
                                    <span className="text-red-600 dark:text-red-400 font-medium">✗</span>
                                  )}
                                  <span className={`text-sm ${
                                    isCorrectAnswer || isUserAnswer
                                      ? "font-medium text-gray-900 dark:text-white"
                                      : "text-gray-700 dark:text-gray-300"
                                  }`}>
                                    {option}
                                  </span>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        {q.explanation && (
                          <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <p className="text-sm text-blue-900 dark:text-blue-100">
                              <span className="font-medium">💡 Giải thích: </span>
                              {q.explanation}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="mt-8 flex gap-4">
              <button
                onClick={onClose}
                className="flex-1 py-3 bg-accent hover:bg-accent-600 text-white font-semibold rounded-lg transition-colors"
              >
                Hoàn thành
              </button>
              {!isPassed && (
                <button
                  onClick={() => {
                    setCurrentQuestionIndex(0);
                    setUserAnswers(new Array(questions.length).fill(null));
                    setShowResult(false);
                    setTimeLeft(30 * 60);
                  }}
                  className="px-6 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Làm lại
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Câu hỏi {currentQuestionIndex + 1}/{questions.length}
            </h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="font-medium">{formatTime(timeLeft)}</span>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative">
            <div className="h-2 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              Đã trả lời: {answeredCount}/{questions.length}
            </div>
          </div>
        </div>

        {/* Question Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <p className="text-lg font-medium text-gray-900 dark:text-white mb-6">
              {currentQuestion.question}
            </p>

            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    userAnswers[currentQuestionIndex] === index
                      ? "border-accent bg-accent/5 dark:bg-accent/10"
                      : "border-gray-200 dark:border-slate-700 hover:border-accent/50 dark:hover:border-accent/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        userAnswers[currentQuestionIndex] === index
                          ? "border-accent bg-accent"
                          : "border-gray-300 dark:border-slate-600"
                      }`}
                    >
                      {userAnswers[currentQuestionIndex] === index && (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-gray-900 dark:text-white">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between gap-4">
            <button
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-2 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Trước
            </button>

            <div className="flex gap-2">
              {questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    index === currentQuestionIndex
                      ? "bg-accent text-white"
                      : userAnswers[index] !== null
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                      : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
              >
                Nộp bài
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-accent hover:bg-accent-600 text-white font-medium rounded-lg transition-colors"
              >
                Tiếp theo
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
