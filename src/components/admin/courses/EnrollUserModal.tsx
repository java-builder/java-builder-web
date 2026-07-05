"use client";

import { useState, useEffect, useRef } from "react";
import { enrollmentApi } from "@/services/enrollment.service";
import { userApi } from "@/services/user.service";
import { useDebounce } from "@/hooks/useDebounce";
import { UserDetailResponse } from "@/types/user";
import toast from "react-hot-toast";
import { UserPlus, X, Loader2, Search, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface EnrollUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  courseId: string;
  courseTitle: string;
}

export default function EnrollUserModal({
  isOpen,
  onClose,
  onSuccess,
  courseId,
  courseTitle,
}: EnrollUserModalProps) {
  const [email, setEmail] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<UserDetailResponse[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [error, setError] = useState("");

  const debouncedSearch = useDebounce(searchTerm, 300);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      if (debouncedSearch.trim().length < 2) {
        setSearchResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const response = await userApi.search({ search: debouncedSearch });
        if (response.data?.data) {
          setSearchResults(response.data.data);
        } else {
          setSearchResults([]);
        }
      } catch (err) {
        console.error("Error searching users:", err);
      } finally {
        setIsSearching(false);
      }
    };

    fetchUsers();
  }, [debouncedSearch]);

  // Click outside listener
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const validateEmail = (emailStr: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailStr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const targetEmail = email || searchTerm;

    if (!targetEmail.trim()) {
      setError("Email không được để trống");
      return;
    }

    if (!validateEmail(targetEmail)) {
      setError("Email không hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      await enrollmentApi.adminEnrollUser(targetEmail, courseId);
      toast.success("Thêm học viên vào khóa học thành công!");
      onSuccess?.();
      handleClose();
    } catch {
      toast.error("Thêm học viên thất bại. Vui lòng thử lại.");
      setError("Không thể thêm học viên. Email không tồn tại hoặc đã được đăng ký.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setSearchTerm("");
    setSearchResults([]);
    setShowDropdown(false);
    setError("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm bg-black/50 dark:bg-black/70 transition-opacity"
        onClick={handleClose}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Modal content */}
        <div className="relative w-full max-w-xl bg-card text-card-foreground border border-border rounded-xl shadow-2xl z-10 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border bg-muted/40 rounded-t-xl">
            <div className="flex items-center space-x-3.5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 border border-accent/15">
                <UserPlus className="h-5.5 w-5.5 text-accent dark:text-accent-on-dark" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-foreground">Thêm học viên mới</h3>
                <p className="text-xs text-muted-foreground truncate max-w-[340px] mt-0.5" title={courseTitle}>
                  Khóa học: <span className="font-semibold text-foreground/80">{courseTitle}</span>
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 p-2 rounded-lg"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-5">
              {/* Guidance Description Card */}
              <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl text-sm text-muted-foreground leading-relaxed">
                Tìm kiếm tài khoản học viên bằng cách nhập tên đăng nhập hoặc địa chỉ email của họ. Chọn đúng học viên từ kết quả gợi ý. Học viên sau khi thêm thành công sẽ có quyền truy cập toàn bộ bài học của khóa học này ngay lập tức.
              </div>

              <div ref={dropdownRef} className="space-y-2 relative">
                <label htmlFor="emailSearch" className="text-sm font-bold text-foreground tracking-wide">
                  Tài khoản học viên
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Search className="h-4.5 w-4.5 text-muted-foreground/50" />
                  </span>
                  <input
                    type="text"
                    id="emailSearch"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setEmail(""); // Clear chosen email until selected from list or custom typed
                      setShowDropdown(true);
                      if (error) setError("");
                    }}
                    onFocus={() => setShowDropdown(true)}
                    placeholder="Nhập email hoặc tên đăng nhập để tìm kiếm..."
                    className="flex h-11 w-full rounded-lg border border-input bg-transparent pl-10 pr-10 py-2 text-sm shadow-sm transition-all placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                    disabled={isLoading}
                    autoComplete="off"
                  />
                  {isSearching && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3.5">
                      <Loader2 className="h-4.5 w-4.5 text-muted-foreground animate-spin" />
                    </span>
                  )}
                </div>
                <p className="text-[11px] text-muted-foreground/70">
                  * Nhập tối thiểu 2 ký tự để bắt đầu tìm kiếm tài khoản học viên trong cơ sở dữ liệu.
                </p>

                {/* Autocomplete Dropdown */}
                {showDropdown && searchTerm.trim().length >= 2 && (
                  <div className="absolute left-0 right-0 mt-2 max-h-64 overflow-y-auto z-50 bg-card border border-border shadow-2xl rounded-xl divide-y divide-border/60 backdrop-blur-md">
                    {isSearching && searchResults.length === 0 ? (
                      <div className="flex items-center justify-center p-5 text-sm text-muted-foreground gap-2.5">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        Đang tìm kiếm tài khoản học viên...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((user) => (
                        <div
                          key={user.id}
                          onClick={() => {
                            setEmail(user.email);
                            setSearchTerm(user.email);
                            setSearchResults([]);
                            setShowDropdown(false);
                            if (error) setError("");
                          }}
                          className="flex items-start gap-3.5 p-3.5 hover:bg-muted/80 cursor-pointer transition-all duration-200 text-left first:rounded-t-xl last:rounded-b-xl"
                        >
                          {user.avatar ? (
                            <Image
                              src={user.avatar}
                              alt={user.username}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full object-cover border border-border/80 shadow-xs mt-0.5"
                              unoptimized
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-accent/10 text-accent flex items-center justify-center font-bold text-sm border border-accent/20 mt-0.5">
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-foreground truncate">
                              {user.username}
                            </p>
                            <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                              <Mail className="w-3 h-3 text-muted-foreground/60" />
                              {user.email}
                            </p>
                            <div className="flex flex-wrap items-center gap-2 mt-1.5">
                              <span className={`inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold tracking-wider uppercase border ${
                                user.userStatus === "ACTIVE" 
                                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/25" 
                                  : "bg-amber-500/10 text-amber-500 border-amber-500/25"
                              }`}>
                                {user.userStatus === "ACTIVE" ? "Đang hoạt động" : "Tạm khóa"}
                              </span>
                              <span className="text-[11px] text-muted-foreground/70">
                                • Tham gia: {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                              </span>
                              {user.university && (
                                <span className="text-[11px] text-muted-foreground/70 truncate max-w-[180px]" title={user.university}>
                                  • {user.university}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-5 text-center text-sm text-muted-foreground">
                        Không tìm thấy học viên nào khớp với từ khóa.
                      </div>
                    )}
                  </div>
                )}

                {error && (
                  <p className="text-xs text-destructive font-medium mt-1">{error}</p>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end space-x-3 p-4 border-t border-border bg-muted/40 rounded-b-xl">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
                className="h-10 px-5 text-sm font-medium"
              >
                Hủy
              </Button>
              <Button
                type="submit"
                variant="accent"
                disabled={isLoading}
                className="h-10 px-5 text-sm font-medium shadow-sm hover:shadow-md transition-all"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Đang xử lý...
                  </>
                ) : (
                  <span>Thêm học viên</span>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
