"use client";

import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { cacheService } from "@/services/cache.service";
import { Button } from "@/components/ui/button";
import { X, Search, Trash2, Copy, Check, Loader2, KeyRound } from "lucide-react";
import toast from "react-hot-toast";

interface CacheKeysModalProps {
  isOpen: boolean;
  onClose: () => void;
  cacheName: string | null;
  onKeyEvicted?: () => void;
}

export function CacheKeysModal({
  isOpen,
  onClose,
  cacheName,
  onKeyEvicted,
}: CacheKeysModalProps) {
  const { t } = useI18n();
  const [keys, setKeys] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [deletingKey, setDeletingKey] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const loadKeys = useCallback(async (name: string) => {
    try {
      setIsLoading(true);
      const res = await cacheService.getKeys(name);
      setKeys(res.data || []);
    } catch {
      toast.error(t("admin.common.loadError") || "Không thể tải danh sách keys");
    } finally {
      setIsLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (isOpen && cacheName) {
      loadKeys(cacheName);
    } else {
      setKeys([]);
      setSearch("");
    }
  }, [isOpen, cacheName, loadKeys]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  const handleCopy = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    toast.success("Đã copy key");
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleEvict = async (key: string) => {
    if (!cacheName) return;
    try {
      setDeletingKey(key);
      await cacheService.evictKey(cacheName, key);
      toast.success(t("admin.caches.evictKeySuccess"));
      setKeys((prev) => prev.filter((k) => k !== key));
      if (onKeyEvicted) {
        onKeyEvicted();
      }
    } catch {
      toast.error(t("admin.common.genericError") || "Không thể xóa key");
    } finally {
      setDeletingKey(null);
    }
  };

  if (!isOpen || !cacheName) return null;

  const filteredKeys = keys.filter((k) =>
    k.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-card border border-border rounded-2xl shadow-2xl max-w-2xl w-full flex flex-col max-h-[85vh] animate-in fade-in-0 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">
                {t("admin.caches.keysModalTitle").replace("{name}", cacheName)}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("admin.caches.keysModalSubtitle")}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-border bg-muted/20">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("admin.caches.searchKeyPlaceholder")}
              className="w-full pl-9 pr-4 py-2 text-sm bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Key List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {isLoading ? (
            <div className="py-16 flex flex-col items-center justify-center gap-2 text-muted-foreground">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
              <p className="text-xs">{t("common.loading")}</p>
            </div>
          ) : filteredKeys.length === 0 ? (
            <div className="py-16 text-center text-muted-foreground">
              <p className="text-sm font-medium">{t("admin.caches.noKeysFound")}</p>
            </div>
          ) : (
            filteredKeys.map((key) => (
              <div
                key={key}
                className="flex items-center justify-between p-3 rounded-lg border border-border bg-card hover:bg-muted/40 transition-colors gap-3 group"
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <code className="text-xs font-mono font-medium text-foreground bg-muted px-2 py-1 rounded truncate">
                    {key}
                  </code>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={() => handleCopy(key)}
                    className="text-muted-foreground hover:text-foreground cursor-pointer"
                    title="Copy key"
                  >
                    {copiedKey === key ? (
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="xs"
                    onClick={() => handleEvict(key)}
                    disabled={deletingKey === key}
                    className="cursor-pointer"
                  >
                    {deletingKey === key ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Trash2 className="w-3.5 h-3.5" />
                    )}
                    <span className="ml-1 text-xs">
                      {t("admin.caches.deleteKeyBtn")}
                    </span>
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border flex items-center justify-between bg-muted/20">
          <span className="text-xs text-muted-foreground">
            {filteredKeys.length} / {keys.length} keys
          </span>
          <Button variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
            {t("admin.caches.closeBtn")}
          </Button>
        </div>
      </div>
    </div>
  );
}
