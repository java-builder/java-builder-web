import { Loader2, Pencil, Trash2 } from "lucide-react";
import { formatReadableDate } from "@/utils/dateUtils";
import { CategoryDetailResponse, CategoryType } from "@/types/category";
import { useI18n } from "@/contexts/I18nContext";
import { Button } from "@/components/ui/button";

interface CategoryRowProps {
  category: CategoryDetailResponse;
  isDeleting: boolean;
  onEdit: (category: CategoryDetailResponse) => void;
  onDelete: (id: string, name: string) => void;
}

export default function CategoryRow({
  category,
  isDeleting,
  onEdit,
  onDelete,
}: CategoryRowProps) {
  const { t } = useI18n();
  const isBlog = category.categoryType === CategoryType.BLOG;
  const isChallenge = category.categoryType === CategoryType.CHALLENGE;

  return (
    <tr className="transition hover:bg-muted/25">
      {/* Name */}
      <td className="px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">
            {category.name}
          </div>
          <div className="truncate font-mono text-[11px] text-muted-foreground">
            {category.slug}
          </div>
        </div>
      </td>

      {/* Type */}
      <td className="whitespace-nowrap px-4 py-3">
        <span
          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${
            isBlog
              ? "bg-blue-50 text-blue-700 ring-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:ring-blue-800"
              : isChallenge
              ? "bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:ring-orange-800"
              : "bg-violet-50 text-violet-700 ring-violet-200 dark:bg-violet-900/20 dark:text-violet-400 dark:ring-violet-800"
          }`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              isBlog ? "bg-blue-500" : isChallenge ? "bg-orange-500" : "bg-violet-500"
            }`}
          />
          {isBlog
            ? t("admin.categories.tabBlog")
            : isChallenge
            ? "Thử thách"
            : t("admin.categories.tabPost")}
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
        <div className="inline-flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onEdit(category)}
            className="h-8 gap-1 px-3 text-xs font-medium rounded-full cursor-pointer hover:text-primary"
          >
            <Pencil className="h-3.5 w-3.5" />
            {t("admin.common.edit")}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onDelete(category.id, category.name)}
            disabled={isDeleting}
            className="h-8 gap-1 px-3 text-xs font-medium rounded-full cursor-pointer border-destructive/25 text-destructive hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive dark:bg-surface"
          >
            {isDeleting ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Trash2 className="h-3.5 w-3.5" />
            )}
            {isDeleting ? t("admin.common.deleting") : t("admin.common.delete")}
          </Button>
        </div>
      </td>
    </tr>
  );
}
