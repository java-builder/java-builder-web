export interface CloudflareAccessRule {
  id: string;
  mode: string;
  notes?: string;
  configuration: {
    target: string;
    value: string;
  };
}

export interface CloudflareResponse<T> {
  success: boolean;
  result: T;
  resultInfo?: {
    count: number;
    page: number;
    perPage: number;
    totalCount: number;
  };
}

export interface CreateAccessRuleRequest {
  mode: string;
  notes: string;
  configuration: {
    target: string;
    value: string;
  };
}

export interface UpdateAccessRuleRequest {
  mode: string;
  notes?: string;
  configuration: {
    target: string;
    value: string;
  };
}
