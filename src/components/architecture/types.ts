export type PatternCategory =
  | "all"
  | "security"
  | "resilience"
  | "microservices"
  | "caching"
  | "devops"
  | "realtime";

export type NodeCategory =
  | "client"
  | "gateway"
  | "filter"
  | "service"
  | "cache"
  | "database"
  | "queue"
  | "auth"
  | "security"
  | "devops"
  | "build"
  | "deploy"
  | "broker"
  | "websocket"
  | "test";

export interface NodeArchDetail {
  role: string;
  purpose: string;
  input: string;
  processing: string;
  output: string;
  failureImpact: string;
  tips: string[];
}

export interface FlowNodeData {
  stepNumber?: number;
  label: string;
  sublabel: string;
  category: NodeCategory;
  categoryBadge: {
    label: string;
    bg: string;
    text: string;
  };
  description: string;
  meta: {
    latency?: string;
    protocol?: string;
    componentType?: string;
  };
  details: NodeArchDetail;
  isSelected?: boolean;
}

export interface FlowEdgeData {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
  label?: string;
  animated?: boolean;
}

export interface ArchitecturePattern {
  id: string;
  title: string;
  vietnameseTitle: string;
  category: "security" | "resilience" | "microservices" | "caching" | "devops" | "realtime";
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert" | "Cơ bản" | "Trung bình" | "Nâng cao" | "Chuyên sâu";
  summary: string;
  keyBenefit: string;
  flowNarrative: string;
  flowSteps: string[];
  tags?: string[];
  initialNodes: {
    id: string;
    type?: string;
    position: { x: number; y: number };
    data: FlowNodeData;
  }[];
  initialEdges: FlowEdgeData[];
}
