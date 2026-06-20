import { formatLocaleString } from "@/utils/dateUtils";
import type { UserSubscription } from "@/types/user-subscription";
import UserAvatar from "./UserAvatar";
import SubscriptionStatusPill from "./SubscriptionStatusPill";
import { getDaysRemainingTone } from "./helpers";

interface SubscriptionMobileCardProps {
  subscription: UserSubscription;
}

export default function SubscriptionMobileCard({
  subscription,
}: SubscriptionMobileCardProps) {
  const daysTone = getDaysRemainingTone(subscription.daysRemaining);

  return (
    <div className="rounded-xl border border-border bg-card p-4 shadow-sm">
      {/* Top: user + status */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <UserAvatar
            src={subscription.avatar}
            name={subscription.username}
            size={40}
          />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">
              {subscription.username}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {subscription.email}
            </div>
          </div>
        </div>
        <SubscriptionStatusPill status={subscription.status} />
      </div>

      {/* Plan */}
      <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
        <span className="text-xs text-muted-foreground">Gói</span>
        <span className="inline-flex items-center rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
          {subscription.planName}
        </span>
      </div>

      {/* Detail rows */}
      <dl className="mt-2 grid grid-cols-1 gap-y-1.5 text-xs">
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Bắt đầu</dt>
          <dd className="tabular-nums text-foreground">
            {formatLocaleString(subscription.startDate)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Kết thúc</dt>
          <dd className="tabular-nums text-foreground">
            {formatLocaleString(subscription.endDate)}
          </dd>
        </div>
        <div className="flex items-baseline justify-between gap-3">
          <dt className="text-muted-foreground">Còn lại</dt>
          <dd>
            {subscription.daysRemaining > 0 ? (
              <span className={`text-sm font-semibold tabular-nums ${daysTone}`}>
                {subscription.daysRemaining}{" "}
                <span className="text-xs font-normal text-muted-foreground">ngày</span>
              </span>
            ) : (
              <span className="text-sm text-muted-foreground">Hết hạn</span>
            )}
          </dd>
        </div>
      </dl>
    </div>
  );
}
