"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Award, X, Loader2, Search, Mail, BookOpen, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilterSelect, FilterOption } from "@/components/ui/FilterSelect";
import { courseApi } from "@/services/course.service";
import { enrollmentApi } from "@/services/enrollment.service";
import { certificateApi } from "@/services/certificate.service";
import { CourseDetailResponse } from "@/types/course";
import { CourseEnrollmentResponse } from "@/types/enrollment";
import { useDebounce } from "@/hooks/useDebounce";
import toast from "react-hot-toast";

interface GrantCertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function GrantCertificateModal({
  isOpen,
  onClose,
  onSuccess,
}: GrantCertificateModalProps) {
  const [courses, setCourses] = useState<CourseDetailResponse[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [isLoadingCourses, setIsLoadingCourses] = useState(false);

  const [students, setStudents] = useState<CourseEnrollmentResponse[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<CourseEnrollmentResponse | null>(null);
  const [studentSearchTerm, setStudentSearchTerm] = useState("");
  const debouncedStudentSearch = useDebounce(studentSearchTerm, 300);
  const [isLoadingStudents, setIsLoadingStudents] = useState(false);
  const [showStudentDropdown, setShowStudentDropdown] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const studentDropdownRef = useRef<HTMLDivElement>(null);

  // Load initial courses list
  useEffect(() => {
    if (isOpen) {
      setIsLoadingCourses(true);
      courseApi
        .getCourses(1, 100)
        .then((res) => {
          setCourses(res.data?.data || []);
        })
        .catch((err) => {
          console.error("Error loading courses:", err);
        })
        .finally(() => {
          setIsLoadingCourses(false);
        });
    } else {
      handleReset();
    }
  }, [isOpen]);

  // Load enrolled students when selected course changes
  useEffect(() => {
    if (selectedCourseId) {
      setIsLoadingStudents(true);
      setSelectedStudent(null);
      setStudentSearchTerm("");
      setError("");
      enrollmentApi
        .getCourseEnrollments(selectedCourseId)
        .then((res) => {
          setStudents(res.data?.data || []);
        })
        .catch((err) => {
          console.error("Error loading course students:", err);
        })
        .finally(() => {
          setIsLoadingStudents(false);
        });
    } else {
      setStudents([]);
    }
  }, [selectedCourseId]);

  // Close student dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        studentDropdownRef.current &&
        !studentDropdownRef.current.contains(e.target as Node)
      ) {
        setShowStudentDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReset = () => {
    setSelectedCourseId("");
    setSelectedStudent(null);
    setStudentSearchTerm("");
    setStudents([]);
    setError("");
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  const courseOptions: FilterOption[] = courses.map((c) => ({
    value: c.id,
    label: c.title,
    description: `Cấp độ: ${c.level}`,
    icon: (
      <div className="relative h-6 w-6 shrink-0 overflow-hidden rounded-md border border-border bg-muted">
        {c.thumbnailUrl ? (
          <Image src={c.thumbnailUrl} alt={c.title} fill className="object-cover" />
        ) : (
          <BookOpen className="m-auto h-3.5 w-3.5 text-muted-foreground" />
        )}
      </div>
    ),
  }));

  const filteredStudents = students.filter((s) => {
    if (!debouncedStudentSearch.trim()) return true;
    const q = debouncedStudentSearch.toLowerCase().trim();
    return (
      s.username?.toLowerCase().includes(q) ||
      s.email?.toLowerCase().includes(q)
    );
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedCourseId) {
      setError("Vui lòng chọn khóa học");
      return;
    }

    if (!selectedStudent) {
      setError("Vui lòng chọn học viên nhận chứng chỉ");
      return;
    }

    setIsLoading(true);
    try {
      await certificateApi.createCertificate({
        userId: selectedStudent.userId,
        courseId: selectedCourseId,
      });
      toast.success(`Cấp chứng chỉ cho học viên "${selectedStudent.username}" thành công!`);
      onSuccess?.();
      handleClose();
    } catch (err: unknown) {
      console.error("Error granting certificate:", err);
      const errorObj = err as { response?: { data?: { message?: string } } };
      const msg = errorObj?.response?.data?.message || "Cấp chứng chỉ thất bại. Học viên có thể đã có bằng cho khóa học này.";
      toast.error(msg);
      setError(msg);
    } finally {
      setIsLoading(false);
    }
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
                <Award className="h-5.5 w-5.5 text-accent dark:text-accent-on-dark" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xl font-bold text-foreground">Cấp chứng chỉ mới</h3>
                <p className="text-xs text-muted-foreground truncate max-w-[340px] mt-0.5">
                  Phát hành bằng chứng nhận hoàn thành khóa học chính thức
                </p>
              </div>
            </div>
            <button
              onClick={handleClose}
              disabled={isLoading}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50 p-2 rounded-lg cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit}>
            <div className="p-6 space-y-5">
              {/* Guidance Description Card */}
              <div className="p-4 bg-accent/5 border border-accent/10 rounded-xl text-sm text-muted-foreground leading-relaxed">
                Chọn khóa học và học viên đủ điều kiện để tiến hành phát hành chứng chỉ. Học viên sau khi được cấp sẽ có mã bảo chứng riêng và hiển thị chứng chỉ trong hồ sơ cá nhân.
              </div>

              {/* Field 1: Course Selector */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-foreground tracking-wide">
                  Khóa học <span className="text-destructive">*</span>
                </label>
                <FilterSelect
                  value={selectedCourseId}
                  onChange={(val) => setSelectedCourseId(String(val))}
                  options={courseOptions}
                  placeholder={isLoadingCourses ? "Đang tải danh sách khóa học..." : "Chọn khóa học..."}
                  searchable={true}
                  searchPlaceholder="Tìm kiếm khóa học theo tên..."
                  disabled={isLoadingCourses || isLoading}
                />
              </div>

              {/* Field 2: Student Autocomplete Search */}
              <div ref={studentDropdownRef} className="space-y-2 relative">
                <label htmlFor="studentSearch" className="text-sm font-bold text-foreground tracking-wide">
                  Học viên nhận chứng chỉ <span className="text-destructive">*</span>
                </label>

                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                    <Search className="h-4.5 w-4.5 text-muted-foreground/50" />
                  </span>
                  <input
                    type="text"
                    id="studentSearch"
                    value={studentSearchTerm}
                    onChange={(e) => {
                      setStudentSearchTerm(e.target.value);
                      setSelectedStudent(null);
                      setShowStudentDropdown(true);
                      if (error) setError("");
                    }}
                    onFocus={() => setShowStudentDropdown(true)}
                    placeholder={
                      !selectedCourseId
                        ? "Vui lòng chọn khóa học trước..."
                        : isLoadingStudents
                        ? "Đang tải học viên của khóa học..."
                        : "Tìm theo tên học viên hoặc email..."
                    }
                    className="flex h-11 w-full rounded-lg border border-input bg-transparent pl-10 pr-10 py-2 text-sm shadow-sm transition-all placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-accent focus-visible:border-accent disabled:cursor-not-allowed disabled:opacity-50 text-foreground"
                    disabled={!selectedCourseId || isLoadingStudents || isLoading}
                    autoComplete="off"
                  />
                  {isLoadingStudents && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-3.5">
                      <Loader2 className="h-4.5 w-4.5 text-muted-foreground animate-spin" />
                    </span>
                  )}
                </div>

                {/* Selected Student Confirmation Pill */}
                {selectedStudent && (
                  <div className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-xs">
                    <div className="min-w-0">
                      <p className="font-bold text-foreground truncate">{selectedStudent.username}</p>
                      <p className="text-muted-foreground text-[11px] truncate">{selectedStudent.email}</p>
                    </div>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-bold">
                      <CheckCircle2 className="w-3 h-3" /> Đã chọn
                    </span>
                  </div>
                )}

                {/* Autocomplete Dropdown List */}
                {showStudentDropdown && selectedCourseId && !selectedStudent && (
                  <div className="absolute left-0 right-0 mt-2 max-h-60 overflow-y-auto z-50 bg-card border border-border shadow-2xl rounded-xl divide-y divide-border/60 backdrop-blur-md">
                    {isLoadingStudents ? (
                      <div className="p-4 text-center text-xs text-muted-foreground flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin text-accent" />
                        Đang tải danh sách học viên...
                      </div>
                    ) : filteredStudents.length > 0 ? (
                      filteredStudents.map((student) => {
                        const isCompleted = student.completed || student.progress === 100;
                        return (
                          <div
                            key={student.enrollmentId}
                            onClick={() => {
                              setSelectedStudent(student);
                              setStudentSearchTerm(student.username || student.email || "");
                              setShowStudentDropdown(false);
                              if (error) setError("");
                            }}
                            className="flex items-start gap-3.5 p-3.5 hover:bg-muted/80 cursor-pointer transition-all duration-200 text-left first:rounded-t-xl last:rounded-b-xl"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-bold text-foreground truncate">
                                  {student.username || "Học viên"}
                                </p>
                                {isCompleted ? (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/25">
                                    100% Hoàn thành
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                                    {student.progress ?? 0}% tiến độ
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-0.5">
                                <Mail className="w-3 h-3 text-muted-foreground/60" />
                                {student.email || "Không có email"}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <div className="p-4 text-center text-xs text-muted-foreground">
                        Không tìm thấy học viên nào tham gia khóa học này.
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
                disabled={isLoading || !selectedCourseId || !selectedStudent}
                className="h-10 px-5 text-sm font-medium shadow-sm hover:shadow-md transition-all gap-1.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-1" />
                    Đang xử lý...
                  </>
                ) : (
                  <>
                    <Award className="w-4 h-4" />
                    <span>Cấp chứng chỉ</span>
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
