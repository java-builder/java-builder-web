import Link from "next/link";
import Image from "next/image";

interface InterviewCategoryCardProps {
  slug: string;
  name: string;
  iconPath: string;
  description: string;
  totalQuestions: number;
  levels: string[];
  color: string;
}

export default function InterviewCategoryCard({
  slug,
  name,
  iconPath,
  description,
  totalQuestions,
  levels,
  color,
}: InterviewCategoryCardProps) {
  return (
    <Link href={`/interview/${slug}`} className="group">
      <div className="relative h-full bg-white dark:bg-slate-800 rounded-2xl border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-lg hover:border-accent dark:hover:border-accent transition-all duration-300">
        {/* Content */}
        <div className="relative p-6">
          {/* Icon & Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className="w-14 h-14 rounded-xl bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 flex items-center justify-center p-2 shadow-sm group-hover:scale-105 transition-transform duration-300">
              <Image
                src={iconPath}
                alt={name}
                width={40}
                height={40}
                className="object-contain"
              />
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className={`text-2xl font-bold ${color}`}>
                {totalQuestions}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                câu hỏi
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-accent transition-colors">
            {name}
          </h3>

          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
            {description}
          </p>

          {/* Levels */}
          <div className="flex flex-wrap gap-2 mb-4">
            {levels.map((level) => (
              <span
                key={level}
                className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-md"
              >
                {level}
              </span>
            ))}
          </div>

          {/* Arrow */}
          <div className="flex items-center text-accent font-medium text-sm group-hover:translate-x-2 transition-transform">
            Xem chi tiết
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
