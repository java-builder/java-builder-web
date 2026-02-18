export interface UserSessionDetailResponse {
  sessionId: string;
  browser: string;
  browserVersion?: string;
  os: string;
  device: string;
  ipAddress: string;
  provider?: string;
  status: string;
  createdAt: string;
}

export interface UserSessionStatisticsResponse {
  totalSessions: number;
  activeSessions: number;
  revokedSessions: number;
  sessionsByProvider: Record<string, number>;
  sessionsByDevice: Record<string, number>;
  sessionsByBrowser: Record<string, number>;
}
