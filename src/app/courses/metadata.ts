import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Khóa học lập trình',
  description: 'Khám phá các khóa học lập trình chất lượng cao từ cơ bản đến nâng cao. Học Java, Spring Boot, React, Next.js với lộ trình rõ ràng và mentor giàu kinh nghiệm',
  url: '/courses',
  tags: ['khóa học lập trình', 'học Java', 'học Spring Boot', 'học React', 'khóa học online', 'lập trình backend', 'lập trình frontend'],
});
