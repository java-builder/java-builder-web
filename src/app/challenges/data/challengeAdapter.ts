import { Challenge, DayChallenge, PhaseInfo } from "../types";
import { ChallengeDetailResponse, ChallengeResponse } from "@/types/challenge";

export function adaptChallengeResponseToUi(res: ChallengeResponse): Challenge {
  return {
    id: res.id,
    slug: res.slug,
    title: res.name,
    subtitle: res.description,
    description: res.description,
    totalDays: res.totalDays,
    estimatedMinutesPerDay: 45,
    level: res.level || "JUNIOR",
    category: (res.category?.name || "Spring Boot") as Challenge["category"],
    tag: res.status === "ACTIVE" ? "HOT" : "PRO",
    tagVariant: "hot",
    colorGradient: res.colorGradient || "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    iconName: "Flame",
    enrolledCount: 120,
    price: res.price,
    freePreviewDays: res.freePreviewDays ?? 3,
    phases: [],
    days: [],
  };
}

export function adaptChallengeDetailResponseToUi(res: ChallengeDetailResponse): Challenge {
  const base = adaptChallengeResponseToUi(res);

  const phases: PhaseInfo[] = (res.phases || []).map((p) => {
    const startDay = p.startDay || 1;
    const endDay = p.endDay || 10;
    const startWeek = Math.floor((startDay - 1) / 7) + 1;
    const endWeek = Math.floor((endDay - 1) / 7) + 1;
    return {
      id: p.phaseNumber,
      title: p.title,
      weekRange: `Tuần ${startWeek} - ${endWeek}`,
      dayRange: `Ngày ${startDay} - ${endDay}`,
      color: "from-blue-600 to-indigo-600",
      description: "",
      badge: `Chặng ${p.phaseNumber}`,
    };
  });

  const days: DayChallenge[] =
    res.days && res.days.length > 0
      ? res.days.map((d) => {
          const phaseNumber = d.phaseNumber || 1;
          const phaseName = d.phaseTitle || `Chặng ${phaseNumber}`;
          const week = Math.floor((d.dayNumber - 1) / 7) + 1;

          return {
            day: d.dayNumber,
            week,
            phaseId: phaseNumber,
            phaseName,
            title: d.title,
            tagline: d.coreMission || `Thực hành ngày ${d.dayNumber}`,
            estimatedMinutes: 60,
            whyLearn: "Nắm vững kỹ năng thực tế",
            coreMission: d.coreMission || d.title,
            tasks: [
              { id: `t1-${d.id}`, title: d.title, isCompleted: false },
            ],
            keyConcepts: ["Architecture", "Best Practices"],
            mentorTip: "Đọc kỹ yêu cầu trước khi bắt tay vào code.",
            resources: [],
            status: d.dayNumber === 1 ? "in_progress" : "locked",
          };
        })
      : Array.from({ length: res.totalDays || 30 }, (_, i) => {
          const dayNumber = i + 1;
          const phaseNumber = Math.floor((dayNumber - 1) / 10) + 1;
          const week = Math.floor((dayNumber - 1) / 7) + 1;
          return {
            day: dayNumber,
            week,
            phaseId: phaseNumber,
            phaseName: `Chặng ${phaseNumber}`,
            title: `Ngày ${dayNumber}: Nội dung lộ trình thử thách`,
            tagline: `Nhiệm vụ rèn luyện ngày ${dayNumber}`,
            estimatedMinutes: 60,
            whyLearn: "Rèn luyện tư duy thực tế và kỷ luật viết code mỗi ngày",
            coreMission: `Hoàn thành bài tập thực hành ngày ${dayNumber}`,
            tasks: [
              { id: `t1-${dayNumber}`, title: `Nắm vững mục tiêu ngày ${dayNumber}`, isCompleted: false },
              { id: `t2-${dayNumber}`, title: `Thực hành code và commit mã nguồn`, isCompleted: false },
            ],
            keyConcepts: ["Hands-on", "Clean Code"],
            mentorTip: "Đọc kỹ yêu cầu và thực hành code trực tiếp.",
            resources: [],
            status: dayNumber === 1 ? "in_progress" : "locked",
          };
        });

  return {
    ...base,
    phases,
    days,
  };
}
