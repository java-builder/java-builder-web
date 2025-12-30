import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Liên hệ',
  description: 'Liên hệ với Marino để được tư vấn về khóa học, hỗ trợ học tập hoặc hợp tác. Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7',
  url: '/contact',
  tags: ['liên hệ', 'hỗ trợ', 'tư vấn khóa học'],
});
