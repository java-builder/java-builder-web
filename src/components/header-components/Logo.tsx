"use client";

import Link from "next/link";

export default function Logo() {
  return (
    <Link href="/" className="hidden lg:flex items-center">
      <svg width="44" height="44" viewBox="0 0 64 58" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="cupGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{stopColor: '#0056d2'}}/>
            <stop offset="100%" style={{stopColor: '#0044aa'}}/>
          </linearGradient>
        </defs>
        <g transform="translate(4, 0)">
          <path d="M16 12C16 12 18 6 16 0" stroke="url(#cupGrad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
          <path d="M24 14C24 14 26 8 24 2" stroke="url(#cupGrad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
          <path d="M32 12C32 12 34 6 32 0" stroke="url(#cupGrad)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6"/>
          <path d="M8 18H40V42C40 48.627 34.627 54 28 54H20C13.373 54 8 48.627 8 42V18Z" fill="url(#cupGrad)"/>
          <path d="M40 24H46C49.314 24 52 26.686 52 30V34C52 37.314 49.314 40 46 40H40" stroke="url(#cupGrad)" strokeWidth="4" fill="none"/>
          <text x="14" y="40" fontFamily="monospace" fontSize="18" fontWeight="bold" fill="white">&lt;/&gt;</text>
        </g>
      </svg>
    </Link>
  );
}
