"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { reviewApi } from "@/services/review.service";
import { ReviewResponse } from "@/types/review";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatShortDate } from "@/utils/dateUtils";

interface ReviewSectionProps {
  courseId: string;
  isEnrolled: boolean;
  isPremiumUser: boolean;
  isActive: boolean;
}

export default function ReviewSection({ courseId, isEnrolled, isPremiumUser, isActive }: ReviewSectionProps) {
  const { data: currentUser } = useCurrentUser();
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalReviews, setTotalReviews] = useState(0);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Form state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasReviewed, setHasReviewed] = useState(false);

  const canReview = (isEnrolled || isPremiumUser) && currentUser && !hasReviewed;

  useEffect(() => {
    if (!isActive || hasFetched) return;

    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const result = await reviewApi.getByCourse(courseId, 1, 5);
        if (result.code === 200 && result.result) {
          setReviews(result.result.result || []);
          setTotalReviews(result.result.totalElements || 0);
          setHasMore(1 < (result.result.totalPages || 1));
          setPage(1);
          setHasFetched(true);

          if (currentUser) {
            const userReview = result.result.result?.find(r => r.username === currentUser.username);
            if (userReview) setHasReviewed(true);
          }
        }
      } catch {
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, [isActive, hasFetched, courseId, currentUser]);

  const fetchReviews = async (pageNum: number) => {
    try {
      setIsLoading(true);
      const result = await reviewApi.getByCourse(courseId, pageNum, 5);
      if (result.code === 200 && result.result) {
        setReviews(prev => [...prev, ...(result.result?.result || [])]);
        setTotalReviews(result.result.totalElements || 0);
        setHasMore(pageNum < (result.result.totalPages || 1));
        setPage(pageNum);
      }
    } catch {
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!rating || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const result = await reviewApi.create({
        courseId,
        rating,
        content: content.trim() || undefined,
      });
      if (result.code === 200 && result.result) {
        setReviews(prev => [result.result!, ...prev]);
        setTotalReviews(prev => prev + 1);
        setRating(0);
        setContent("");
        setHasReviewed(true);
      }
    } catch {
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      {totalReviews > 0 && (
        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl">
          <div className="text-center">
            <div className="text-4xl font-bold text-amber-600">{averageRating}</div>
            <div className="flex justify-center mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-4 h-4 ${star <= Math.round(Number(averageRating)) ? "text-amber-400" : "text-gray-300"}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <div className="text-sm text-gray-500 mt-1">{totalReviews} đánh giá</div>
          </div>
        </div>
      )}

      {/* Review Form */}
      {canReview ? (
        <div className="bg-gray-50 rounded-xl p-4">
          <div className="flex items-start gap-3">
            {currentUser?.avatar ? (
              <Image
                src={currentUser.avatar}
                alt={currentUser.username || "User"}
                width={40}
                height={40}
                className="w-10 h-10 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
                <span className="text-white font-medium text-sm">
                  {currentUser?.username?.charAt(0)?.toUpperCase() || "U"}
                </span>
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-sm font-medium text-gray-700">{currentUser?.username}</span>
                <span className="text-xs text-gray-400">•</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <svg
                        className={`w-6 h-6 ${
                          star <= (hoverRating || rating) ? "text-amber-400" : "text-gray-300"
                        } transition-colors`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ trải nghiệm của bạn về khóa học này..."
                className="w-full px-3 py-2.5 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent bg-white"
                rows={3}
              />
              <div className="flex justify-end mt-3">
                <button
                  onClick={handleSubmit}
                  disabled={!rating || isSubmitting}
                  className="px-5 py-2 bg-accent hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                >
                  {isSubmitting && (
                    <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                  )}
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : hasReviewed ? (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
          <svg className="w-8 h-8 text-green-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-green-700">Bạn đã đánh giá khóa học này</p>
        </div>
      ) : !currentUser ? (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-center">
          <p className="text-sm text-gray-600">Đăng nhập để đánh giá khóa học</p>
        </div>
      ) : (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-center">
          <svg className="w-8 h-8 text-amber-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="text-sm text-amber-700">Đăng ký khóa học để đánh giá</p>
        </div>
      )}

      {/* Reviews List */}
      {isLoading && reviews.length === 0 ? (
        <div className="flex justify-center py-8">
          <svg className="animate-spin w-8 h-8 text-accent" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        </div>
      ) : reviews.length > 0 ? (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="bg-white border border-gray-100 rounded-xl p-4 hover:shadow-sm transition-shadow">
              <div className="flex items-start gap-3">
                {review.userAvatar ? (
                  <Image
                    src={review.userAvatar}
                    alt={review.username}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent-600 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-medium text-sm">
                      {review.username?.charAt(0)?.toUpperCase() || "U"}
                    </span>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="font-medium text-gray-900 truncate">{review.username}</span>
                    <span className="text-xs text-gray-400 flex-shrink-0">{formatShortDate(review.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= review.rating ? "text-amber-400" : "text-gray-200"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  {review.content && (
                    <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Load More */}
          {hasMore && (
            <div className="text-center pt-2">
              <button
                onClick={() => fetchReviews(page + 1)}
                disabled={isLoading}
                className="text-accent hover:text-accent-600 text-sm font-medium transition-colors"
              >
                {isLoading ? "Đang tải..." : "Xem thêm đánh giá"}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-300 mb-3">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          </div>
          <h3 className="text-base font-medium text-gray-900 mb-1">Chưa có đánh giá</h3>
          <p className="text-sm text-gray-500">Hãy là người đầu tiên đánh giá khóa học này!</p>
        </div>
      )}
    </div>
  );
}
