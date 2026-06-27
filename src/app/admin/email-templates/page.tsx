"use client";

import { useEffect, useState } from "react";
import { emailTemplateService } from "@/services/email-template.service";
import { EmailTemplateResponse } from "@/types/email-template";
import { useConfirm } from "@/hooks/useConfirm";
import toast from "react-hot-toast";
import {
  EmailTemplatesHeader,
  EmailTemplatesSearchBar,
  EmailTemplatesGrid,
  EmailTemplatePreviewModal,
  EmailTemplateEditorModal,
} from "@/components/admin/email-templates";

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplateResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Modals state
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplateResponse | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const { confirm } = useConfirm();

  const fetchTemplates = async () => {
    setIsLoading(true);
    try {
      const res = await emailTemplateService.getAllEmailTemplates();
      setTemplates(res.data || []);
    } catch (e) {
      console.error(e);
      const err = e as { message?: string };
      toast.error(err.message || "Không thể tải danh sách mẫu email");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleDelete = (name: string) => {
    confirm(
      async () => {
        await emailTemplateService.deleteTemplate(name);
        fetchTemplates();
      },
      {
        title: "Xác nhận xoá mẫu email",
        message: `Bạn có chắc chắn muốn xoá mẫu email <strong>${name}</strong>? Thao tác này sẽ xoá vĩnh viễn trên AWS SES.`,
        confirmText: "Xoá",
        cancelText: "Huỷ",
        type: "error",
      }
    );
  };

  const handleOpenCreate = () => {
    setIsEditMode(false);
    setSelectedTemplate(null);
    setIsEditorOpen(true);
  };

  const handleOpenEdit = (tpl: EmailTemplateResponse) => {
    setIsEditMode(true);
    setSelectedTemplate(tpl);
    setIsEditorOpen(true);
  };

  const handleOpenPreview = (tpl: EmailTemplateResponse) => {
    setSelectedTemplate(tpl);
    setIsPreviewOpen(true);
  };

  const filteredTemplates = templates.filter(
    (tpl) =>
      tpl.templateName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tpl.subject.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6 max-w-7xl mx-auto">
      <EmailTemplatesHeader
        totalCount={templates.length}
        onCreate={handleOpenCreate}
      />

      <EmailTemplatesSearchBar
        searchQuery={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      <EmailTemplatesGrid
        templates={filteredTemplates}
        isLoading={isLoading}
        searchQuery={searchQuery}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onPreview={handleOpenPreview}
        onClearFilter={() => setSearchQuery("")}
        onCreateNew={handleOpenCreate}
      />

      <EmailTemplatePreviewModal
        isOpen={isPreviewOpen}
        onClose={() => {
          setIsPreviewOpen(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
        onEdit={handleOpenEdit}
      />

      <EmailTemplateEditorModal
        isOpen={isEditorOpen}
        onClose={() => {
          setIsEditorOpen(false);
          setSelectedTemplate(null);
        }}
        template={selectedTemplate}
        isEditMode={isEditMode}
        onSuccess={fetchTemplates}
      />
    </div>
  );
}
