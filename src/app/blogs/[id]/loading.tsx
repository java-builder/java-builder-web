export default function Loading() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header skeleton */}
            <div className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="animate-pulse">
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Main Content Skeleton */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                            {/* Featured Image Skeleton */}
                            <div className="aspect-[4/2] bg-gray-200 animate-pulse rounded-lg"></div>

                            <div className="p-8">
                                {/* Header Skeleton */}
                                <div className="mb-6">
                                    <div className="flex items-center space-x-3 mb-4">
                                        <div className="w-9 h-9 bg-gray-200 rounded-lg animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                    </div>

                                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4 animate-pulse"></div>
                                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-6 animate-pulse"></div>
                                </div>

                                {/* Meta Info Skeleton */}
                                <div className="flex flex-wrap items-center gap-4 mb-8">
                                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                </div>

                                {/* Summary Skeleton */}
                                <div className="mb-8 p-6 bg-gray-100 rounded-lg">
                                    <div className="h-5 bg-gray-200 rounded w-20 mb-3 animate-pulse"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                        <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                                    </div>
                                </div>

                                {/* Content Skeleton */}
                                <div className="space-y-4">
                                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-4/6 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    <div className="h-32 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-2/3 animate-pulse"></div>
                                </div>

                                {/* Actions Skeleton */}
                                <div className="mt-12 pt-8 border-t border-gray-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4">
                                            <div className="h-10 bg-gray-200 rounded-lg w-24 animate-pulse"></div>
                                            <div className="h-10 bg-gray-200 rounded-lg w-20 animate-pulse"></div>
                                        </div>
                                        <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Skeleton */}
                    <div className="lg:col-span-1">
                        <div className="space-y-6">
                            {/* Author Info Skeleton */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="h-5 bg-gray-200 rounded w-24 mb-4 animate-pulse"></div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
                                    <div>
                                        <div className="h-4 bg-gray-200 rounded w-20 mb-1 animate-pulse"></div>
                                        <div className="h-3 bg-gray-200 rounded w-16 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Related Blogs Skeleton */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="h-5 bg-gray-200 rounded w-32 mb-4 animate-pulse"></div>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex space-x-3">
                                            <div className="w-16 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                                            <div className="flex-1">
                                                <div className="h-4 bg-gray-200 rounded w-full mb-1 animate-pulse"></div>
                                                <div className="h-3 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-200">
                                    <div className="h-4 bg-gray-200 rounded w-32 animate-pulse"></div>
                                </div>
                            </div>

                            {/* Quick Actions Skeleton */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <div className="h-5 bg-gray-200 rounded w-28 mb-4 animate-pulse"></div>
                                <div className="space-y-3">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center space-x-3 p-3">
                                            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                                            <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
