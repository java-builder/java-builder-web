import { ReactNode } from "react";

interface StepCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

export default function StepCard({ title, description, children }: StepCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <div className="border-b border-gray-200 px-5 py-3 dark:border-slate-700">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="mt-0.5 text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <div className="px-5 py-5">{children}</div>
    </div>
  );
}
