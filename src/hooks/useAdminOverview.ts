import { useState, useEffect, useRef } from "react";
import { reportApi } from "@/services/report.service";
import { OverviewStatsResponse } from "@/types/report";

export const useAdminOverview = () => {
  const [overview, setOverview] = useState<OverviewStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;

    const fetchOverview = async () => {
      try {
        setLoading(true);
        const response = await reportApi.getOverview();
        setOverview(response.data ?? null);
        setError(null);
        hasFetched.current = true;
      } catch (err) {
        console.error("Failed to fetch overview:", err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, []);

  return { overview, loading, error };
};
