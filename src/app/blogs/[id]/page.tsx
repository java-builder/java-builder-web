'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Blog, BlogTypeDisplayNames } from '@/types/blog';
import { Comment } from '@/types/comment';
import { blogService } from '@/services/blog.service';
import { formatApiDate, formatApiDateOnly } from '@/utils/dateUtils';
import BlogTypeIcon from '@/components/admin/blogs/BlogTypeIcon';
import MarkdownRenderer from '@/components/admin/blogs/MarkdownRenderer';
import Header from '@/components/Header';
import MotionWrapper from '@/components/MotionWrapper';
import CommentList from '@/components/blogs/CommentList';

export default function BlogDetailPage() {
    const params = useParams();
    const blogId = params.id as string;

    const [blog, setBlog] = useState<Blog | null>(null);
    const [relatedBlogs, setRelatedBlogs] = useState<Blog[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [comments, setComments] = useState<Comment[]>([]);
    const [isLoadingComments, setIsLoadingComments] = useState(false);
    const [isSubmittingComment, setIsSubmittingComment] = useState(false);

    useEffect(() => {
        const fetchBlogDetail = async () => {
            try {
                setIsLoading(true);
                setError(null);

                const blogData = await blogService.getBlogById(blogId);
                setBlog(blogData);

                const relatedData = await blogService.getBlogs({
                    page: 1,
                    blogType: blogData.blogType,
                    status: 'PUBLISHED'
                });

                const filtered = relatedData.result
                    .filter(b => b.id !== blogId)
                    .slice(0, 3);
                setRelatedBlogs(filtered);

                // Load comments
                await loadComments();

            } catch (err) {
                console.error('Error fetching blog:', err);
                setError('Không thể tải bài viết. Vui lòng thử lại sau.');
            } finally {
                setIsLoading(false);
            }
        };

        const loadComments = async () => {
            try {
                setIsLoadingComments(true);
                const mockComments = [
                    {
                        id: '1',
                        content: 'Bài viết rất hay và hữu ích! Cảm ơn tác giả đã chia sẻ.',
                        author: 'Nguyễn Văn A',
                        createdAt: new Date().toISOString(),
                        likeCount: 5,
                        isLiked: false,
                        replies: [
                            {
                                id: '1-1',
                                content: 'Mình cũng nghĩ vậy!',
                                author: 'Trần Thị B',
                                createdAt: new Date().toISOString(),
                                likeCount: 2
                            }
                        ]
                    },
                    {
                        id: '2',
                        content: 'Có thể chia sẻ thêm về phần này không ạ?',
                        author: 'Lê Văn C',
                        createdAt: new Date().toISOString(),
                        likeCount: 3,
                        isLiked: true,
                        replies: []
                    }
                ];
                setComments(mockComments);
            } catch (err) {
                console.error('Error loading comments:', err);
            } finally {
                setIsLoadingComments(false);
            }
        };

        if (blogId) {
            fetchBlogDetail();
        }
    }, [blogId]);

    // Comment handlers
    const handleAddComment = async (content: string) => {
        try {
            setIsSubmittingComment(true);
            // Mock API call - replace with actual implementation
            const newComment = {
                id: Date.now().toString(),
                content,
                author: 'Khách', // Public comment without authentication
                createdAt: new Date().toISOString(),
                likeCount: 0,
                isLiked: false,
                replies: []
            };
            setComments(prev => [newComment, ...prev]);
        } catch (err) {
            console.error('Error adding comment:', err);
        } finally {
            setIsSubmittingComment(false);
        }
    };

    const handleLikeComment = async (commentId: string) => {
        try {
            setComments(prev => prev.map(comment =>
                comment.id === commentId
                    ? {
                        ...comment,
                        likeCount: comment.isLiked ? comment.likeCount - 1 : comment.likeCount + 1,
                        isLiked: !comment.isLiked
                    }
                    : comment
            ));
        } catch (err) {
            console.error('Error liking comment:', err);
        }
    };

    const handleReplyComment = async (commentId: string, content: string) => {
        try {
            const newReply = {
                id: `${commentId}-${Date.now()}`,
                content,
                author: 'Khách',
                createdAt: new Date().toISOString(),
                likeCount: 0
            };

            setComments(prev => prev.map(comment =>
                comment.id === commentId
                    ? { ...comment, replies: [...(comment.replies || []), newReply] }
                    : comment
            ));
        } catch (err) {
            console.error('Error replying to comment:', err);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        try {
            setComments(prev => prev.filter(comment => comment.id !== commentId));
        } catch (err) {
            console.error('Error deleting comment:', err);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
                        <div className="aspect-video bg-gray-200 rounded-lg mb-8"></div>
                        <div className="space-y-4">
                            <div className="h-4 bg-gray-200 rounded w-full"></div>
                            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !blog) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Header />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="text-center">
                        <div className="mx-auto w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mb-4">
                            <svg className="w-12 h-12 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy bài viết</h1>
                        <p className="text-gray-600 mb-6">{error || 'Bài viết này không tồn tại hoặc đã bị xóa.'}</p>
                        <Link
                            href="/blogs"
                            className="inline-flex items-center px-6 py-3 bg-orange-500 text-white font-medium rounded-lg hover:bg-orange-600 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Quay lại danh sách bài viết
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-gray-500 hover:text-orange-500 transition-colors">
                            Trang chủ
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <Link href="/blogs" className="text-gray-500 hover:text-orange-500 transition-colors">
                            Blog
                        </Link>
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                        <span className="text-gray-900 font-medium truncate">{blog.title}</span>
                    </nav>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <MotionWrapper animation="fadeInUp" duration={0.6} mode="mount">
                            <article className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                                {/* Featured Image */}
                                {blog.featuredImage && (
                                    <div className="aspect-[4/2] w-full overflow-hidden relative rounded-lg bg-gray-100">
                                        <Image
                                            src={blog.featuredImage}
                                            alt={blog.title}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 60vw"
                                            className="object-scale-down"
                                            priority
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    {/* Header */}
                                    <div className="mb-4">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <div className="p-1.5 bg-blue-100 rounded-md">
                                                <BlogTypeIcon blogType={blog.blogType} className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <span className="text-xs font-medium text-blue-700">
                                                {BlogTypeDisplayNames[blog.blogType]}
                                            </span>
                                        </div>

                                        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                                            {blog.title}
                                        </h1>

                                        {/* Meta Info */}
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500 mb-4">
                                            {blog.author && (
                                                <div className="flex items-center space-x-2">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                    <span>Tác giả: {blog.author}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                </svg>
                                                <time dateTime={blog.createdAt}>{formatApiDate(blog.createdAt)}</time>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                                <span>{blog.viewCount} lượt xem</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                </svg>
                                                <span>{blog.likeCount} lượt thích</span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                                </svg>
                                                <span>{comments.length} bình luận</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Summary */}
                                    {blog.summary && (
                                        <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
                                            <h3 className="font-medium text-blue-900 mb-2 text-sm">Tóm tắt</h3>
                                            <MarkdownRenderer content={blog.summary} className="text-blue-800 text-sm" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="prose prose-sm max-w-none">
                                        <MarkdownRenderer content={blog.content} />
                                    </div>

                                    {/* Tags & Actions */}
                                    <div className="mt-8 pt-6 border-t border-gray-200">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <div className="flex items-center space-x-3">
                                                <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                                    </svg>
                                                    <span>Thích ({blog.likeCount})</span>
                                                </button>
                                                <button className="flex items-center space-x-1.5 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors text-sm">
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                                    </svg>
                                                    <span>Chia sẻ</span>
                                                </button>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Cập nhật: {formatApiDateOnly(blog.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </MotionWrapper>

                        {/* Comments Section */}
                        <MotionWrapper animation="fadeInUp" duration={0.6} delay={0.3} mode="mount">
                            <div className="mt-8 bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                                <CommentList
                                    comments={comments}
                                    onAddComment={handleAddComment}
                                    onLikeComment={handleLikeComment}
                                    onReplyComment={handleReplyComment}
                                    onDeleteComment={handleDeleteComment}
                                    isLoading={isLoadingComments}
                                    isSubmitting={isSubmittingComment}
                                />
                            </div>
                        </MotionWrapper>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <MotionWrapper animation="fadeInRight" duration={0.8} delay={0.2} mode="mount">
                            <div className="space-y-4">
                                {/* Author Info */}
                                {blog.author && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Về tác giả</h3>
                                        <div className="flex items-center space-x-2">
                                            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                                {blog.author.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium text-gray-900">{blog.author}</h4>
                                                <p className="text-xs text-gray-500">Tác giả bài viết</p>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Related Blogs */}
                                {relatedBlogs.length > 0 && (
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                        <h3 className="text-sm font-semibold text-gray-900 mb-3">Bài viết liên quan</h3>
                                        <div className="space-y-3">
                                            {relatedBlogs.map((relatedBlog) => (
                                                <Link
                                                    key={relatedBlog.id}
                                                    href={`/blogs/${relatedBlog.id}`}
                                                    className="block group"
                                                >
                                                    <div className="flex space-x-2">
                                                        {relatedBlog.featuredImage && (
                                                            <div className="flex-shrink-0 w-12 h-12 rounded-md overflow-hidden">
                                                                <Image
                                                                    src={relatedBlog.featuredImage}
                                                                    alt={relatedBlog.title}
                                                                    width={48}
                                                                    height={48}
                                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                                />
                                                            </div>
                                                        )}
                                                        <div className="flex-1 min-w-0">
                                                            <h4 className="text-xs font-medium text-gray-900 group-hover:text-orange-500 transition-colors line-clamp-2">
                                                                {relatedBlog.title}
                                                            </h4>
                                                            <p className="text-xs text-gray-500 mt-1">
                                                                {formatApiDateOnly(relatedBlog.createdAt)}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </Link>
                                            ))}
                                        </div>
                                        <div className="mt-3 pt-3 border-t border-gray-200">
                                            <Link
                                                href="/blogs"
                                                className="text-xs text-orange-500 hover:text-orange-600 font-medium"
                                            >
                                                Xem tất cả →
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Quick Actions */}
                                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                                    <h3 className="text-sm font-semibold text-gray-900 mb-3">Hành động nhanh</h3>
                                    <div className="space-y-2">
                                        <Link
                                            href="/blogs"
                                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                                            </svg>
                                            <span className="text-sm text-gray-700">Tất cả bài viết</span>
                                        </Link>
                                        <Link
                                            href={`/blogs?blogType=${blog.blogType}`}
                                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            <BlogTypeIcon blogType={blog.blogType} className="w-4 h-4 text-gray-400" />
                                            <span className="text-sm text-gray-700">{BlogTypeDisplayNames[blog.blogType]}</span>
                                        </Link>
                                        <Link
                                            href="/courses"
                                            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-50 transition-colors"
                                        >
                                            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                            </svg>
                                            <span className="text-sm text-gray-700">Khóa học</span>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </MotionWrapper>
                    </div>
                </div>
            </div>
        </div>
    );
}
