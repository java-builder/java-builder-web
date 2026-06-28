import Link from "next/link";
import Image from "next/image";

interface SidebarUserProfileProps {
  currentUser: { username: string; email: string; avatar?: string } | undefined;
  isCollapsed: boolean;
  onLogout: () => void;
}

export default function SidebarUserProfile({
  currentUser,
  isCollapsed,
  onLogout,
}: SidebarUserProfileProps) {
  if (!currentUser) {
    return (
      <>
        {isCollapsed ? (
          <>
            <div className="relative group">
              <Link
                href="/login"
                className="w-9 h-9 rounded-lg bg-accent hover:bg-accent-600 text-white flex items-center justify-center transition-colors"
                title="Đăng nhập"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </Link>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl z-[9999]">
                Đăng nhập
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
              </div>
            </div>

            <div className="relative group">
              <Link
                href="/register"
                className="w-9 h-9 rounded-lg border-2 border-accent text-accent hover:bg-accent hover:text-white flex items-center justify-center transition-colors"
                title="Đăng ký"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </Link>
              <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl z-[9999]">
                Đăng ký
                <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-1.5 w-full">
            <Link
              href="/login"
              className="w-full px-3 py-2 bg-accent hover:bg-accent-600 text-white rounded-lg transition-colors flex items-center justify-center gap-1.5 font-medium text-xs shadow-xs"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span className="text-white">Đăng nhập</span>
            </Link>

            <Link
              href="/register"
              className="w-full px-3 py-2 bg-white dark:bg-slate-800 border-2 border-accent text-accent hover:bg-accent hover:text-white rounded-lg transition-all duration-200 flex items-center justify-center gap-1.5 font-medium text-xs shadow-xs"
            >
              <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              <span>Đăng ký</span>
            </Link>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {isCollapsed ? (
        <div className="relative group">
          <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-700 hover:border-accent transition-colors">
            {currentUser.avatar ? (
              <Image
                src={currentUser.avatar}
                alt={currentUser.username}
                width={40}
                height={40}
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full bg-accent/20 flex items-center justify-center text-accent font-semibold">
                {(currentUser.username || "U").charAt(0).toUpperCase()}
              </div>
            )}
          </button>

          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 dark:bg-slate-700 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap pointer-events-none shadow-xl z-[9999] min-w-[200px]">
            <div className="font-medium">{currentUser.username}</div>
            <div className="text-xs text-gray-300 dark:text-gray-400 mt-0.5">{currentUser.email}</div>
            <button
              onClick={onLogout}
              className="mt-2 w-full px-3 py-1.5 text-xs bg-red-500 hover:bg-red-600 text-white rounded transition-colors flex items-center justify-center gap-1.5 pointer-events-auto"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Đăng xuất
            </button>
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-[6px] border-transparent border-r-gray-900 dark:border-r-slate-700"></div>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-slate-700 flex-shrink-0">
              {currentUser.avatar ? (
                <Image
                  src={currentUser.avatar}
                  alt={currentUser.username}
                  width={40}
                  height={40}
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-accent/20 flex items-center justify-center text-accent font-semibold text-lg">
                  {(currentUser.username || "U").charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                {currentUser.username}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {currentUser.email}
              </p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="w-full px-4 py-2.5 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium text-sm"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Đăng xuất
          </button>
        </>
      )}
    </>
  );
}
