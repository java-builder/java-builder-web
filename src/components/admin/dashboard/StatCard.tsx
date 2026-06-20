import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  name: string;
  value: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: "emerald" | "blue" | "purple" | "amber" | "rose";
}

export const StatCard = ({ name, value, icon, badge, badgeColor = "emerald" }: StatCardProps) => {
  const badgeColors = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-900/50",
    blue: "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900/50",
    purple: "bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:text-purple-400 dark:border-purple-900/50",
    amber: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/50",
    rose: "bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/50",
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 h-full">
      <CardContent className="flex flex-col gap-3 py-1">
        {/* Icon and Badge Row */}
        <div className="flex items-center justify-between">
          <div className="p-2 sm:p-2.5 bg-accent/10 rounded-lg flex-shrink-0">
            <div className="text-accent-600 dark:text-accent-on-dark w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
          </div>
          {badge && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badgeColors[badgeColor]} flex-shrink-0`}>
              {badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <p className="text-xs sm:text-sm font-medium text-muted-foreground line-clamp-2 leading-tight">
            {name}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground tracking-tight">
            {value}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

