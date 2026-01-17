import { SettingsData, SettingValue } from "@/types/settings";
import { settingsConfig } from "@/lib/settings-config";

class SettingsService {
  private storageKey = "JavaBuilder-settings";

  async loadSettings(): Promise<SettingsData> {
    try {
      const stored = localStorage.getItem(this.storageKey);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
    return this.getDefaultSettings();
  }

  async saveSettings(settings: SettingsData): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
    } catch (error) {
      console.error("Error saving settings:", error);
      throw new Error("Không thể lưu cài đặt");
    }
  }

  private getDefaultSettings(): SettingsData {
    const defaultSettings: SettingsData = {};

    settingsConfig.tabs.forEach((tab) => {
      defaultSettings[tab.id] = {};
      tab.sections.forEach((section) => {
        defaultSettings[tab.id][section.id] = {};
        section.fields.forEach((field) => {
          if (field.defaultValue !== undefined) {
            defaultSettings[tab.id][section.id][field.id] = field.defaultValue;
          }
        });
      });
    });

    return defaultSettings;
  }

  getSetting<T = unknown>(
    settings: SettingsData,
    tabId: string,
    sectionId: string,
    fieldId: string,
  ): T | undefined {
    return settings[tabId]?.[sectionId]?.[fieldId] as T | undefined;
  }

  setSetting<T = unknown>(
    settings: SettingsData,
    tabId: string,
    sectionId: string,
    fieldId: string,
    value: T,
  ): SettingsData {
    const newSettings = { ...settings };

    if (!newSettings[tabId]) {
      newSettings[tabId] = {};
    }
    if (!newSettings[tabId][sectionId]) {
      newSettings[tabId][sectionId] = {};
    }

    (newSettings[tabId][sectionId] as SettingValue)[fieldId] = value as unknown;
    return newSettings;
  }

  validateSettings(settings: SettingsData): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    settingsConfig.tabs.forEach((tab) => {
      tab.sections.forEach((section) => {
        section.fields.forEach((field) => {
          const value = this.getSetting(settings, tab.id, section.id, field.id);

          if (
            field.required &&
            (value === undefined || value === null || value === "")
          ) {
            errors.push(`${field.label} là bắt buộc`);
          }

          if (
            field.validation &&
            value !== undefined &&
            value !== null &&
            value !== ""
          ) {
            const { min, max, pattern } = field.validation;

            if (field.type === "number") {
              const numValue = Number(value);
              if (min !== undefined && numValue < min) {
                errors.push(`${field.label} phải >= ${min}`);
              }
              if (max !== undefined && numValue > max) {
                errors.push(`${field.label} phải <= ${max}`);
              }
            }

            if (pattern && typeof value === "string") {
              const regex = new RegExp(pattern);
              if (!regex.test(value)) {
                errors.push(
                  field.validation.message ||
                  `${field.label} không đúng định dạng`,
                );
              }
            }
          }
        });
      });
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  exportSettings(settings: SettingsData): string {
    return JSON.stringify(settings, null, 2);
  }

  importSettings(jsonString: string): SettingsData {
    try {
      const imported = JSON.parse(jsonString);
      const validation = this.validateSettings(imported);

      if (!validation.isValid) {
        throw new Error(
          `Dữ liệu không hợp lệ: ${validation.errors.join(", ")}`,
        );
      }

      return imported;
    } catch (error) {
      throw new Error("Không thể import cài đặt: " + (error as Error).message);
    }
  }
}

export const settingsService = new SettingsService();
