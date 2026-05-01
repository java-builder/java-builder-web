import Image from "next/image";

interface ChatHeaderProps {
  onToggleSidebar: () => void;
}

export default function ChatHeader({ onToggleSidebar }: ChatHeaderProps) {
  return (
    <div className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-3 sm:px-4 py-3 flex-shrink-0">
      <div className="flex items-center gap-3">
        {/* Toggle Sidebar Button */}
        <button
          onClick={onToggleSidebar}
          className="p-1.5 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
        >
          <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white dark:bg-slate-700 flex items-center justify-center flex-shrink-0 p-1.5 sm:p-2 border-2 border-gray-200 dark:border-slate-600 relative">
          <Image src="/logos/java-logo.png" alt="JavaBuilder AI" fill className="object-contain p-1" />
        </div>
        <div className="flex-1 min-w-0">
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">
            AI Chatbot
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
            Trợ lý AI hỗ trợ học lập trình Java 24/7
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 rounded-full flex-shrink-0">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-xs font-medium text-green-700 dark:text-green-400">Online</span>
        </div>
      </div>
    </div>
  );
}
