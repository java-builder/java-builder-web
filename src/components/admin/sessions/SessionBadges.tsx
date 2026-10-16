import { KeyRound, User } from "lucide-react";
import { FaGoogle, FaGithub, FaLinkedin } from "react-icons/fa";

export const getProviderBadge = (provider: string) => {
  const p = (provider || "").toUpperCase();
  switch (p) {
    case 'GOOGLE':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20">
          <FaGoogle className="w-3 h-3 text-[#EA4335]" />
          Google
        </span>
      );
    case 'GITHUB':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-500/10 text-slate-700 dark:text-slate-300 border border-slate-500/20">
          <FaGithub className="w-3 h-3" />
          GitHub
        </span>
      );
    case 'LINKEDIN':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
          <FaLinkedin className="w-3.5 h-3.5 text-[#0A66C2]" />
          LinkedIn
        </span>
      );
    case 'USERNAME_PASSWORD':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
          <KeyRound className="w-3 h-3" />
          Mật khẩu
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-muted text-muted-foreground border border-border">
          <User className="w-3 h-3" />
          {provider || 'Khác'}
        </span>
      );
  }
};

export const getStatusBadge = (status: string) => {
  const isActive = status === 'ACTIVE';
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${isActive
      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
      : "bg-muted text-muted-foreground border-border"
      }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500" : "bg-slate-400 dark:bg-slate-500"}`}></span>
      <span>{isActive ? "Hoạt động" : "Thu hồi"}</span>
    </span>
  );
};
