"use client";

import React, { useState } from "react";
import { useI18n } from "@/contexts/I18nContext";
import { SystemHealthResponse } from "@/types/system-metric";
import { X, Copy, Check, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface DiagnosticInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: SystemHealthResponse | null;
}

export function DiagnosticInspectorModal({
  isOpen,
  onClose,
  data,
}: DiagnosticInspectorModalProps) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonString);
      setCopied(true);
      toast.success(t("admin.systemMetrics.copied") || "Copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy JSON");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl rounded-xl border border-border bg-card shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">
                {t("admin.systemMetrics.diagnosticInspector")}
              </h3>
              <p className="text-xs text-muted-foreground">
                Raw JSON response from GET /api/v1/system-metrics
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="cursor-pointer gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-500 font-semibold">{t("admin.systemMetrics.copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-muted-foreground" />
                  <span>{t("admin.systemMetrics.copyJson")}</span>
                </>
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="cursor-pointer text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content body with syntax style */}
        <div className="p-6 overflow-y-auto font-mono text-xs bg-slate-950 text-slate-100 dark:bg-black/90 selection:bg-primary/30">
          <pre className="whitespace-pre-wrap leading-relaxed">
            {jsonString || "// No payload available"}
          </pre>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-3 bg-secondary/30 text-xs text-muted-foreground">
          <span>System Metrics & Health Payload</span>
          <Button variant="outline" size="sm" onClick={onClose} className="cursor-pointer">
            {t("admin.systemMetrics.close") || "Close"}
          </Button>
        </div>
      </div>
    </div>
  );
}
