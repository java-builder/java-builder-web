import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Về chúng tôi - Marino',
  description: 'Tìm hiểu về Marino - Nền tảng học tập trực tuyến. Chuyên cung cấp khóa học chất lượng cao về Java, Spring Boot và các công nghệ hiện đại',
  url: '/about',
  tags: ['Marino', 'Java Developer', 'giảng viên lập trình', 'mentor'],
});
