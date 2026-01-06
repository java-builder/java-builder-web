export const formatApiDate = (dateString: string): string => {
  try {
    const parts = dateString.split(" ");
    const datePart = parts[0];
    const timePart = parts[1];

    const [day, month, year] = datePart.split("-");
    const [hour, minute, second] = timePart.split(":");

    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
    );

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return "Ngày không hợp lệ";
  }
};

export const formatApiDateOnly = (dateString: string): string => {
  try {
    const parts = dateString.split(" ");
    const datePart = parts[0];

    const [day, month, year] = datePart.split("-");

    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));

    return date.toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch (error) {
    console.error("Error parsing date:", dateString, error);
    return "Ngày không hợp lệ";
  }
};

// Format: dd/mm/yyyy
export const formatShortDate = (dateString: string): string => {
  try {
    const [datePart] = dateString.split(" ");
    const [day, month, year] = datePart.split("-");
    return `${day}/${month}/${year}`;
  } catch {
    return dateString;
  }
};


// Format relative time (e.g., "2 giờ trước", "3 ngày trước")
export const formatRelativeTime = (dateString: string): string => {
  try {
    const parts = dateString.split(" ");
    const datePart = parts[0];
    const timePart = parts[1];

    const [day, month, year] = datePart.split("-");
    const [hour, minute, second] = timePart.split(":");

    const date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
    );

    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffSeconds < 60) return "Vừa xong";
    if (diffMinutes < 60) return `${diffMinutes} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffWeeks < 4) return `${diffWeeks} tuần trước`;
    if (diffMonths < 12) return `${diffMonths} tháng trước`;

    return formatApiDateOnly(dateString);
  } catch {
    return dateString;
  }
};
