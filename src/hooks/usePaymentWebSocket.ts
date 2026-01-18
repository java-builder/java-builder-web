import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Client } from '@stomp/stompjs';
import { connectWebSocket, subscribeToPaymentSuccess, PaymentSuccessNotification } from '@/lib/websocket';
import toast from 'react-hot-toast';

export const usePaymentWebSocket = () => {
  const router = useRouter();
  const clientRef = useRef<Client | null>(null);

  useEffect(() => {
    console.log('🔌 Initializing WebSocket connection...');
    const client = connectWebSocket();
    clientRef.current = client;

    // Override onConnect to subscribe after connection established
    const originalOnConnect = client.onConnect;
    client.onConnect = (frame) => {
      console.log('✅ WebSocket connected!');
      console.log('📋 Session:', frame.headers);
      
      // Call original onConnect if exists
      if (originalOnConnect) {
        originalOnConnect(frame);
      }
      
      // Subscribe to payment success notifications
      const subscription = subscribeToPaymentSuccess(client, (notification: PaymentSuccessNotification) => {
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
      
      console.log('✅ Subscription ID:', subscription?.id);
    };
    
    // Log disconnect
    client.onDisconnect = () => {
      console.log('🔴 WebSocket disconnected');
    };

    // Cleanup
    return () => {
      console.log('🧹 Cleaning up WebSocket');
      if (clientRef.current) {
        clientRef.current.deactivate();
      }
    };
  }, [router]);

  return clientRef.current;
};
