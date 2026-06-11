interface StatCardProps {
  name: string;
  value: string;
  icon: React.ReactNode;
  badge?: string;
  badgeColor?: "emerald" | "blue" | "purple" | "amber" | "rose";
}

export const StatCard = ({ name, value, icon, badge, badgeColor = "emerald" }: StatCardProps) => {
  const badgeColors = {
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-4 sm:p-5 lg:p-6 border border-gray-100 hover:shadow-md transition-all duration-200 h-full">
      <div className="flex flex-col gap-3">
        {/* Icon and Badge Row */}
        <div className="flex items-center justify-between">
          <div className="p-2 sm:p-2.5 bg-accent-100 rounded-lg flex-shrink-0">
            <div className="text-accent-600 w-5 h-5 sm:w-6 sm:h-6">{icon}</div>
          </div>
          {badge && (
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${badgeColors[badgeColor]} flex-shrink-0`}>
              {badge}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col gap-1">
          <p className="text-xs sm:text-sm font-medium text-gray-600 line-clamp-2 leading-tight">
            {name}
          </p>
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 tracking-tight">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};
