"use client";

import dynamic from "next/dynamic";

const StudyProgressClient = dynamic(() => import("./StudyProgressClient"), {
  ssr: false,
});

export default function StudyProgressWrapper() {
  return <StudyProgressClient />;
}
