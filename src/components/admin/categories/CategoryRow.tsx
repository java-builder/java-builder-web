import { Loader2, Pencil, Trash2 } from "lucide-react";
import { formatReadableDate } from "@/utils/dateUtils";
import { CategoryDetailResponse, CategoryType } from "@/types/category";

interface CategoryRowProps {
  category: CategoryDetailResponse;
  isDeleting: boolean;
  onEdit: (category: CategoryDetailResponse) => void;
  onDelete: (id: string, name: string) => void;
}

// Emoji thường có ký tự non-ASCII và <= 4 grapheme.
// Slug text như "spring", "java"... thì pure ASCII.
const isEmojiLike = (value: string) => {
  if (!value) return false;
  if (/^[\x00-\x7F]+$/.test(value)) return false;
  return [...value].length <= 4;
};

export default function CategoryRow({
  category,
  isDeleting,
  onEdit,
  onDelete,
}: CategoryRowProps) {
  const fallbackColor = "#374151";
  const color = category.color || fallbackColor;
  const isBlog = category.categoryType === CategoryType.BLOG;
  const iconValue = category.icon ?? "";
  const isEmoji = isEmojiLike(iconValue);
  const initialChar =
    (iconValue || category.name || "?").trim().charAt(0).toUpperCase();

  return (
    <tr className="transition hover:bg-muted/25">
      {/* Name + icon */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-2.5">
          <span
            className="flex h-9 w-9 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg text-base font-semibold"
            style={{
              background: `${color}1a`,
              color,
            }}
          >
            {isEmoji ? iconValue : initialChar}
          </span>
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">
              {category.name}
            </div>
            <div className="truncate font-mono text-[11px] text-muted-foreground">
              {category.slug}
            </div>
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="whitespace-nowrap px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
            isBlog
              ? "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800"
              : "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:ring-violet-800"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isBlog ? "bg-blue-500" : "bg-violet-500"
            }`}
          />
          {isBlog ? "Blog" : "Bài viết"}
        </span>
      </td>

      {/* Description */}
      <td className="px-4 py-3 text-sm text-muted-foreground">
        {category.description ? (
          <span className="line-clamp-1" title={category.description}>
            {category.description}
          </span>
        ) : (
          <span className="text-muted-foreground/50">—</span>
        )}
      </td>

      {/* Created at */}
      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-muted-foreground">
        {formatReadableDate(category.createdAt)}
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="inline-flex items-center gap-1 rounded-lg border border-border bg-card px-2.5 py-1 text-xs font-semibold text-foreground transition hover:border-accent hover:text-accent cursor-pointer"
          >
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </button>
          <button
            type="button"
            onClick={() => onDelete(category.id, category.name)}
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
