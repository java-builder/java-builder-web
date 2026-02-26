// Subscription Plan types
export interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  durationDays: number;
  description: string;
  features: string;
  isActive?: boolean;
}

export interface CreateSubscriptionPlanRequest {
  name: string;
  price: number;
  durationDays: number;
  description?: string;
  features?: string;
}

export interface UpdateSubscriptionPlanRequest {
  id: string;
  name?: string;
  price?: number;
  durationDays?: number;
  description?: string;
  features?: string;
  isActive?: boolean;
}
