"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { CreatePostRequest } from "@/types/post";
import { useForm } from "react-hook-form";
import { CategoryDetailResponse } from "@/types/category";
import MarkdownEditor from "@/components/admin/blogs/MarkdownEditor";

const POPULAR_TAGS = [
  "java", "spring-boot", "spring-security", "jpa", "hibernate",
  "react", "nextjs", "typescript", "javascript", "docker",
  "kubernetes", "microservices", "rest-api", "database", "mysql"
];

interface PostFormProps {
  onSubmit?: (data: CreatePostRequest) => void;
  categories?: CategoryDetailResponse[] | null;
  initialData?: Partial<CreatePostRequest & { thumbnail?: string }>;
}

export default function PostForm({ onSubmit, categories = null, initialData }: PostFormProps) {
  const router = useRouter();
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<CreatePostRequest>();
  const [content, setContent] = useState<string>("");

  useEffect(() => {
    register("content", { required: "Nội dung là bắt buộc" });
  }, [register]);

  useEffect(() => {
    if (initialData) {
      if (initialData.title) setValue("title", initialData.title);
      if (initialData.categoryId) {
        setSelectedCategoryId(initialData.categoryId);
        setValue("categoryId", initialData.categoryId);
      }
      if (initialData.content) setContent(initialData.content);
      if (initialData.thumbnail) setValue("thumbnail", initialData.thumbnail);
    }
  }, [initialData, setValue]);

  // populate initial values for edit flow
  useEffect(() => {
    if (typeof window === "undefined") return;
    // initialData handled via props; setValue called when initialData provided
  }, []);

  useEffect(() => {
    setValue("content", content);
  }, [content, setValue]);

  useEffect(() => {
    if (selectedCategoryId) {
      setValue("categoryId", selectedCategoryId);
    }
  }, [selectedCategoryId, setValue]);

  const handleFormSubmit = (data: CreatePostRequest) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      // Mock submission - redirect to main Q&A page
      console.log("Post submitted:", data);
      router.push("/qna");
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 p-6">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Đặt câu hỏi mới
        </h2>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiêu đề câu hỏi *
            </label>
            <input
              type="text"
              {...register("title", { required: "Tiêu đề là bắt buộc" })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-accent focus:border-accent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              placeholder="Ví dụ: Lỗi NullPointer khi khởi tạo Bean trong Spring Boot"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.title.message}</p>
            )}
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nội dung chi tiết *
            </label>
            <MarkdownEditor
              value={content}
              onChange={setContent}
              placeholder="Mô tả chi tiết vấn đề bạn gặp phải, kèm theo code mẫu, error message, và những gì bạn đã thử..."
              height={300}
              error={errors.content ? String(errors.content.message) : undefined}
            />
          </div>

          {/* Tag (single-select) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Chọn tag (chỉ chọn 1)
            </label>

            <input type="hidden" {...register("categoryId", { required: "Bạn phải chọn một chuyên mục" })} />

            <div className="flex flex-wrap gap-2">
              {(categories && categories.length > 0 ? categories.map(c => ({ id: c.id, name: c.name })) : POPULAR_TAGS.map(t => ({ id: t, name: t }))).map((opt) => {
                const active = selectedCategoryId === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategoryId(opt.id);
                    }}
                    className={`inline-flex items-center justify-center h-8 px-3 rounded-full text-sm leading-none transition ${active ? "bg-accent text-white border-accent shadow" : "bg-white dark:bg-slate-700 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600"}`}
                  >
                    {opt.name}
                  </button>
                );
              })}
            </div>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.categoryId.message}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4 border-t border-gray-200 dark:border-slate-700">
            <button
              type="submit"
              className="px-6 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
            >
              Đăng câu hỏi
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-300 dark:hover:bg-slate-500 transition-colors"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

