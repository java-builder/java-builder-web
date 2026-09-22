export interface CacheInfo {
  name: string;
  displayName: string;
  keyCount: number;
  ttl: string;
  description: string;
}

export interface CacheStats {
  totalCaches: number;
  totalKeys: number;
  status: "connected" | "disconnected";
}
