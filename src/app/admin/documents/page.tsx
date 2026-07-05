"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Document, DocumentType } from "@/types/document";
import { documentApi } from "@/services/document.service";
import { fileApi } from "@/services/course.service";
import toast from "react-hot-toast";
import { formatReadableDate } from "@/utils/dateUtils";
import { Button } from "@/components/ui/button";
import {
  Plus,
  RotateCw,
  Search,
  Pencil,
  Trash2,
  X,
  Upload,
  Loader2,
} from "lucide-react";

const documentTypes = [
  { type: DocumentType.BOOK, label: "Sách", icon: "📚" },
  { type: DocumentType.PDF, label: "PDF", icon: "📄" },
  { type: DocumentType.ARTICLE, label: "Bài viết", icon: "📝" },
  { type: DocumentType.VIDEO, label: "Video", icon: "🎬" },
  { type: DocumentType.TUTORIAL, label: "Hướng dẫn", icon: "📖" },
  { type: DocumentType.OTHER, label: "Khác", icon: "📁" },
];

const TypeBadge = ({ type }: { type: DocumentType }) => {
  const config = documentTypes.find((t) => t.type === type) || documentTypes[5];
  const colorMap: Record<DocumentType, string> = {
    [DocumentType.BOOK]: "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-200/50 dark:border-blue-500/20",
    [DocumentType.PDF]: "bg-orange-50 text-orange-700 dark:bg-orange-500/10 dark:text-orange-400 border border-orange-200/50 dark:border-orange-500/20",
    [DocumentType.ARTICLE]: "bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 border border-green-200/50 dark:border-green-500/20",
    [DocumentType.VIDEO]: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 border border-red-200/50 dark:border-red-500/20",
    [DocumentType.TUTORIAL]: "bg-yellow-50 text-yellow-700 dark:bg-yellow-500/10 dark:text-yellow-400 border border-yellow-200/50 dark:border-yellow-500/20",
    [DocumentType.OTHER]: "bg-muted text-muted-foreground border border-border",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-[11px] font-semibold ${colorMap[type]}`}>
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </span>
  );
};

export default function AdminDocumentsPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<string>("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "">("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, id: "", title: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const hasFetched = useRef(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: DocumentType.BOOK,
    url: "",
    key: "",
  });

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await documentApi.getAll({ page: 1, size: 100 });
      setDocuments(response.data?.data || []);
    } catch {
      // Error handled silently
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;
    fetchDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchSearch = !search || 
      doc.title.toLowerCase().includes(search.toLowerCase()) ||
      doc.description?.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || doc.type === typeFilter;
    return matchSearch && matchType;
  });

  const handleOpenModal = (doc?: Document) => {
    if (doc) {
      setEditingDoc(doc);
      setFormData({
        title: doc.title,
        description: doc.description || "",
        type: doc.type,
        url: doc.url || "",
        key: "", // Key không cần hiển thị lại
      });
      setImagePreview(doc.thumbnailUrl || null);
    } else {
      setEditingDoc(null);
      setFormData({
        title: "",
        description: "",
        type: DocumentType.BOOK,
        url: "",
        key: "",
      });
      setImagePreview(null);
    }
    setImageFile(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Vui lòng chọn file ảnh");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ảnh không được vượt quá 5MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData({ ...formData, key: "" });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Vui lòng nhập tiêu đề");
      return;
    }

    setIsSubmitting(true);
    try {
      let key = formData.key;

      // Upload ảnh bằng presigned URL nếu có file mới
      if (imageFile) {
        const result = await fileApi.uploadPublicImage(imageFile);
        key = result.key;
      }

      const data = { ...formData, key };

      if (editingDoc) {
        const result = await documentApi.update(editingDoc.id, data);
        if (result.code === 200) {
          toast.success(result.message || "Cập nhật tài liệu thành công");
          setIsModalOpen(false);
          setImageFile(null);
          setImagePreview(null);
          fetchDocuments();
        }
      } else {
        const result = await documentApi.create(data);
        if (result.code === 201) {
          toast.success(result.message || "Thêm tài liệu thành công");
          setIsModalOpen(false);
          setImageFile(null);
          setImagePreview(null);
          fetchDocuments();
        }
      }
    } catch (error) {
      console.error("Error saving document:", error);
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (id: string, title: string) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const confirmDelete = async () => {
    setIsDeleting(deleteModal.id);
    try {
      const result = await documentApi.delete(deleteModal.id);
      if (result.code === 200) {
        toast.success(result.message || "Xóa tài liệu thành công");
        setDocuments(documents.filter((d) => d.id !== deleteModal.id));
        setDeleteModal({ isOpen: false, id: "", title: "" });
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Xóa tài liệu thất bại");
    } finally {
      setIsDeleting("");
    }
  };

  const formatDate = (dateString: string) => {
    return formatReadableDate(dateString);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Header */}
      <div className="mb-6">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Quản lý Tài liệu</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Quản lý sách và tài liệu học tập
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-3">
            <Button
              onClick={() => handleOpenModal()}
              variant="accent"
              className="gap-2 h-9.5"
            >
              <Plus className="h-4 w-4" />
              Thêm tài liệu
            </Button>
            <Button
              onClick={fetchDocuments}
              disabled={isLoading}
              variant="outline"
              className="gap-2 h-9.5"
            >
              <RotateCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-card rounded-xl p-4 border border-border shadow-sm">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tổng</p>
          <p className="text-2xl font-bold text-foreground mt-1">{documents.length}</p>
        </div>
        {documentTypes.map((t) => (
          <div key={t.type} className="bg-card rounded-xl p-4 border border-border shadow-sm">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider truncate">
              {t.icon} {t.label}
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {documents.filter((d) => d.type === t.type).length}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-muted/30 rounded-xl p-6 border border-border">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-foreground placeholder-muted-foreground text-sm transition-colors duration-200"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocumentType | "")}
            className="px-4 py-2 bg-background border border-input rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-foreground text-sm"
          >
            <option value="">Tất cả loại</option>
            {documentTypes.map((t) => (
              <option key={t.type} value={t.type}>{t.icon} {t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Tài liệu</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Loại</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Ngày tạo</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-muted-foreground uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-20 rounded bg-muted shrink-0" />
                        <div className="space-y-2 flex-grow">
                          <div className="h-4 bg-muted rounded w-48" />
                          <div className="h-3.5 bg-muted rounded w-32" />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-muted rounded w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="h-4 bg-muted rounded w-24" />
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="h-8 bg-muted rounded w-16 ml-auto" />
                    </td>
                  </tr>
                ))
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Không có tài liệu nào
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-muted flex-shrink-0 border border-border">
                          {doc.thumbnailUrl ? (
                            <Image src={doc.thumbnailUrl} alt={doc.title} fill className="object-contain" />
                          ) : (
                            <div className="w-full h-full bg-accent/10 flex items-center justify-center">
                              <span className="text-2xl">📚</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-foreground truncate max-w-xs">{doc.title}</h3>
                          {doc.description && (
                            <p className="text-sm text-muted-foreground truncate max-w-xs mt-0.5">{doc.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <TypeBadge type={doc.type} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-muted-foreground">{formatDate(doc.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          onClick={() => handleOpenModal(doc)}
                          variant="ghost"
                          size="icon-sm"
                          className="hover:text-accent text-muted-foreground"
                          title="Chỉnh sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          disabled={isDeleting === doc.id}
                          variant="ghost"
                          size="icon-sm"
                          className="hover:text-destructive hover:bg-destructive/10 text-muted-foreground"
                          title="Xóa"
                        >
                          {isDeleting === doc.id ? (
                            <Loader2 className="animate-spin w-4 h-4" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-start sm:items-center justify-center p-4 pt-16 sm:pt-4">
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-card border border-border rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-foreground mb-6">
                {editingDoc ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Tiêu đề *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-sm resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Loại tài liệu *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentType })}
                    className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-sm"
                  >
                    {documentTypes.map((t) => (
                      <option key={t.type} value={t.type}>{t.icon} {t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1.5">Link tài liệu</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com/document.pdf"
                    className="w-full px-4 py-2 bg-background border border-input rounded-lg text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 text-sm placeholder:text-muted-foreground"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Ảnh bìa</label>
                  {imagePreview ? (
                    <div className="relative w-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={400}
                        height={200}
                        className="w-full h-48 object-contain rounded-lg border border-border bg-muted/30"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon-xs"
                        onClick={removeImage}
                        className="absolute top-2 right-2 rounded-full shadow-sm"
                      >
                        <X className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent/5 transition-all"
                    >
                      <Upload className="w-10 h-10 text-muted-foreground mb-2" />
                      <p className="text-foreground text-sm font-medium">Nhấn để chọn ảnh</p>
                      <p className="text-muted-foreground text-xs mt-1">JPG, PNG, GIF. Tối đa 5MB</p>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isSubmitting}
                  />
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-border">
                  <Button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    variant="outline"
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    variant="accent"
                    className="gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="animate-spin w-4 h-4" />
                        Đang lưu...
                      </>
                    ) : (
                      editingDoc ? "Cập nhật" : "Thêm mới"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      <ConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, id: "", title: "" })}
        onConfirm={confirmDelete}
        title="Xóa tài liệu"
        message={`Bạn có chắc chắn muốn xóa tài liệu <strong>${deleteModal.title}</strong>?`}
        confirmText="Xóa"
        cancelText="Hủy"
        isLoading={isDeleting === deleteModal.id}
        type="danger"
      />
    </div>
  );
}
