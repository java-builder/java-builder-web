export interface UserSession {
  sessionId: string;
  userId: string;
  browser: string;
  browserVersion: string;
  os: string;
  device: string;
  ipAddress: string;
  provider: string;
  status: 'ACTIVE' | 'REVOKED';
  createdAt: string;
}
