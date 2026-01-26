 "use client";

import { useState, useEffect } from "react";
import MDEditor from "@uiw/react-md-editor";
import "@uiw/react-md-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import { CreateCommentRequest } from "@/types/comment";
import { useForm } from "react-hook-form";
import { commentApi } from "@/services/comment.service";

interface CommentFormProps {
  onSubmit?: (data: CreateCommentRequest) => Promise<void> | void;
  onCancel?: () => void;
  placeholder?: string;
  targetId?: string;
  targetType?: "BLOG" | "LESSON" | "POST" | "QUESTION";
}

export default function CommentForm({
  onSubmit,
  onCancel,
  placeholder = "Viết bình luận của bạn...",
  targetId,
  targetType = "POST",
}: CommentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm<CreateCommentRequest>();

  useEffect(() => {
    register("content", {
      required: "Nội dung câu trả lời là bắt buộc",
      minLength: { value: 10, message: "Câu trả lời phải có ít nhất 10 ký tự" }
    });
  }, [register]);

  const content = watch("content") || "";
  const charCount = content.length;

  const handleFormSubmit = async (data: CreateCommentRequest) => {
    setIsSubmitting(true);

    try {
      const payload: CreateCommentRequest = {
        ...data,
        targetId: data.targetId || targetId || "",
        targetType: data.targetType || targetType,
      };

      if (onSubmit) {
        await onSubmit(payload);
      } else {
        // call API directly
        await commentApi.create(payload);
      }
      reset();
    } catch (error) {
      console.error("Error submitting comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Viết câu trả lời
      </h3>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div>
          <MDEditor
            value={content}
            onChange={(val) => setValue("content", val || "", { shouldValidate: true, shouldDirty: true })}
            height={200}
            textareaProps={{ placeholder }}
          />
          <div className="mt-2 flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div>Hỗ trợ Markdown: <span className="font-medium">**bold**, *italic*, `code`, [link](url)</span></div>
            <div className="text-xs text-gray-400">{charCount}/2000</div>
          </div>
          {errors.content && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Đang gửi..." : "Gửi bình luận"}
          </button>
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
            >
              Hủy
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
