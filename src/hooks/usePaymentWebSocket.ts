import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Client } from '@stomp/stompjs';
import { connectWebSocket, subscribeToPaymentSuccess, PaymentSuccessNotification } from '@/lib/websocket';
import toast from 'react-hot-toast';

export const usePaymentWebSocket = () => {
  const router = useRouter();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = connectWebSocket();
    clientRef.current = client;
    const originalOnConnect = client.onConnect;
    client.onConnect = (frame) => {
      console.log('✅ WebSocket connected, subscribing to payment notifications...');
      
      if (originalOnConnect) {
        originalOnConnect(frame);
      }
      subscribeToPaymentSuccess(client, (notification: PaymentSuccessNotification) => {
        console.log('💰 Payment notification received:', notification);
        
        if (notification.transactionType === 'SUBSCRIPTION') {
          toast.success('🎉 Đăng ký Premium thành công!', {
            duration: 4000,
            position: 'top-center',
          });
          
          setTimeout(() => {
            router.push('/profile/subscription');
          }, 2000);
          
        } else if (notification.transactionType === 'PAYIN') {
          toast.success('🎉 Thanh toán khóa học thành công!', {
            duration: 4000,
            position: 'top-center',
          });
          
          setTimeout(() => {
            router.refresh();
          }, 2000);
        }
      });
    };

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [router]);

  return clientRef.current;
};
