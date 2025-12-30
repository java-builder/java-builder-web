import { Metadata } from 'next';
import { generateSEO } from '@/lib/seo';

export const metadata: Metadata = generateSEO({
  title: 'Blog công nghệ',
  description: 'Chia sẻ kiến thức, kinh nghiệm và xu hướng công nghệ mới nhất. Hướng dẫn lập trình, tips & tricks, và thảo luận về các công nghệ hiện đại',
  url: '/blogs',
  tags: ['blog công nghệ', 'hướng dẫn lập trình', 'kinh nghiệm lập trình', 'tips lập trình', 'tin tức công nghệ'],
});
