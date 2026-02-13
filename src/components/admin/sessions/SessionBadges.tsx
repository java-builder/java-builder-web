export const getProviderBadge = (provider: string) => {
  const p = (provider || "").toUpperCase();
  switch (p) {
    case 'GOOGLE':
      return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-red-50 text-red-700 border border-red-100 dark:bg-red-900 dark:text-red-200 dark:border-red-700">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
            <path d="M21.6 12.227c0-.68-.06-1.336-.176-1.958H12v3.71h5.44c-.234 1.228-.93 2.27-1.976 2.966v2.466h3.19c1.88-1.744 2.97-4.307 2.97-7.184z" fill="#EA4335"/>
            <path d="M12 21.6c2.56 0 4.7-.852 6.28-2.18l-3.19-2.466c-.874.588-1.99.94-3.09.94-2.38 0-4.4-1.605-5.12-3.765H2.64v2.36C4.22 19.86 7.86 21.6 12 21.6z" fill="#34A853"/>
            <path d="M6.88 14.24a5.2 5.2 0 01-.36-2.24c0-.78.12-1.53.36-2.24V7.06H2.64C1.93 8.86 1.6 10.78 1.6 12.72c0 1.94.33 3.86 1.04 5.66l3.24-2.14z" fill="#FBBC05"/>
            <path d="M12 4.64c1.12 0 2.18.384 3 1.12l2.24-2.24C16.66 2.08 14.56 1.2 12 1.2 7.86 1.2 4.22 2.94 2.64 5.94l3.24 2.36C7.6 6.245 9.62 4.64 12 4.64z" fill="#4285F4"/>
          </svg>
          Google
        </span>
      );
    case 'GITHUB':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200 dark:bg-slate-700 dark:text-gray-100 dark:border-slate-600">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
          GitHub
        </span>
      );
    case 'LINKEDIN':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 dark:bg-blue-900 dark:text-blue-200 dark:border-blue-700">
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="currentColor">
            <rect width="24" height="24" rx="3" fill="#0A66C2" />
            <path d="M6.94 8.5h2.22v8.5H6.94v-8.5zM7.99 6.94a1.28 1.28 0 110-2.56 1.28 1.28 0 010 2.56zM13.56 12.06c0-1.62.03-3.69-2.41-3.69-2.43 0-2.8 1.9-2.8 3.64v4.49h2.22v-4.02c0-.74.02-1.68 1.03-1.68 1 0 1.03.96 1.03 1.73v3.97h2.22v-4.44z" fill="#fff"/>
          </svg>
          LinkedIn
        </span>
      );
    case 'USERNAME_PASSWORD':
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200 dark:bg-slate-700 dark:text-slate-200 dark:border-slate-600">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
          </svg>
          Mật khẩu
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700 border border-gray-200 dark:bg-slate-700 dark:text-slate-300 dark:border-slate-600">
          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          {provider || 'Khác'}
        </span>
      );
  }
};

export const getStatusBadge = (status: string) => {
  const isActive = status === 'ACTIVE';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${isActive
      ? "bg-emerald-50 text-emerald-700 border-emerald-100 ring-1 ring-emerald-500/10 dark:bg-emerald-900 dark:text-emerald-100 dark:border-emerald-700"
      : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-700 dark:text-gray-300 dark:border-slate-600"
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400"}`}></span>
      <span>{isActive ? "Hoạt động" : "Thu hồi"}</span>
    </span>
  );
};
