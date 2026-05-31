"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ConfirmModal from "@/components/ui/ConfirmModal";
import { Document, DocumentType } from "@/types/document";
import { documentApi } from "@/services/document.service";
import { fileApi } from "@/services/course.service";
import toast from "react-hot-toast";
import { formatReadableDate } from "@/utils/dateUtils";

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
    [DocumentType.BOOK]: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-white",
    [DocumentType.PDF]: "bg-orange-100 text-orange-800 dark:bg-orange-700 dark:text-white",
    [DocumentType.ARTICLE]: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-white",
    [DocumentType.VIDEO]: "bg-red-100 text-red-800 dark:bg-red-700 dark:text-white",
    [DocumentType.TUTORIAL]: "bg-yellow-100 text-yellow-800 dark:bg-yellow-500 dark:text-white",
    [DocumentType.OTHER]: "bg-gray-100 text-gray-800 dark:bg-slate-700 dark:text-gray-100",
  };
  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium ${colorMap[type]}`}>
      {config.icon} {config.label}
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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="mb-6 lg:mb-0">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Quản lý Tài liệu</h1>
            <p className="text-gray-600 dark:text-gray-300">Quản lý sách và tài liệu học tập</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => handleOpenModal()}
              className="inline-flex items-center px-4 py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent-600 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Thêm tài liệu
            </button>
            <button
              onClick={fetchDocuments}
              disabled={isLoading}
              className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 dark:bg-slate-700 dark:text-gray-200 dark:hover:bg-slate-600"
            >
              <svg className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Làm mới
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
          <p className="text-sm text-gray-600">Tổng</p>
          <p className="text-2xl font-bold text-gray-900">{documents.length}</p>
        </div>
        {documentTypes.map((t) => (
          <div key={t.type} className="bg-white rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">{t.icon} {t.label}</p>
            <p className="text-2xl font-bold text-gray-900">
              {documents.filter((d) => d.type === t.type).length}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-6 border border-gray-200 dark:bg-slate-800 dark:border-slate-700">
        <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm tài liệu..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-gray-700 placeholder-gray-400"
            />
          </div>
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as DocumentType | "")}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent text-gray-700"
          >
            <option value="">Tất cả loại</option>
            {documentTypes.map((t) => (
              <option key={t.type} value={t.type}>{t.icon} {t.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden dark:bg-slate-800 dark:border-slate-700">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 dark:bg-slate-800 dark:border-slate-700">
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Tài liệu</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Loại</th>
                <th className="text-left px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Ngày tạo</th>
                <th className="text-right px-6 py-4 text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-accent" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Đang tải...
                  </td>
                </tr>
              ) : filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    Không có tài liệu nào
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          {doc.thumbnailUrl ? (
                            <Image src={doc.thumbnailUrl} alt={doc.title} fill className="object-contain" />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-accent-100 to-accent-200 flex items-center justify-center">
                              <span className="text-2xl">📚</span>
                            </div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 dark:text-white truncate max-w-xs">{doc.title}</h3>
                          {doc.description && (
                            <p className="text-sm text-gray-500 dark:text-gray-300 truncate max-w-xs">{doc.description}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <TypeBadge type={doc.type} />
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500">{formatDate(doc.createdAt)}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenModal(doc)}
                          className="p-2 text-gray-400 hover:text-accent hover:bg-accent-50 rounded-lg transition-colors"
                          title="Chỉnh sửa"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id, doc.title)}
                          disabled={isDeleting === doc.id}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Xóa"
                        >
                          {isDeleting === doc.id ? (
                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                          ) : (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          )}
                        </button>
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
            <div className="fixed inset-0 bg-black/50" onClick={() => setIsModalOpen(false)} />
            <div className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-6 max-h-[85vh] overflow-y-auto">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingDoc ? "Chỉnh sửa tài liệu" : "Thêm tài liệu mới"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent resize-y"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Loại tài liệu *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as DocumentType })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  >
                    {documentTypes.map((t) => (
                      <option key={t.type} value={t.type}>{t.icon} {t.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link tài liệu</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    placeholder="https://example.com/document.pdf"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-accent focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh bìa</label>
                  {imagePreview ? (
                    <div className="relative w-full">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        width={400}
                        height={200}
                        className="w-full h-48 object-contain rounded-lg border border-gray-300 bg-gray-50"
                      />
                      <button
                        type="button"
                        onClick={removeImage}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 hover:bg-red-600 transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-accent hover:bg-accent-50 transition-all"
                    >
                      <svg className="w-12 h-12 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-gray-600 text-sm font-medium">Nhấn để chọn ảnh</p>
                      <p className="text-gray-400 text-xs mt-1">JPG, PNG, GIF. Tối đa 5MB</p>
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
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    disabled={isSubmitting}
                    className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-accent text-white rounded-lg hover:bg-accent-600 transition-colors disabled:opacity-50 flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Đang lưu...
                      </>
                    ) : (
                      editingDoc ? "Cập nhật" : "Thêm mới"
                    )}
                  </button>
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
