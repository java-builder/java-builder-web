export interface CreatePaymentRequest {
    courserId: string;
}

export interface CreatePaymentResponse {
    orderCode: number;
    checkoutUrl: string;
    qrCode: string;
    status: "PENDING" | "PAID" | "CANCELLED";
    totalPrice: number;
    paymentGateway: string;
}
