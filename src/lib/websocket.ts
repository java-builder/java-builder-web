import { Client } from '@stomp/stompjs';

export interface PaymentSuccessNotification {
  orderCode: number;
  totalPrice: number;
  transactionType: 'PAYIN' | 'PAYOUT' | 'SUBSCRIPTION';
  paymentStatus: string;
  redirectUrl: string;
  paidAt: string;
}

export const connectWebSocket = () => {
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/java-builder/ws';
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;

  const client = new Client({
    brokerURL: wsUrl,
    connectHeaders: token ? {
      Authorization: `Bearer ${token}`,
    } : {},

    onConnect: () => {
      console.log('WebSocket connected');
    },

    onStompError: (frame) => {
      console.error('WebSocket error:', frame.headers['message']);
    },
  });

  client.activate();

  return client;
};

export const subscribeToPaymentSuccess = (
  client: Client,
  callback: (notification: PaymentSuccessNotification) => void
) => {
  if (!client.connected) {
    return null;
  }

  return client.subscribe('/user/queue/payment-success', (message) => {
    try {
      const notification: PaymentSuccessNotification = JSON.parse(message.body);
      callback(notification);
    } catch (error) {
      console.error('Error parsing payment notification:', error);
    }
  });
};
