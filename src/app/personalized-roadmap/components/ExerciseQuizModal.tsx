"use client";

import { useState, useEffect } from "react";
import { X, CheckCircle2, XCircle, ChevronRight, Trophy, Loader2 } from "lucide-react";

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface ExerciseQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  weakPointTitle: string;
  difficulty?: "Dễ" | "Trung bình" | "Khó";
}

export function ExerciseQuizModal({
  isOpen,
  onClose,
  weakPointTitle,
}: ExerciseQuizModalProps) {
  const [isGenerating, setIsGenerating] = useState(true);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      // Reset state
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setCorrectCount(0);
      setIsCompleted(false);
      setIsGenerating(true);

      // Simulate AI generating questions
      setTimeout(() => {
        const generatedQuestions = generateQuizQuestions(weakPointTitle);
        setQuestions(generatedQuestions);
        setIsGenerating(false);
      }, 1500);
    }
  }, [isOpen, weakPointTitle]);

  const currentQuestion = questions[currentQuestionIndex];
  const totalQuestions = questions.length;

  const handleSelectAnswer = (optionIndex: number) => {
    if (isAnswered) return;
    setSelectedAnswer(optionIndex);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null) return;
    
    setIsAnswered(true);
    if (selectedAnswer === currentQuestion.correctAnswer) {
      setCorrectCount(correctCount + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsCompleted(false);
    setIsGenerating(true);
    
    setTimeout(() => {
      const generatedQuestions = generateQuizQuestions(weakPointTitle);
      setQuestions(generatedQuestions);
      setIsGenerating(false);
    }, 1000);
  };

  const getScoreColor = () => {
    const percentage = (correctCount / totalQuestions) * 100;
    if (percentage >= 80) return "text-emerald-600 dark:text-emerald-400";
    if (percentage >= 60) return "text-amber-600 dark:text-amber-400";
    return "text-rose-600 dark:text-rose-400";
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-950 dark:text-white">
                Luyện tập: {weakPointTitle}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
            {isGenerating ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 className="w-12 h-12 text-accent animate-spin mb-4" />
                <p className="text-gray-600 dark:text-slate-400">
                  AI đang tạo câu hỏi cho bạn...
                </p>
              </div>
            ) : isCompleted ? (
              <div className="text-center py-8">
                <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-10 h-10 text-accent" />
                </div>
                <h3 className="text-2xl font-bold text-gray-950 dark:text-white mb-2">
                  Hoàn thành!
                </h3>
                <p className="text-lg mb-6">
                  Kết quả:{" "}
                  <span className={`font-bold ${getScoreColor()}`}>
                    {correctCount}/{totalQuestions}
                  </span>{" "}
                  câu đúng
                </p>

                <div className="space-y-3">
                  {(correctCount / totalQuestions) >= 0.8 ? (
                    <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40 rounded-lg">
                      <p className="text-sm text-emerald-800 dark:text-emerald-300">
                        🎉 Xuất sắc! Bạn đã nắm vững kiến thức này.
                      </p>
                    </div>
                  ) : (correctCount / totalQuestions) >= 0.6 ? (
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-lg">
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        👍 Tốt! Bạn có thể ôn lại một chút để đạt kết quả cao hơn.
                      </p>
                    </div>
                  ) : (
                    <div className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-lg">
                      <p className="text-sm text-rose-800 dark:text-rose-300">
                        💪 Cần cố gắng thêm! Hãy xem lại lý thuyết và thử lại.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={handleRestart}
                      className="px-6 py-2.5 bg-accent hover:bg-accent-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      Làm lại
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg font-semibold transition-colors"
                    >
                      Đóng
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                {/* Progress */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-sm font-semibold text-gray-600 dark:text-slate-400">
                    Câu {currentQuestionIndex + 1}/{totalQuestions}
                  </span>
                  <div className="flex gap-1.5">
                    {questions.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-8 h-1.5 rounded-full transition-colors ${
                          idx < currentQuestionIndex
                            ? "bg-accent"
                            : idx === currentQuestionIndex
                              ? "bg-accent/50"
                              : "bg-gray-200 dark:bg-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Question */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-950 dark:text-white mb-4">
                    {currentQuestion.question}
                  </h3>

                  {/* Options */}
                  <div className="space-y-3">
                    {currentQuestion.options.map((option, idx) => {
                      const isSelected = selectedAnswer === idx;
                      const isCorrect = idx === currentQuestion.correctAnswer;
                      const showResult = isAnswered;

                      return (
                        <button
                          key={idx}
                          onClick={() => handleSelectAnswer(idx)}
                          disabled={isAnswered}
                          className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                            showResult
                              ? isCorrect
                                ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500 dark:border-emerald-600"
                                : isSelected
                                  ? "bg-rose-50 dark:bg-rose-900/20 border-rose-500 dark:border-rose-600"
                                  : "border-gray-200 dark:border-slate-700 opacity-50"
                              : isSelected
                                ? "border-accent bg-accent/5 dark:bg-accent/10 shadow-sm"
                                : "border-gray-200 dark:border-slate-700 hover:border-accent/50 hover:bg-gray-50 dark:hover:bg-slate-900"
                          } ${isAnswered ? "cursor-not-allowed" : "cursor-pointer"}`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              showResult
                                ? isCorrect
                                  ? "bg-emerald-500 border-emerald-500"
                                  : isSelected
                                    ? "bg-rose-500 border-rose-500"
                                    : "border-gray-300 dark:border-slate-600"
                                : isSelected
                                  ? "bg-accent border-accent"
                                  : "border-gray-300 dark:border-slate-600"
                            }`}>
                              {showResult && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-white" />
                              )}
                              {showResult && !isCorrect && isSelected && (
                                <XCircle className="w-4 h-4 text-white" />
                              )}
                              {!showResult && isSelected && (
                                <div className="w-2.5 h-2.5 rounded-full bg-white" />
                              )}
                            </div>
                            <span className="flex-1 text-sm font-medium text-gray-900 dark:text-white">
                              {option}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Explanation (shown after answering) */}
                {isAnswered && (
                  <div className={`p-4 rounded-lg border ${
                    selectedAnswer === currentQuestion.correctAnswer
                      ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40"
                      : "bg-rose-50 dark:bg-rose-900/20 border-rose-200 dark:border-rose-800/40"
                  }`}>
                    <p className={`text-sm font-semibold mb-2 ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? "text-emerald-800 dark:text-emerald-300"
                        : "text-rose-800 dark:text-rose-300"
                    }`}>
                      {selectedAnswer === currentQuestion.correctAnswer
                        ? "✅ Chính xác!"
                        : "❌ Chưa đúng"}
                    </p>
                    <p className={`text-xs leading-relaxed ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? "text-emerald-700 dark:text-emerald-400"
                        : "text-rose-700 dark:text-rose-400"
                    }`}>
                      {currentQuestion.explanation}
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                  {!isAnswered ? (
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={selectedAnswer === null}
                      className="px-6 py-2.5 bg-accent hover:bg-accent-600 disabled:bg-gray-300 dark:disabled:bg-slate-700 disabled:cursor-not-allowed text-white rounded-lg font-semibold transition-colors"
                    >
                      Kiểm tra
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="inline-flex items-center gap-2 px-6 py-2.5 bg-accent hover:bg-accent-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      {currentQuestionIndex < totalQuestions - 1 ? "Câu tiếp theo" : "Xem kết quả"}
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

// Generate quiz questions based on weak point
function generateQuizQuestions(weakPoint: string): QuizQuestion[] {
  const questionTemplates: Record<string, QuizQuestion[]> = {
    "OOP & Class cơ bản": [
      {
        id: "q1",
        question: "Trong Java, từ khóa nào dùng để kế thừa từ một class khác?",
        options: ["implements", "extends", "inherits", "super"],
        correctAnswer: 1,
        explanation: "Từ khóa 'extends' được sử dụng để kế thừa từ một class cha. 'implements' dùng cho interface, còn 'super' dùng để gọi constructor/method của class cha.",
      },
      {
        id: "q2",
        question: "Tính đóng gói (Encapsulation) trong OOP đạt được bằng cách nào?",
        options: [
          "Sử dụng public cho tất cả thuộc tính",
          "Sử dụng private cho thuộc tính và public cho getter/setter",
          "Không sử dụng access modifier",
          "Sử dụng protected cho mọi thứ",
        ],
        correctAnswer: 1,
        explanation: "Encapsulation đạt được bằng cách khai báo thuộc tính private và cung cấp getter/setter public để kiểm soát truy cập dữ liệu.",
      },
      {
        id: "q3",
        question: "Constructor trong Java có đặc điểm gì?",
        options: [
          "Phải có kiểu trả về",
          "Tên phải giống tên class và không có kiểu trả về",
          "Chỉ được khai báo 1 lần",
          "Không thể có tham số",
        ],
        correctAnswer: 1,
        explanation: "Constructor phải có tên giống tên class và không có kiểu trả về (kể cả void). Java hỗ trợ constructor overloading nên có thể có nhiều constructor với tham số khác nhau.",
      },
    ],
    "Exception Handling": [
      {
        id: "q1",
        question: "Khối nào bắt buộc phải có trong try-catch-finally?",
        options: ["try", "catch", "finally", "Cả try và catch"],
        correctAnswer: 0,
        explanation: "Khối 'try' là bắt buộc. Bạn có thể có try-catch, try-finally, hoặc try-catch-finally, nhưng không thể có catch hoặc finally mà không có try.",
      },
      {
        id: "q2",
        question: "Checked Exception khác Unchecked Exception ở điểm nào?",
        options: [
          "Checked phải được xử lý hoặc throws, Unchecked không bắt buộc",
          "Không có sự khác biệt",
          "Unchecked phải xử lý, Checked không",
          "Checked chỉ dùng trong method main",
        ],
        correctAnswer: 0,
        explanation: "Checked Exception (như IOException) bắt buộc phải được xử lý bằng try-catch hoặc khai báo throws. Unchecked Exception (như NullPointerException) kế thừa từ RuntimeException và không bắt buộc.",
      },
      {
        id: "q3",
        question: "Khối finally sẽ được thực thi khi nào?",
        options: [
          "Chỉ khi không có exception",
          "Chỉ khi có exception",
          "Luôn luôn thực thi (trừ trường hợp System.exit)",
          "Không bao giờ thực thi",
        ],
        correctAnswer: 2,
        explanation: "Khối finally luôn được thực thi bất kể có exception hay không, trừ khi JVM bị dừng bằng System.exit() hoặc thread bị kill.",
      },
    ],
    default: [
      {
        id: "q1",
        question: `Câu hỏi về ${weakPoint}: Kiến thức cơ bản quan trọng nhất là gì?`,
        options: [
          "Hiểu rõ khái niệm và cách hoạt động",
          "Chỉ cần nhớ cú pháp",
          "Không cần hiểu, chỉ cần copy code",
          "Học thuộc lòng tất cả",
        ],
        correctAnswer: 0,
        explanation: `Để thành thạo ${weakPoint}, quan trọng nhất là hiểu rõ khái niệm và cách hoạt động. Từ đó bạn có thể áp dụng linh hoạt vào các tình huống khác nhau.`,
      },
      {
        id: "q2",
        question: `Khi gặp lỗi liên quan đến ${weakPoint}, bạn nên làm gì đầu tiên?`,
        options: [
          "Đọc thông báo lỗi và tìm hiểu nguyên nhân",
          "Copy lỗi lên Google",
          "Hỏi người khác ngay",
          "Bỏ qua và làm phần khác",
        ],
        correctAnswer: 0,
        explanation: "Việc đọc và hiểu thông báo lỗi giúp bạn phát triển kỹ năng debug. Sau đó mới search hoặc hỏi người khác khi cần.",
      },
      {
        id: "q3",
        question: `Cách tốt nhất để luyện tập ${weakPoint}?`,
        options: [
          "Làm nhiều bài tập thực hành",
          "Chỉ đọc lý thuyết",
          "Xem video hướng dẫn",
          "Học thuộc code mẫu",
        ],
        correctAnswer: 0,
        explanation: "Practice makes perfect! Làm nhiều bài tập giúp bạn ghi nhớ lâu hơn và hiểu sâu hơn so với chỉ đọc lý thuyết.",
      },
    ],
  };

  return questionTemplates[weakPoint] || questionTemplates.default;
}
