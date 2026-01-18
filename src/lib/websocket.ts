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
  const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:8080/f-learning/ws';
  const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
  
  console.log('🔌 Connecting to WebSocket...', { wsUrl, hasToken: !!token });
  
  const client = new Client({
    brokerURL: wsUrl,
    connectHeaders: token ? {
      Authorization: `Bearer ${token}`,
    } : {},
    
    onConnect: () => {
      console.log('✅ WebSocket connected successfully!');
    },
    
    onStompError: (frame) => {
      console.error('❌ WebSocket error:', frame.headers['message']);
    },
    
    debug: () => {},
  });

  client.activate();
  
  return client;
};

export const subscribeToPaymentSuccess = (
  client: Client,
  callback: (notification: PaymentSuccessNotification) => void
) => {
  if (!client.connected) {
    console.warn('⚠️ Cannot subscribe: WebSocket not connected yet');
    return null;
  }

  console.log('📡 Subscribing to /user/queue/payment-success');
  
  return client.subscribe('/user/queue/payment-success', (message) => {
    try {
      console.log('📨 Received payment notification:', message.body);
      const notification: PaymentSuccessNotification = JSON.parse(message.body);
      callback(notification);
    } catch (error) {
      console.error('Error parsing payment notification:', error);
    }
  });
};
