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
    <tr className="transition hover:bg-muted/25">
      {/* Name */}
      <td className="px-4 py-3">
        <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2 py-0.5 text-sm font-semibold text-accent">
          <Hash className="h-3 w-3" />
          {tag.name}
        </span>
      </td>

      {/* Slug */}
      <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
        {tag.slug}
      </td>

      {/* Created at */}
      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-muted-foreground">
        {formatReadableDate(tag.createdAt)}
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(tag)}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground transition hover:border-accent hover:text-accent cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </button>
          <button
            type="button"
            onClick={() => onDelete(tag.id, tag.name)}
            disabled={isDeleting}
            className="inline-flex items-center gap-1 rounded-lg border border-destructive/20 bg-card px-2.5 py-1 text-xs font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
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
