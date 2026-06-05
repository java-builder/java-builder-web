"use client";

import { useEffect, useState } from "react";
import { tagService } from "@/services/tag.service";
import { TagDetailResponse } from "@/types/tag";
import { useConfirm } from "@/hooks/useConfirm";
import {
  CreateTagModal,
  TagsHeader,
  TagsSearchBar,
  TagsTable,
  UpdateTagModal,
} from "@/components/admin/tags";

export default function TagsPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedTag, setSelectedTag] = useState<TagDetailResponse | null>(null);
  const [tags, setTags] = useState<TagDetailResponse[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const { confirm } = useConfirm();

  const fetchTags = async (search?: string) => {
    setIsLoading(true);
    try {
      const res = await tagService.getAll(search);
      setTags(res.data?.data || []);
    } catch (e) {
      console.error(e);
      setTags([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTags(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleDelete = async (id: string, name: string) => {
    await confirm(
      async () => {
        setDeletingId(id);
        try {
          await tagService.deleteTag(id);
          await fetchTags(searchQuery);
        } catch (e) {
          console.error(e);
        } finally {
          setDeletingId(null);
        }
      },
      {
        title: "Xác nhận xoá tag",
        message: `<div>Bạn có chắc muốn xoá tag <strong>${name}</strong>?</div>`,
        confirmText: "Xoá",
        cancelText: "Huỷ",
        type: "error",
      }
    );
  };

  const handleEdit = (tag: TagDetailResponse) => {
    setSelectedTag(tag);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-6">
      <TagsHeader totalCount={tags.length} onCreate={() => setIsCreateOpen(true)} />

      <TagsSearchBar
        searchQuery={searchQuery}
        onChange={setSearchQuery}
        onClear={() => setSearchQuery("")}
      />

      <TagsTable
        tags={tags}
        isLoading={isLoading}
        searchQuery={searchQuery}
        deletingId={deletingId}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <CreateTagModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSuccess={() => fetchTags(searchQuery)}
      />
      <UpdateTagModal
        isOpen={isEditOpen}
        onClose={() => {
          setIsEditOpen(false);
          setSelectedTag(null);
        }}
        tag={selectedTag}
        onSuccess={() => {
          fetchTags(searchQuery);
          setSelectedTag(null);
        }}
      />
    </div>
  );
}
