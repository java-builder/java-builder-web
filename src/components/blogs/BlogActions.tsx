"use client";

import { formatApiDateOnly } from "@/utils/dateUtils";

interface BlogActionsProps {
  createdAt: string;
  onShareFacebook: () => void;
  onShareLinkedIn: () => void;
}

export default function BlogActions({
  createdAt,
  onShareFacebook,
  onShareLinkedIn,
}: BlogActionsProps) {
  return (
    <div className="mt-4 sm:mt-6 md:mt-8 pt-4 sm:pt-6 border-t border-gray-200 dark:border-slate-700">
      <div className="flex flex-col gap-3 sm:gap-4">
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-2 sm:gap-3">
          {/* Share Buttons */}
          <div className="flex gap-2 sm:gap-3">
            <button
              onClick={onShareFacebook}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 sm:py-2.5 bg-[#1877F2]/10 text-[#1877F2] rounded-lg hover:bg-[#1877F2]/20 transition-colors text-sm font-medium"
              aria-label="Chia sẻ Facebook"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M22.675 0h-21.35C.593 0 0 .593 0 1.325v21.351C0 23.407.593 24 1.325 24H12.82v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.796.715-1.796 1.764v2.314h3.59l-.467 3.622h-3.123V24h6.127C23.407 24 24 23.407 24 22.676V1.325C24 .593 23.407 0 22.675 0z" />
              </svg>
              <span>Facebook</span>
            </button>
            <button
              onClick={onShareLinkedIn}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 sm:py-2.5 bg-[#0A66C2]/10 text-[#0A66C2] rounded-lg hover:bg-[#0A66C2]/20 transition-colors text-sm font-medium"
              aria-label="Chia sẻ LinkedIn"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M20.451 20.451h-3.554v-5.569c0-1.328-.025-3.037-1.852-3.037-1.853 0-2.136 1.447-2.136 2.942v5.664H9.355V9h3.414v1.561h.047c.476-.9 1.637-1.852 3.37-1.852 3.604 0 4.269 2.372 4.269 5.455v6.287zM5.337 7.433a2.063 2.063 0 11.001-4.126 2.063 2.063 0 01-.001 4.126zM7.114 20.451H3.56V9h3.554v11.451zM22.225 0H1.771C.792 0 0 .771 0 1.723v20.555C0 23.228.792 24 1.771 24h20.451C23.2 24 24 23.228 24 22.277V1.723C24 .771 23.2 0 22.222 0z" />
              </svg>
              <span>LinkedIn</span>
            </button>
          </div>
        </div>

        {/* Update Date */}
        <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-100 dark:border-slate-700">
          Cập nhật: {formatApiDateOnly(createdAt)}
        </div>
      </div>
    </div>
  );
}
