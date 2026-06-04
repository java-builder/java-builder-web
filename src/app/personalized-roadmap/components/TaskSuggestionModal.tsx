"use client";

import { X, BookOpen, Video, FileText, Code, CheckCircle2 } from "lucide-react";

interface Task {
  title: string;
  time: string;
  type: string;
}

interface TaskSuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task | null;
}

export function TaskSuggestionModal({ isOpen, onClose, task }: TaskSuggestionModalProps) {
  if (!isOpen || !task) return null;

  // Generate suggestions based on task
  const suggestions = generateSuggestions(task);

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        {/* Modal */}
        <div 
          className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-slate-700">
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-950 dark:text-white mb-1">
                Gợi ý học tập
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {task.title}
              </p>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-slate-400" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Task Info Card */}
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/40 rounded-lg">
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                  Nội dung cần học
                </h3>
              </div>
              <p className="text-sm text-blue-800 dark:text-blue-300/90 leading-relaxed">
                {suggestions.overview}
              </p>
            </div>

            {/* Learning Steps */}
            <div className="mb-6">
              <h3 className="text-base font-bold text-gray-950 dark:text-white mb-4 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-accent" />
                Các bước học tập
              </h3>
              <div className="space-y-3">
                {suggestions.steps.map((step, idx) => (
                  <div
                    key={idx}
                    className="flex gap-3 p-3 bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700"
                  >
                    <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                        {step.title}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-slate-400 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resources */}
            <div>
              <h3 className="text-base font-bold text-gray-950 dark:text-white mb-4">
                Tài liệu tham khảo
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {suggestions.resources.map((resource, idx) => (
                  <a
                    key={idx}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-3 p-3 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-700 hover:border-accent hover:shadow-sm transition-all group"
                  >
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      resource.type === "video"
                        ? "bg-red-100 dark:bg-red-900/30"
                        : resource.type === "doc"
                          ? "bg-blue-100 dark:bg-blue-900/30"
                          : "bg-emerald-100 dark:bg-emerald-900/30"
                    }`}>
                      {resource.type === "video" ? (
                        <Video className="w-5 h-5 text-red-600 dark:text-red-400" />
                      ) : resource.type === "doc" ? (
                        <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                      ) : (
                        <Code className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white mb-0.5 group-hover:text-accent transition-colors">
                        {resource.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-slate-400">
                        {resource.description}
                      </p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 dark:border-slate-700 flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 hover:bg-gray-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-gray-900 dark:text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Đóng
            </button>
            <button
              className="px-5 py-2.5 bg-accent hover:bg-accent-600 text-white rounded-lg font-semibold text-sm transition-colors"
            >
              Bắt đầu học
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

// Generate learning suggestions based on task
function generateSuggestions(task: Task) {
  interface TaskTemplate {
    overview: string;
    steps: Array<{ title: string; description: string }>;
    resources: Array<{ type: string; title: string; description: string; url: string }>;
  }

  const taskTemplates: Record<string, TaskTemplate> = {
    "Ôn tập OOP & Inheritance": {
      overview: "Ôn lại các khái niệm OOP cơ bản và cách sử dụng kế thừa (Inheritance) trong Java. Hiểu rõ về class, object, encapsulation, và quan hệ cha-con giữa các class.",
      steps: [
        {
          title: "Xem lại lý thuyết OOP",
          description: "Đọc lại 4 tính chất: Encapsulation, Inheritance, Polymorphism, Abstraction. Tập trung vào Inheritance.",
        },
        {
          title: "Viết code mẫu đơn giản",
          description: "Tạo class Animal (cha) và class Dog extends Animal (con). Thử override methods và gọi super().",
        },
        {
          title: "Làm bài tập thực hành",
          description: "Thiết kế hệ thống quản lý nhân viên với Employee, Manager, Developer sử dụng inheritance.",
        },
        {
          title: "Review và debug",
          description: "Kiểm tra lại code, fix lỗi, đảm bảo hiểu rõ constructor chaining và method overriding.",
        },
      ],
      resources: [
        {
          type: "video",
          title: "Java OOP Tutorial",
          description: "Video hướng dẫn OOP từ cơ bản đến nâng cao",
          url: "#",
        },
        {
          type: "doc",
          title: "Oracle Java Docs - Inheritance",
          description: "Tài liệu chính thức về Inheritance",
          url: "https://docs.oracle.com/javase/tutorial/java/IandI/subclasses.html",
        },
        {
          type: "code",
          title: "GitHub Examples",
          description: "Code mẫu OOP trên GitHub",
          url: "#",
        },
        {
          type: "doc",
          title: "JavaBuilder - OOP Guide",
          description: "Hướng dẫn OOP tiếng Việt chi tiết",
          url: "#",
        },
      ],
    },
    default: {
      overview: `Học và thực hành nội dung "${task.title}". Dành ${task.time} để nắm vững kiến thức này.`,
      steps: [
        {
          title: "Đọc lý thuyết cơ bản",
          description: "Hiểu rõ khái niệm và cách hoạt động của chủ đề này.",
        },
        {
          title: "Xem ví dụ minh họa",
          description: "Học qua các ví dụ code mẫu và phân tích cách hoạt động.",
        },
        {
          title: "Thực hành code",
          description: "Tự viết code để củng cố kiến thức đã học.",
        },
        {
          title: "Làm bài tập",
          description: "Hoàn thành các bài tập liên quan để test hiểu biết.",
        },
      ],
      resources: [
        {
          type: "video",
          title: "Video Tutorial",
          description: "Hướng dẫn chi tiết qua video",
          url: "#",
        },
        {
          type: "doc",
          title: "Documentation",
          description: "Tài liệu tham khảo chính thức",
          url: "#",
        },
        {
          type: "code",
          title: "Code Examples",
          description: "Các ví dụ code mẫu",
          url: "#",
        },
        {
          type: "doc",
          title: "Practice Exercises",
          description: "Bài tập thực hành",
          url: "#",
        },
      ],
    },
  };

  return taskTemplates[task.title] || taskTemplates.default;
}
