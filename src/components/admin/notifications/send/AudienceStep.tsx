"use client";

import Image from "next/image";
import { Check, Search } from "lucide-react";
import type { TargetSegment } from "@/components/admin/notifications/useEmailCampaign";
import type { UserDetailResponse } from "@/types/user";
import StepCard from "./StepCard";
import StepFooter from "./StepFooter";
import { ICON_TONE, SEGMENTS } from "./helpers";
import { Button } from "@/components/ui/button";

interface AudienceStepProps {
  targetSegment: TargetSegment;
  selectedUsers: string[];
  users: UserDetailResponse[];
  searchQuery: string;
  isLoadingUsers: boolean;
  onTargetSegmentChange: (segment: TargetSegment) => void;
  onSearchQueryChange: (value: string) => void;
  onUserSelect: (userId: string) => void;
  onSelectAll: () => void;
  onBack: () => void;
  onNext: () => void;
}

export default function AudienceStep({
  targetSegment,
  selectedUsers,
  users,
  searchQuery,
  isLoadingUsers,
  onTargetSegmentChange,
  onSearchQueryChange,
  onUserSelect,
  onSelectAll,
  onBack,
  onNext,
}: AudienceStepProps) {
  return (
    <div className="space-y-5">
      <StepCard
        title="Phân khúc người nhận"
        description="Chọn nhóm đối tượng nhận chiến dịch"
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {SEGMENTS.map((segment) => {
            const isActive = targetSegment === segment.id;
            const Icon = segment.icon;
            return (
              <button
                key={segment.id}
                type="button"
                onClick={() => onTargetSegmentChange(segment.id)}
                className={`flex items-start gap-3 rounded-xl border p-4 text-left transition ${
                  isActive
                    ? "border-accent bg-accent/5 ring-1 ring-accent/30"
                    : "border-border bg-card hover:border-accent/50 hover:bg-muted"
                }`}
              >
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                    isActive ? "bg-accent/10 text-accent" : ICON_TONE[segment.tone]
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <div
                    className={`text-sm font-semibold ${
                      isActive ? "text-accent" : "text-foreground"
                    }`}
                  >
                    {segment.title}
                  </div>
                  <div className="mt-0.5 text-xs text-muted-foreground">
                    {segment.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </StepCard>

      {targetSegment === "custom" && (
        <StepCard
          title="Tìm kiếm người nhận"
          description="Chọn từng tài khoản theo username hoặc email"
        >
          <div className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchQueryChange(e.target.value)}
                  placeholder="Tìm theo username, email..."
                  className="block w-full rounded-lg border border-input bg-background py-2 pl-8 pr-3 text-sm text-foreground placeholder:text-muted-foreground transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onSelectAll}
              >
                {selectedUsers.length === users.length && users.length > 0
                  ? "Bỏ chọn tất cả"
                  : "Chọn tất cả"}
              </Button>
            </div>

            {selectedUsers.length > 0 && (
              <div className="text-xs text-muted-foreground">
                Đã chọn{" "}
                <span className="font-semibold text-accent">
                  {selectedUsers.length}
                </span>{" "}
                người nhận
              </div>
            )}

            <div className="max-h-72 overflow-y-auto rounded-lg border border-border">
              {isLoadingUsers ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  Đang tìm kiếm...
                </div>
              ) : users.length === 0 ? (
                <div className="p-6 text-center text-xs text-muted-foreground">
                  Nhập từ khoá để tìm kiếm tài khoản
                </div>
              ) : (
                <ul className="divide-y divide-border">
                  {users.map((user) => {
                    const isSelected = selectedUsers.includes(user.id);
                    return (
                      <li
                        key={user.id}
                        onClick={() => onUserSelect(user.id)}
                        className={`flex cursor-pointer items-center gap-3 px-3 py-2.5 transition ${
                          isSelected
                            ? "bg-accent/5"
                            : "hover:bg-muted"
                        }`}
                      >
                        <span
                          className={`flex h-4 w-4 flex-shrink-0 items-center justify-center rounded border transition ${
                            isSelected
                              ? "border-accent bg-accent"
                              : "border-input bg-background"
                          }`}
                        >
                          {isSelected && (
                            <Check className="h-3 w-3 text-white" strokeWidth={3} />
                          )}
                        </span>
                        <UserAvatar src={user.avatar} name={user.username} />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-medium text-foreground">
                            {user.username}
                          </div>
                          <div className="truncate text-xs text-muted-foreground">
                            {user.email}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>
        </StepCard>
      )}

      <StepFooter onBack={onBack} onNext={onNext} nextLabel="Lập lịch" />
    </div>
  );
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0]?.toUpperCase())
    .slice(0, 2)
    .join("") || "U";

function UserAvatar({ src, name }: { src?: string | null; name: string }) {
  if (src) {
    return (
      <div className="relative h-7 w-7 flex-shrink-0 overflow-hidden rounded-full bg-gray-100 dark:bg-slate-700">
        <Image
          src={src}
          alt={name}
          fill
          sizes="28px"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent text-[11px] font-semibold text-white">
      {getInitials(name)}
    </div>
  );
}
