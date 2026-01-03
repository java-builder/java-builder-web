"use client";

import Link from "next/link";
import Image from "next/image";

export default function Logo() {
  return (
    <Link href="/" className="hidden lg:flex items-center">
      <Image
        src="/logos/java-coffee-logo-icon-vector.jpg"
        alt="JavaBuilder"
        width={48}
        height={48}
        className="rounded-lg"
      />
    </Link>
  );
}
