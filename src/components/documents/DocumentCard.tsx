import React from "react";
import Image from "next/image";
import { Document, DocumentType } from "@/types/document";
import { useI18n } from "@/contexts/I18nContext";
import { ExternalLink, Lock } from "lucide-react";

interface DocumentCardProps {
  document: Document;
  index?: number;
}

export default function DocumentCard({ document, index = 0 }: DocumentCardProps) {
  const { t } = useI18n();
  const [imageError, setImageError] = React.useState(false);

  const getDocumentTypeInfo = (type: DocumentType) => {
    const typeMap = {
      [DocumentType.BOOK]: {
        name: t("documentsPage.types.book"),
        color: "bg-[#FFF0E8] text-[#FF5A1F] border border-[#FFD8C7] dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50",
        icon: "📚"
      },
      [DocumentType.ARTICLE]: {
        name: t("documentsPage.types.article"),
        color: "bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-400 dark:border-emerald-900/50",
        icon: "📝"
      },
      [DocumentType.VIDEO]: {
        name: t("documentsPage.types.video"),
        color: "bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-400 dark:border-rose-900/50",
        icon: "🎥"
      },
      [DocumentType.TUTORIAL]: {
        name: t("documentsPage.types.tutorial"),
        color: "bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/50",
        icon: "🎓"
      },
      [DocumentType.PDF]: {
        name: t("documentsPage.types.pdf"),
        color: "bg-[#FFF0E8] text-[#FF5A1F] border border-[#FFD8C7] dark:bg-orange-950/40 dark:text-orange-400 dark:border-orange-900/50",
        icon: "📄"
      },
      [DocumentType.OTHER]: {
        name: t("documentsPage.types.other"),
        color: "bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700",
        icon: "📋"
      }
    };
    return typeMap[type] || typeMap[DocumentType.OTHER];
  };

  const getGradient = (index: number) => {
    const gradients = [
      "from-slate-800 via-slate-900 to-black",
      "from-zinc-800 via-zinc-900 to-black",
      "from-neutral-800 via-neutral-900 to-black",
      "from-stone-800 via-stone-900 to-black",
    ];
    return gradients[index % gradients.length];
  };

  const typeInfo = getDocumentTypeInfo(document.type);
  const gradient = getGradient(index);

  const handleClick = () => {
    if (document.url) {
      window.open(document.url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`group relative flex flex-col h-full overflow-hidden rounded-2xl border border-[#E8E8E8] dark:border-border bg-white dark:bg-surface shadow-xs transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-[#FF5A1F]/5 ${
        document.url ? 'cursor-pointer' : 'cursor-default'
      }`}
    >
      {/* Header */}
      <div className="relative aspect-[16/10] overflow-hidden flex-shrink-0 bg-slate-900">
        {document.thumbnailUrl && !imageError ? (
          <Image
            src={document.thumbnailUrl}
            alt={document.title}
            width={400}
            height={224}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            unoptimized
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`h-full bg-gradient-to-r ${gradient} flex items-center justify-center p-4`}>
            <div className="text-center">
              <div className="w-14 h-16 bg-white/10 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-lg">
                <span className="text-2xl">{typeInfo.icon}</span>
              </div>
              <h3 className="text-white font-bold text-xs leading-tight line-clamp-2 px-2">
                {document.title}
              </h3>
            </div>
          </div>
        )}

        {/* Type Badge */}
        <div className="absolute top-2.5 left-2.5 z-10">
          <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${typeInfo.color} shadow-xs`}>
            <span>{typeInfo.icon}</span>
            <span>{typeInfo.name}</span>
          </span>
        </div>

        <div className="absolute inset-0 bg-black/10 pointer-events-none" />
      </div>

      {/* Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <h4 className="text-base font-bold text-[#171717] dark:text-white mb-2 line-clamp-2 group-hover:text-[#FF5A1F] transition-colors leading-snug">
          {document.title}
        </h4>

        {document.description && (
          <p className="text-xs text-[#64748B] dark:text-slate-400 mb-4 leading-relaxed line-clamp-2">
            {document.description}
          </p>
        )}

        {/* Footer */}
        <div className="mt-auto pt-3.5 border-t border-[#E8E8E8] dark:border-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Image
              src="/logos/java-logo.png"
              alt="JavaBuilder"
              width={18}
              height={18}
              className="rounded-full"
            />
            <span className="text-xs font-semibold text-[#171717] dark:text-white">
              JavaBuilder
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 text-xs font-bold transition-transform duration-200 group-hover:translate-x-0.5 ${
              document.url
                ? "text-[#FF5A1F] group-hover:text-[#e04b16]"
                : "text-[#64748B] dark:text-slate-500"
            }`}
          >
            <span>{document.url ? t("documentsPage.accessDoc") : t("documentsPage.noLink")}</span>
            {document.url ? (
              <ExternalLink className="w-3.5 h-3.5" />
            ) : (
              <Lock className="w-3.5 h-3.5" />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
