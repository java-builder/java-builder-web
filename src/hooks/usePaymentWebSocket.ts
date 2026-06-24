import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWebSocket } from '@/components/providers/PresenceProvider';
import { subscribeToPaymentSuccess, PaymentSuccessNotification } from '@/lib/websocket';
import toast from 'react-hot-toast';

import { clearInterviewQuestionsCache } from '@/hooks/useInterviewQuestions';

export const usePaymentWebSocket = (courseId?: string) => {
  const router = useRouter();
  const { client, isConnected } = useWebSocket();

  useEffect(() => {
    if (!client || !isConnected) {
      return;
    }

    const subscription = subscribeToPaymentSuccess(client, (notification: PaymentSuccessNotification) => {
      if (notification.transactionType === 'SUBSCRIPTION') {
        // Xóa cache câu hỏi phỏng vấn khi đăng ký premium thành công
        clearInterviewQuestionsCache();

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
        }, 2000);

      } else if (notification.transactionType === 'PAYIN') {
        toast.success('🎉 Thanh toán khóa học thành công!', {
          duration: 4000,
          position: 'top-center',
        });

        setTimeout(() => {
          router.push('/my-courses');
          router.refresh();
        }, 2000);
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [client, isConnected, router, courseId]);

  return client;
};
