import { CourseLevel } from "@/types/course";

interface LevelBadgeProps {
  level: CourseLevel;
}

export const LevelBadge = ({ level }: LevelBadgeProps) => {
  const getLevelConfig = (level: CourseLevel) => {
    switch (level) {
      case CourseLevel.BEGINNER:
        return {
          color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
          text: "Cơ bản",
        };
      case CourseLevel.INTERMEDIATE:
        return {
          color: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
          text: "Trung cấp",
        };
      case CourseLevel.ADVANCED:
        return {
          color: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
          text: "Nâng cao",
        };
      case CourseLevel.EXPERT:
        return {
          color: "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
          text: "Chuyên gia",
        };
      default:
        return {
          color: "bg-muted text-muted-foreground border-border",
          text: level,
        };
    }
  };

  const config = getLevelConfig(level);
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}
    >
      {config.text}
    </span>
  );
};
