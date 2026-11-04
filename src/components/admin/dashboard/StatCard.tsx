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
    emerald: "bg-success-soft text-success border-success-border",
    blue: "bg-secondary-soft text-secondary border-secondary-soft-border",
    purple: "bg-primary-soft text-primary border-primary-soft-border",
    amber: "bg-warning-soft text-warning border-warning-border",
    rose: "bg-error-soft text-error border-error-border",
  };

  return (
    <Card className="hover:shadow-md transition-all duration-200 h-full">
      <CardContent className="flex flex-col gap-3 py-1">
        {/* Icon and Badge Row */}
        <div className="flex items-center justify-between">
          <div className="p-2 sm:p-2.5 bg-primary-soft border border-primary-soft-border rounded-lg flex-shrink-0">
            <div className="text-primary w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
          </div>
          {badge && (
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${badgeColors[badgeColor]} flex-shrink-0`}>
              {badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <p className="text-xs sm:text-sm font-medium text-text-muted line-clamp-2 leading-tight">
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
