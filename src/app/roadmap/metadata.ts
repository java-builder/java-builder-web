import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Lộ trình học Backend - JavaBuilder',
  description: 'Lộ trình học Backend Java từ cơ bản đến nâng cao: Java Core, Spring Boot, Spring Security, Microservices với Spring Cloud, Docker và DevOps',
  url: '/roadmap',
  tags: ['lộ trình học Java', 'Spring Boot', 'Spring Security', 'Microservices', 'Spring Cloud', 'Backend Developer'],
});
