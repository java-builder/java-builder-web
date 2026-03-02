"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { notificationApi } from "@/services/notification.service";
import { SendAdminNotificationRequest } from "@/types/notification";
import { userApi } from "@/services/user.service";
import { UserDetailResponse } from "@/types/user";
import { useDebounce } from "@/hooks/useDebounce";

export default function SendNotificationPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [users, setUsers] = useState<UserDetailResponse[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const loadUsers = useCallback(async () => {
    setIsLoadingUsers(true);
    try {
      const res = await userApi.search({
        page: 1,
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
      });
      setUsers(res.data?.data || []);
    } catch {
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setIsLoadingUsers(false);
    }
  }, [debouncedSearchQuery]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = users;

  const handleUserSelect = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((u) => u.id));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Vui lòng nhập tiêu đề và nội dung");
      return;
    }

    if (selectedUsers.length === 0) {
      toast.error("Vui lòng chọn ít nhất một người nhận");
      return;
    }

    setIsLoading(true);
    try {
      const request: SendAdminNotificationRequest = {
        title: title.trim(),
        content: content.trim(),
        link: link.trim() || undefined,
        recipientIds: selectedUsers,
      };

      const res = await notificationApi.sendAdminNotification(request);
      toast.success(`Đã gửi thông báo đến ${res.data?.totalRecipients} người dùng`);
      router.push("/admin/notifications");
    } catch {
      toast.error("Gửi thông báo thất bại");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-2">
          <Link
            href="/admin/notifications"
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Gửi thông báo</h1>
        </div>
        <p className="text-sm text-gray-500">
          Tạo và gửi thông báo đến người dùng
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Nội dung thông báo</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tiêu đề <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Nhập tiêu đề thông báo..."
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nội dung <span className="text-red-500">*</span>
              </label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Nhập nội dung thông báo..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Liên kết (tùy chọn)
              </label>
              <input
                type="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm ring-1 ring-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Người nhận</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm kiếm người dùng..."
                  className="w-full px-4 py-2 pl-10 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-500"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <button
                type="button"
                onClick={handleSelectAll}
                className="px-4 py-2 text-sm text-accent-600 hover:text-accent-700 border border-accent-200 rounded-lg hover:bg-accent-50"
              >
                {selectedUsers.length === filteredUsers.length && filteredUsers.length > 0
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả"}
              </button>
            </div>

            {selectedUsers.length > 0 && (
              <div className="text-sm text-gray-600">
                Đã chọn: <span className="font-medium text-accent-600">{selectedUsers.length}</span> người dùng
              </div>
            )}

            <div className="max-h-72 overflow-y-auto border border-gray-200 rounded-lg">
              {isLoadingUsers ? (
                <div className="p-4 text-center text-gray-500">Đang tải...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="p-4 text-center text-gray-500">Không tìm thấy người dùng</div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => handleUserSelect(user.id)}
                    className={`flex items-center gap-3 p-3 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors ${selectedUsers.includes(user.id)
                        ? "bg-accent-50"
                        : "hover:bg-gray-50"
                      }`}
                  >
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${selectedUsers.includes(user.id)
                        ? "bg-accent-600 border-accent-600"
                        : "border-gray-300"
                      }`}>
                      {selectedUsers.includes(user.id) && (
                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    {user.avatar ? (
                      <Image
                        src={user.avatar}
                        alt={user.username || "Avatar"}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                        unoptimized
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gradient-to-r from-accent-500 to-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                        {user.username?.charAt(0)?.toUpperCase() || "U"}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">{user.username}</div>
                      <div className="text-sm text-gray-500 truncate">{user.email}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3">
          <Link
            href="/admin/notifications"
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isLoading || selectedUsers.length === 0}
            className="px-6 py-2 bg-accent-600 text-white rounded-lg hover:bg-accent-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Đang gửi...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                Gửi thông báo
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
