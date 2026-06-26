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
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-gray-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Ghi chú cá nhân {notes.length > 0 && <span className="text-xs font-semibold px-2 py-0.5 bg-gray-100 dark:bg-slate-750 text-gray-500 dark:text-slate-400 rounded-full">{notes.length}</span>}
        </h2>
        {!isAdding && (
          <button
            onClick={() => setIsAdding(true)}
            className="inline-flex items-center gap-1.5 text-sm text-accent hover:text-accent/90 font-bold transition-colors cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            Tạo ghi chú mới
          </button>
        )}
      </div>

      {/* Add Note Form */}
      {isAdding && (
        <div className="mb-6 bg-white dark:bg-slate-900/30 border border-gray-200/80 dark:border-slate-700/80 rounded-xl overflow-hidden focus-within:border-accent focus-within:ring-4 focus-within:ring-accent/15 transition-all shadow-xs">
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                if (newContent.trim()) handleAddNote();
              }
            }}
            placeholder="Nhập ghi chú tại đây... (Nhấn Enter để lưu nhanh, Shift+Enter để xuống dòng)"
            className="w-full px-4 py-3.5 text-sm bg-transparent border-none focus:outline-none focus:ring-0 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-slate-500 resize-none min-h-[96px] leading-relaxed"
            autoFocus
          />
          
          <div className="h-px bg-gray-100 dark:bg-slate-800" />
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-4 py-3 bg-gray-50/60 dark:bg-slate-800/30">
            {/* Timestamp Toggle Pill */}
            <button
              type="button"
              onClick={() => setAttachTimestamp(!attachTimestamp)}
              className={`inline-flex items-center self-start sm:self-auto gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer select-none ${
                attachTimestamp
                  ? "bg-accent/10 border-accent/20 text-accent shadow-xs"
                  : "bg-gray-100 dark:bg-slate-800 border-gray-200 dark:border-slate-700 text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-700"
              }`}
            >
              <svg className={`w-3.5 h-3.5 ${attachTimestamp ? "text-accent animate-pulse" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>
                Ghi chú tại <span className="font-bold">{formatTime(currentTime)}</span>
              </span>
            </button>
            
            {/* Actions */}
            <div className="flex items-center gap-2 justify-end">
              <button
                type="button"
                onClick={() => { setIsAdding(false); setNewContent(""); }}
                className="px-4 py-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 cursor-pointer font-bold rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              >
                Hủy
              </button>
              <button
                type="button"
                onClick={handleAddNote}
                disabled={!newContent.trim()}
                className="px-4 py-2 text-xs bg-accent hover:bg-accent/90 disabled:bg-gray-100 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-600 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all shadow-xs hover:shadow active:scale-98 cursor-pointer"
              >
                Lưu ghi chú
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-10">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-accent"></div>
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed border-gray-200 dark:border-slate-700/60 rounded-xl bg-gray-50/20 dark:bg-slate-800/5">
          <div className="w-12 h-12 rounded-full bg-accent/5 dark:bg-accent/10 flex items-center justify-center text-accent mb-3">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
          </div>
          <p className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-1">
            Chưa có ghi chú nào
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-[280px]">
            Ghi lại những ý chính hoặc đoạn code hay của bài học để xem lại bất cứ lúc nào.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.id}
              className="group relative p-4 bg-white dark:bg-slate-900/10 rounded-xl border border-gray-100 dark:border-slate-800/80 hover:border-gray-200 dark:hover:border-slate-700 hover:shadow-xs transition-all"
            >
              {editingId === note.id ? (
                <div>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm border border-gray-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-white focus:ring-1 focus:ring-accent resize-none focus:outline-none"
                    rows={3}
                    autoFocus
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button 
                      onClick={cancelEdit} 
                      className="px-3 py-1.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer font-bold rounded-md hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      Hủy
                    </button>
                    <button
                      onClick={() => handleUpdateNote(note.id)}
                      disabled={!editContent.trim()}
                      className="px-4 py-1.5 text-xs bg-accent hover:bg-accent/90 disabled:bg-gray-150 dark:disabled:bg-slate-800 disabled:text-gray-400 dark:disabled:text-slate-650 disabled:cursor-not-allowed text-white font-bold rounded-lg transition-all cursor-pointer"
                    >
                      Lưu thay đổi
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Timestamp badge */}
                  {note.timestamp !== null && note.formattedTime && (
                    <button
                      onClick={() => onSeekTo?.(note.timestamp!)}
                      className="inline-flex items-center gap-1 mb-2 px-2.5 py-0.5 rounded-full text-xs bg-accent/10 dark:bg-accent/15 text-accent font-bold hover:bg-accent hover:text-white transition-all cursor-pointer border border-transparent hover:border-accent/10"
                      title={`Nhảy tới ${note.formattedTime}`}
                    >
                      <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      {note.formattedTime}
                    </button>
                  )}
                  
                  {/* Content */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed font-normal mb-2.5">
                    {note.content}
                  </p>
                  
                  {/* Footer */}
                  <div className="flex items-center justify-between border-t border-gray-50 dark:border-slate-800/40 pt-2">
                    <span className="text-[11px] text-gray-400 dark:text-slate-500">
                      {new Date(note.createdAt).toLocaleString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    
                    {/* Actions - visible on mobile, hover visible on desktop */}
                    <div className="flex items-center gap-2.5 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => startEdit(note)}
                        className="text-xs text-gray-450 hover:text-accent font-semibold transition-colors cursor-pointer"
                      >
                        Sửa
                      </button>
                      <span className="text-gray-200 dark:text-slate-800">|</span>
                      <button
                        onClick={() => handleDeleteNote(note.id)}
                        className="text-xs text-gray-450 hover:text-red-500 font-semibold transition-colors cursor-pointer"
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
