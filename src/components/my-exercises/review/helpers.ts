export interface ScoreTone {
  ring: string;
  bgFromRing: string;
  text: string;
  chip: string;
  label: string;
  summary: string;
  verdictBg: string;
}

export function getScoreTone(scorePercentage: number): ScoreTone {
  if (scorePercentage >= 80) {
    return {
      ring: "stroke-emerald-500",
      bgFromRing: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
      chip: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800",
      label: "Đạt yêu cầu",
      summary:
        "Bạn đã nắm vững phần lớn nội dung. Hãy duy trì phong độ và mở rộng sang các chủ đề nâng cao.",
      verdictBg:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    };
  }

  if (scorePercentage >= 50) {
    return {
      ring: "stroke-blue-500",
      bgFromRing: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
      chip: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800",
      label: "Cần cải thiện",
      summary:
        "Kết quả ổn nhưng vẫn còn khoảng trống kiến thức. Hãy tập trung xem lại các câu sai để củng cố nền tảng.",
      verdictBg: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    };
  }

  return {
    ring: "stroke-rose-500",
    bgFromRing: "bg-rose-500",
    text: "text-rose-600 dark:text-rose-400",
    chip: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800",
    label: "Chưa đạt",
    summary:
      "Bạn cần ôn tập lại từ phần cơ bản. Hãy bắt đầu với các câu sai và làm lại để củng cố.",
    verdictBg: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400",
  };
}

export function getQuestionStatus(
  isCorrect: boolean,
  hasAnswer: boolean
): "correct" | "incorrect" | "skipped" {
  if (isCorrect) return "correct";
  if (hasAnswer) return "incorrect";
  return "skipped";
}
