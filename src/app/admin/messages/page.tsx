"use client";

import AdminMessagesClient from "@/components/admin/messages/AdminMessagesClient";

export default function AdminMessagesPage() {
  return (
    <div className="h-[calc(100vh-6.5rem)] w-full rounded-2xl border border-border overflow-hidden relative bg-background shadow-xs">
      <AdminMessagesClient />
    </div>
  );
}
