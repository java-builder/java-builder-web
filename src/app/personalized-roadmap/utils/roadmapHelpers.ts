import { Roadmap } from "../types";

export const getStageProgress = (roadmap: Roadmap, stageIndex: number): number => {
  const stage = roadmap.stages[stageIndex];
  if (!stage) return 0;
  const totalItems = stage.topics.length + stage.exercises.length;
  if (totalItems === 0) return 0;

  const completedCount =
    stage.topics.filter((t) => roadmap.completedItems.includes(`${stageIndex}-topic-${t}`))
      .length +
    stage.exercises.filter((e) => roadmap.completedItems.includes(`${stageIndex}-exercise-${e}`))
      .length;

  return Math.round((completedCount / totalItems) * 100);
};

export const getRoadmapProgress = (roadmap: Roadmap): number => {
  if (roadmap.stages.length === 0) return 0;
  const total = roadmap.stages.reduce((sum, _, index) => sum + getStageProgress(roadmap, index), 0);
  return Math.round(total / roadmap.stages.length);
};

export const getStageStatus = (
  roadmap: Roadmap,
  stageIndex: number
): { label: string; colorClass: string } => {
  const progress = getStageProgress(roadmap, stageIndex);
  if (progress === 100) {
    return {
      label: "Đã hoàn thành",
      colorClass:
        "bg-emerald-50 border border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/30",
    };
  }
  if (progress > 0) {
    return {
      label: "Đang học",
      colorClass:
        "bg-blue-50 border border-blue-200 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/30",
    };
  }
  return {
    label: "Chưa bắt đầu",
    colorClass:
      "bg-gray-100 border border-gray-200 text-gray-500 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700",
  };
};

export const computeTargetMonths = (dailyHours: string): string => {
  if (!dailyHours) return "Chưa xác định";
  switch (dailyHours) {
    case "30 phút / ngày":
      return "6 tháng (24 tuần)";
    case "1 giờ / ngày":
      return "3 tháng (12 tuần)";
    case "1.5 giờ / ngày":
      return "2 tháng 2 tuần (10 tuần)";
    case "2 giờ / ngày":
      return "2 tháng (8 tuần)";
    case "2.5 giờ / ngày":
      return "1 tháng 2 tuần (6 tuần)";
    case "3 giờ / ngày":
      return "1 tháng 1 tuần (5 tuần)";
    case "4 giờ / ngày":
      return "1 tháng (4 tuần)";
    case "6 giờ / ngày":
      return "3 tuần (15 ngày)";
    case "8 giờ / ngày":
      return "2 tuần (10 ngày)";
    default:
      return "3 tháng (12 tuần)";
  }
};

export const computeConfidence = (currentLevel: string): number => {
  if (!currentLevel) return 0;
  switch (currentLevel) {
    case "Chưa biết gì":
      return 10;
    case "Sinh viên năm 1-2":
      return 22;
    case "Mất gốc Java":
      return 15;
    case "Mới học cơ bản":
      return 35;
    case "OOP & Collections":
      return 48;
    case "Chuyển từ ngôn ngữ khác":
      return 40;
    case "JDBC & Database":
      return 58;
    case "DSA cơ bản":
      return 65;
    case "Junior nền tảng":
      return 74;
    case "Có kinh nghiệm dự án":
      return 80;
    case "Chuẩn bị phỏng vấn":
      return 78;
    case "Đã đi làm cần nâng cao":
      return 88;
    default:
      return 50;
  }
};

export const computeFocusAreas = (roadmap: Roadmap) => {
  let baseJava = 10;
  let baseSpring = 0;
  let baseDb = 0;
  let baseSystem = 0;

  switch (roadmap.currentLevel) {
    case "Chưa biết gì":
      baseJava = 10;
      break;
    case "Sinh viên năm 1-2":
      baseJava = 25;
      baseDb = 10;
      break;
    case "Mất gốc Java":
      baseJava = 15;
      break;
    case "Mới học cơ bản":
      baseJava = 45;
      break;
    case "OOP & Collections":
      baseJava = 60;
      baseDb = 15;
      break;
    case "Chuyển từ ngôn ngữ khác":
      baseJava = 35;
      baseSystem = 10;
      break;
    case "JDBC & Database":
      baseJava = 50;
      baseDb = 55;
      break;
    case "DSA cơ bản":
      baseJava = 55;
      baseSystem = 15;
      break;
    case "Junior nền tảng":
      baseJava = 70;
      baseSpring = 40;
      baseDb = 45;
      break;
    case "Có kinh nghiệm dự án":
      baseJava = 75;
      baseSpring = 60;
      baseDb = 55;
      baseSystem = 45;
      break;
    case "Chuẩn bị phỏng vấn":
      baseJava = 80;
      baseSpring = 65;
      baseDb = 60;
      baseSystem = 50;
      break;
    case "Đã đi làm cần nâng cao":
      baseJava = 85;
      baseSpring = 75;
      baseDb = 70;
      baseSystem = 70;
      break;
  }

  roadmap.stages.forEach((stage, index) => {
    const prog = getStageProgress(roadmap, index);
    const title = stage.title.toLowerCase();

    if (
      title.includes("java") ||
      title.includes("oop") ||
      title.includes("nền tảng") ||
      title.includes("cơ bản") ||
      title.includes("cú pháp")
    ) {
      baseJava = Math.min(100, Math.round(baseJava + (prog * (100 - baseJava)) / 100));
    }
    if (
      title.includes("spring") ||
      title.includes("api") ||
      title.includes("backend") ||
      title.includes("security") ||
      title.includes("rest")
    ) {
      baseSpring = Math.min(100, Math.round(baseSpring + (prog * (100 - baseSpring)) / 100));
    }
    if (
      title.includes("database") ||
      title.includes("jpa") ||
      title.includes("sql") ||
      title.includes("cơ sở dữ liệu") ||
      title.includes("query") ||
      title.includes("cache") ||
      title.includes("redis")
    ) {
      baseDb = Math.min(100, Math.round(baseDb + (prog * (100 - baseDb)) / 100));
    }
    if (
      title.includes("docker") ||
      title.includes("microservices") ||
      title.includes("devops") ||
      title.includes("dự án") ||
      title.includes("thiết kế") ||
      title.includes("kiến trúc") ||
      title.includes("phỏng vấn") ||
      title.includes("react") ||
      title.includes("next.js") ||
      title.includes("frontend")
    ) {
      baseSystem = Math.min(100, Math.round(baseSystem + (prog * (100 - baseSystem)) / 100));
    }
  });

  return [
    { label: "Java Core", value: baseJava, color: "bg-blue-500" },
    { label: "Spring Boot", value: baseSpring, color: "bg-emerald-500" },
    { label: "Database & JPA", value: baseDb, color: "bg-amber-500" },
    { label: "System Design", value: baseSystem, color: "bg-rose-500" },
  ];
};
