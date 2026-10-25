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
    isPremium: Boolean(res.isPremium),
    phases: [],
    days: [],
  };
}

export function adaptChallengeDetailResponseToUi(res: ChallengeDetailResponse): Challenge {
  const base = adaptChallengeResponseToUi(res);

  const phaseMapById = new Map<string, { phaseNumber: number; title: string; id: string }>();
  (res.phases || []).forEach((p) => {
    phaseMapById.set(p.id, { phaseNumber: p.phaseNumber, title: p.title, id: p.id });
  });

  const phases: PhaseInfo[] = (res.phases || []).map((p) => {
    let daysNumList = p.daysNumber;
    if (p.challengeDaysSummaries && p.challengeDaysSummaries.length > 0) {
      daysNumList = p.challengeDaysSummaries.map((s) => s.dayNumber);
    } else if (res.challengeDaysSummaries && res.challengeDaysSummaries.length > 0) {
      const matchedDays = res.challengeDaysSummaries
        .filter((s) => s.phaseId === p.id)
        .map((s) => s.dayNumber);
      if (matchedDays.length > 0) {
        daysNumList = matchedDays;
      }
    }

    return {
      id: p.phaseNumber,
      phaseId: p.id,
      title: p.title,
      color: "from-blue-600 to-indigo-600",
      description: "",
      badge: `Giai đoạn ${p.phaseNumber}`,
      totalDays: p.totalDays || (daysNumList ? daysNumList.length : undefined),
      daysNumber: daysNumList,
      challengeDaysSummaries: p.challengeDaysSummaries,
    };
  });

  const rawDays = res.days && res.days.length > 0 ? res.days : res.day ? [res.day] : [];
  const daysDetailMap = new Map(rawDays.map((d) => [d.dayNumber, d]));

  // Flatten summaries from phases (new API) or root (old API)
  const allSummaries: {
    id: string;
    dayNumber: number;
    title?: string;
    isFreePreview?: boolean;
    phaseId?: string;
    phaseNumber?: number;
    phaseTitle?: string;
  }[] = [];

  (res.phases || []).forEach((p) => {
    if (p.challengeDaysSummaries && p.challengeDaysSummaries.length > 0) {
      p.challengeDaysSummaries.forEach((s) => {
        allSummaries.push({
          id: s.id,
          dayNumber: s.dayNumber,
          title: s.title,
          isFreePreview: s.isFreePreview,
          phaseId: p.id,
          phaseNumber: p.phaseNumber,
          phaseTitle: p.title,
        });
      });
    }
  });

  if (allSummaries.length === 0 && res.challengeDaysSummaries && res.challengeDaysSummaries.length > 0) {
    res.challengeDaysSummaries.forEach((s) => {
      const pInfo = s.phaseId ? phaseMapById.get(s.phaseId) : undefined;
      allSummaries.push({
        id: s.id,
        dayNumber: s.dayNumber,
        isFreePreview: s.isFreePreview,
        phaseId: s.phaseId,
        phaseNumber: pInfo?.phaseNumber,
        phaseTitle: pInfo?.title,
      });
    });
  }

  let days: DayChallenge[] = [];

  if (allSummaries.length > 0) {
    days = allSummaries.map((summary) => {
      const dayNum = summary.dayNumber;
      const d = daysDetailMap.get(dayNum);
      const phaseInfo = summary.phaseId ? phaseMapById.get(summary.phaseId) : undefined;
      const phaseNumber = summary.phaseNumber || d?.phaseNumber || phaseInfo?.phaseNumber;
      const phaseName =
        summary.phaseTitle ||
        d?.phaseTitle ||
        phaseInfo?.title ||
        (phaseNumber ? `Giai đoạn ${phaseNumber}` : "");
      const week = Math.floor((dayNum - 1) / 7) + 1;
      const isFreePreview =
        base.isFree ||
        Boolean(summary.isFreePreview ?? d?.freePreview ?? d?.isFreePreview);

      return {
        id: summary.id || d?.id,
        day: dayNum,
        week,
        phaseId: phaseNumber,
        phaseName,
        title: d?.title || summary.title || `Thử thách Ngày ${dayNum}`,
        tagline: d?.coreMission || `Thực hành ngày ${dayNum}`,
        estimatedMinutes: 60,
        whyLearn: d?.whyLearn || "Nắm vững kỹ năng thực tế",
        coreMission: d?.coreMission || d?.title || summary.title || `Nhiệm vụ Ngày ${dayNum}`,
        content: d?.content || "",
        isFreePreview: Boolean(isFreePreview),
        tasks:
          d?.tasks && d.tasks.length > 0
            ? d.tasks.map((t) => ({
                id: t.id,
                title: t.title,
                isCompleted: false,
                resourceLinks: t.resourceLinks || [],
              }))
            : [],
        keyConcepts:
          d?.keyConcepts && d.keyConcepts.length > 0
            ? d.keyConcepts
            : ["Spring Boot", "Best Practices"],
        mentorTip: "Đọc kỹ yêu cầu trước khi bắt tay vào code.",
        resources: [],
        status: dayNum === 1 ? ("in_progress" as const) : ("locked" as const),
      };
    });
  } else {
    // Fallback if challengeDaysSummaries is not present
    const totalDays = res.totalDays || rawDays.length || 1;
    const dayToPhaseMap = new Map<number, { phaseNumber: number; phaseTitle: string }>();
    (res.phases || []).forEach((p) => {
      if (p.daysNumber && p.daysNumber.length > 0) {
        p.daysNumber.forEach((dn) => {
          dayToPhaseMap.set(dn, { phaseNumber: p.phaseNumber, phaseTitle: p.title });
        });
      }
    });

    days = Array.from({ length: totalDays }, (_, idx) => {
      const dayNum = idx + 1;
      const d = daysDetailMap.get(dayNum);
      const phaseInfo = dayToPhaseMap.get(dayNum);
      const phaseNumber = d?.phaseNumber || phaseInfo?.phaseNumber;
      const phaseName =
        d?.phaseTitle ||
        phaseInfo?.phaseTitle ||
        (phaseNumber ? `Giai đoạn ${phaseNumber}` : "");
      const week = Math.floor((dayNum - 1) / 7) + 1;
      const isFreePreview =
        base.isFree ||
        Boolean(d?.freePreview ?? d?.isFreePreview);

      return {
        id: d?.id,
        day: dayNum,
        week,
        phaseId: phaseNumber,
        phaseName,
        title: d?.title || `Ngày ${dayNum}`,
        tagline: d?.coreMission || `Thực hành ngày ${dayNum}`,
        estimatedMinutes: 60,
        whyLearn: d?.whyLearn || "Nắm vững kỹ năng thực tế",
        coreMission: d?.coreMission || d?.title || `Nhiệm vụ Ngày ${dayNum}`,
        content: d?.content || "",
        isFreePreview: Boolean(isFreePreview),
        tasks:
          d?.tasks && d.tasks.length > 0
            ? d.tasks.map((t) => ({
                id: t.id,
                title: t.title,
                isCompleted: false,
                resourceLinks: t.resourceLinks || [],
              }))
            : [],
        keyConcepts:
          d?.keyConcepts && d.keyConcepts.length > 0
            ? d.keyConcepts
            : ["Architecture", "Best Practices"],
        mentorTip: "Đọc kỹ yêu cầu trước khi bắt tay vào code.",
        resources: [],
        status: dayNum === 1 ? ("in_progress" as const) : ("locked" as const),
      };
    });
  }

  return {
    ...base,
    phases,
    days,
  };
}
