"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "@xyflow/react";
import {
  Globe,
  Shield,
  Layers,
  Server,
  Database,
  Zap,
  Cpu,
  Inbox,
  Lock,
  GitBranch,
  Container,
  Radio,
  CheckCircle2,
} from "lucide-react";
import { FlowNodeData } from "./types";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "client":
      return <Globe className="w-4 h-4 text-sky-500" />;
    case "auth":
    case "security":
      return <Lock className="w-4 h-4 text-[#FF5A1F]" />;
    case "filter":
      return <Shield className="w-4 h-4 text-amber-500" />;
    case "gateway":
      return <Zap className="w-4 h-4 text-orange-500" />;
    case "service":
      return <Server className="w-4 h-4 text-blue-500" />;
    case "cache":
      return <Layers className="w-4 h-4 text-emerald-500" />;
    case "database":
      return <Database className="w-4 h-4 text-indigo-500" />;
    case "queue":
    case "broker":
      return <Inbox className="w-4 h-4 text-purple-500" />;
    case "devops":
    case "build":
      return <GitBranch className="w-4 h-4 text-rose-500" />;
    case "deploy":
      return <Container className="w-4 h-4 text-teal-500" />;
    case "websocket":
      return <Radio className="w-4 h-4 text-pink-500" />;
    case "test":
      return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    default:
      return <Cpu className="w-4 h-4 text-[#FF5A1F]" />;
  }
};

const CardNodeComponent = ({ data, selected }: NodeProps) => {
  const nodeData = data as unknown as FlowNodeData;
  const { label, sublabel, category, categoryBadge, isSelected, stepNumber } = nodeData;

  const isHighlighted = selected || isSelected;
  const isDatabase = category === "database";

  return (
    <div
      className={`group relative transition-all duration-200 w-[205px] select-none cursor-pointer p-3.5 ${
        isDatabase
          ? // Database Cylinder Shape with rounded top/bottom ellipse curves & disk stack styling
            `rounded-t-[22px] rounded-b-[22px] bg-gradient-to-b from-indigo-50/60 via-white to-indigo-50/40 dark:from-[#1A1F2C] dark:via-[#161B22] dark:to-[#1A1F2C] border-2 shadow-sm ${
              isHighlighted
                ? "border-[#FF5A1F] ring-2 ring-orange-500/25 shadow-md shadow-orange-500/10 -translate-y-0.5"
                : "border-indigo-300/80 dark:border-indigo-800/80 hover:border-[#FF5A1F]/70"
            }`
          : // Standard Card Shape
            `rounded-2xl bg-white dark:bg-[#1E232A] border shadow-xs ${
              isHighlighted
                ? "border-[#FF5A1F] ring-2 ring-orange-500/25 shadow-md shadow-orange-500/10 -translate-y-0.5"
                : "border-slate-200 dark:border-slate-800 hover:border-[#FF5A1F]/70 hover:shadow-xs"
            }`
      }`}
    >
      {/* Database Cylinder Top Elliptical Rim Header */}
      {isDatabase && (
        <div className="w-full h-3 rounded-full border border-indigo-200 dark:border-indigo-700/80 bg-indigo-100/50 dark:bg-indigo-900/40 mb-2 flex items-center justify-center">
          <div className="w-12 h-1 rounded-full bg-indigo-300/60 dark:bg-indigo-600/60" />
        </div>
      )}

      {/* Left handles - invisible anchors for edge connections */}
      <Handle
        type="target"
        position={Position.Left}
        id="left"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="target"
        position={Position.Left}
        id="left-target"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Left}
        id="left-source"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />

      {/* Right handles */}
      <Handle
        type="source"
        position={Position.Right}
        id="right"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Right}
        id="right-source"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="target"
        position={Position.Right}
        id="right-target"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />

      {/* Top handles */}
      <Handle
        type="source"
        position={Position.Top}
        id="top"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Top}
        id="top-source"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="target"
        position={Position.Top}
        id="top-target"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />

      {/* Bottom handles */}
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="bottom-source"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />
      <Handle
        type="target"
        position={Position.Bottom}
        id="bottom-target"
        className="!opacity-0 !w-1 !h-1 !border-0 pointer-events-none"
      />

      {/* Header: Sequence Number + Icon + Category Badge */}
      <div className="flex items-center justify-between gap-1.5 mb-2">
        <div className="flex items-center gap-1.5">
          {/* Sequence Number Badge: High-contrast branded orange with crisp white text */}
          {stepNumber !== undefined && (
            <span className="w-5 h-5 rounded-full bg-[#FF5A1F] text-white text-[10px] font-bold font-mono flex items-center justify-center shrink-0 shadow-xs ring-1 ring-white/30 dark:ring-black/40">
              {stepNumber}
            </span>
          )}

          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 border ${
              isDatabase
                ? "bg-indigo-100/70 dark:bg-indigo-950/60 border-indigo-200 dark:border-indigo-800"
                : "bg-orange-50 dark:bg-orange-950/40 border-orange-200/50 dark:border-orange-900/40"
            }`}
          >
            {getCategoryIcon(category)}
          </div>
        </div>

        <span
          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
            categoryBadge?.bg || (isDatabase ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-400" : "bg-orange-100 text-[#FF5A1F]")
          }`}
        >
          {categoryBadge?.label || (isDatabase ? "DATABASE" : category)}
        </span>
      </div>

      {/* Title & Sublabel */}
      <div className="space-y-0.5">
        <h4 className="text-xs font-bold text-foreground leading-snug group-hover:text-[#FF5A1F] transition-colors truncate">
          {label}
        </h4>
        <p className="text-[10px] text-muted-foreground font-mono truncate">
          {sublabel}
        </p>
      </div>

      {/* Database Cylinder Bottom Disc Line */}
      {isDatabase && (
        <div className="w-full h-1.5 rounded-b-full border-b border-indigo-300 dark:border-indigo-700/80 mt-2" />
      )}
    </div>
  );
};

export const CardNode = memo(CardNodeComponent);
