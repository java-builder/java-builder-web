"use client";

import Link from "next/link";
import Image from "next/image";
import { useSettingsContext } from "@/contexts/SettingsContext";
import { useEffect, useState } from "react";

export default function Logo() {
  const { settings } = useSettingsContext();
  const rawAppName = settings?.system?.["app-info"]?.["app-name"];
  const [clientTitle, setClientTitle] = useState<string | null>(null);

  useEffect(() => {
    if (!rawAppName && typeof document !== "undefined") {
      setClientTitle(document.title || null);
    }
  }, [rawAppName]);

  const appName =
    typeof rawAppName === "string" && rawAppName.trim() !== ""
      ? rawAppName
      : clientTitle
      ? clientTitle
      : "Java Builder";

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
      {/* show skeleton while clientTitle not yet available when rawAppName missing */}
      {(!rawAppName && clientTitle === null) ? (
        <span className="w-32 h-4 rounded bg-gray-200 dark:bg-slate-700 animate-pulse inline-block" />
      ) : (
        <span className="text-[0.65rem] font-semibold text-gray-500 dark:text-white tracking-wider uppercase leading-tight">
          {appName}
        </span>
      )}
    </Link>
  );
}
