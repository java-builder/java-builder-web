"use client";

import { useState } from "react";
import { useIpAccessRules } from "@/hooks/use-ip-access-rules";
import { CreateRuleModal } from "@/components/admin/ip-access-rules/CreateRuleModal";
import { EditRuleModal } from "@/components/admin/ip-access-rules/EditRuleModal";
import ConfirmModal from "@/components/ui/confirm-modal";
import { Button } from "@/components/ui/button";
import { CloudflareAccessRule } from "@/types/cloudflare";
import { ChevronDown, Pencil, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function AdminIpAccessRulesPage() {
  const { t } = useI18n();
  const [ruleToDelete, setRuleToDelete] = useState<CloudflareAccessRule | null>(null);
  const {
    rules,
    isLoading,
    page,
    setPage,
    perPage,
    setPerPage,
    totalCount,
    filterTarget,
    setFilterTarget,
    filterValue,
    setFilterValue,
    filterMode,
    setFilterMode,
    filterNotes,
    setFilterNotes,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    editingRule,
    setEditingRule,
    isSubmitting,
    handleFilterChange,
    handleCreateSubmit,
    handleEditClick,
    handleEditSubmit,
    handleDelete,
    totalPages,
    getModeBadge,
    getValuePlaceholder,
    blockedCount,
  } = useIpAccessRules();

  return (
    <div className="p-6 min-h-screen bg-background text-foreground transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            {t("admin.ipAccessRules.pageTitle")}
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-500 border border-red-500/20">
              Blocked: {blockedCount}
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            {t("admin.ipAccessRules.pageSubtitle")}
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center justify-center px-4 py-2 text-sm font-semibold rounded-full bg-primary text-white hover:bg-primary-hover transition-all cursor-pointer"
        >
          {t("admin.ipAccessRules.addRuleBtn")}
        </button>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5 mb-6 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Bộ lọc danh sách</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Mục tiêu (Target)</label>
            <div className="relative">
              <select
                value={filterTarget}
                onChange={(e) => handleFilterChange(setFilterTarget, e.target.value)}
                className="appearance-none w-full pl-3 pr-8 py-2 bg-transparent border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
              >
                <option value="">Tất cả mục tiêu</option>
                <option value="ip">IP đơn lẻ (ip)</option>
                <option value="ip_range">Dải IP (ip_range)</option>
                <option value="country">Quốc gia (country - Yêu cầu Enterprise)</option>
                <option value="asn">ASN (Mạng)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Giá trị (Value / IP)</label>
            <input
              type="text"
              placeholder={filterTarget ? getValuePlaceholder(filterTarget) : "Chọn mục tiêu để xem gợi ý..."}
              value={filterValue}
              onChange={(e) => handleFilterChange(setFilterValue, e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Chế độ (Mode)</label>
            <div className="relative">
              <select
                value={filterMode}
                onChange={(e) => handleFilterChange(setFilterMode, e.target.value)}
                className="appearance-none w-full pl-3 pr-8 py-2 bg-transparent border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground cursor-pointer"
              >
                <option value="">Tất cả hành vi</option>
                <option value="block">Block</option>
                <option value="challenge">Challenge</option>
                <option value="js_challenge">JS Challenge</option>
                <option value="managed_challenge">Managed Challenge</option>
                <option value="whitelist">Whitelist</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground">
                <ChevronDown className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Ghi chú (Notes)</label>
            <input
              type="text"
              placeholder="Từ khóa ghi chú..."
              value={filterNotes}
              onChange={(e) => handleFilterChange(setFilterNotes, e.target.value)}
              className="w-full px-3 py-2 bg-transparent border border-border rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-primary/20 text-foreground"
            />
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground text-sm">
              Đang tải danh sách IP Access Rules từ Cloudflare...
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-muted/40 border-b border-border text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
                  <th className="py-4 px-5">Target</th>
                  <th className="py-4 px-5">Giá trị chặn</th>
                  <th className="py-4 px-5">Chế độ hành vi</th>
                  <th className="py-4 px-5">Ghi chú</th>
                  <th className="py-4 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm">
                {rules.length > 0 ? (
                  rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-muted/30 transition-colors">
                      <td className="py-4 px-5 font-mono text-xs uppercase text-muted-foreground select-none">
                        {rule.configuration.target}
                      </td>
                      <td className="py-4 px-5 font-semibold font-mono tracking-tight text-foreground">
                        {rule.configuration.value}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getModeBadge(rule.mode)}`}>
                          {rule.mode}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-muted-foreground max-w-xs truncate">
                        {rule.notes || <span className="text-muted-foreground/60 italic">Không có ghi chú</span>}
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1.5">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditClick(rule)}
                            className="h-8 gap-1 px-3 text-xs font-medium rounded-full cursor-pointer hover:text-primary"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            <span>Sửa</span>
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setRuleToDelete(rule)}
                            className="h-8 gap-1 px-3 text-xs font-medium rounded-full cursor-pointer border-destructive/25 text-destructive hover:bg-destructive/10 hover:border-destructive/40 hover:text-destructive dark:bg-surface"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Xóa</span>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 px-5 text-center text-muted-foreground italic">
                      Không tìm thấy IP access rule nào khớp
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-background dark:bg-surface border-t border-border gap-4 text-xs select-none">
            <span className="text-muted-foreground">
              Hiển thị <span className="font-semibold text-foreground">{(page - 1) * perPage + 1}</span> - <span className="font-semibold text-foreground">{Math.min(page * perPage, totalCount)}</span> trong tổng số <span className="font-semibold text-foreground">{totalCount}</span> rules
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="inline-flex items-center justify-center p-2 bg-surface border border-border rounded-xl hover:bg-muted disabled:opacity-50 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - page) <= 1) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                        page === pageNum
                          ? "bg-primary border-primary text-white shadow-xs"
                          : "bg-surface border-border hover:bg-muted text-foreground"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                } else if (pageNum === 2 || pageNum === totalPages - 1) {
                  return <span key={pageNum} className="px-1 text-muted-foreground">...</span>;
                }
                return null;
              })}

              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="inline-flex items-center justify-center p-2 bg-surface border border-border rounded-xl hover:bg-muted disabled:opacity-50 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>

              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="ml-2.5 px-2 py-1.5 bg-surface border border-border rounded-xl text-foreground cursor-pointer"
              >
                <option value={10}>10 / trang</option>
                <option value={20}>20 / trang</option>
                <option value={50}>50 / trang</option>
              </select>
            </div>
          </div>
        )}
      </div>

      <CreateRuleModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        isSubmitting={isSubmitting}
        onSubmit={handleCreateSubmit}
      />

      <EditRuleModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setEditingRule(null);
        }}
        rule={editingRule}
        isSubmitting={isSubmitting}
        onSubmit={handleEditSubmit}
      />

      <ConfirmModal
        isOpen={ruleToDelete !== null}
        onClose={() => setRuleToDelete(null)}
        onConfirm={async () => {
          if (ruleToDelete) {
            const success = await handleDelete(ruleToDelete);
            if (success) {
              setRuleToDelete(null);
            }
          }
        }}
        title="Xác nhận bỏ chặn / xóa"
        message={`Bạn có chắc chắn muốn bỏ chặn/xóa rule cho <strong class="font-mono">${ruleToDelete?.configuration?.value}</strong>?`}
        confirmText="Xóa bỏ"
        cancelText="Hủy"
        isLoading={isSubmitting}
        type="danger"
      />
    </div>
  );
}
