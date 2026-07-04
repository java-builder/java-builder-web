"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useCreateExercise } from "@/hooks/useExercises";
import {
  ExerciseType,
  Difficulty,
  QuestionType,
  Question,
} from "@/types/exercise";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ExerciseQuestionBlock from "@/components/admin/exercises/ExerciseQuestionBlock";
import { ExerciseFormData } from "@/components/admin/exercises/QuestionOptionsField";
import {
  exerciseInputClassName,
  exercisePrimaryButtonClassName,
  exerciseSelectClassName,
} from "@/components/admin/exercises/constants";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Sparkles, Loader2, Wand2 } from "lucide-react";
import { chatbotApi } from "@/services/chatbot.service";
import toast from "react-hot-toast";

export default function CreateExercisePage() {
  const router = useRouter();
  const createExerciseMutation = useCreateExercise();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // AI Exercise Generation state
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [aiTopic, setAiTopic] = useState("");
  const [aiDifficulty, setAiDifficulty] = useState<Difficulty[]>([Difficulty.EASY]);
  const [aiNumQuestions, setAiNumQuestions] = useState<number | "">(5);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ExerciseFormData>({
    defaultValues: {
      title: "",
      description: "",
      exerciseType: ExerciseType.MULTIPLE_CHOICE,
      difficulty: Difficulty.EASY,
      timeLimit: 60,
      maxScore: 0,
      questions: [],
    },
  });

  const {
    fields: questions,
    append: addQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
  });

  const exerciseType = watch("exerciseType");
  const watchedQuestions = watch("questions");

  // Sync AI modal values with form fields when modal opens
  const formTitle = watch("title");
  const formDifficulty = watch("difficulty");

  useEffect(() => {
    if (isAiModalOpen) {
      setAiTopic(formTitle || "");
      setAiDifficulty(formDifficulty ? [formDifficulty] : [Difficulty.EASY]);
    }
  }, [isAiModalOpen, formTitle, formDifficulty]);

  const handleGenerateExerciseWithAi = async () => {
    if (!aiTopic.trim()) {
      toast.error("Vui lòng nhập chủ đề để AI soạn câu hỏi");
      return;
    }
    setIsAiGenerating(true);
    try {
      const res = await chatbotApi.generateExercise({
        topic: aiTopic,
        difficulty: aiDifficulty,
        questionType: "MULTIPLE_CHOICE",
        numQuestions: Number(aiNumQuestions) || 5,
      });

      if (res && res.data && res.data.questions) {
        const generatedQuestions: Question[] = res.data.questions.map((q, idx) => ({
          content: q.questionContent,
          questionType: q.questionType === "MULTIPLE_CHOICE" ? QuestionType.MULTIPLE_CHOICE : QuestionType.SINGLE_CHOICE,
          score: Number(q.point) || 10,
          orderIndex: idx + 1,
          options: q.options.map((opt, optIdx) => ({
            orderIndex: optIdx + 1,
            content: opt.optionContent,
            isCorrect: opt.isCorrect,
          })),
        }));

        if (res.data.exerciseTitle) {
          setValue("title", res.data.exerciseTitle);
        }
        if (res.data.exerciseDescription) {
          setValue("description", res.data.exerciseDescription);
        }
        setValue("questions", generatedQuestions);
        toast.success(`Đã tự động tạo thành công ${generatedQuestions.length} câu hỏi bằng AI!`);
        setIsAiModalOpen(false);
      } else {
        toast.error("Không nhận được dữ liệu từ AI. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("AI Generation error:", err);
      toast.error("Có lỗi xảy ra khi gọi AI tạo bài tập.");
    } finally {
      setIsAiGenerating(false);
    }
  };

  // Auto-calculate maxScore from sum of all question scores
  useEffect(() => {
    if (exerciseType === ExerciseType.MULTIPLE_CHOICE && watchedQuestions) {
      const totalScore = watchedQuestions.reduce((sum, question) => {
        return sum + (Number(question.score) || 0);
      }, 0);
      setValue("maxScore", totalScore);
    }
  }, [watchedQuestions, exerciseType, setValue]);

  const addNewQuestion = () => {
    const newQuestion: Question = {
      content: "",
      questionType: QuestionType.SINGLE_CHOICE,
      score: 10,
      orderIndex: questions.length + 1,
      options: [
        { orderIndex: 1, content: "", isCorrect: false },
        { orderIndex: 2, content: "", isCorrect: false },
        { orderIndex: 3, content: "", isCorrect: false },
        { orderIndex: 4, content: "", isCorrect: false },
      ],
    };
    addQuestion(newQuestion);
  };

  const onSubmit = async (data: ExerciseFormData) => {
    setIsSubmitting(true);
    try {
      const payload: ExerciseFormData = {
        ...data,
        questions: data.questions.map((question, questionIndex) => ({
          ...question,
          orderIndex: questionIndex + 1,
          options: question.options.map((option, optionIndex) => ({
            ...option,
            orderIndex: optionIndex + 1,
          })),
        })),
      };
      await createExerciseMutation.mutateAsync(payload);
      router.push("/admin/exercises");
    } catch (error) {
      console.error("Error creating exercise:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="h-10 w-10 rounded-xl"
          >
            <ChevronLeft className="h-5 w-5 text-foreground" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Tạo bài tập mới</h1>
            <p className="text-xs text-muted-foreground mt-0.5">Thêm bài tập thực hành mới vào kho bài tập của hệ thống</p>
          </div>
        </div>

        {exerciseType === ExerciseType.MULTIPLE_CHOICE && (
          <Button
            type="button"
            variant="accent"
            onClick={() => setIsAiModalOpen(true)}
            className="h-10 gap-1.5 rounded-xl font-bold shadow-xs hover:shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
            <span>Tự động tạo bằng AI</span>
          </Button>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-5">
          <h2 className="text-lg font-bold text-foreground border-b border-border pb-3">Thông tin cơ bản</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-2">Tiêu đề bài tập *</label>
              <input
                type="text"
                {...register("title", { required: "Tiêu đề không được để trống" })}
                className={exerciseInputClassName}
                placeholder="Ví dụ: Lập trình OOP cơ bản với Java..."
              />
              {errors.title && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.title.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-foreground mb-2">Mô tả *</label>
              <textarea
                {...register("description", { required: "Mô tả không được để trống" })}
                rows={4}
                className={exerciseInputClassName}
                placeholder="Nhập mô tả chi tiết yêu cầu bài tập..."
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Loại bài tập *</span>
                </div>
              </label>
              <div className="relative">
                <select {...register("exerciseType")} className={exerciseSelectClassName}>
                  <option value={ExerciseType.MULTIPLE_CHOICE}>Trắc nghiệm</option>
                  <option value={ExerciseType.ESSAY}>Tự luận</option>
                  <option value={ExerciseType.CODING}>Lập trình</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Độ khó *</span>
                </div>
              </label>
              <div className="relative">
                <select {...register("difficulty")} className={exerciseSelectClassName}>
                  <option value={Difficulty.EASY}>Dễ</option>
                  <option value={Difficulty.MEDIUM}>Trung bình</option>
                  <option value={Difficulty.HARD}>Khó</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Thời gian làm bài (phút) *</span>
                </div>
              </label>
              <input
                type="number"
                min="1"
                {...register("timeLimit", {
                  required: "Thời gian làm bài không được để trống",
                  min: { value: 1, message: "Thời gian phải lớn hơn 0" },
                })}
                className={exerciseInputClassName}
                placeholder="60"
              />
              {errors.timeLimit && (
                <p className="mt-1.5 text-xs text-red-500 font-semibold">{errors.timeLimit.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <span>Điểm tối đa</span>
                </div>
              </label>
              <div className="relative">
                <input
                  type="number"
                  {...register("maxScore")}
                  className={`${exerciseInputClassName} bg-muted cursor-not-allowed text-muted-foreground`}
                  placeholder="Tự động tính từ tổng điểm câu hỏi"
                  disabled
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                Tự động tính = tổng điểm của tất cả câu hỏi
              </p>
            </div>
          </div>
        </div>

        {exerciseType === ExerciseType.MULTIPLE_CHOICE && (
          <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h2 className="text-lg font-bold text-foreground">Câu hỏi trắc nghiệm</h2>
              <span className="text-xs font-semibold px-2.5 py-1 bg-accent/15 text-accent rounded-full select-none">
                Tổng số: {questions.length} câu hỏi
              </span>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground border border-dashed border-border rounded-2xl bg-muted/20 animate-in fade-in duration-300">
                <svg className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm font-semibold">Chưa có câu hỏi nào trong bài tập này</p>
                <p className="text-xs text-muted-foreground mt-1">Nhấn nút &quot;Thêm câu hỏi&quot; bên dưới để bắt đầu soạn câu hỏi.</p>
              </div>
            ) : (
              <div className="space-y-6 mb-4">
                {questions.map((question, questionIndex) => (
                  <ExerciseQuestionBlock
                    key={question.id}
                    questionIndex={questionIndex}
                    control={control}
                    register={register}
                    onRemove={() => removeQuestion(questionIndex)}
                  />
                ))}
              </div>
            )}

            <div className="flex justify-center pt-2">
              <button
                type="button"
                onClick={addNewQuestion}
                className={exercisePrimaryButtonClassName}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
                </svg>
                <span>Thêm câu hỏi</span>
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            className="px-6 py-2.5 rounded-xl border border-border text-foreground hover:bg-muted text-sm font-bold h-11"
          >
            Hủy
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            variant="accent"
            className="px-6 py-2.5 rounded-xl text-sm font-bold h-11"
          >
            {isSubmitting && <LoadingSpinner size="sm" />}
            <span>{isSubmitting ? "Đang tạo..." : "Tạo bài tập"}</span>
          </Button>
        </div>
      </form>

      {/* AI Exercise Generation Modal */}
      {isAiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200">
          <div className="bg-card w-full max-w-md rounded-2xl border border-border shadow-xl overflow-hidden transform transition-all animate-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="px-6 py-4 border-b border-border flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-accent/10">
                <Sparkles className="h-5 w-5 text-accent" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Tạo đề tự động bằng AI</h3>
                <p className="text-xs text-muted-foreground">Tạo nhanh câu hỏi trắc nghiệm bằng mô hình AI</p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                  Chủ đề bài học / Nội dung thi *
                </label>
                <input
                  type="text"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  placeholder="Ví dụ: Kế thừa và Đa hình trong Java..."
                  className={exerciseInputClassName}
                />
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                    Độ khó (chọn 1 hoặc nhiều)
                  </label>
                  <div className="flex items-center gap-5 mt-1 bg-muted/30 p-3 rounded-xl border border-border/60">
                    {[Difficulty.EASY, Difficulty.MEDIUM, Difficulty.HARD].map((diff) => {
                      const isChecked = aiDifficulty.includes(diff);
                      const label = diff === Difficulty.EASY ? "Dễ" : diff === Difficulty.MEDIUM ? "Trung bình" : "Khó";
                      return (
                        <label
                          key={diff}
                          className="flex items-center space-x-2 text-sm font-semibold text-foreground cursor-pointer select-none group"
                        >
                          <input
                            type="checkbox"
                            checked={isChecked}
                            className="h-4.5 w-4.5 rounded border-border text-accent focus:ring-accent/20 cursor-pointer accent-accent"
                            onChange={() => {
                              if (isChecked) {
                                if (aiDifficulty.length > 1) {
                                  setAiDifficulty(aiDifficulty.filter((d) => d !== diff));
                                } else {
                                  toast.error("Vui lòng chọn ít nhất một độ khó");
                                }
                              } else {
                                setAiDifficulty([...aiDifficulty, diff]);
                              }
                            }}
                          />
                          <span className="text-sm font-medium text-foreground/90 group-hover:text-foreground transition-colors">{label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
                    Số lượng câu hỏi cần AI tạo
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={aiNumQuestions}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        setAiNumQuestions("");
                      } else {
                        const parsed = parseInt(val);
                        if (!isNaN(parsed)) {
                          setAiNumQuestions(Math.min(50, Math.max(1, parsed)));
                        }
                      }
                    }}
                    className={exerciseInputClassName}
                  />
                </div>
              </div>

              <div className="bg-muted/40 border border-border p-3.5 rounded-xl text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground block mb-1">💡 Lưu ý:</span>
                Sau khi AI hoàn thành, danh sách câu hỏi trắc nghiệm sẽ tự động được điền vào form thiết kế bên ngoài. Bạn vẫn có thể chỉnh sửa lại nội dung, đáp án tùy ý trước khi bấm lưu.
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-muted/30 border-t border-border flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsAiModalOpen(false)}
                disabled={isAiGenerating}
                className="h-10 rounded-xl"
              >
                Hủy
              </Button>
              <Button
                type="button"
                variant="accent"
                onClick={handleGenerateExerciseWithAi}
                disabled={isAiGenerating}
                className="h-10 gap-1.5 rounded-xl font-bold min-w-32"
              >
                {isAiGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Đang soạn đề...</span>
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4" />
                    <span>Soạn đề ngay</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
