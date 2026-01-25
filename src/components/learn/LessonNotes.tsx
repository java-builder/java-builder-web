"use client";

import { useState, useEffect, useRef } from "react";
import { lessonNoteApi } from "@/services/lesson-note.service";
import { LessonNote } from "@/types/lesson-note";

interface LessonNotesProps {
  lessonId: string;
  currentTime?: number;
  onSeekTo?: (timestamp: number) => void;
}

export default function LessonNotes({
  lessonId,
  currentTime = 0,
  onSeekTo,
}: LessonNotesProps) {
  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [attachTimestamp, setAttachTimestamp] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const fetchedLessonIdRef = useRef<string | null>(null);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  useEffect(() => {
    if (fetchedLessonIdRef.current === lessonId) return;
    fetchedLessonIdRef.current = lessonId;

    const fetchNotes = async () => {
      try {
        setIsLoading(true);
        const response = await lessonNoteApi.getByLesson(lessonId);
        if (response.code === 200 && response.data) {
          setNotes(response.data);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [lessonId]);

  const handleAddNote = async () => {
    if (!newContent.trim()) return;

    try {
      const response = await lessonNoteApi.create({
        lessonId,
        content: newContent.trim(),
        timestamp: attachTimestamp ? Math.floor(currentTime) : undefined,
      });

      if (response.code === 201 && response.data) {
        setNotes((prev) => [response.data!, ...prev]);
        setNewContent("");
        setIsAdding(false);
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  const handleUpdateNote = async (noteId: string) => {
    if (!editContent.trim()) return;

    try {
      const response = await lessonNoteApi.update(noteId, {
        content: editContent.trim(),
      });

      if (response.code === 200 && response.data) {
        setNotes((prev) =>
          prev.map((note) => (note.id === noteId ? response.data! : note))
        );
        setEditingId(null);
        setEditContent("");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    if (!confirm("Bạn có chắc muốn xóa ghi chú này?")) return;

    try {
      const response = await lessonNoteApi.delete(noteId);
      if (response.code === 200) {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const startEdit = (note: LessonNote) => {
    setEditingId(note.id);
    setEditContent(note.content);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent("");
  };

  return (
    <div className="mt-6 sm:mt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold text-gray-900 dark:text-white">
          Ghi chú {notes.length > 0 && <span className="font-normal text-gray-500">({notes.length})</span>}
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="text-sm text-accent hover:text-accent-600 font-medium transition-colors"
          >
            Thêm ghi chú
          </button>
        )}
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <div className="mb-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (newContent.trim()) handleAddNote();
              }
            }}
            placeholder="Nhập ghi chú..."
            className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-1 focus:ring-accent focus:border-accent resize-none"
            rows={4}
            autoFocus
          />
          
          <div className="flex items-center justify-between mt-2">
            <label className="flex items-center gap-2 text-xs text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={attachTimestamp}
                onChange={(e) => setAttachTimestamp(e.target.checked)}
                className="rounded border-gray-300 text-accent focus:ring-accent w-3.5 h-3.5"
              />
              Đánh dấu {attachTimestamp && <span className="text-accent font-medium">{formatTime(currentTime)}</span>}
            </label>
            
            <div className="flex gap-2">
              <button
                onClick={() => { setIsAdding(false); setNewContent(""); }}
                className="px-4 py-1.5 text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                Hủy
              </button>
              <button
                onClick={handleAddNote}
                disabled={!newContent.trim()}
                className="px-4 py-1.5 text-sm bg-accent hover:bg-accent-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded transition-colors"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-6">
          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-accent"></div>
        </div>
      ) : notes.length === 0 ? (
        <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-6">
          Chưa có ghi chú nào
        </p>
      ) : (
        <div className="space-y-2">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group relative p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600 transition-colors"
            >
              {editingId === note.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-1 focus:ring-accent resize-none"
                    rows={2}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button onClick={cancelEdit} className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700">
                      Hủy
                    </button>
                    <button
                      onClick={() => handleUpdateNote(note.id)}
                      disabled={!editContent.trim()}
                      className="px-3 py-1 text-xs bg-accent hover:bg-accent-600 disabled:bg-gray-300 text-white rounded"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Timestamp badge */}
                  {note.timestamp !== null && note.formattedTime && (
                    <button
                      onClick={() => onSeekTo?.(note.timestamp!)}
                      className="inline-block mb-1.5 text-xs text-accent hover:text-accent-600 font-medium transition-colors"
                    >
                      ▶ {note.formattedTime}
                    </button>
                  )}
                  
                  {/* Content */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                    {note.content}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">
                      {new Date(note.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                    
                    {/* Actions - always visible */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(note)}
                        className="text-xs text-gray-500 hover:text-accent transition-colors"
                      >
                        Sửa
                      </button>
                      <span className="text-gray-300">|</span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-xs text-gray-500 hover:text-red-500 transition-colors"
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
