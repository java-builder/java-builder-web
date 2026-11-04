"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

interface SidebarContextType {
  isCollapsed: boolean;
  setIsCollapsed: (val: boolean) => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (val: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Load from localStorage on client side
  useEffect(() => {
    const saved = localStorage.getItem("sidebar-collapsed");
    if (saved === "true") {
      setIsCollapsed(true);
    }
  }, []);

  const handleSetCollapsed = (val: boolean) => {
    setIsCollapsed(val);
    localStorage.setItem("sidebar-collapsed", String(val));
  };

  return (
    <SidebarContext.Provider
      value={{
        isCollapsed,
        setIsCollapsed: handleSetCollapsed,
        isMobileOpen,
        setIsMobileOpen,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    return {
      isCollapsed: false,
      setIsCollapsed: () => {},
      isMobileOpen: false,
      setIsMobileOpen: () => {},
    };
  }
  return context;
}
