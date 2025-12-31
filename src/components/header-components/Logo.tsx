"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="hidden lg:flex items-center space-x-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shadow-lg">
          <div className="w-7 h-7 rounded-full bg-white flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l9-5-9-5-9 5 9 5z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 14l6.16-3.422A12.083 12.083 0 0112 21.5 12.083 12.083 0 015.84 10.578L12 14z" />
            </svg>
          </div>
        </div>
      </div>
      <span className="text-xl font-bold text-gray-900 dark:text-white">Marino</span>
    </Link>
  );
}
