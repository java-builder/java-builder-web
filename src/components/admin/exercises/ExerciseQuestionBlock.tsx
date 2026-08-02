import { useState } from "react";
import { Control, UseFormRegister, useWatch, Controller } from 'react-hook-form';
import { QuestionType } from '@/types/exercise';
import { exerciseInputClassName } from './constants';
import QuestionOptionsField, { ExerciseFormData } from './QuestionOptionsField';
import { Eye, Edit2 } from "lucide-react";
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
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="md:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-semibold text-foreground">
              <div className="flex items-center space-x-2">
                <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
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
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
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
              <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
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

