import { Challenge, DayChallenge, PhaseInfo } from "../types";
import { ChallengeDetailResponse, ChallengeResponse } from "@/types/challenge";

export function adaptChallengeResponseToUi(res: ChallengeResponse): Challenge {
  const isFree = Boolean(
    res.isFree ??
    (res.price === undefined || res.price === null || Number(res.price) <= 0)
  );

  return {
    id: res.id,
    slug: res.slug,
    title: res.title,
    subtitle: res.description,
    description: res.description,
    totalDays: res.totalDays,
    estimatedMinutesPerDay: 45,
    level: res.level || "JUNIOR",
    category: res.category?.name || "",
    tag: isFree ? "HOT" : res.status === "ACTIVE" ? "HOT" : "PRO",
    tagVariant: isFree ? "new" : "hot",
    colorGradient: res.colorGradient || "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
    iconName: "Flame",
    enrolledCount: 120,
    price: res.price,
    freePreviewDays: res.freePreviewDays ?? 0,
    isFree,
    isEnrolled: Boolean(res.isEnrolled),
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
      badge: `Giai đoạn ${p.phaseNumber}`,
    };
  });

  const days: DayChallenge[] = (res.days || []).map((d) => {
    const phaseNumber = d.phaseNumber || 1;
    const phaseName = d.phaseTitle || `Giai đoạn ${phaseNumber}`;
    const week = Math.floor((d.dayNumber - 1) / 7) + 1;
    const isFreePreview = base.isFree || Boolean(d.freePreview ?? d.isFreePreview ?? (res.freePreviewDays != null && res.freePreviewDays > 0 && d.dayNumber <= res.freePreviewDays));

    return {
      id: d.id,
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
      isFreePreview: Boolean(isFreePreview),
      tasks:
        d.tasks && d.tasks.length > 0
          ? d.tasks.map((t) => ({
              id: t.id,
              title: t.title,
              isCompleted: false,
              resourceLinks: t.resourceLinks || [],
            }))
          : [],
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
