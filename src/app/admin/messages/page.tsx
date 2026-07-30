"use client";

import MessagesClient from "@/app/messages/MessagesClient";

export default function AdminMessagesPage() {
  return (
    <div className="h-full w-full rounded-2xl border border-border overflow-hidden relative bg-background shadow-xs">
      <MessagesClient />
    </div>
  );
}
