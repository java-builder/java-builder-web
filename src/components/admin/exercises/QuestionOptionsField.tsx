"use client";

import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
import { CreateExerciseRequest } from "@/types/exercise";
import { exerciseInputClassName } from "./constants";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export type ExerciseFormData = CreateExerciseRequest;

interface QuestionOptionsFieldProps {
  questionIndex: number;
  control: Control<ExerciseFormData>;
  register: UseFormRegister<ExerciseFormData>;
  minOptions?: number;
}

export default function QuestionOptionsField({
  questionIndex,
  control,
  register,
  minOptions = 2,
}: QuestionOptionsFieldProps) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.options`,
  });

  const handleAddOption = () => {
    append({
      orderIndex: fields.length + 1,
      content: "",
      isCorrect: false,
    });
  };

  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex justify-between items-center mb-4">
        <label className="flex items-center space-x-2 text-sm font-bold text-foreground">
          <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
          </svg>
          <span>Các lựa chọn</span>
        </label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={handleAddOption}
          className="gap-1 text-accent hover:text-accent font-semibold h-8"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>Thêm lựa chọn</span>
        </Button>
      </div>

      <div className="space-y-3">
        {fields.map((field, optionIndex) => (
          <div key={field.id} className="flex items-center gap-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-center w-8 h-8 bg-muted rounded-xl text-muted-foreground font-semibold text-xs shrink-0 select-none">
              {String.fromCharCode(65 + optionIndex)}
            </div>
            <div className="relative flex-1">
              <input
                type="text"
                {...register(`questions.${questionIndex}.options.${optionIndex}.content`)}
                className={`${exerciseInputClassName} pr-10`}
                placeholder={`Lựa chọn ${optionIndex + 1}`}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <input
                  type="checkbox"
                  {...register(`questions.${questionIndex}.options.${optionIndex}.isCorrect`)}
                  className="h-5 w-5 text-green-600 focus:ring-green-500 border-gray-300 rounded cursor-pointer"
                  title="Đánh dấu là đáp án đúng"
                />
              </div>
            </div>
            {fields.length > minOptions && (
              <button
                type="button"
                onClick={() => remove(optionIndex)}
                className="text-red-500 hover:text-red-700 transition-colors shrink-0"
                aria-label="Xóa lựa chọn"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-start space-x-2 text-xs text-blue-500 bg-blue-500/10 p-3.5 border border-blue-500/20 rounded-xl">
        <svg className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span className="font-semibold">Lưu ý: Đánh dấu tích vào checkbox bên phải mỗi đáp án để xác định câu trả lời đúng.</span>
      </div>
    </div>
  );
}
