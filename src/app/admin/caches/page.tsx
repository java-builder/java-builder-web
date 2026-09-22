"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { cacheService } from "@/services/cache.service";
import { CacheInfo } from "@/types/cache";
import { CacheStatsCards } from "@/components/admin/caches/CacheStatsCards";
import { CacheTable } from "@/components/admin/caches/CacheTable";
import { CacheKeysModal } from "@/components/admin/caches/CacheKeysModal";
import ConfirmModal from "@/components/common/ConfirmModal";
import { Button } from "@/components/ui/button";
import { RefreshCw, Trash2, Search } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminCachesPage() {
  const { t } = useI18n();

  const [caches, setCaches] = useState<CacheInfo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");

  // Modals state
  const [selectedCacheForKeys, setSelectedCacheForKeys] = useState<string | null>(null);
  const [cacheToClear, setCacheToClear] = useState<CacheInfo | null>(null);
  const [showClearAllModal, setShowClearAllModal] = useState(false);
  const [isActionPending, setIsActionPending] = useState(false);

  const fetchCaches = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await cacheService.getAll();
      setCaches(res.data || []);
    } catch {
      toast.error(t("admin.common.loadError") || "Không thể tải danh sách cache");
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchCaches();
  }, [fetchCaches]);

  // Handle clear single cache
  const handleClearSingleCache = async () => {
    if (!cacheToClear) return;
    try {
      setIsActionPending(true);
      await cacheService.clearCache(cacheToClear.name);
      toast.success(t("admin.caches.clearSuccess"));
      setCacheToClear(null);
      await fetchCaches();
    } catch {
      toast.error(t("admin.common.genericError") || "Xóa cache thất bại");
    } finally {
      setIsActionPending(false);
    }
  };

  // Handle clear all caches
  const handleClearAllCaches = async () => {
    try {
      setIsActionPending(true);
      await cacheService.clearAll();
      toast.success(t("admin.caches.clearAllSuccess"));
      setShowClearAllModal(false);
      await fetchCaches();
    } catch {
      toast.error(t("admin.common.genericError") || "Xóa toàn bộ cache thất bại");
    } finally {
      setIsActionPending(false);
    }
  };

  // Filtered caches
  const filteredCaches = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return caches;
    return caches.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.displayName.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [caches, search]);

  const totalKeys = useMemo(() => {
    return caches.reduce((acc, c) => acc + (c.keyCount || 0), 0);
  }, [caches]);

  return (
    <div className="p-6 min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            {t("admin.caches.pageTitle")}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("admin.caches.pageSubtitle")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={fetchCaches}
            disabled={isLoading}
            className="cursor-pointer gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            <span>{t("admin.caches.refreshBtn")}</span>
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => setShowClearAllModal(true)}
            disabled={isLoading || isActionPending}
            className="cursor-pointer gap-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>{t("admin.caches.clearAllBtn")}</span>
          </Button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <CacheStatsCards
        totalCaches={caches.length}
        totalKeys={totalKeys}
        isLoading={isLoading}
      />

      {/* Search & Filter Toolbar */}
      <div className="bg-card border border-border rounded-xl p-4 mb-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("admin.caches.searchPlaceholder")}
            className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
          />
        </div>
        <div className="text-xs text-muted-foreground self-end sm:self-center">
          {filteredCaches.length} / {caches.length} {t("admin.layout.caches").toLowerCase()}
        </div>
      </div>

      {/* Cache Table */}
      <CacheTable
        caches={filteredCaches}
        isLoading={isLoading}
        onViewKeys={(cacheName) => setSelectedCacheForKeys(cacheName)}
        onClearCache={(cache) => setCacheToClear(cache)}
        isClearingName={cacheToClear?.name}
      />

      {/* Modal: View & Evict Keys */}
      <CacheKeysModal
        isOpen={Boolean(selectedCacheForKeys)}
        onClose={() => setSelectedCacheForKeys(null)}
        cacheName={selectedCacheForKeys}
        onKeyEvicted={fetchCaches}
      />

      {/* Confirm Modal: Clear Single Cache */}
      <ConfirmModal
        isOpen={Boolean(cacheToClear)}
        onClose={() => setCacheToClear(null)}
        onConfirm={handleClearSingleCache}
        title={t("admin.caches.clearCacheConfirmTitle").replace(
          "{name}",
          cacheToClear?.displayName || cacheToClear?.name || ""
        )}
        message={t("admin.caches.clearCacheConfirmMsg").replace(
          "{name}",
          cacheToClear?.displayName || cacheToClear?.name || ""
        )}
        confirmText={t("common.delete")}
        cancelText={t("common.cancel")}
        type="danger"
      />

      {/* Confirm Modal: Clear All Caches */}
      <ConfirmModal
        isOpen={showClearAllModal}
        onClose={() => setShowClearAllModal(false)}
        onConfirm={handleClearAllCaches}
        title={t("admin.caches.clearAllConfirmTitle")}
        message={t("admin.caches.clearAllConfirmMsg")}
        confirmText={t("admin.caches.clearAllBtn")}
        cancelText={t("common.cancel")}
        type="danger"
      />
    </div>
  );
}
