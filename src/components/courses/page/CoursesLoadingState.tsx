"use client";

export default function CoursesLoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="aspect-video  bg-gray-100 dark:bg-slate-700" />
          <div className="space-y-3 p-5">
            <div className="h-5 w-3/4  rounded bg-gray-200 dark:bg-slate-700" />
            <div className="h-4 w-full  rounded bg-gray-100 dark:bg-slate-700/60" />
            <div className="h-4 w-5/6  rounded bg-gray-100 dark:bg-slate-700/60" />
            <div className="flex items-center justify-between pt-3">
              <div className="h-7 w-20  rounded-full bg-gray-100 dark:bg-slate-700/60" />
              <div className="h-9 w-28  rounded-lg bg-gray-100 dark:bg-slate-700/60" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
