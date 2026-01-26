"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettingsContext } from "@/contexts/SettingsContext";

export default function Logo() {
  const { settings } = useSettingsContext();
  const rawAppName = settings?.system?.["app-info"]?.["app-name"];
  const appName =
    typeof rawAppName === "string" && rawAppName.trim() !== ""
      ? rawAppName
      : typeof window !== "undefined"
      ? document.title
      : "Learning Platform";

  return (
    <Link href="/" className="flex items-center gap-2.5">
      <div className="relative w-9 h-9 flex-shrink-0">
        <Image
          src="/logos/java-logo.png"
          alt={appName}
          width={36}
          height={36}
          className="object-contain"
        />
      </div>
      <span className="text-[0.65rem] font-semibold text-gray-500 dark:text-gray-400 tracking-wider uppercase leading-tight">
        {appName}
      </span>
    </Link>
  );
}
