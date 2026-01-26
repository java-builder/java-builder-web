 "use client";

import { useState } from "react";
import PostForm from "./PostForm";

interface QuickAskModalProps {
  targetId?: string;
  targetType?: string;
}

export default function QuickAskModal({ }: QuickAskModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 bg-accent text-white px-4 py-2 rounded-full shadow-lg z-40"
        aria-label="Hỏi nhanh"
      >
        Hỏi
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-2xl bg-white dark:bg-slate-800 rounded-lg p-4 mx-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-semibold">Hỏi nhanh</h3>
              <button onClick={() => setOpen(false)} className="text-gray-500">Đóng</button>
            </div>
            <PostForm onSubmit={() => setOpen(false)} />
          </div>
        </div>
      )}
    </>
  );
}



