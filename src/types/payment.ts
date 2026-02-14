export interface PaymentDetailResponse {
  id: string;
  paymentCode: number;
  totalPrice: number;
  description: string;
  paymentMethod: PaymentMethod;
  paymentGateway: PaymentGateWay;
  paymentStatus: PaymentStatus;
  transactionType: TransactionType;
  userName: string;
  userEmail: string;
  courseTitle?: string;
  subscriptionPlanName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentResponse {
  orderCode: number;
  checkoutUrl: string;
  qrCode: string;
  status: PaymentStatus;
  totalPrice: number;
  paymentGateway: PaymentGateWay;
}

export enum PaymentMethod {
  ONLINE_BANKING = "ONLINE_BANKING",
}

export enum PaymentGateWay {
  PAYOS = "PAYOS",
}

export enum PaymentStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  FAILED = "FAILED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED",
}

export enum TransactionType {
  PAYIN = "PAYIN",
  PAYOUT = "PAYOUT",
  SUBSCRIPTION = "SUBSCRIPTION",
}
