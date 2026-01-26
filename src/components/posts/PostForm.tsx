 "use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CreatePostRequest } from "@/types/post";
import { useForm } from "react-hook-form";

const POPULAR_TAGS = [
  "java", "spring-boot", "spring-security", "jpa", "hibernate",
  "react", "nextjs", "typescript", "javascript", "docker",
  "kubernetes", "microservices", "rest-api", "database", "mysql"
];

interface PostFormProps {
  onSubmit?: (data: CreatePostRequest) => void;
}

export default function PostForm({ onSubmit }: PostFormProps) {
  const router = useRouter();
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<CreatePostRequest>();

  const handleFormSubmit = (data: CreatePostRequest) => {
    if (onSubmit) {
      onSubmit(data);
    } else {
      // Mock submission - redirect to main Q&A page
      console.log("Post submitted:", data);
      router.push("/qna");
    }
  };

  const addTag = (tag: string) => {
    if (tag && !selectedTags.includes(tag) && selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
    setCustomTag("");
  };

  const removeTag = (tagToRemove: string) => {
    setSelectedTags(selectedTags.filter(tag => tag !== tagToRemove));
  };

  const handleCustomTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag(customTag.trim());
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
            <textarea
              {...register("content", { required: "Nội dung là bắt buộc" })}
              rows={8}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-accent focus:border-accent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
              placeholder="Mô tả chi tiết vấn đề bạn gặp phải, kèm theo code mẫu, error message, và những gì bạn đã thử..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.content.message}</p>
            )}
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags (tối đa 5 tags)
            </label>

            {/* Selected Tags */}
            {selectedTags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {selectedTags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-2 py-1 text-sm bg-accent text-white rounded-md"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 hover:text-red-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Custom Tag Input */}
            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyPress={handleCustomTagKeyPress}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-md shadow-sm focus:ring-accent focus:border-accent bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
                placeholder="Thêm tag tùy chỉnh..."
              />
              <button
                type="button"
                onClick={() => addTag(customTag.trim())}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-300 dark:hover:bg-slate-500"
              >
                Thêm
              </button>
            </div>

            {/* Popular Tags */}
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Tags phổ biến:</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TAGS.filter(tag => !selectedTags.includes(tag)).map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => addTag(tag)}
                    disabled={selectedTags.length >= 5}
                    className="px-2 py-1 text-sm bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
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
