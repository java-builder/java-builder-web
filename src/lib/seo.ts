import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'Marino';
const SITE_DESCRIPTION = 'Nền tảng học tập trực tuyến hiện đại với khóa học chất lượng cao, blog công nghệ và lộ trình học tập cá nhân hóa';

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  tags?: string[];
  noIndex?: boolean;
}

export function generateSEO({
  title,
  description,
  image = `${SITE_URL}/hero-background.jpg`,
  url,
  type = 'website',
  publishedTime,
  modifiedTime,
  author,
  tags,
  noIndex = false,
}: SEOProps): Metadata {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return {
    title: fullTitle,
    description,
    keywords: tags?.join(', '),
    authors: author ? [{ name: author }] : [{ name: 'Marino' }],
    creator: 'Marino',
    publisher: SITE_NAME,
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type,
      locale: 'vi_VN',
      url: canonicalUrl,
      title: fullTitle,
      description,
      siteName: SITE_NAME,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(type === 'article' && {
        publishedTime,
        modifiedTime,
        authors: author ? [author] : ['Marino'],
        tags,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@marino',
      site: '@marino',
    },
  };
}

export function generateBlogStructuredData(blog: {
  id: string;
  title: string;
  summary?: string;
  content: string;
  author?: string;
  featuredImage?: string;
  createdAt: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: blog.title,
    description: blog.summary || blog.content.substring(0, 160),
    image: blog.featuredImage || `${SITE_URL}/hero-background.jpg`,
    author: {
      '@type': 'Person',
      name: blog.author || 'Marino',
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/marino-logo.svg`,
      },
    },
    datePublished: blog.createdAt,
    dateModified: blog.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blogs/${blog.id}`,
    },
  };
}

export function generateCourseStructuredData(course: {
  id: string;
  title: string;
  description: string;
  price: number;
  courseCover?: string;
  duration?: number;
  level?: string;
  createdAt: string;
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    name: course.title,
    description: course.description,
    provider: {
      '@type': 'Organization',
      name: SITE_NAME,
      sameAs: SITE_URL,
    },
    image: course.courseCover || `${SITE_URL}/hero-background.jpg`,
    offers: {
      '@type': 'Offer',
      price: course.price,
      priceCurrency: 'VND',
      availability: 'https://schema.org/InStock',
    },
    ...(course.duration && {
      timeRequired: `PT${course.duration}H`,
    }),
    ...(course.level && {
      educationalLevel: course.level,
    }),
    datePublished: course.createdAt,
  };
}

export function generateOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/marino-logo.svg`,
    description: SITE_DESCRIPTION,
    founder: {
      '@type': 'Person',
      name: 'Marino',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@marino.vn',
    },
    sameAs: [
      'https://facebook.com/marino',
      'https://github.com/marino',
    ],
  };
}

export function generateWebsiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE_URL}/courses?search={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}
