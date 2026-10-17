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
    const endDay = p.endDay || startDay;
    const startWeek = Math.floor((startDay - 1) / 7) + 1;
    const endWeek = Math.floor((endDay - 1) / 7) + 1;
    return {
      id: p.phaseNumber,
      title: p.title,
      weekRange: `Tuần ${startWeek} - ${endWeek}`,
      dayRange: startDay === endDay ? `Ngày ${startDay}` : `Ngày ${startDay} - ${endDay}`,
      color: "from-blue-600 to-indigo-600",
      description: "",
      badge: `Chặng ${p.phaseNumber}`,
    };
  });

  const days: DayChallenge[] = (res.days || []).map((d) => {
    const phaseNumber = d.phaseNumber || 1;
    const phaseName = d.phaseTitle || `Chặng ${phaseNumber}`;
    const week = Math.floor((d.dayNumber - 1) / 7) + 1;
    const isFree = d.freePreview ?? d.isFreePreview ?? (d.dayNumber <= (res.freePreviewDays ?? 3));

    return {
      day: d.dayNumber,
      week,
      phaseId: phaseNumber,
      phaseName,
      title: d.title,
      tagline: d.coreMission || `Thực hành ngày ${d.dayNumber}`,
      estimatedMinutes: 60,
      whyLearn: d.whyLearn || "Nắm vững kỹ năng thực tế",
      coreMission: d.coreMission || d.title,
      content: d.content || "",
      isFreePreview: Boolean(isFree),
      tasks:
        d.tasks && d.tasks.length > 0
          ? d.tasks.map((t) => ({ id: t.id, title: t.title, isCompleted: false }))
          : [{ id: `t1-${d.id || d.dayNumber}`, title: d.title, isCompleted: false }],
      keyConcepts:
        d.keyConcepts && d.keyConcepts.length > 0
          ? d.keyConcepts
          : ["Architecture", "Best Practices"],
      mentorTip: "Đọc kỹ yêu cầu trước khi bắt tay vào code.",
      resources: [],
      status: d.dayNumber === 1 ? ("in_progress" as const) : ("locked" as const),
    };
  });

  return {
    ...base,
    phases,
    days,
  };
}
