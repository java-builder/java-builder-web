export function formatEnrollmentDate(dateString: string): string {
  try {
    // Backend trả format "dd-MM-yyyy HH:mm:ss"
    const parts = dateString.split(" ");
    if (parts.length === 2) {
      const [datePart, timePart] = parts;
      const [day, month, year] = datePart.split("-");
      const [hour, minute] = timePart.split(":");

      const date = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute)
      );

      if (!isNaN(date.getTime())) {
        return date.toLocaleString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
      }
    }
    return dateString;
  } catch {
    return dateString;
  }
}

export function getProgressTone(progress: number): {
  bar: string;
  text: string;
} {
  if (progress >= 100) {
    return {
      bar: "bg-emerald-500",
      text: "text-emerald-600 dark:text-emerald-400",
    };
  }
  if (progress >= 60) {
    return {
      bar: "bg-blue-500",
      text: "text-blue-600 dark:text-blue-400",
    };
  }
  if (progress >= 30) {
    return {
      bar: "bg-amber-500",
      text: "text-amber-600 dark:text-amber-400",
    };
  }
  return {
    bar: "bg-rose-400",
    text: "text-rose-600 dark:text-rose-400",
  };
}
