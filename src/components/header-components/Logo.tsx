"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="relative w-9 h-9 flex-shrink-0">
        <Image
          src="/logos/java-logo.png"
          alt="Learning Platform"
          width={36}
          height={36}
          className="object-contain"
        />
      </div>
      <span className="text-[0.65rem] font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase leading-tight">
        Learning Platform
      </span>
    </Link>
  );
}
