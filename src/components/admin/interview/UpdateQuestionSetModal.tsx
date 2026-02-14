"use client";

import { useState, useEffect } from "react";
import { questionSetService } from "@/services/question-set.service";
import { UpdateQuestionSetRequest, QuestionSetDetailResponse } from "@/types/question-set";

interface UpdateQuestionSetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  questionSet: QuestionSetDetailResponse | null;
}

export default function UpdateQuestionSetModal({
  isOpen,
  onClose,
  onSuccess,
  questionSet,
}: UpdateQuestionSetModalProps) {
  const [formData, setFormData] = useState<UpdateQuestionSetRequest>({
    title: "",
    level: "FRESHER",
    difficulty: "EASY",
    topics: "",
    displayOrder: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Predefined tags
  const availableTags = [
    "OOP", "Inheritance", "Polymorphism", "Encapsulation", "Abstraction",
    "Collections", "Stream API", "Lambda", "Generics", "Exception Handling",
    "Multithreading", "Concurrency", "JDBC", "JPA", "Hibernate",
    "Spring Core", "Spring Boot", "Spring MVC", "Spring Security", "Spring Data",
    "REST API", "Microservices", "Docker", "Kubernetes", "Cloud",
    "AWS", "Azure", "Design Patterns", "SOLID", "Testing"
  ];

  useEffect(() => {
    if (questionSet) {
      setFormData({
        title: questionSet.title,
        level: questionSet.level,
        difficulty: questionSet.difficulty,
        topics: questionSet.topics || "",
        displayOrder: questionSet.displayOrder,
      });
    }
  }, [questionSet]);

  const toggleTag = (tag: string) => {
    const currentTags = formData.topics ? formData.topics.split(", ").filter(t => t.trim()) : [];
    const tagIndex = currentTags.indexOf(tag);
    
    if (tagIndex > -1) {
      currentTags.splice(tagIndex, 1);
    } else {
      currentTags.push(tag);
    }
    
    setFormData({ ...formData, topics: currentTags.join(", ") });
  };

  const isTagSelected = (tag: string) => {
    const currentTags = formData.topics ? formData.topics.split(", ").filter(t => t.trim()) : [];
    return currentTags.includes(tag);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionSet) return;
    
    setError("");
    setIsSubmitting(true);

    try {
      await questionSetService.updateQuestionSet(questionSet.id, formData);
      onSuccess();
      onClose();
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } }; message?: string };
      setError(error.response?.data?.message || error.message || "Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen || !questionSet) return null;

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Chỉnh sửa bộ câu hỏi
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {questionSet.title}
              </p>
            </div>
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              placeholder="VD: OOP Fundamentals"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Cấp độ <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as "INTERN" | "FRESHER" | "JUNIOR" | "MIDDLE" | "SENIOR" })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="INTERN">Intern</option>
                <option value="FRESHER">Fresher</option>
                <option value="JUNIOR">Junior</option>
                <option value="MIDDLE">Middle</option>
                <option value="SENIOR">Senior</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Độ khó <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value as "EASY" | "MEDIUM" | "HARD" })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="EASY">Dễ</option>
                <option value="MEDIUM">Trung bình</option>
                <option value="HARD">Khó</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Chủ đề liên quan
              </label>
              <input
                type="text"
                value={formData.topics}
                onChange={(e) => setFormData({ ...formData, topics: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Hoặc nhập thủ công"
              />
              <div className="mt-2 flex flex-wrap gap-1.5 max-h-32 overflow-y-auto">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-2 py-1 text-xs rounded-md transition-colors ${
                      isTagSelected(tag)
                        ? "bg-accent text-white"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Thứ tự hiển thị
              </label>
              <input
                type="number"
                min="1"
                value={formData.displayOrder}
                onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-accent hover:bg-accent/90 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
