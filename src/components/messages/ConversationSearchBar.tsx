import { Search, Loader2 } from "lucide-react";

interface ConversationSearchBarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  isSearchingApi: boolean;
}

export default function ConversationSearchBar({
  searchQuery,
  onSearchChange,
  isSearchingApi,
}: ConversationSearchBarProps) {
  return (
    <div className="p-3 border-b border-border">
      <div className="relative flex items-center">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Tìm trò chuyện, người dùng..."
          className="w-full pl-9.5 pr-8 py-2 rounded-xl border border-input bg-background text-foreground text-[16px] sm:text-xs focus:outline-none focus:ring-2 focus:ring-accent focus:border-accent transition-all placeholder:text-muted-foreground"
        />
        {isSearchingApi && (
          <Loader2 className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-accent animate-spin" />
        )}
      </div>
    </div>
  );
}
