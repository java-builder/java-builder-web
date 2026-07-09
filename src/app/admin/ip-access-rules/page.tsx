"use client";

import { useState } from "react";
import { useIpAccessRules } from "@/hooks/use-ip-access-rules";
import { CreateRuleModal } from "@/components/admin/ip-access-rules/create-modal";
import { EditRuleModal } from "@/components/admin/ip-access-rules/edit-modal";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { CloudflareAccessRule } from "@/types/cloudflare";

export default function AdminIpAccessRulesPage() {
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
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-slate-900 text-foreground transition-colors duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2.5">
            Quản lý chặn IP & Access Rules
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/50">
              Đang chặn {blockedCount} IP
            </span>
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Cấu hình chặn, cấp phép hoặc thử thách truy cập từ IP, dải IP, Quốc gia sang website thông qua Cloudflare
          </p>
        </div>
        <button
          onClick={() => {
            setShowCreateModal(true);
          }}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white text-sm font-semibold rounded-lg shadow-sm transition-all duration-150 transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <svg className="w-4.5 h-4.5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Chặn IP / Access Rule mới
        </button>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-255 dark:border-slate-700 rounded-xl p-5 mb-6 shadow-xs">
        <h2 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-4">Bộ lọc danh sách</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Mục tiêu (Target)</label>
            <div className="relative">
              <select
                value={filterTarget}
                onChange={(e) => handleFilterChange(setFilterTarget, e.target.value)}
                className="appearance-none w-full pl-3 pr-8 py-2 bg-gray-55 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <option value="">Tất cả mục tiêu</option>
                <option value="ip">IP đơn lẻ (ip)</option>
                <option value="ip_range">Dải IP (ip_range)</option>
                <option value="country">Quốc gia (country - Yêu cầu Enterprise)</option>
                <option value="asn">ASN (Mạng)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-muted-foreground mb-1">Chế độ (Mode)</label>
            <div className="relative">
              <select
                value={filterMode}
                onChange={(e) => handleFilterChange(setFilterMode, e.target.value)}
                className="appearance-none w-full pl-3 pr-8 py-2 bg-gray-55 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20 text-slate-800 dark:text-slate-100 cursor-pointer"
              >
                <option value="">Tất cả hành vi</option>
                <option value="block">Block</option>
                <option value="challenge">Challenge</option>
                <option value="js_challenge">JS Challenge</option>
                <option value="managed_challenge">Managed Challenge</option>
                <option value="whitelist">Whitelist</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2.5 text-muted-foreground">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
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
              className="w-full px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-red-500/20"
            />
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 border border-gray-250 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          {isLoading ? (
            <div className="py-20 text-center text-muted-foreground animate-pulse text-sm">
              Đang tải danh sách IP Access Rules từ Cloudflare...
            </div>
          ) : (
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-55/60 dark:bg-slate-700/30 border-b border-gray-200 dark:border-slate-700 text-xs font-semibold uppercase tracking-wider text-muted-foreground select-none">
                  <th className="py-4 px-5">Target</th>
                  <th className="py-4 px-5">Giá trị chặn</th>
                  <th className="py-4 px-5">Chế độ hành vi</th>
                  <th className="py-4 px-5">Ghi chú</th>
                  <th className="py-4 px-5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-slate-700 text-sm">
                {rules.length > 0 ? (
                  rules.map((rule) => (
                    <tr key={rule.id} className="hover:bg-gray-50/50 dark:hover:bg-slate-700/10 transition-colors">
                      <td className="py-4 px-5 font-mono text-xs uppercase text-muted-foreground select-none">
                        {rule.configuration.target}
                      </td>
                      <td className="py-4 px-5 font-semibold font-mono tracking-tight text-slate-800 dark:text-slate-100">
                        {rule.configuration.value}
                      </td>
                      <td className="py-4 px-5">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getModeBadge(rule.mode)}`}>
                          {rule.mode}
                        </span>
                      </td>
                      <td className="py-4 px-5 text-muted-foreground max-w-xs truncate">
                        {rule.notes || <span className="text-gray-400 italic">Không có ghi chú</span>}
                      </td>
                      <td className="py-4 px-5 text-right whitespace-nowrap">
                        <button
                          onClick={() => handleEditClick(rule)}
                          className="inline-flex items-center p-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-md transition-colors mr-2.5"
                          title="Chỉnh sửa rule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => setRuleToDelete(rule)}
                          className="inline-flex items-center p-1.5 bg-red-50 hover:bg-red-100 dark:bg-red-950/20 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 rounded-md transition-colors"
                          title="Bỏ chặn / Xóa rule"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
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
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-slate-800 border-t border-gray-250 dark:border-slate-700 gap-4 text-xs select-none">
            <span className="text-muted-foreground">
              Hiển thị <span className="font-semibold text-foreground">{(page - 1) * perPage + 1}</span> - <span className="font-semibold text-foreground">{Math.min(page * perPage, totalCount)}</span> trong tổng số <span className="font-semibold text-foreground">{totalCount}</span> rules
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="inline-flex items-center justify-center p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-150 disabled:opacity-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              {Array.from({ length: totalPages }).map((_, idx) => {
                const pageNum = idx + 1;
                if (pageNum === 1 || pageNum === totalPages || Math.abs(pageNum - page) <= 1) {
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-lg text-xs font-semibold border transition-all ${page === pageNum
                          ? "bg-red-600 dark:bg-red-700 border-red-600 text-white shadow-xs"
                          : "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 hover:bg-gray-100"
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
                className="inline-flex items-center justify-center p-2 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg hover:bg-gray-150 disabled:opacity-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <select
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
                className="ml-2.5 px-2 py-1.5 bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600 rounded-lg"
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
