import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Về chúng tôi - JavaBuilder',
  description: 'Tìm hiểu về JavaBuilder - Nền tảng học tập trực tuyến. Chuyên cung cấp khóa học chất lượng cao về Java, Spring Boot và các công nghệ hiện đại',
  url: '/about',
  tags: ['JavaBuilder', 'Java Developer', 'giảng viên lập trình', 'mentor'],
});
