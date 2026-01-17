export interface SubscriptionPlan {
    id: string;
    name: string;
    price: number;
    durationDays: number;
    description: string;
    features: string;
}

export interface UserSubscription {
    id: string;
    planId: string;
    planName: string;
    status: "ACTIVE" | "EXPIRED" | "CANCELLED";
    startDate: string;
    endDate: string;
    daysRemaining: number;
}

export interface SubscribeResponse {
    orderCode: number;
    checkoutUrl: string;
    qrCode: string;
    status: string;
    totalPrice: number;
    paymentGateway: string;
}
