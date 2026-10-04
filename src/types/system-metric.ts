export type HealthStatus = "UP" | "DOWN" | "OUT_OF_SERVICE" | "UNKNOWN" | string;

export interface DatabaseHealthDetails {
  database?: string;
  validationQuery?: string;
}

export interface DatabaseHealth {
  status: HealthStatus;
  details?: DatabaseHealthDetails;
}

export interface DiskSpaceHealthDetails {
  total?: number;
  free?: number;
  threshold?: number;
  path?: string;
  exists?: boolean;
}

export interface DiskSpaceHealth {
  status: HealthStatus;
  details?: DiskSpaceHealthDetails;
}

export interface RedisHealthDetails {
  version?: string;
}

export interface RedisHealth {
  status: HealthStatus;
  details?: RedisHealthDetails;
}

export interface PingHealth {
  status: HealthStatus;
}

export interface LivenessHealth {
  status: HealthStatus;
}

export interface ReadinessHealth {
  status: HealthStatus;
}

export interface SystemHealthComponents {
  db?: DatabaseHealth;
  diskSpace?: DiskSpaceHealth;
  redis?: RedisHealth;
  ping?: PingHealth;
  livenessState?: LivenessHealth;
  readinessState?: ReadinessHealth;
  [key: string]: unknown;
}

export interface JavaInfo {
  version?: string;
  vendor?: string;
  runtimeName?: string;
}

export interface OsInfo {
  name?: string;
  arch?: string;
  version?: string;
}

export interface AppInfo {
  appName?: string;
  appVersion?: string;
  activeProfile?: string;
  java?: JavaInfo;
  os?: OsInfo;
}

export interface ActuatorAppInfo {
  name?: string;
  description?: string;
  version?: string;
  environment?: string;
  [key: string]: unknown;
}

export interface ActuatorJavaInfo {
  version?: string;
  vendor?: { name?: string; version?: string } | string;
  runtime?: { name?: string; version?: string } | string;
  jvm?: { name?: string; vendor?: string; version?: string };
  [key: string]: unknown;
}

export interface ActuatorOsInfo {
  name?: string;
  arch?: string;
  version?: string;
  [key: string]: unknown;
}

export interface ActuatorInfo {
  app?: ActuatorAppInfo;
  java?: ActuatorJavaInfo;
  os?: ActuatorOsInfo;
  git?: Record<string, unknown>;
  build?: Record<string, unknown>;
  [key: string]: unknown;
}

export interface SystemHealthResponse {
  status: HealthStatus;
  groups: string[];
  components: SystemHealthComponents;
  info?: ActuatorInfo;
  appInfo?: AppInfo;
}

export interface HealthCheckHistoryItem {
  id: string;
  timestamp: string;
  status: HealthStatus;
  responseTimeMs: number;
  healthyCount: number;
  totalCount: number;
}
