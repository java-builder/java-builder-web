"use client";

import { useState, useEffect, useRef } from "react";
import { lessonNoteApi } from "@/services/lesson-note.service";
import { LessonNote } from "@/types/lesson-note";
import { Button } from "@/components/ui/button";
import { Clock, Edit3, FileText, Plus, Play, Trash2 } from "lucide-react";

interface LessonNotesProps {
  lessonId: string;
  currentTime?: number;
  onSeekTo?: (timestamp: number) => void;
  showTimestamp?: boolean;
}

export default function LessonNotes({
  lessonId,
  currentTime = 0,
  onSeekTo,
  showTimestamp = true,
}: LessonNotesProps) {
  const [notes, setNotes] = useState<LessonNote[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newContent, setNewContent] = useState("");
  const [attachTimestamp, setAttachTimestamp] = useState(showTimestamp);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const fetchedLessonIdRef = useRef<string | null>(null);
  const editInputRef = useRef<HTMLTextAreaElement | null>(null);

  const adjustHeight = (el: HTMLTextAreaElement | null) => {
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  };

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

  useEffect(() => {
    if (editingId && editInputRef.current) {
      const el = editInputRef.current;
      adjustHeight(el);
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editingId]);

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
    try {
      const response = await lessonNoteApi.delete(noteId);
      if (response.code === 200) {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
        setDeletingId(null);
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
    <div>
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-5">
        <h2 className="text-base font-bold text-foreground flex items-center gap-2">
          <FileText className="w-4.5 h-4.5 text-primary" />
          <span>Ghi chú cá nhân</span>
          {notes.length > 0 && (
            <span className="text-xs font-semibold px-2 py-0.5 bg-primary-soft text-primary rounded-full">
              {notes.length}
            </span>
          )}
        </h2>
        {!isAdding && (
          <Button
            type="button"
            size="sm"
            onClick={() => setIsAdding(true)}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo ghi chú mới</span>
          </Button>
        )}
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <div className="mb-6 bg-surface border border-border rounded-2xl overflow-hidden focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/15 transition-all shadow-xs">
          <textarea
            value={newContent}
            onChange={(e) => {
              setNewContent(e.target.value);
              adjustHeight(e.target);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                e.preventDefault();
                if (newContent.trim()) handleAddNote();
              }
            }}
            placeholder="Nhập ghi chú tại đây... (Nhấn Ctrl+Enter để lưu nhanh)"
            className="w-full px-4 py-3.5 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-foreground placeholder:text-text-muted resize-none min-h-[96px] leading-relaxed"
            ref={adjustHeight}
            autoFocus
          />

          <div className="h-px bg-border" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-muted/30">
            {/* Timestamp Toggle Pill */}
            {showTimestamp ? (
              <button
                type="button"
                onClick={() => setAttachTimestamp(!attachTimestamp)}
                className={`inline-flex items-center self-start sm:self-auto gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
                  attachTimestamp
                    ? "bg-primary-soft border-primary/25 text-primary"
                    : "bg-background border-border text-text-muted hover:text-foreground"
                }`}
              >
                <Clock
                  className={`w-3.5 h-3.5 ${
                    attachTimestamp ? "text-primary" : "text-text-muted"
                  }`}
                />
                <span>
                  Ghi chú tại{" "}
                  <span className="font-bold">{formatTime(currentTime)}</span>
                </span>
              </button>
            ) : (
              <div />
            )}

            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => {
                  setIsAdding(false);
                  setNewContent("");
                }}
                className="px-4 py-2 text-xs text-text-muted hover:text-foreground cursor-pointer font-bold rounded-full hover:bg-muted transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddNote}
                disabled={!newContent.trim()}
                className="px-4 py-2 text-xs bg-primary hover:bg-primary-hover disabled:bg-muted disabled:text-text-muted disabled:cursor-not-allowed text-white font-bold rounded-full transition-all shadow-xs active:scale-95 cursor-pointer"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {isLoading ? (
        <div className="space-y-3 py-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="p-4 bg-muted/20 border border-border rounded-2xl space-y-2 animate-pulse"
            >
              <div className="flex items-center justify-between">
                <div className="h-4 bg-muted rounded w-20" />
                <div className="h-3.5 bg-muted rounded w-16" />
              </div>
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-5/6" />
            </div>
          ))}
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-border rounded-2xl bg-background/50">
          <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center text-primary mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <p className="text-sm font-bold text-foreground mb-1">
            Chưa có ghi chú nào
          </p>
          <p className="text-xs text-text-muted text-center max-w-[280px]">
            Ghi lại những ý chính hoặc đoạn code quan trọng của bài học để ôn tập bất cứ lúc nào.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group relative p-4 pl-5 bg-surface rounded-2xl border border-border border-l-4 border-l-primary hover:shadow-xs transition-all duration-200"
            >
              {editingId === note.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => {
                      setEditContent(e.target.value);
                      adjustHeight(e.target);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                        e.preventDefault();
                        if (editContent.trim()) handleUpdateNote(note.id);
                      }
                    }}
                    className="w-full px-3.5 py-2.5 text-sm border border-border rounded-xl bg-background text-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 resize-none focus:outline-none"
                    ref={editInputRef}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2.5">
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="px-3.5 py-1.5 text-xs text-text-muted hover:text-foreground cursor-pointer font-bold rounded-full hover:bg-muted transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      type="button"
                      onClick={() => handleUpdateNote(note.id)}
                      disabled={!editContent.trim()}
                      className="px-4 py-1.5 text-xs bg-primary hover:bg-primary-hover disabled:bg-muted disabled:text-text-muted disabled:cursor-not-allowed text-white font-bold rounded-full transition-all cursor-pointer"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header info */}
                  <div className="flex items-center justify-between mb-2 text-[11px] text-text-muted font-medium">
                    <div className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-primary" />
                      <span className="font-bold text-foreground/80">
                        Ghi chú
                      </span>
                    </div>
                    <span>
                      {new Date(note.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {/* Timestamp badge if video note */}
                  {showTimestamp &&
                    note.timestamp !== null &&
                    note.formattedTime && (
                      <button
                        type="button"
                        onClick={() => onSeekTo?.(note.timestamp!)}
                        className="inline-flex items-center gap-1 mb-2 px-2.5 py-0.5 rounded-full text-xs bg-primary-soft text-primary font-bold hover:bg-primary hover:text-white transition-all cursor-pointer"
                        title={`Nhảy tới ${note.formattedTime}`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>{note.formattedTime}</span>
                      </button>
                    )}

                  {/* Content */}
                  <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed font-normal mb-3">
                    {note.content}
                  </p>

                  {/* Actions footer */}
                  {deletingId === note.id ? (
                    <div className="flex items-center justify-between pt-2.5 border-t border-error/20 text-xs animate-in fade-in duration-150">
                      <span className="text-error font-bold">
                        Xác nhận xóa ghi chú này?
                      </span>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDeletingId(null)}
                          className="px-3 py-1 text-text-muted hover:text-foreground font-bold transition-colors cursor-pointer rounded-full hover:bg-muted"
                        >
                          Hủy
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteNote(note.id)}
                          className="px-3.5 py-1 bg-error hover:opacity-90 text-white rounded-full font-bold transition-all shadow-xs cursor-pointer"
                        >
                          Xóa
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-end gap-3 pt-2 border-t border-border/60">
                      <button
                        type="button"
                        onClick={() => startEdit(note)}
                        className="text-xs text-text-muted hover:text-primary font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>
                      <span className="text-border text-xs">|</span>
                      <button
                        type="button"
                        onClick={() => setDeletingId(note.id)}
                        className="text-xs text-text-muted hover:text-error font-bold transition-colors cursor-pointer inline-flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Xóa</span>
                      </button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
