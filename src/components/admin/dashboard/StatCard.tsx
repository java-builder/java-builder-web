interface StatCardProps {
  name: string;
  value: string;
  icon: React.ReactNode;
}

export const StatCard = ({ name, value, icon }: StatCardProps) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
      <div className="flex items-center">
        <div className="p-2 bg-accent-100 rounded-lg">
          <div className="text-accent-600">{icon}</div>
        </div>
        <div className="ml-4 flex-1">
          <p className="text-sm font-medium text-gray-600">{name}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
};
