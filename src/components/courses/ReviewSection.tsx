"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useReviews } from "@/hooks/useReviews";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatShortDate } from "@/utils/dateUtils";
import { CheckCircle2, Loader2, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

interface ReviewSectionProps {
  courseId: string;
  isEnrolled: boolean;
}

type FilterType = "all" | 5 | 4 | 3 | 2 | 1;

function ReviewAvatar({
  src,
  username,
  size = 36,
}: {
  src?: string | null;
  username?: string | null;
  size?: number;
}) {
  const [hasError, setHasError] = useState(false);
  const initial = (username || "U").trim().charAt(0).toUpperCase();

  if (src && !hasError) {
    return (
      <Image
        src={src}
        alt={username || "User"}
        width={size}
        height={size}
        onError={() => setHasError(true)}
        className="w-9 h-9 rounded-full object-cover border border-border shrink-0"
        unoptimized
      />
    );
  }

  return (
    <div className="w-9 h-9 rounded-full bg-primary-soft border border-primary/20 text-primary flex items-center justify-center font-bold text-xs shrink-0">
      {initial}
    </div>
  );
}

export default function ReviewSection({
  courseId,
  isEnrolled,
}: ReviewSectionProps) {
  const { data: currentUser } = useCurrentUser();
  const {
    reviews,
    totalReviews,
    isLoading,
    hasReviewed,
    createReview,
    isSubmitting,
  } = useReviews(courseId);

  const [filter, setFilter] = useState<FilterType>("all");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");

  const canReview = isEnrolled && currentUser && !hasReviewed;

  const ratingStats = useMemo(() => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach((r) => {
      if (r.rating >= 1 && r.rating <= 5) {
        stats[r.rating as keyof typeof stats]++;
      }
    });
    return stats;
  }, [reviews]);

  const averageRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }, [reviews]);

  const filteredReviews = useMemo(() => {
    if (filter === "all") return reviews;
    return reviews.filter((r) => r.rating === filter);
  }, [reviews, filter]);

  const handleSubmit = useCallback(() => {
    if (!rating || isSubmitting) return;
    createReview(
      { rating, content: content.trim() || undefined },
      {
        onSuccess: () => {
          setRating(0);
          setContent("");
          toast.success("Cảm ơn đánh giá của bạn!");
        },
        onError: () => {
          toast.error("Gửi đánh giá thất bại. Vui lòng thử lại.");
        },
      }
    );
  }, [rating, content, isSubmitting, createReview]);

  const StarIcon = ({
    filled,
    size = 15,
  }: {
    filled: boolean;
    size?: number;
  }) => (
    <svg
      className={filled ? "text-amber-400" : "text-border"}
      width={size}
      height={size}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  if (isLoading) {
    return (
      <div className="space-y-4 text-foreground animate-pulse">
        <div className="bg-surface border border-border rounded-2xl p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center justify-center md:border-r md:border-border md:pr-6 shrink-0">
              <div className="w-16 h-12 bg-border rounded mb-2" />
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-4 h-4 bg-border rounded" />
                ))}
              </div>
              <div className="w-16 h-4 bg-border rounded mt-2" />
            </div>
            <div className="flex-1 space-y-3">
              {[5, 4, 3, 2, 1].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-4 bg-border rounded" />
                  <div className="flex-1 h-2 bg-border rounded-full" />
                  <div className="w-6 h-4 bg-border rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 text-foreground">
      {/* Rating Summary Card */}
      <div className="bg-surface border border-border rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div className="flex flex-col items-center justify-center md:border-r md:border-border md:pr-8 shrink-0 text-center">
            <div className="text-4xl sm:text-5xl font-extrabold text-foreground tracking-tight tabular-nums">
              {averageRating.toFixed(1)}
            </div>
            <div className="flex items-center gap-0.5 mt-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <StarIcon
                  key={star}
                  filled={star <= Math.round(averageRating)}
                  size={16}
                />
              ))}
            </div>
            <div className="text-xs text-text-muted font-medium mt-1.5">
              {totalReviews} đánh giá
            </div>
          </div>

          <div className="flex-1 w-full space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = ratingStats[star as keyof typeof ratingStats];
              const percentage =
                totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              const isSelected = filter === star;
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() =>
                    setFilter(isSelected ? "all" : (star as FilterType))
                  }
                  className={`w-full flex items-center gap-3 rounded-full px-3 py-1 transition-all cursor-pointer ${
                    isSelected
                      ? "bg-primary-soft border border-primary/20"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-1 w-10 shrink-0">
                    <span className="text-xs font-semibold text-foreground">
                      {star}
                    </span>
                    <StarIcon filled size={13} />
                  </div>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span
                    className={`text-xs w-7 text-right tabular-nums shrink-0 ${
                      isSelected
                        ? "text-primary font-bold"
                        : "text-text-muted font-medium"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {filter !== "all" && (
          <div className="mt-4 pt-3.5 border-t border-border flex items-center justify-between">
            <span className="text-xs text-text-muted font-medium">
              Đang lọc:{" "}
              <strong className="text-foreground font-semibold">
                {filter} sao
              </strong>{" "}
              ({filteredReviews.length} đánh giá)
            </span>
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="text-xs text-primary hover:underline font-semibold cursor-pointer"
            >
              Xóa bộ lọc
            </button>
          </div>
        )}
      </div>

      {/* Review Form */}
      {canReview && (
        <div className="bg-background/60 border border-border rounded-2xl p-4 sm:p-5">
          <div className="flex items-start gap-3.5">
            <ReviewAvatar
              src={currentUser?.avatar}
              username={currentUser?.username}
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2 mb-2.5 flex-wrap">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-sm font-bold text-foreground">
                    {currentUser?.username}
                  </span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="hover:scale-110 active:scale-95 transition-transform duration-100 p-0.5 cursor-pointer"
                      >
                        <StarIcon
                          filled={star <= (hoverRating || rating)}
                          size={18}
                        />
                      </button>
                    ))}
                  </div>
                  {!rating && (
                    <span className="text-xs text-text-muted">
                      Chọn số sao đánh giá
                    </span>
                  )}
                </div>
              </div>

              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Chia sẻ cảm nhận của bạn về khóa học (không bắt buộc)..."
                className="w-full px-3.5 py-2.5 border border-border rounded-xl text-sm resize-none focus:outline-none focus:border-primary bg-surface text-foreground placeholder:text-text-muted/70 transition-colors"
                rows={2}
              />

              <div className="flex justify-end mt-2.5">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={!rating || isSubmitting}
                  className={`inline-flex items-center gap-1.5 h-9 px-5 text-xs font-semibold rounded-full transition-all ${
                    !rating || isSubmitting
                      ? "bg-muted text-text-muted/50 cursor-not-allowed"
                      : "bg-primary hover:bg-primary/90 text-white shadow-xs active:scale-95 cursor-pointer"
                  }`}
                >
                  {isSubmitting && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  )}
                  <span>Gửi đánh giá</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasReviewed && (
        <div className="flex items-center justify-center gap-2 py-2.5 px-4 text-success bg-success/10 border border-success/20 rounded-xl">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="text-xs font-semibold">
            Bạn đã gửi đánh giá cho khóa học này
          </span>
        </div>
      )}

      {/* Reviews List (Unified Container) */}
      {filteredReviews.length > 0 ? (
        <div className="rounded-2xl border border-border bg-surface divide-y divide-border overflow-hidden">
          {filteredReviews.map((review) => (
            <div
              key={review.id}
              className="px-5 py-3.5 hover:bg-muted/30 transition-colors"
            >
              <div className="flex items-start gap-3.5">
                <ReviewAvatar
                  src={review.userAvatar}
                  username={review.username}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0 flex-wrap">
                      <span className="text-sm font-bold text-foreground truncate">
                        {review.username}
                      </span>
                      <div className="flex items-center gap-0.5 shrink-0">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <StarIcon
                            key={star}
                            filled={star <= review.rating}
                            size={13}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-text-muted font-medium tabular-nums shrink-0">
                      {formatShortDate(review.createdAt)}
                    </span>
                  </div>

                  {review.content && (
                    <p className="text-foreground/90 text-sm leading-relaxed mt-1.5">
                      {review.content}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filter !== "all" ? (
        <div className="bg-surface border border-border rounded-2xl py-10 text-center">
          <p className="text-sm text-text-muted">
            Không có đánh giá {filter} sao
          </p>
        </div>
      ) : (
        <div className="bg-surface border border-border rounded-2xl py-10 text-center space-y-2">
          <div className="w-10 h-10 rounded-xl bg-background border border-border flex items-center justify-center mx-auto text-text-muted">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-foreground">
            Chưa có đánh giá
          </h3>
          <p className="text-xs text-text-muted max-w-xs mx-auto leading-relaxed">
            Hãy trở thành học viên đầu tiên chia sẻ cảm nhận về khóa học này.
          </p>
        </div>
      )}
    </div>
  );
}
