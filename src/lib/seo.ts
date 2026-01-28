import { Metadata } from 'next';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
const SITE_NAME = 'JavaBuilder';
const SITE_DESCRIPTION = 'JavaBuilder.online - Nền tảng học lập trình Java, Spring Boot, React online số 1 Việt Nam. Khóa học chất lượng cao với mentor chuyên nghiệp. Từ zero đến hero cùng JavaBuilder.';
const SITE_KEYWORDS = [
  'javabuilder',
  'java builder',
  'javabuilder.online',
  'java builder online',
  'javabuilder học java',
  'javabuilder khóa học',
  'học java online việt nam',
  'khóa học java spring boot',
  'học lập trình java từ cơ bản đến nâng cao',
  'học spring boot online',
  'khóa học backend java',
  'học java miễn phí',
  'lộ trình học java',
  'java developer việt nam',
  // General keywords
  'học java',
  'học lập trình java',
  'khóa học java',
  'java spring boot',
  'học spring boot',
  'lập trình java online',
  'học lập trình online',
  'khóa học lập trình',
  'backend developer',
  'fullstack developer',
];

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
  useTemplate?: boolean;
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
  useTemplate = true,
}: SEOProps): Metadata {
  const fullTitle = useTemplate ? `${title} | ${SITE_NAME}` : title;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;
  const allKeywords = [...SITE_KEYWORDS, ...(tags || [])];

  return {
    title: fullTitle,
    description,
    keywords: allKeywords.join(', '),
    authors: author ? [{ name: author }] : [{ name: 'JavaBuilder' }],
    creator: 'JavaBuilder',
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
        authors: author ? [author] : ['JavaBuilder'],
        tags: allKeywords,
      }),
    },
    twitter: {
      card: 'summary_large_image',
      title: fullTitle,
      description,
      images: [image],
      creator: '@JavaBuilder',
      site: '@JavaBuilder',
    },
  };
}

export function generateBlogStructuredData(blog: {
  id: string;
  title: string;
  slug: string;
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
      name: blog.author || 'JavaBuilder',
      url: `${SITE_URL}/about`,
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/favicon.svg`,
      },
    },
    datePublished: blog.createdAt,
    dateModified: blog.createdAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blogs/${blog.slug}`,
    },
  };
}

export function generateCourseStructuredData(course: {
  id: string;
  title: string;
  slug: string;
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
    url: `${SITE_URL}/courses/${course.slug}`,
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
    alternateName: ['Java Builder', 'javabuilder', 'JavaBuilder.online'],
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: SITE_DESCRIPTION,
    founder: {
      '@type': 'Person',
      name: 'JavaBuilder',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      email: 'contact@javabuilder.online',
    },
    sameAs: [
      'https://facebook.com/JavaBuilder',
      'https://github.com/JavaBuilder',
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


// Educational Organization Schema - giúp Google hiểu đây là nền tảng giáo dục
export function generateEducationalOrganizationStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: SITE_NAME,
    alternateName: ['Java Builder', 'javabuilder', 'JavaBuilder.online', 'javabuilder online'],
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    description: SITE_DESCRIPTION,
    areaServed: {
      '@type': 'Country',
      name: 'Vietnam',
    },
    availableLanguage: ['vi', 'en'],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Khóa học lập trình',
      itemListElement: [
        {
          '@type': 'Course',
          name: 'Khóa học Java cơ bản đến nâng cao',
          description: 'Học Java từ zero đến hero với JavaBuilder',
          provider: {
            '@type': 'Organization',
            name: SITE_NAME,
          },
        },
        {
          '@type': 'Course',
          name: 'Khóa học Spring Boot',
          description: 'Xây dựng ứng dụng web với Spring Boot',
          provider: {
            '@type': 'Organization',
            name: SITE_NAME,
          },
        },
      ],
    },
  };
}

// FAQ Schema - giúp hiển thị FAQ trên Google Search
export function generateFAQStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'JavaBuilder là gì?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'JavaBuilder (javabuilder.online) là nền tảng học lập trình Java, Spring Boot, React online hàng đầu Việt Nam. Cung cấp khóa học chất lượng cao với mentor chuyên nghiệp, giúp bạn từ zero đến hero trong lập trình.',
        },
      },
      {
        '@type': 'Question',
        name: 'Học Java ở đâu tốt nhất?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'JavaBuilder.online là lựa chọn tốt nhất để học Java tại Việt Nam. Với lộ trình học tập cá nhân hóa, mentor hỗ trợ 1-1, và cộng đồng học viên năng động.',
        },
      },
      {
        '@type': 'Question',
        name: 'JavaBuilder có những khóa học gì?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'JavaBuilder cung cấp các khóa học: Java cơ bản đến nâng cao, Spring Boot, React, Next.js, và nhiều công nghệ backend/frontend khác. Phù hợp cho cả người mới bắt đầu và developer muốn nâng cao kỹ năng.',
        },
      },
    ],
  };
}

// BreadcrumbList Schema - giúp hiển thị breadcrumb trên Google
export function generateBreadcrumbStructuredData(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

// LocalBusiness Schema - giúp hiển thị thông tin doanh nghiệp
export function generateLocalBusinessStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: SITE_NAME,
    alternateName: ['Java Builder', 'javabuilder', 'JavaBuilder.online'],
    image: `${SITE_URL}/hero-background.jpg`,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'VN',
    },
    priceRange: '$$',
    openingHoursSpecification: {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: '00:00',
      closes: '23:59',
    },
  };
}
