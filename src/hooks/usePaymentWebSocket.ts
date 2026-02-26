import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Client } from '@stomp/stompjs';
import { connectWebSocket, subscribeToPaymentSuccess, PaymentSuccessNotification } from '@/lib/websocket';
import toast from 'react-hot-toast';

export const usePaymentWebSocket = (courseId?: string) => {
  const router = useRouter();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    const client = connectWebSocket();
    clientRef.current = client;

    const originalOnConnect = client.onConnect;
    client.onConnect = (frame) => {
      if (originalOnConnect) {
        originalOnConnect(frame);
      }
      
      subscribeToPaymentSuccess(client, (notification: PaymentSuccessNotification) => {
        if (notification.transactionType === 'SUBSCRIPTION') {
          toast.success('🎉 Đăng ký Premium thành công!', {
            duration: 5000,
            position: 'top-center',
            style: {
              background: 'linear-gradient(to right, #fbbf24, #f97316)',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '16px',
              padding: '16px 24px',
            },
          });
          
          setTimeout(() => {
            router.push('/profile/subscription');
            router.refresh();
            client.deactivate();
          }, 2000);
          
        } else if (notification.transactionType === 'PAYIN') {
          toast.success('🎉 Thanh toán khóa học thành công!', {
            duration: 4000,
            position: 'top-center',
          });
          
          setTimeout(() => {
            if (courseId) {
              router.push(`/learn/${courseId}`);
            }
            router.refresh();
            client.deactivate();
          }, 2000);
        }
      });
    };

    return () => {
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [router, courseId]);

  return clientRef.current;
};
