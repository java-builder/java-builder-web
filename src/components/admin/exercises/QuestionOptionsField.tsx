"use client";

import { Control, UseFormRegister, useFieldArray } from "react-hook-form";
import { CreateExerciseRequest } from "@/types/exercise";
import { exerciseInputClassName } from "./constants";
import { Button } from "@/components/ui/button";
import { Plus, ListChecks, X, Info } from "lucide-react";

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
          <ListChecks className="w-4 h-4 text-accent" />
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
                <X className="w-5 h-5" />
              </button>
            )}
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-start space-x-2 text-xs text-blue-500 bg-blue-500/10 p-3.5 border border-blue-500/20 rounded-xl">
        <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        <span className="font-semibold">Lưu ý: Đánh dấu tích vào checkbox bên phải mỗi đáp án để xác định câu trả lời đúng.</span>
      </div>
    </div>
  );
}
