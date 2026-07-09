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
  result_info?: {
    count: number;
    page: number;
    per_page: number;
    total_count: number;
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

export interface GetAccessRulesRequest {
  page?: number;
  perPage?: number;
  target?: string;
  value?: string;
  mode?: string;
  notes?: string;
}

