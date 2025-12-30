import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Về chúng tôi - Lê Khánh Đức',
  description: 'Tìm hiểu về Lê Khánh Đức - Java Developer và founder của F Learning. Chuyên gia phát triển backend với kinh nghiệm về Java, Spring Boot và các công nghệ cloud',
  url: '/about',
  tags: ['Lê Khánh Đức', 'Java Developer', 'F Learning', 'giảng viên lập trình', 'mentor'],
});
