export default function CommentPlaceholder() {
  return (
    <div className="ml-10 animate-pulse">
      <div className="flex gap-2">
        <div className="w-7 h-7 bg-gray-200 dark:bg-slate-600 rounded-full flex-shrink-0" />
        
        <div className="flex-1 min-w-0">
          <div className="bg-gray-100 dark:bg-slate-700 rounded-2xl px-3 py-2 inline-block">
            <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-20 mb-1.5" />
            <div className="h-3 bg-gray-200 dark:bg-slate-600 rounded w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
