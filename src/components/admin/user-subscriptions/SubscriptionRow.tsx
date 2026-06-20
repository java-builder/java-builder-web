import { formatLocaleString } from "@/utils/dateUtils";
import type { UserSubscription } from "@/types/user-subscription";
import UserAvatar from "./UserAvatar";
import SubscriptionStatusPill from "./SubscriptionStatusPill";
import { getDaysRemainingTone } from "./helpers";

interface SubscriptionRowProps {
  subscription: UserSubscription;
}

export default function SubscriptionRow({ subscription }: SubscriptionRowProps) {
  const daysTone = getDaysRemainingTone(subscription.daysRemaining);

  return (
    <tr className="transition hover:bg-muted/25">
      {/* User */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <UserAvatar src={subscription.avatar} name={subscription.username} />
          <div className="min-w-0">
            <div className="truncate text-sm font-semibold text-foreground">
              {subscription.username}
            </div>
            <div className="truncate text-xs text-muted-foreground">
              {subscription.email}
            </div>
          </div>
        </div>
      </td>

      {/* Plan */}
      <td className="whitespace-nowrap px-4 py-3">
        <span className="inline-flex items-center rounded-md bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
          {subscription.planName}
        </span>
      </td>

      {/* Status */}
      <td className="whitespace-nowrap px-4 py-3">
        <SubscriptionStatusPill status={subscription.status} />
      </td>

      {/* Start date */}
      <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-muted-foreground">
        {formatLocaleString(subscription.startDate)}
      </td>

      {/* End date */}
      <td className="whitespace-nowrap px-4 py-3 text-xs tabular-nums text-muted-foreground">
        {formatLocaleString(subscription.endDate)}
      </td>

      {/* Days remaining */}
      <td className="whitespace-nowrap px-4 py-3 text-right">
        {subscription.daysRemaining > 0 ? (
          <span className={`text-sm font-semibold tabular-nums ${daysTone}`}>
            {subscription.daysRemaining}{" "}
            <span className="text-xs font-normal text-muted-foreground">ngày</span>
          </span>
        ) : (
          <span className="text-sm text-muted-foreground">—</span>
        )}
      </td>
    </tr>
  );
}
