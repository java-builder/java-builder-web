"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { UpdateProfileRequest, UserDetailResponse, UserStatus } from "@/types/user";
import { userApi } from "@/services/user.service";
import { roleService } from "@/services/role.service";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Loader2, ShieldAlert, Check, X } from "lucide-react";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: UserDetailResponse | null;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onSuccess,
  user,
}: EditUserModalProps) {
  const [formData, setFormData] = useState<Partial<UserDetailResponse>>({
    username: "",
    email: "",
    university: "",
    userStatus: UserStatus.ACTIVE,
    mftEnable: false,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [availableRoles, setAvailableRoles] = useState<string[]>([]);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  // Fetch all available roles from system
  useEffect(() => {
    const fetchAvailableRoles = async () => {
      try {
        const res = await roleService.getAll();
        const roleNames = res.data?.data?.map((r) => r.name) || [];
        setAvailableRoles(roleNames);
      } catch (err) {
        console.error("Failed to fetch roles:", err);
      }
    };

    if (isOpen) {
      fetchAvailableRoles();
    }
  }, [isOpen]);

  // Reset form when user changes
  useEffect(() => {
    if (user && isOpen) {
      setFormData({
        username: user.username,
        email: user.email,
        university: user.university || "",
        userStatus: user.userStatus,
        mftEnable: user.mftEnable,
      });
      setSelectedRoles(user.authorities || []);
      setError("");
    }
  }, [user, isOpen]);

  const handleInputChange = (
    field: keyof Partial<UserDetailResponse>,
    value: string | UserStatus | boolean,
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    setError("");
    try {
      // 1. Update basic profile info
      const updateData: UpdateProfileRequest = {
        username: formData.username?.trim() || undefined,
        university: formData.university?.trim() || undefined,
        userStatus: formData.userStatus,
      };
      await userApi.updateProfileByAdmin(user.id, updateData);

      // 2. Check if roles changed, and update roles if necessary
      const initialRoles = user.authorities || [];
      const isRolesChanged =
        initialRoles.length !== selectedRoles.length ||
        !initialRoles.every((r) => selectedRoles.includes(r));

      if (isRolesChanged) {
        await userApi.assignRoles(user.id, selectedRoles);
      }

      toast.success("Cập nhật thông tin và quyền người dùng thành công!");
      onSuccess();
      handleClose();
    } catch (err: unknown) {
      console.error("Error updating user:", err);
      setError((err as Error)?.message || "Có lỗi xảy ra khi cập nhật người dùng");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      username: "",
      email: "",
      university: "",
      userStatus: UserStatus.ACTIVE,
      mftEnable: false,
    });
    setError("");
    setIsDropdownOpen(false);
    setSelectedRoles([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/40 dark:bg-black/60">
      {/* Modal Box */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 border border-gray-150 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in-0 zoom-in-95 duration-300">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 dark:border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white">
              Chỉnh sửa người dùng
            </h2>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              Cập nhật thông tin, quyền hạn và trạng thái người dùng
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="px-5 py-4 space-y-4 max-h-[calc(100dvh-180px)] overflow-y-auto">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Ảnh đại diện
              </label>
              <div className="flex items-center space-x-4 p-3 rounded-xl border border-gray-100 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/40">
                <div className="relative h-14 w-14 flex-shrink-0">
                  {user?.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.username}
                      fill
                      sizes="56px"
                      className="rounded-full object-cover border border-gray-200 dark:border-slate-700"
                      unoptimized
                    />
                  ) : (
                    <div className="h-14 w-14 rounded-full bg-gradient-to-r from-accent to-accent-600 flex items-center justify-center">
                      <span className="text-lg font-bold text-white uppercase">
                        {user?.username?.charAt(0) || "U"}
                      </span>
                    </div>
                  )}
                </div>
                <div className="space-y-0.5">
                  <p className="text-xs font-medium text-gray-950 dark:text-white">Ảnh đại diện người dùng</p>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400">
                    Ảnh đại diện do người dùng quản lý và không thể chỉnh sửa từ admin.
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Tên người dùng
                </label>
                <input
                  type="text"
                  value={formData.username || ""}
                  disabled
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/30 px-3 py-2 text-sm text-gray-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email || ""}
                  disabled
                  className="flex h-10 w-full rounded-lg border border-gray-200 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/30 px-3 py-2 text-sm text-gray-500 dark:text-slate-400 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                Trường đại học
              </label>
              <input
                type="text"
                value={formData.university || ""}
                disabled
                placeholder="Chưa cập nhật thông tin trường đại học"
                className="flex h-10 w-full rounded-lg border border-gray-200 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/30 px-3 py-2 text-sm text-gray-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-700 dark:text-slate-350 flex items-center justify-between">
                <span>Quyền hạn tài khoản <span className="text-rose-500">*</span></span>
                <span className="text-[10px] font-normal text-gray-400 normal-case dark:text-slate-500">(Chọn ít nhất 1 quyền)</span>
              </label>
              <div className="divide-y divide-gray-150 dark:divide-slate-800 rounded-xl border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
                {availableRoles.length > 0 ? (
                  availableRoles.map((roleName) => {
                    const isSelected = selectedRoles.includes(roleName);

                    const roleMeta: Record<string, { label: string; desc: string }> = {
                      ADMIN: {
                        label: "Quản trị viên (ADMIN)",
                        desc: "Toàn quyền quản trị hệ thống, quản lý người dùng, cấu hình và bài học.",
                      },
                      USER: {
                        label: "Học viên (USER)",
                        desc: "Tài khoản học viên thông thường, học bài giảng và làm bài tập.",
                      },
                    };
                    const meta = roleMeta[roleName] || {
                      label: roleName,
                      desc: "Quyền hạn hệ thống cấp cho tài khoản.",
                    };

                    return (
                      <div
                        key={roleName}
                        onClick={() => {
                          if (isSelected) {
                            if (selectedRoles.length === 1) {
                              toast.error("Người dùng phải có ít nhất một quyền");
                              return;
                            }
                            setSelectedRoles(selectedRoles.filter((r) => r !== roleName));
                          } else {
                            setSelectedRoles([...selectedRoles, roleName]);
                          }
                        }}
                        className="flex items-center justify-between py-2.5 px-3.5 hover:bg-gray-50/50 dark:hover:bg-slate-800/20 cursor-pointer select-none transition-colors"
                      >
                        <div className="space-y-0.5 pr-4">
                          <span className="text-xs font-bold text-gray-900 dark:text-white">
                            {meta.label}
                          </span>
                          <p className="text-[11px] text-gray-400 dark:text-slate-455 leading-normal">
                            {meta.desc}
                          </p>
                        </div>

                        <div className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${isSelected ? "bg-accent" : "bg-gray-200 dark:bg-slate-800"
                          }`}>
                          <span className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isSelected ? "translate-x-4" : "translate-x-0"
                            }`} />
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="flex items-center justify-center p-6 gap-2 text-xs text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin text-accent" />
                    Đang tải danh sách quyền...
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700 dark:text-slate-300">
                  Trạng thái tài khoản <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white dark:border-slate-800 dark:bg-slate-900 text-gray-900 dark:text-white px-3 py-2 text-sm shadow-sm transition-all focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-800/30"
                  >
                    <span>
                      {formData.userStatus === UserStatus.ACTIVE ? "Hoạt động" : "Không hoạt động"}
                    </span>
                    <svg className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {isDropdownOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                      <div className="absolute left-0 right-0 mt-1.5 z-20 rounded-lg border border-gray-150 bg-white dark:border-slate-800 dark:bg-slate-900 py-1 shadow-lg ring-1 ring-black/5 animate-in fade-in-0 slide-in-from-top-1 duration-150">
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange("userStatus", UserStatus.ACTIVE);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex w-full items-center px-3.5 py-2.5 text-sm text-left transition-colors ${formData.userStatus === UserStatus.ACTIVE
                            ? "bg-accent/10 text-accent font-semibold dark:bg-accent/25"
                            : "text-gray-700 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                            }`}
                        >
                          Hoạt động
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            handleInputChange("userStatus", UserStatus.INACTIVE);
                            setIsDropdownOpen(false);
                          }}
                          className={`flex w-full items-center px-3.5 py-2.5 text-sm text-left transition-colors ${formData.userStatus === UserStatus.INACTIVE
                            ? "bg-accent/10 text-accent font-semibold dark:bg-accent/25"
                            : "text-gray-700 dark:text-slate-350 hover:bg-gray-50 dark:hover:bg-slate-800/40"
                            }`}
                        >
                          Không hoạt động
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                  Xác thực 2 yếu tố (2FA)
                </label>
                <div className="flex items-center space-x-3 px-3 h-10 rounded-lg border border-gray-200 bg-gray-50/50 dark:border-slate-800 dark:bg-slate-900/30 cursor-not-allowed select-none">
                  <input
                    type="checkbox"
                    id="mftEnable"
                    disabled
                    checked={formData.mftEnable || false}
                    className="h-4 w-4 rounded border-gray-300 text-accent focus:ring-accent dark:bg-slate-800 disabled:opacity-50 cursor-not-allowed"
                  />
                  <label htmlFor="mftEnable" className="text-sm font-medium text-gray-500 dark:text-slate-400 cursor-not-allowed">
                    {formData.mftEnable ? "Đã kích hoạt" : "Chưa kích hoạt"}
                  </label>
                </div>
              </div>
            </div>

            {error && (
              <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl dark:bg-rose-950/20 dark:border-rose-900/30 flex items-start gap-2 text-rose-600 dark:text-rose-400">
                <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="text-xs font-semibold">{error}</p>
              </div>
            )}
          </div>

          <div className="flex items-center justify-end gap-2 px-5 py-3.5 border-t border-gray-100 dark:border-slate-800 bg-gray-50/50 dark:bg-slate-900/40">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="text-xs font-medium"
            >
              Hủy bỏ
            </Button>
            <Button
              type="submit"
              variant="accent"
              disabled={isLoading}
              className="text-xs font-semibold"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                  Đang cập nhật...
                </>
              ) : (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5" />
                  Lưu thay đổi
                </>
              )}
            </Button>
          </div>
        </form>

      </div>
    </div>
  );
}
