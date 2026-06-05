import { Hash, Loader2, Pencil, Trash2 } from "lucide-react";
import { formatReadableDate } from "@/utils/dateUtils";
import type { TagDetailResponse } from "@/types/tag";

interface TagRowProps {
  tag: TagDetailResponse;
  isDeleting: boolean;
  onEdit: (tag: TagDetailResponse) => void;
  onDelete: (id: string, name: string) => void;
}

export default function TagRow({ tag, isDeleting, onEdit, onDelete }: TagRowProps) {
  return (
    <tr className="transition hover:bg-gray-50 dark:hover:bg-slate-700/40">
      {/* Name */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-0.5 text-sm font-semibold text-accent">
          <Hash className="h-3 w-3" />
          {tag.name}
        </span>
      </td>

      {/* Slug */}
      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-gray-600 dark:text-gray-300">
        {tag.slug}
      </td>

      {/* Created at */}
      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-gray-600 dark:text-gray-300">
        {formatReadableDate(tag.createdAt)}
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(tag)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200"
          >
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </button>
          <button
            type="button"
            onClick={() => onDelete(tag.id, tag.name)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded-lg border border-rose-200 bg-white px-2.5 py-1 text-xs font-semibold text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-rose-900/40 dark:bg-slate-800 dark:text-rose-400 dark:hover:bg-rose-900/20"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {isDeleting ? "Đang xoá..." : "Xoá"}
          </button>
        </div>
      </td>
    </tr>
  );
}
