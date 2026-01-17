"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <Image
        src="/logos/java-coffee-logo-icon-vector.jpg"
        alt="JavaBuilder"
        width={40}
        height={40}
        className="rounded-lg object-cover"
      />
      <div className="flex flex-col">
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 leading-none">
          JavaBuilder
        </span>
        <span className="text-[0.65rem] font-bold text-blue-600 dark:text-blue-400 tracking-[0.1em] uppercase">
          System
        </span>
      </div>
    </Link>
  );
}
