"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import {
  ActivityType,
  ActivityTypeColors,
} from "@/types/user-activity";
import ActivityTypeIcon from "@/components/activity/ActivityTypeIcon";

interface StudyTimelineItemProps {
  activityType: ActivityType;
  activityTypeName: string;
  resourceTitle: string;
  resourceThumbnailUrl?: string | null;
  relativeTime: string;
  fullTime: string;
  href?: string;
}

export default function StudyTimelineItem({
  activityType,
  activityTypeName,
  resourceTitle,
  resourceThumbnailUrl,
  relativeTime,
  fullTime,
  href,
}: StudyTimelineItemProps) {
  const tone = ActivityTypeColors[activityType];
  const hasLink = Boolean(href);

  const renderPlaceholder = (type: ActivityType) => {
    switch (type) {
      case ActivityType.SUBMIT_EXERCISE: {
        // Build a dynamic Java Class Name from the exercise title
        const cleanTitle = resourceTitle
          .replace(/[^a-zA-Z0-9\s]/g, "")
          .split(/\s+/)
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join("");
        const className = cleanTitle.slice(0, 14) || "Main";

        // Determine method name dynamically based on title keywords
        const lowerTitle = resourceTitle.toLowerCase();
        let methodName = "solve";
        if (lowerTitle.includes("security") || lowerTitle.includes("auth")) {
          methodName = "configure";
        } else if (lowerTitle.includes("sql") || lowerTitle.includes("db") || lowerTitle.includes("data") || lowerTitle.includes("query")) {
          methodName = "query";
        } else if (lowerTitle.includes("loop") || lowerTitle.includes("sort") || lowerTitle.includes("search") || lowerTitle.includes("algorithm")) {
          methodName = "process";
        }

        return (
          <div className="w-full h-full bg-[#1e1e2e] flex flex-col text-left font-mono select-none">
            {/* Mock Window Header */}
            <div className="flex items-center gap-1.5 px-2 py-1 bg-[#181825] border-b border-[#313244]/20 flex-shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f38ba8]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#f9e2af]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[#a6e3a1]" />
            </div>
            {/* Mock Code Block */}
            <div className="p-2 flex-1 flex flex-col justify-center gap-1 text-[8px] font-bold">
              <div>
                <span className="text-[#cba6f7]">class</span> <span className="text-[#89b4fa]">{className}</span> <span className="text-[#f38ba8]">{`{`}</span>
              </div>
              <div className="pl-3">
                <span className="text-[#f9e2af]">void</span> <span className="text-[#89b4fa]">{methodName}</span><span className="text-[#f38ba8]">();</span>
              </div>
              <div>
                <span className="text-[#f38ba8]">{`}`}</span>
              </div>
            </div>
          </div>
        );
      }
      case ActivityType.VIEW_LESSON:
        return (
          <div className="w-full h-full bg-[#f8fafc] dark:bg-[#0f172a] flex flex-col justify-center p-2.5 gap-1.5 text-left select-none">
            <div className="w-10 h-2 bg-emerald-500 rounded-sm" />
            <div className="w-full h-1 bg-slate-200 dark:bg-slate-700/60 rounded-sm" />
            <div className="w-11/12 h-1 bg-slate-200 dark:bg-slate-700/60 rounded-sm" />
            <div className="w-4/5 h-1 bg-slate-200 dark:bg-slate-700/60 rounded-sm" />
          </div>
        );
      case ActivityType.READ_INTERVIEW:
        return (
          <div className="w-full h-full bg-[#f0f9ff] dark:bg-[#0c4a6e]/10 flex flex-col justify-center p-2.5 gap-2 text-left select-none">
            <div className="flex items-center gap-1.5">
              <span className="px-1 py-0.5 rounded bg-blue-500 text-white text-[7px] font-bold leading-none">Q</span>
              <div className="h-1.5 w-12 bg-blue-200 dark:bg-blue-800/80 rounded-sm" />
            </div>
            <div className="flex items-center gap-1.5 pl-3">
              <span className="px-1 py-0.5 rounded bg-indigo-500 text-white text-[7px] font-bold leading-none">A</span>
              <div className="h-1.5 w-10 bg-indigo-200 dark:bg-indigo-800/80 rounded-sm" />
            </div>
          </div>
        );
      case ActivityType.READ_BLOG:
        return (
          <div className="w-full h-full bg-[#faf5ff] dark:bg-[#3b0764]/10 flex items-center p-2.5 gap-2 text-left select-none">
            <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex-shrink-0 flex items-center justify-center">
              <ActivityTypeIcon type={ActivityType.READ_BLOG} className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="flex-1 flex flex-col gap-1.5">
              <div className="w-10 h-1.5 bg-purple-400 dark:bg-purple-500 rounded-sm" />
              <div className="w-full h-1 bg-slate-200 dark:bg-slate-700/60 rounded-sm" />
            </div>
          </div>
        );
      default:
        return (
          <div className="w-full h-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
            <ActivityTypeIcon type={type} className="h-6 w-6 opacity-60" />
          </div>
        );
    }
  };

  const cardContent = (
    <div className="flex items-center gap-4 w-full">
      {/* Thumbnail or Fallback Icon Box with Overlay Icon Badge */}
      <div className="relative w-16 h-12 sm:w-24 sm:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-slate-50 dark:bg-slate-900 border border-slate-200/65 dark:border-slate-800 flex items-center justify-center">
        {resourceThumbnailUrl ? (
          <>
            <Image
              src={resourceThumbnailUrl}
              alt={resourceTitle}
              fill
              sizes="(max-width: 640px) 64px, 96px"
              className="object-cover transition duration-300 group-hover:scale-105"
            />
            {/* Small icon badge overlay on bottom right */}
            <div className={`absolute bottom-1 right-1 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full border border-white dark:border-slate-900 shadow-sm ${tone}`}>
              <ActivityTypeIcon type={activityType} className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
            </div>
          </>
        ) : (
          renderPlaceholder(activityType)
        )}
      </div>

      {/* Main Metadata & Title */}
      <div className="min-w-0 flex-1 flex flex-col justify-center">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] font-semibold border ${tone} bg-opacity-10 dark:bg-opacity-10 border-current/10`}
          >
            {activityTypeName}
          </span>
          <span className="text-[10px] text-gray-300 dark:text-slate-700">•</span>
          <span
            className="text-[11px] tabular-nums text-gray-400 dark:text-gray-500 font-medium"
            title={fullTime}
          >
            {relativeTime}
          </span>
        </div>
        <h3 className="mt-1.5 line-clamp-1 sm:line-clamp-2 text-sm sm:text-base font-bold leading-snug text-slate-800 dark:text-slate-100 group-hover:text-accent dark:group-hover:text-accent-400 transition-colors duration-150">
          {resourceTitle}
        </h3>
      </div>

      {/* Action Arrow */}
      {hasLink && (
        <div className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-800/40 group-hover:bg-accent/10 transition duration-200 text-slate-400 group-hover:text-accent">
          <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
        </div>
      )}
    </div>
  );

  return (
    <div className="w-full">
      {hasLink ? (
        <Link href={href!} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800/30 transition duration-150 cursor-pointer group">
          {cardContent}
        </Link>
      ) : (
        <div className="flex items-center gap-4 p-3 group">
          {cardContent}
        </div>
      )}
    </div>
  );
}
