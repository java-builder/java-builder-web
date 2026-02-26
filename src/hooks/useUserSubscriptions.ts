import { useState, useEffect, useRef } from "react";
import { userSubscriptionService } from "@/services/user-subscription.service";
import { UserSubscription } from "@/types/user-subscription";
import toast from "react-hot-toast";

export function useUserSubscriptions(
  page: number = 1,
  size: number = 10,
  status?: string,
  search?: string
) {
  const [subscriptions, setSubscriptions] = useState<UserSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) {
      hasFetched.current = false;
    }

    const fetchSubscriptions = async () => {
      try {
        setIsLoading(true);
        const response = await userSubscriptionService.getAllUserSubscriptions(
          page,
          size,
          status || undefined,
          search || undefined
        );
        if (response.data) {
          setSubscriptions(response.data.data || []);
          setTotalPages(response.data.totalPages || 1);
          setTotalElements(response.data.totalElements || 0);
        }
      } catch {
        toast.error("Không thể tải danh sách subscriptions");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubscriptions();
  }, [page, size, status, search]);

  const refetch = () => {
    hasFetched.current = false;
  };

  return { subscriptions, isLoading, totalPages, totalElements, refetch };
}
