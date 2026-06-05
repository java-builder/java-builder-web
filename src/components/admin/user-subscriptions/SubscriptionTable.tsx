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
    <div className="hidden overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800 md:block">
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-900/40">
            <tr>
              {COLUMN_HEADERS.map((col) => (
                <th
                  key={col.label}
                  className={`whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-300 ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white dark:divide-slate-700 dark:bg-slate-800">
            {subscriptions.map((sub) => (
              <SubscriptionRow key={sub.id} subscription={sub} />
            ))}

            {subscriptions.length === 0 && (
              <tr>
                <td colSpan={COLUMN_HEADERS.length} className="px-4 py-12 text-center">
                  <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-slate-700">
                    <Users className="h-5 w-5 text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    Chưa có dữ liệu
                  </p>
                  <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
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
