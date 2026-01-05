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
