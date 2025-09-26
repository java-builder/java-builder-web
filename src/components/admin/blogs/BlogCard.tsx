import { Blog, BlogTypeDisplayNames } from '@/types/blog';
import Image from 'next/image';
import BlogTypeIcon from './BlogTypeIcon';
import MarkdownRenderer from './MarkdownRenderer';

interface BlogCardProps {
    blog: Blog;
    onEdit: (blog: Blog) => void;
    onDelete: (id: string, title: string) => void;
    onPreview?: (blog: Blog) => void;
    isDeleting?: boolean;
}

const StatusBadge = ({ status }: { status: string }) => {
    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'PUBLISHED':
                return { color: 'bg-green-100 text-green-800 border-green-200', text: 'Đã xuất bản' };
            case 'DRAFT':
                return { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', text: 'Bản nháp' };
            case 'ARCHIVED':
                return { color: 'bg-gray-100 text-gray-800 border-gray-200', text: 'Lưu trữ' };
            default:
                return { color: 'bg-gray-100 text-gray-800 border-gray-200', text: status };
        }
    };

    const config = getStatusConfig(status);
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${config.color}`}>
            {config.text}
        </span>
    );
};

export default function BlogCard({ blog, onEdit, onDelete, onPreview, isDeleting }: BlogCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 overflow-hidden">
            {/* Featured Image */}
            {blog.featuredImage && (
                <div className="aspect-video w-full overflow-hidden relative">
                    <Image
                        src={blog.featuredImage}
                        alt={blog.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover hover:scale-105 transition-transform duration-300"
                    />
                </div>
            )}

            <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <BlogTypeIcon blogType={blog.blogType} className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                            <span className="text-xs font-medium text-blue-600">
                                {BlogTypeDisplayNames[blog.blogType]}
                            </span>
                            <div className="flex items-center space-x-2 mt-1">
                                <StatusBadge status={blog.status} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-blue-600 transition-colors duration-200">
                    {blog.title}
                </h3>

                {/* Summary */}
                {blog.summary && (
                    <div className="mb-4">
                        <MarkdownRenderer
                            content={blog.summary}
                            className="text-sm text-gray-600"
                            maxLines={3}
                        />
                    </div>
                )}

                {/* Stats */}
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                    <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        {blog.viewCount}
                    </span>
                    <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        {blog.likeCount}
                    </span>
                </div>

                {/* Meta */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span>Tác giả: {blog.author}</span>
                    <span>{formatDate(blog.createdAt)}</span>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-2 pt-4 border-t border-gray-100">
                    {onPreview && (
                        <button
                            onClick={() => onPreview(blog)}
                            className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg transition-colors duration-200"
                        >
                            <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Xem
                        </button>
                    )}
                    <button
                        onClick={() => onEdit(blog)}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                    >
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Sửa
                    </button>
                    <button
                        onClick={() => onDelete(blog.id, blog.title)}
                        disabled={isDeleting}
                        className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-red-700 bg-red-100 hover:bg-red-200 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isDeleting ? (
                            <>
                                <svg className="animate-spin w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Đang xóa...
                            </>
                        ) : (
                            <>
                                <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Xóa
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}