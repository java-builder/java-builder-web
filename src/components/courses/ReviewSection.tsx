"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { useReviews } from "@/hooks/useReviews";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { formatShortDate } from "@/utils/dateUtils";
import toast from "react-hot-toast";

interface ReviewSectionProps {
  courseId: string;
  isEnrolled: boolean;
}

type FilterType = "all" | 5 | 4 | 3 | 2 | 1;

export default function ReviewSection({ courseId, isEnrolled }: ReviewSectionProps) {
  const { data: currentUser } = useCurrentUser();
  const { reviews, totalReviews, isLoading, hasReviewed, createReview, isSubmitting } = useReviews(courseId);

  const [filter, setFilter] = useState<FilterType>("all");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [content, setContent] = useState("");

  const canReview = isEnrolled && currentUser && !hasReviewed;

  const ratingStats = useMemo(() => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(r => {
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
    return reviews.filter(r => r.rating === filter);
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
        }
      }
    );
  }, [rating, content, isSubmitting, createReview]);

  const StarIcon = ({ filled, size = 16 }: { filled: boolean; size?: number }) => (
    <svg className={filled ? "text-amber-400" : "text-gray-200"} width={size} height={size} fill="currentColor" viewBox="0 0 20 20">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );

  if (isLoading) {
    return (
      <div className="space-y-6 text-foreground">
        <div className="bg-card border border-border rounded-2xl p-6 animate-pulse">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col items-center justify-center md:border-r md:border-border md:pr-6 shrink-0">
              <div className="w-16 h-12 bg-muted rounded mb-2"></div>
              <div className="flex gap-1">{[1, 2, 3, 4, 5].map(i => <div key={i} className="w-4 h-4 bg-muted rounded"></div>)}</div>
              <div className="w-16 h-4 bg-muted rounded mt-2"></div>
            </div>
            <div className="flex-1 space-y-3">
              {[5, 4, 3, 2, 1].map(i => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-4 bg-muted rounded"></div>
                  <div className="flex-1 h-2 bg-muted rounded-full"></div>
                  <div className="w-6 h-4 bg-muted rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-card border border-border rounded-2xl p-5 animate-pulse">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 bg-muted rounded-full shrink-0"></div>
                <div className="flex-1 space-y-2">
                  <div className="w-24 h-4 bg-muted rounded"></div>
                  <div className="w-20 h-3 bg-muted rounded"></div>
                  <div className="w-full h-4 bg-muted rounded pt-1"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-foreground">
      {/* Rating Summary */}
      <div className="bg-card border border-border rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex flex-col items-center justify-center md:border-r md:border-border md:pr-8 shrink-0 text-center">
            <div className="text-5xl font-extrabold text-foreground tracking-tight">{averageRating.toFixed(1)}</div>
            <div className="flex items-center gap-0.5 mt-2.5">
              {[1, 2, 3, 4, 5].map(star => <StarIcon key={star} filled={star <= Math.round(averageRating)} size={18} />)}
            </div>
            <div className="text-xs text-muted-foreground font-semibold mt-2">{totalReviews} đánh giá</div>
          </div>
          <div className="flex-1 space-y-2.5">
            {[5, 4, 3, 2, 1].map(star => {
              const count = ratingStats[star as keyof typeof ratingStats];
              const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
              const isSelected = filter === star;
              return (
                <button
                  key={star}
                  onClick={() => setFilter(isSelected ? "all" : star as FilterType)}
                  className={`w-full flex items-center gap-3 rounded-xl px-3 py-1.5 -mx-3 transition-all ${
                    isSelected 
                      ? "bg-amber-500/5 dark:bg-amber-500/10 border border-amber-500/10" 
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-1 w-12 flex-shrink-0">
                    <span className="text-xs font-semibold text-foreground/90">{star}</span>
                    <StarIcon filled size={14} />
                  </div>
                  <div className="flex-grow h-2 bg-muted/60 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${isSelected ? "bg-amber-500" : "bg-amber-400"}`} style={{ width: `${percentage}%` }} />
                  </div>
                  <span className={`text-xs w-8 text-right shrink-0 ${isSelected ? "text-amber-500 font-bold" : "text-muted-foreground/80 font-medium"}`}>{count}</span>
                </button>
              );
            })}
          </div>
        </div>
        {filter !== "all" && (
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted-foreground font-medium">Đang lọc: <span className="text-foreground font-bold">{filter} sao</span> ({filteredReviews.length})</span>
            <button onClick={() => setFilter("all")} className="text-xs text-accent hover:text-accent/80 transition-colors font-bold cursor-pointer">Xóa bộ lọc</button>
          </div>
        )}
      </div>

      {/* Review Form */}
      {canReview && (
        <div className="bg-muted/15 border border-border rounded-2xl p-5 shadow-2xs">
          <div className="flex items-start gap-3.5">
            {currentUser?.avatar ? (
              <Image src={currentUser.avatar} alt="" width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-border/80" unoptimized />
            ) : (
              <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-sm">{currentUser?.username?.charAt(0)?.toUpperCase()}</span>
              </div>
            )}
            <div className="flex-grow min-w-0">
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-sm font-semibold text-foreground">{currentUser?.username}</span>
                <span className="text-xs text-muted-foreground/50">•</span>
                <div className="flex items-center gap-2">
                  <div className="flex gap-0.5">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} className="hover:scale-110 active:scale-95 transition-transform duration-100 p-0.5 animate-in fade-in">
                        <StarIcon filled={star <= (hoverRating || rating)} size={22} />
                      </button>
                    ))}
                  </div>
                  {!rating && (
                    <span className="text-xs text-amber-500 font-semibold animate-pulse ml-1">
                      (Vui lòng chọn số sao)
                    </span>
                  )}
                </div>
              </div>
              <textarea 
                value={content} 
                onChange={e => setContent(e.target.value)} 
                placeholder="Chia sẻ trải nghiệm học tập của bạn tại đây..." 
                className="w-full px-3 py-2.5 border border-input rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent/10 focus:border-accent bg-background text-foreground placeholder:text-muted-foreground/60 transition-all" 
                rows={3} 
              />
              <div className="flex justify-end mt-3">
                <button 
                  onClick={handleSubmit} 
                  disabled={!rating || isSubmitting} 
                  className={`px-5 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                    (!rating || isSubmitting)
                      ? "bg-muted text-muted-foreground/40 cursor-not-allowed"
                      : "bg-accent hover:bg-accent/90 text-white shadow-sm hover:shadow-md active:scale-98 cursor-pointer"
                  }`}
                >
                  {isSubmitting && <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /></svg>}
                  Gửi đánh giá
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {hasReviewed && (
        <div className="flex items-center justify-center gap-2 py-3 text-emerald-600 dark:text-emerald-400 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          <span className="text-xs font-semibold">Bạn đã gửi đánh giá cho khóa học này</span>
        </div>
      )}

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map(review => (
            <div key={review.id} className="bg-card border border-border rounded-2xl p-5 hover:shadow-sm transition-all duration-200">
              <div className="flex items-start gap-4">
                {review.userAvatar ? (
                  <Image src={review.userAvatar} alt={review.username || ""} width={40} height={40} className="w-10 h-10 rounded-full object-cover border border-border/80 shrink-0" unoptimized />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-accent/80 flex items-center justify-center shadow-xs shrink-0">
                    <span className="text-white font-bold text-sm">{review.username?.charAt(0)?.toUpperCase()}</span>
                  </div>
                )}
                <div className="flex-grow min-w-0 space-y-1.5">
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-semibold text-foreground truncate">{review.username}</span>
                    <span className="text-xs text-muted-foreground font-medium shrink-0">{formatShortDate(review.createdAt)}</span>
                  </div>
                  <div className="flex gap-0.5">{[1, 2, 3, 4, 5].map(star => <StarIcon key={star} filled={star <= review.rating} size={13} />)}</div>
                  {review.content && <p className="text-foreground/90 text-sm leading-relaxed pt-0.5">{review.content}</p>}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : filter !== "all" ? (
        <div className="bg-card border border-border rounded-2xl py-12 text-center">
          <p className="text-sm text-muted-foreground">Không có đánh giá {filter} sao</p>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-2xl py-12 text-center space-y-3">
          <svg className="w-12 h-12 mx-auto text-muted-foreground/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-foreground">Chưa có đánh giá</h3>
            <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">Khóa học này hiện chưa nhận được nhận xét nào. Hãy trở thành người đầu tiên đánh giá!</p>
          </div>
        </div>
      )}
    </div>
  );
}
