export interface SettingField {
  id: string;
  type:
    | "text"
    | "email"
    | "tel"
    | "textarea"
    | "select"
    | "toggle"
    | "file"
    | "number";
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: string | number | boolean;
  options?: { value: string; label: string }[];
  required?: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    message?: string;
  };
}

export interface SettingSection {
  id: string;
  title: string;
  description?: string;
  fields: SettingField[];
}

export interface SettingTab {
  id: string;
  name: string;
  icon: string;
  sections: SettingSection[];
}

export interface SettingsConfig {
  tabs: SettingTab[];
}

export interface SettingValue {
  [key: string]: unknown;
}

export interface SettingsData {
  [tabId: string]: {
    [sectionId: string]: {
      [fieldId: string]: unknown;
    };
  };
}
