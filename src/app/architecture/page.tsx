import { Metadata } from "next";
import { ArchitectureCatalogClient } from "@/components/architecture/ArchitectureCatalogClient";

export const metadata: Metadata = {
  title: "Mô Phỏng Kiến Trúc Động (Architecture Visualizer) | JavaBuilder",
  description:
    "Thư viện mô phỏng tương tác các luồng kiến trúc hệ thống và System Design chuẩn Enterprise: Caching, Load Balancing, Rate Limiting, Spring Security OAuth2, Real-time WebSocket, Kafka Event Bus, Circuit Breaker, API Gateway và Sharding.",
  keywords: [
    "system design visualizer",
    "load balancing architecture",
    "spring security filter chain",
    "kafka message queue flow",
    "database sharding replication",
    "cache-aside redis pattern",
    "rate limiting token bucket",
    "circuit breaker resilience4j",
    "api gateway routing",
  ],
};

export default function ArchitecturePage() {
  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-background">
      <ArchitectureCatalogClient />
    </div>
  );
}
