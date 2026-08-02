"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { UserSubscription } from "@/types/user-subscription";
import { formatDate } from "@/utils/dateUtils";
import { useI18n } from "@/contexts/I18nContext";
import {
  NoSubscriptionState,
  RenewConfirmModal,
  SubscriptionBenefits,
  SubscriptionCard,
  SubscriptionExpiringAlert,
  SubscriptionHeader,
  SubscriptionLoadingState,
} from "@/components/subscription";

export default function SubscriptionClient() {
  const { t } = useI18n();
  const [subscription, setSubscription] = useState<UserSubscription | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [showRenewModal, setShowRenewModal] = useState(false);
  const [isRenewing, setIsRenewing] = useState(false);

  const fetchSubscription = async () => {
    try {
      setIsLoading(true);
      const response = await userSubscriptionService.getMySubscription();
      setSubscription(response.data || null);
    } catch (error) {
      console.error("Error fetching subscription:", error);
      setSubscription(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const handleRenew = async () => {
    if (!subscription) return;

    try {
      setIsRenewing(true);
      const response = await userSubscriptionService.renew(subscription.planId);

      if (response.code === 200) {
        toast.success(t("subscriptionPage.renewSuccess"));
        setShowRenewModal(false);
        await fetchSubscription();
      }
    } catch (error) {
      console.error("Error renewing subscription:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : t("subscriptionPage.renewFailed");
      toast.error(errorMessage);
    } finally {
      setIsRenewing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl">
          <SubscriptionLoadingState />
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
        <div className="mx-auto max-w-4xl space-y-4 p-4 sm:space-y-6 sm:p-6">
          <SubscriptionHeader
            title={t("subscriptionPage.title")}
            subtitle={t("subscriptionPage.subtitle")}
          />
          <NoSubscriptionState
            title={t("subscriptionPage.noPremiumTitle")}
            description={t("subscriptionPage.noPremiumDesc")}
            viewPlansLabel={t("subscriptionPage.viewPlansBtn")}
          />
        </div>
      </div>
    );
  }

  const daysLeft = subscription.daysRemaining ?? 0;
  const isExpiringSoon = daysLeft <= 7 && daysLeft > 0;
  const startDateText = formatDate(subscription.startDate);
  const endDateText = formatDate(subscription.endDate);

  const benefitItems = [
    t("subscriptionPage.benefit1"),
    t("subscriptionPage.benefit2"),
    t("subscriptionPage.benefit3"),
    t("subscriptionPage.benefit4"),
  ].filter(Boolean);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      <div className="mx-auto max-w-4xl space-y-4 p-4 sm:space-y-6 sm:p-6">
        <SubscriptionHeader
          title={t("subscriptionPage.title")}
          subtitle={t("subscriptionPage.subtitle")}
        />

        {isExpiringSoon && (
          <SubscriptionExpiringAlert
            title={t("subscriptionPage.expiringSoonTitle")}
            description={t("subscriptionPage.expiringSoonDesc").replace(
              "{days}",
              String(daysLeft)
            )}
          />
        )}

        <SubscriptionCard
          subscription={subscription}
          startDateText={startDateText}
          endDateText={endDateText}
          labels={{
            currentPlan: t("subscriptionPage.currentPlan"),
            statusActive: t("subscriptionPage.statusActive"),
            statusExpired: t("subscriptionPage.statusExpired"),
            statusCancelled: t("subscriptionPage.statusExpired"),
            renewBtn: t("subscriptionPage.renewBtn"),
            startDate: t("subscriptionPage.startDate"),
            endDate: t("subscriptionPage.endDate"),
            timeLeft: t("subscriptionPage.timeLeft"),
            days: t("subscriptionPage.days"),
            statusLabel: t("subscriptionPage.statusLabel"),
          }}
          onRenew={() => setShowRenewModal(true)}
        />

        {benefitItems.length > 0 && (
          <SubscriptionBenefits
            title={t("subscriptionPage.benefitsTitle")}
            items={benefitItems}
          />
        )}
      </div>

      {showRenewModal && (
        <RenewConfirmModal
          subscription={subscription}
          endDateText={endDateText}
          isProcessing={isRenewing}
          labels={{
            title: t("subscriptionPage.renewModalTitle"),
            description: t("subscriptionPage.renewModalDesc"),
            planLabel: t("subscriptionPage.planLabel"),
            currentEndDateLabel: t(
              "subscriptionPage.currentEndDateLabel"
            ),
            cancelBtn: t("subscriptionPage.cancelBtn"),
            confirmBtn: t("subscriptionPage.confirmRenewBtn"),
            processing: t("subscriptionPage.processing"),
            close: t("common.close"),
          }}
          onClose={() => {
            if (!isRenewing) setShowRenewModal(false);
          }}
          onConfirm={handleRenew}
        />
      )}
    </div>
  );
}
