"use client";

import { Users } from "lucide-react";
import type { UserSubscription } from "@/types/user-subscription";
import SubscriptionRow from "./SubscriptionRow";

interface SubscriptionTableProps {
  subscriptions: UserSubscription[];
}

const COLUMN_HEADERS: { label: string; align?: "left" | "right" }[] = [
  { label: "Người dùng" },
  { label: "Gói" },
  { label: "Trạng thái" },
  { label: "Ngày bắt đầu" },
  { label: "Ngày kết thúc" },
  { label: "Còn lại", align: "right" },
];

export default function SubscriptionTable({ subscriptions }: SubscriptionTableProps) {
  return (
    <div className="hidden overflow-hidden rounded-xl border border-border bg-card shadow-sm md:block">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-border">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[18%]" />
            <col className="w-[18%]" />
            <col className="w-[8%]" />
          </colgroup>
          <thead className="bg-muted/40">
            <tr>
              {COLUMN_HEADERS.map((col) => (
                <th
                  key={col.label}
                  className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-transparent">
            {subscriptions.map((sub) => (
              <SubscriptionRow key={sub.id} subscription={sub} />
            ))}

            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={COLUMN_HEADERS.length} className="px-4 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-medium text-foreground">
                    Chưa có dữ liệu
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Không có subscription nào phù hợp với bộ lọc
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
