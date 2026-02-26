// User Subscription types
export interface UserSubscription {
  id: string;
  planId: string;
  planName: string;
  email: string;
  username: string;
  avatar: string;
  status: "ACTIVE" | "EXPIRED" | "CANCELLED";
  startDate: string;
  endDate: string;
  daysRemaining: number;
}

export interface SubscribeRequest {
  planId: string;
}

export interface SubscribeResponse {
  orderCode: number;
  checkoutUrl: string;
  qrCode: string;
  status: string;
  totalPrice: number;
  paymentGateway: string;
}
