"use client";

import Image from "next/image";

export default function CourseInstructor() {
  return (
    <div className="space-y-6">
      {/* Instructor Profile */}
      <div className="flex items-start space-x-4 p-6 bg-gray-50 dark:bg-slate-700/50 rounded-lg">
        <div className="w-16 h-16 rounded-full overflow-hidden flex-shrink-0 bg-white">
          <Image
            src="/logos/java-logo.png"
            alt="JavaBuilder"
            width={64}
            height={64}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            JavaBuilder
          </h3>
          <p className="text-accent-600 dark:text-accent-400 font-medium mb-2">
            Backend Developer
          </p>
          <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
            Chuyên gia phát triển backend với kinh nghiệm sâu về Java, Spring
            Boot và các công nghệ cloud. Tôi đam mê chia sẻ kiến thức và giúp
            đỡ các bạn trẻ phát triển kỹ năng lập trình backend.
          </p>
        </div>
      </div>

      {/* Skills */}
      <div>
        <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
          Kỹ năng chuyên môn
        </h4>
        <div className="flex flex-wrap gap-2">
          {[
            "Java",
            "Spring Boot",
            "Docker",
            "PostgreSQL",
            "MongoDB",
            "AWS",
            "Kubernetes",
          ].map((skill) => (
            <span
              key={skill}
              className="px-3 py-1 bg-accent-100 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 rounded-full text-sm font-medium border border-accent-200 dark:border-accent-800"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Contact */}
      <div className="p-4 bg-accent-50 dark:bg-accent-900/20 rounded-lg border border-accent-100 dark:border-accent-800">
        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
          Liên hệ với giảng viên
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
          Có câu hỏi về khóa học? Hãy liên hệ trực tiếp với tôi!
        </p>
        <button className="bg-accent hover:bg-accent-600 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 text-sm">
          Gửi tin nhắn
        </button>
      </div>
    </div>
  );
}
