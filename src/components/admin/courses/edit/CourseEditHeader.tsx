"use client";

import Link from "next/link";

interface CourseEditHeaderProps {
  courseTitle?: string;
  isSaving: boolean;
  onSave: () => void;
}

export default function CourseEditHeader({
  courseTitle,
  isSaving,
  onSave,
}: CourseEditHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <Link href="/admin/courses" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Chỉnh sửa khóa học</h1>
          <p className="text-sm text-gray-500">{courseTitle}</p>
        </div>
      </div>
      <button
        onClick={onSave}
        disabled={isSaving}
        className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent-600 disabled:opacity-50 flex items-center gap-2 transition-colors"
      >
        {isSaving && (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        Lưu thay đổi
      </button>
    </div>
  );
}
