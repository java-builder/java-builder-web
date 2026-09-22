"use client";

import { useI18n } from "@/contexts/I18nContext";
import { CacheInfo } from "@/types/cache";
import { Button } from "@/components/ui/button";
import { KeyRound, Trash2, Clock, Database, Layers } from "lucide-react";

interface CacheTableProps {
  caches: CacheInfo[];
  isLoading: boolean;
  onViewKeys: (cacheName: string) => void;
  onClearCache: (cache: CacheInfo) => void;
  isClearingName?: string | null;
}

export function CacheTable({
  caches,
  isLoading,
  onViewKeys,
  onClearCache,
  isClearingName,
}: CacheTableProps) {
  const { t } = useI18n();

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary mb-3"></div>
        <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
      </div>
    );
  }

  if (caches.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3 text-muted-foreground">
          <Database className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-foreground">
          {t("admin.caches.noCachesFound")}
        </h3>
        <p className="text-sm text-muted-foreground mt-1">
          {t("admin.caches.noCachesSubtitle")}
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-muted/50 border-b border-border text-xs uppercase font-semibold text-muted-foreground tracking-wider">
            <tr>
              <th className="py-3.5 px-4 w-12 text-center">#</th>
              <th className="py-3.5 px-4">{t("admin.caches.colName")}</th>
              <th className="py-3.5 px-4">{t("admin.caches.colDescription")}</th>
              <th className="py-3.5 px-4 w-36 text-center">{t("admin.caches.colTTL")}</th>
              <th className="py-3.5 px-4 w-32 text-center">{t("admin.caches.colKeyCount")}</th>
              <th className="py-3.5 px-4 w-48 text-right">{t("admin.caches.colActions")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {caches.map((cache, index) => {
              const isClearing = isClearingName === cache.name;
              return (
                <tr
                  key={cache.name}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Index */}
                  <td className="py-3.5 px-4 text-center text-xs text-muted-foreground font-mono">
                    {index + 1}
                  </td>

                  {/* Cache Name & Display Name */}
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground flex items-center gap-2">
                          <span>{cache.displayName}</span>
                        </div>
                        <code className="text-xs text-muted-foreground font-mono">
                          {cache.name}
                        </code>
                      </div>
                    </div>
                  </td>

                  {/* Description */}
                  <td className="py-3.5 px-4 text-xs text-muted-foreground max-w-md">
                    {cache.description}
                  </td>

                  {/* TTL */}
                  <td className="py-3.5 px-4 text-center">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-muted text-foreground border border-border">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      {cache.ttl}
                    </span>
                  </td>

                  {/* Key Count */}
                  <td className="py-3.5 px-4 text-center">
                    <span
                      className={`inline-flex items-center justify-center min-w-[2.25rem] px-2 py-0.5 rounded-full text-xs font-semibold ${
                        cache.keyCount > 0
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
                          : "bg-muted text-muted-foreground border border-border"
                      }`}
                    >
                      {cache.keyCount}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="outline"
                        size="xs"
                        onClick={() => onViewKeys(cache.name)}
                        className="cursor-pointer gap-1"
                        title={t("admin.caches.viewKeysBtn")}
                      >
                        <KeyRound className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>{t("admin.caches.viewKeysBtn")}</span>
                      </Button>
                      <Button
                        variant="destructive"
                        size="xs"
                        onClick={() => onClearCache(cache)}
                        disabled={isClearing}
                        className="cursor-pointer gap-1"
                        title={t("admin.caches.clearCacheBtn")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t("admin.caches.clearCacheBtn")}</span>
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
