"use client";

import { createContext, useContext, useState, useEffect, useRef, ReactNode } from "react";
import { reportApi } from "@/services/report.service";
import { OverviewStatsResponse } from "@/types/report";

interface AdminOverviewContextType {
  overview: OverviewStatsResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

const AdminOverviewContext = createContext<AdminOverviewContextType | undefined>(undefined);

export const AdminOverviewProvider = ({ children }: { children: ReactNode }) => {
  const [overview, setOverview] = useState<OverviewStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isMountedRef = useRef(true);
  const hasFetchedRef = useRef(false);

  const fetchOverview = async () => {
    if (hasFetchedRef.current) return;
    
    hasFetchedRef.current = true;

    try {
      setLoading(true);
      const response = await reportApi.getOverview();
      
      if (isMountedRef.current) {
        setOverview(response.data ?? null);
        setError(null);
      }
    } catch (err) {
      if (isMountedRef.current) {
        console.error("Failed to fetch overview:", err);
        setError(err as Error);
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    isMountedRef.current = true;
    fetchOverview();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const refetch = () => {
    hasFetchedRef.current = false;
    fetchOverview();
  };

  return (
    <AdminOverviewContext.Provider value={{ overview, loading, error, refetch }}>
      {children}
    </AdminOverviewContext.Provider>
  );
};

export const useAdminOverviewContext = () => {
  const context = useContext(AdminOverviewContext);
  if (context === undefined) {
    throw new Error("useAdminOverviewContext must be used within AdminOverviewProvider");
  }
  return context;
};
