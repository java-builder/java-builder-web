import { en } from "./en";
import { ja } from "./ja";
import { ko } from "./ko";
import { vi } from "./vi";

export const messages = {
  vi,
  en,
  ja,
  ko,
} as const;

export type Messages = typeof messages;
