import { MetadataRoute } from 'next';
import { parseApiDate } from '@/utils/dateUtils';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/java-builder';

interface BlogItem {
  slug: string;
  createdAt: string;
}

interface CourseItem {
  slug: string;
  createdAt: string;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/courses`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.95,
    },
    {
      url: `${SITE_URL}/blogs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/qna`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/documents`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/contact`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ];

  try {
    const blogsResponse = await fetch(`${API_URL}/api/v1/blogs?page=1&size=1000`, {
      next: { revalidate: 3600 },
    });
    const blogsData = await blogsResponse.json();
    const blogs: BlogItem[] = blogsData?.data?.data || [];

    const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => ({
      url: `${SITE_URL}/blogs/${blog.slug}`,
      lastModified: parseApiDate(blog.createdAt) || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    const coursesResponse = await fetch(`${API_URL}/api/v1/courses?page=1&size=1000`, {
      next: { revalidate: 3600 },
    });
    const coursesData = await coursesResponse.json();
    const courses: CourseItem[] = coursesData?.data?.data || [];

    const coursePages: MetadataRoute.Sitemap = courses.map((course) => ({
      url: `${SITE_URL}/courses/${course.slug}`,
      lastModified: parseApiDate(course.createdAt) || new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

    let qnaPages: MetadataRoute.Sitemap = [];
    try {
      const qnaResponse = await fetch(`${API_URL}/api/v1/posts?page=1&size=1000`, {
        next: { revalidate: 3600 },
      });
      const qnaData = await qnaResponse.json();
      const posts: { slug: string; createdAt: string }[] = qnaData?.data?.data || [];
      qnaPages = posts.map((post) => ({
        url: `${SITE_URL}/qna/${post.slug}`,
        lastModified: parseApiDate(post.createdAt) || new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
    } catch {
      // Ignore Q&A sitemap error if endpoint fails
    }

    return [...staticPages, ...blogPages, ...coursePages, ...qnaPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    return staticPages;
  }
}
