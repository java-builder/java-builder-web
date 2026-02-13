import { CourseLevel } from "@/types/course";

interface LevelBadgeProps {
  level: CourseLevel;
}

export const LevelBadge = ({ level }: LevelBadgeProps) => {
  const getLevelConfig = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return {
          color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
          text: "Cơ bản",
        };
      case CourseLevel.INTERMEDIATE:
        return {
          color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
          text: "Trung cấp",
        };
      case CourseLevel.ADVANCED:
        return {
          color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
          text: "Nâng cao",
        };
      default:
        return {
          color: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
          text: level,
        };
    }
  };

  const config = getLevelConfig(level);
  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${config.color}`}
    >
      {config.text}
    </span>
  );
};
