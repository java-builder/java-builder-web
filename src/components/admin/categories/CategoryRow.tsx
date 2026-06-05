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
    <tr className="transition hover:bg-gray-50 dark:hover:bg-slate-700/40">
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
            <div className="truncate text-sm font-semibold text-gray-900 dark:text-white">
              {category.name}
            </div>
            <div className="truncate font-mono text-[11px] text-gray-500 dark:text-gray-400">
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
      <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
        {category.description ? (
          <span className="line-clamp-1" title={category.description}>
            {category.description}
          </span>
        ) : (
          <span className="text-gray-400">—</span>
        )}
      </td>

      {/* Created at */}
      <td className="whitespace-nowrap px-4 py-3 text-sm tabular-nums text-gray-600 dark:text-gray-300">
        {formatReadableDate(category.createdAt)}
      </td>

      {/* Actions */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(category)}
            className="inline-flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 transition hover:border-accent hover:text-accent dark:border-slate-700 dark:bg-slate-800 dark:text-gray-200"
          >
            <Pencil className="h-3.5 w-3.5" />
            Sửa
          </button>
          <button
            type="button"
            onClick={() => onDelete(category.id, category.name)}
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
