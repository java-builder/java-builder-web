export interface UserSession {
  sessionId: string;
  userId: string;
  username: string;
  email: string;
  avatar?: string;
  browser: string;
  browserVersion: string;
  os: string;
  device: string;
  ipAddress: string;
  provider: string;
  status: 'ACTIVE' | 'REVOKED';
  createdAt: string;
}

export interface UserSessionStatistics {
  totalSessions: number;
  activeSessions: number;
  revokedSessions: number;
  sessionsByProvider: Record<string, number>;
  sessionsByDevice: Record<string, number>;
  sessionsByBrowser: Record<string, number>;
}
