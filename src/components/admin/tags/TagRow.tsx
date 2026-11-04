import { Hash, Loader2, Pencil, Trash2 } from "lucide-react";
import { formatReadableDate } from "@/utils/dateUtils";
import type { TagDetailResponse } from "@/types/tag";
import { Button } from "@/components/ui/button";

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
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-2.5 py-0.5 text-xs font-semibold text-primary">
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
        <div className="inline-flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(tag)}
            className="h-8 gap-1 px-3 text-xs font-medium rounded-full cursor-pointer hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDelete(tag.id, tag.name)}
            disabled={isDeleting}
            className="h-8 gap-1 px-3 text-xs font-medium rounded-full cursor-pointer border-destructive/25 text-destructive hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive dark:bg-surface"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {isDeleting ? "Đang xóa..." : "Xóa"}
          </Button>
        </div>
      </td>
    </tr>
  );
}
