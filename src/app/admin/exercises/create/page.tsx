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
} from "@/components/admin/exercises/constants";

export default function CreateExercisePage() {
  const router = useRouter();
  const createExerciseMutation = useCreateExercise();
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Tạo bài tập mới</h1>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Thông tin cơ bản</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Tiêu đề bài tập *</label>
              <input
                type="text"
                {...register("title", { required: "Tiêu đề không được để trống" })}
                className={exerciseInputClassName}
                placeholder="Nhập tiêu đề bài tập..."
              />
              {errors.title && (
                <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả *</label>
              <textarea
                {...register("description", { required: "Mô tả không được để trống" })}
                rows={4}
                className={exerciseInputClassName}
                placeholder="Nhập mô tả bài tập..."
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <span>Loại bài tập *</span>
                </div>
              </label>
              <div className="relative">
                <select {...register("exerciseType")} className={exerciseInputClassName}>
                  <option value={ExerciseType.MULTIPLE_CHOICE}>Trắc nghiệm</option>
                  <option value={ExerciseType.ESSAY}>Tự luận</option>
                  <option value={ExerciseType.CODING}>Lập trình</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  <span>Độ khó *</span>
                </div>
              </label>
              <div className="relative">
                <select {...register("difficulty")} className={exerciseInputClassName}>
                  <option value={Difficulty.EASY}>Dễ</option>
                  <option value={Difficulty.MEDIUM}>Trung bình</option>
                  <option value={Difficulty.HARD}>Khó</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <div className="flex items-center space-x-2">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Thời gian làm bài (phút) *</span>
                </div>
              </label>
              <div className="relative">
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
              </div>
              {errors.timeLimit && (
                <p className="mt-1 text-sm text-red-600">{errors.timeLimit.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  className={`${exerciseInputClassName} bg-gray-50 cursor-not-allowed`}
                  placeholder="Tự động tính từ tổng điểm câu hỏi"
                  disabled
                  readOnly
                />
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
              <p className="mt-1 text-xs text-gray-500">
                Tự động tính = tổng điểm của tất cả câu hỏi
              </p>
            </div>
          </div>
        </div>

        {exerciseType === ExerciseType.MULTIPLE_CHOICE && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Câu hỏi</h2>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-8 text-gray-500 mb-4">
                <p>Chưa có câu hỏi nào. Nhấn &quot;Thêm câu hỏi&quot; để bắt đầu.</p>
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

            <div className="flex justify-center">
              <button type="button" onClick={addNewQuestion} className={exercisePrimaryButtonClassName}>
                + Thêm câu hỏi
              </button>
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting && <LoadingSpinner size="sm" />}
            <span>{isSubmitting ? "Đang tạo..." : "Tạo bài tập"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
