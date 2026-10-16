import { useState } from "react";
import { Control, UseFormRegister, useWatch, Controller } from 'react-hook-form';
import { QuestionType } from '@/types/exercise';
import { exerciseInputClassName } from './constants';
import QuestionOptionsField, { ExerciseFormData } from './QuestionOptionsField';
import { Eye, Edit2, Trash2, HelpCircle, ListChecks, Star } from "lucide-react";
import PublicMarkdownRenderer from "@/components/blogs/PublicMarkdownRenderer";
import { FilterSelect } from "@/components/ui/FilterSelect";

interface ExerciseQuestionBlockProps {
  questionIndex: number;
  control: Control<ExerciseFormData>;
  register: UseFormRegister<ExerciseFormData>;
  onRemove: () => void;
}

export default function ExerciseQuestionBlock({
  questionIndex,
  control,
  register,
  onRemove,
}: ExerciseQuestionBlockProps) {
  const [isPreview, setIsPreview] = useState(true);

  const questionContent = useWatch({
    control,
    name: `questions.${questionIndex}.content`,
    defaultValue: "",
  });

  return (
    <div className="border border-border rounded-2xl p-6 bg-card hover:border-accent/40 transition-all duration-250 shadow-sm">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent-600 rounded-xl flex items-center justify-center shadow-sm select-none">
            <span className="text-white font-extrabold text-sm">{questionIndex + 1}</span>
          </div>
          <h3 className="text-lg font-bold text-foreground">Câu hỏi {questionIndex + 1}</h3>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="p-2 text-red-500 hover:text-white hover:bg-red-500 rounded-xl transition-all duration-200 cursor-pointer"
          aria-label="Xóa câu hỏi"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-foreground">
              <div className="flex items-center space-x-2">
                <HelpCircle className="w-4 h-4 text-accent" />
                <span>Nội dung câu hỏi *</span>
              </div>
            </label>

            <div className="flex items-center gap-1 bg-muted/60 p-0.5 rounded-lg border border-border/60">
              <button
                type="button"
                onClick={() => setIsPreview(false)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  !isPreview
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Edit2 className="h-3 w-3" />
                <span>Soạn thảo</span>
              </button>
              <button
                type="button"
                onClick={() => setIsPreview(true)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                  isPreview
                    ? "bg-background text-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Eye className="h-3 w-3" />
                <span>Xem trước</span>
              </button>
            </div>
          </div>

          {isPreview ? (
            <div className="min-h-[180px] p-4 rounded-xl border border-border bg-muted/10 overflow-y-auto prose dark:prose-invert max-w-none text-sm leading-relaxed">
              {questionContent.trim() ? (
                <PublicMarkdownRenderer content={questionContent} />
              ) : (
                <span className="text-muted-foreground italic text-xs">Chưa có nội dung câu hỏi để hiển thị.</span>
              )}
            </div>
          ) : (
            <textarea
              {...register(`questions.${questionIndex}.content`, {
                required: 'Nội dung câu hỏi không được để trống',
              })}
              rows={8}
              className={`${exerciseInputClassName} min-h-[180px] resize-y`}
              placeholder="Nhập nội dung câu hỏi..."
            />
          )}
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            <div className="flex items-center space-x-2">
              <ListChecks className="w-4 h-4 text-accent" />
              <span>Loại câu hỏi</span>
            </div>
          </label>
          <Controller
            control={control}
            name={`questions.${questionIndex}.questionType`}
            render={({ field }) => (
              <FilterSelect
                value={field.value}
                onChange={field.onChange}
                options={[
                  { value: QuestionType.SINGLE_CHOICE, label: "Một đáp án" },
                  { value: QuestionType.MULTIPLE_CHOICE, label: "Nhiều đáp án" },
                ]}
                placeholder="Chọn loại câu hỏi..."
              />
            )}
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            <div className="flex items-center space-x-2">
              <Star className="w-4 h-4 text-accent" />
              <span>Điểm số</span>
            </div>
          </label>
          <input
            type="number"
            min="1"
            {...register(`questions.${questionIndex}.score`)}
            className={exerciseInputClassName}
            placeholder="10"
          />
        </div>
      </div>

      <QuestionOptionsField
        questionIndex={questionIndex}
        control={control}
        register={register}
      />
    </div>
  );
}

