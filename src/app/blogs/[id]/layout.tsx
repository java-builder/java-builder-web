import { ReactNode } from 'react';
import type { Metadata } from 'next';
import { blogService } from '@/services/blog.service';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    try {
        const { id } = await params;
        const blog = await blogService.getBlogById(id);

        const title = blog.title || 'Bài viết';
        const description = (blog.summary || '').replace(/\s+/g, ' ').slice(0, 180) || 'Chia sẻ từ F-Learning';
        const url = `${SITE_URL}/blogs/${id}`;
        const imgUrl = blog.featuredImage && /^https?:\/\//i.test(blog.featuredImage)
            ? blog.featuredImage
            : (blog.featuredImage ? `${SITE_URL}${blog.featuredImage.startsWith('/') ? '' : '/'}${blog.featuredImage}` : undefined);
        const images = imgUrl ? [{ url: imgUrl }] : undefined;

        return {
            title,
            description,
            openGraph: {
                title,
                description,
                url,
                type: 'article',
                images,
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: imgUrl ? [imgUrl] : undefined,
            },
            alternates: {
                canonical: url,
            },
        };
    } catch {
        return {
            title: 'Bài viết',
        };
    }
}

export default async function BlogDetailLayout({ children, params }: { children: ReactNode; params: Promise<{ id: string }> }) {
    // Await to satisfy Next 15 layout typing for dynamic params
    await params;
    return <>{children}</>;
}


