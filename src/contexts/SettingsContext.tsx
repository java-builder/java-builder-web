 'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { SettingsData } from "@/types/settings";
import { settingsService } from "@/services/settings.service";

interface SettingsContextType {
  settings: SettingsData;
  loadSettings: () => Promise<void>;
  updateSetting: (
    tabId: string,
    sectionId: string,
    fieldId: string,
    value: unknown,
  ) => Promise<boolean>;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SettingsData>({});

  const applySettingsEffects = (s: SettingsData) => {
    try {
      const appName = settingsService.getSetting<string>(s, "system", "app-info", "app-name");
      if (appName) {
        document.title = appName;
      }

      const defaultTheme = settingsService.getSetting<string>(s, "display", "theme", "default-theme");
      // Only apply the default theme if the user hasn't explicitly chosen a theme.
      const savedTheme = localStorage.getItem("theme");
      if (!savedTheme && defaultTheme) {
        if (defaultTheme === "dark") {
          localStorage.setItem("theme", "dark");
          document.documentElement.classList.add("dark");
        } else if (defaultTheme === "light") {
          localStorage.setItem("theme", "light");
          document.documentElement.classList.remove("dark");
        }
      }

      const primary = settingsService.getSetting<string>(s, "display", "theme", "primary-color");
      const secondary = settingsService.getSetting<string>(s, "display", "theme", "secondary-color");
      if (primary) document.documentElement.style.setProperty("--jb-primary-color", primary);
      if (secondary) document.documentElement.style.setProperty("--jb-secondary-color", secondary);
    } catch (err) {
      console.error("Error applying settings effects:", err);
    }
  };

  const loadSettings = useCallback(async () => {
    try {
      const loaded = await settingsService.loadSettings();
      setSettings(loaded);
      applySettingsEffects(loaded);
    } catch (err) {
      console.error("Failed to load settings:", err);
    }
  }, []);

  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  const updateSetting = async (tabId: string, sectionId: string, fieldId: string, value: unknown) => {
    try {
      const next = settingsService.setSetting(settings, tabId, sectionId, fieldId, value as unknown);
      setSettings(next);
      await settingsService.saveSettings(next);
      applySettingsEffects(next);
      return true;
    } catch (err) {
      console.error("Failed to update setting:", err);
      return false;
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, loadSettings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettingsContext() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    return {
      settings: {},
      loadSettings: async () => {},
      updateSetting: async () => false,
    } as SettingsContextType;
  }
  return ctx;
}


