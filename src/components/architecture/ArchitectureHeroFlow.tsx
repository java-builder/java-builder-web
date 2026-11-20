"use client";

import React from "react";
import {
  Globe,
  Zap,
  Server,
  Database,
} from "lucide-react";

export const ArchitectureHeroFlow: React.FC = () => {
  return (
    <div className="w-full max-w-4xl mx-auto py-3 select-none">
      <style jsx>{`
        @keyframes flowDash {
          from {
            stroke-dashoffset: 16;
          }
          to {
            stroke-dashoffset: 0;
          }
        }
        .flow-line {
          stroke-dasharray: 4 4;
          animation: flowDash 1.2s linear infinite;
        }
      `}</style>

      {/* Horizontal Minimalist Pipeline Flow */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-2 sm:gap-3">
        {/* Node 1: Client */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-border/80 bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-xs shadow-2xs transition-all hover:border-sky-400">
          <div className="w-7 h-7 rounded-lg bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 flex items-center justify-center shrink-0">
            <Globe className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-foreground">Client App</div>
            <div className="text-[10px] text-muted-foreground font-mono">Web & Mobile</div>
          </div>
        </div>

        {/* Connector 1 */}
        <div className="hidden md:flex flex-col items-center justify-center px-1">
          <span className="text-[9px] font-mono text-[#FF5A1F] font-bold">HTTPS</span>
          <svg className="w-10 h-3 overflow-visible" viewBox="0 0 40 10">
            <line
              x1="0"
              y1="5"
              x2="34"
              y2="5"
              stroke="#FF5A1F"
              strokeWidth="1.5"
              className="flow-line"
            />
            <polygon points="38,5 32,2 32,8" fill="#FF5A1F" />
          </svg>
        </div>
        <div className="md:hidden text-slate-300 dark:text-slate-600 text-xs">↓</div>

        {/* Node 2: Gateway */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-[#FF5A1F]/60 bg-orange-50/50 dark:bg-[#201A18]/60 backdrop-blur-xs shadow-2xs transition-all">
          <div className="w-7 h-7 rounded-lg bg-orange-100 dark:bg-orange-950 text-[#FF5A1F] flex items-center justify-center shrink-0">
            <Zap className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-foreground">API Gateway</div>
            <div className="text-[10px] text-muted-foreground font-mono">Cân Bằng Tải</div>
          </div>
        </div>

        {/* Connector 2 */}
        <div className="hidden md:flex flex-col items-center justify-center px-1">
          <span className="text-[9px] font-mono text-blue-500 font-bold">Internal RPC</span>
          <svg className="w-10 h-3 overflow-visible" viewBox="0 0 40 10">
            <line
              x1="0"
              y1="5"
              x2="34"
              y2="5"
              stroke="#3B82F6"
              strokeWidth="1.5"
              className="flow-line"
            />
            <polygon points="38,5 32,2 32,8" fill="#3B82F6" />
          </svg>
        </div>
        <div className="md:hidden text-slate-300 dark:text-slate-600 text-xs">↓</div>

        {/* Node 3: Backend Services */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-border/80 bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-xs shadow-2xs transition-all hover:border-blue-400">
          <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
            <Server className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-foreground">App Services</div>
            <div className="text-[10px] text-muted-foreground font-mono">Xử Lý Nghiệp Vụ</div>
          </div>
        </div>

        {/* Connector 3 */}
        <div className="hidden md:flex flex-col items-center justify-center px-1">
          <span className="text-[9px] font-mono text-indigo-500 font-bold">Read / Write</span>
          <svg className="w-10 h-3 overflow-visible" viewBox="0 0 40 10">
            <line
              x1="0"
              y1="5"
              x2="34"
              y2="5"
              stroke="#6366F1"
              strokeWidth="1.5"
              className="flow-line"
            />
            <polygon points="38,5 32,2 32,8" fill="#6366F1" />
          </svg>
        </div>
        <div className="md:hidden text-slate-300 dark:text-slate-600 text-xs">↓</div>

        {/* Node 4: Database & Cache */}
        <div className="flex items-center gap-2.5 px-3.5 py-2 rounded-xl border border-border/80 bg-white/90 dark:bg-[#161B22]/90 backdrop-blur-xs shadow-2xs transition-all hover:border-indigo-400">
          <div className="w-7 h-7 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
            <Database className="w-3.5 h-3.5" />
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-foreground">Data & Cache</div>
            <div className="text-[10px] text-muted-foreground font-mono">Lưu Trữ Bền Vững</div>
          </div>
        </div>
      </div>
    </div>
  );
};
