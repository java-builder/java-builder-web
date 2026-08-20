import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useWebSocket } from '@/components/providers/PresenceProvider';
import { subscribeToPaymentSuccess, PaymentSuccessNotification } from '@/lib/websocket';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { clearInterviewQuestionsCache } from '@/hooks/useInterviewQuestions';

export const usePaymentWebSocket = (courseId?: string) => {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();
  const { client, isConnected } = useWebSocket();

  useEffect(() => {
    if (!client || !isConnected) {
      return;
    }

    const subscription = subscribeToPaymentSuccess(client, (notification: PaymentSuccessNotification) => {
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('payment:success', { detail: notification }));
      }

      const isLearningPage =
        pathname?.startsWith('/docs') ||
        pathname?.startsWith('/learn') ||
        pathname?.startsWith('/courses') ||
        pathname?.startsWith('/interview');

      if (notification.transactionType === 'SUBSCRIPTION') {
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

        if (isLearningPage) {
          router.refresh();
        } else {
          setTimeout(() => {
            router.push('/profile/subscription');
            router.refresh();
          }, 1500);
        }

      } else if (notification.transactionType === 'PAYIN') {
        toast.success('🎉 Thanh toán khóa học thành công!', {
          duration: 4000,
          position: 'top-center',
        });

        if (isLearningPage) {
          router.refresh();
        } else {
          setTimeout(() => {
            router.push('/my-courses');
            router.refresh();
          }, 1500);
        }
      }
    });

    return () => {
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, [client, isConnected, router, pathname, queryClient, courseId]);

  return client;
};
