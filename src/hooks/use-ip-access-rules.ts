"use client";

import { useState, useEffect, useCallback } from "react";
import { cloudflareService } from "@/services/cloudflare.service";
import { CloudflareAccessRule, GetAccessRulesRequest } from "@/types/cloudflare";
import toast from "react-hot-toast";

export function useIpAccessRules() {
  const [rules, setRules] = useState<CloudflareAccessRule[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  const [blockedCount, setBlockedCount] = useState(0);

  const [filterTarget, setFilterTarget] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filterMode, setFilterMode] = useState("block");
  const [filterNotes, setFilterNotes] = useState("");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingRule, setEditingRule] = useState<CloudflareAccessRule | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchBlockedCount = useCallback(async () => {
    try {
      const res = await cloudflareService.getAll({ page: 1, perPage: 1, mode: "block" });
      if (res.data?.success && res.data.result_info) {
        setBlockedCount(res.data.result_info.total_count);
      }
    } catch (e) {
      console.error("Lỗi khi tải số lượng IP bị chặn:", e);
    }
  }, []);

  const fetchRules = useCallback(async () => {
    try {
      setIsLoading(true);
      const params: GetAccessRulesRequest = {
        page,
        perPage,
        target: filterTarget || undefined,
        value: filterValue.trim() || undefined,
        mode: filterMode || undefined,
        notes: filterNotes.trim() || undefined,
      };

      const res = await cloudflareService.getAll(params);
      if (res.data?.success && res.data.result) {
        setRules(res.data.result);
        if (res.data.result_info) {
          const total = res.data.result_info.total_count;
          setTotalCount(total);
          if (filterMode === "block") {
            setBlockedCount(total);
          }
        } else {
          const total = res.data.result.length;
          setTotalCount(total);
          if (filterMode === "block") {
            setBlockedCount(total);
          }
        }
      } else {
        toast.error("Không thể tải danh sách rule từ Cloudflare");
      }
    } catch (e) {
      console.error(e);
      toast.error("Đã xảy ra lỗi khi tải danh sách");
    } finally {
      setIsLoading(false);
    }
  }, [page, perPage, filterTarget, filterValue, filterMode, filterNotes]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchRules();
    }, 400);
    return () => clearTimeout(timer);
  }, [fetchRules]);

  const refreshRulesAndStats = useCallback(() => {
    fetchRules();
    if (filterMode !== "block") {
      fetchBlockedCount();
    }
  }, [fetchRules, fetchBlockedCount, filterMode]);

  const handleFilterChange = (setter: (val: string) => void, val: string) => {
    setter(val);
    setPage(1);
  };

  const handleCreateSubmit = async (data: { target: string; value: string; mode: string; notes: string }) => {
    if (!data.value.trim()) {
      toast.error("Vui lòng điền giá trị IP/Dải IP/Quốc gia/ASN");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await cloudflareService.create({
        mode: data.mode,
        notes: data.notes,
        configuration: {
          target: data.target,
          value: data.value.trim(),
        },
      });

      if (res.data?.success) {
        toast.success("Tạo rule thành công!");
        setShowCreateModal(false);
        refreshRulesAndStats();
      } else {
        toast.error("Tạo rule thất bại trên Cloudflare");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Lỗi khi tạo rule");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (rule: CloudflareAccessRule) => {
    setEditingRule(rule);
    setShowEditModal(true);
  };

  const handleEditSubmit = async (data: { target: string; value: string; mode: string; notes: string }) => {
    if (!editingRule) return;
    setIsSubmitting(true);
    try {
      const res = await cloudflareService.update(editingRule.id, {
        mode: data.mode,
        notes: data.notes,
        configuration: {
          target: data.target,
          value: data.value,
        },
      });

      if (res.data?.success) {
        toast.success("Cập nhật rule thành công!");
        setShowEditModal(false);
        setEditingRule(null);
        refreshRulesAndStats();
      } else {
        toast.error("Cập nhật rule thất bại");
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (rule: CloudflareAccessRule) => {
    setIsSubmitting(true);
    try {
      const res = await cloudflareService.delete(rule.id);
      if (res.data?.success) {
        toast.success("Bỏ chặn thành công!");
        setRules((prev) => prev.filter((r) => r.id !== rule.id));
        setTotalCount((prev) => Math.max(0, prev - 1));
        refreshRulesAndStats();
        return true;
      } else {
        toast.error("Xóa rule thất bại");
        return false;
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || "Lỗi khi xóa rule");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalPages = Math.ceil(totalCount / perPage);

  const getModeBadge = (mode: string) => {
    switch (mode) {
      case "block":
        return "bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-400 border border-red-200 dark:border-red-900/50";
      case "challenge":
        return "bg-amber-100 text-amber-800 dark:bg-amber-950/40 dark:text-amber-400 border border-amber-200 dark:border-amber-900/50";
      case "whitelist":
        return "bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-400 border border-green-200 dark:border-green-900/50";
      case "js_challenge":
        return "bg-blue-100 text-blue-800 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-200 dark:border-blue-900/50";
      case "managed_challenge":
        return "bg-purple-100 text-purple-800 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-200 dark:border-purple-900/50";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700/50";
    }
  };

  const getValuePlaceholder = (target: string) => {
    switch (target) {
      case "ip":
        return "Ví dụ: 198.51.100.4 (IPv4) hoặc 2400:cb00::1 (IPv6)";
      case "ip_range":
        return "Ví dụ: 198.51.100.0/24 (Dải địa chỉ CIDR)";
      case "country":
        return "Ví dụ: VN, US, CN (Mã quốc gia ISO 2 chữ cái)";
      case "asn":
        return "Ví dụ: AS13335 (Mã hiệu mạng ASN)";
      default:
        return "Nhập giá trị cấu hình...";
    }
  };

  return {
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
  };
}
