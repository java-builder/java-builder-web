export interface UserStreak {
  userId: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  isMaintainedToday: boolean;
}

export type StreakStatus = "ACTIVE_TODAY" | "AT_RISK" | "BROKEN";

export interface AdminUserStreak extends UserStreak {
  username?: string;
  email?: string;
  avatar?: string;
  status: StreakStatus;
}

export interface UserStreakStats {
  totalStreakUsers: number;
  activeTodayCount: number;
  atRiskCount: number;
  topCurrentStreak: number;
  avgCurrentStreak: number;
}

export interface LeaderboardUser {
  rank: number;
  userId: string;
  username?: string;
  email?: string;
  avatar?: string;
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string | null;
  isMaintainedToday?: boolean;
  maintainedToday?: boolean;
}

export interface StreakLeaderboard {
  topUsers: LeaderboardUser[];
  currentUser: LeaderboardUser | null;
}



