export { messages } from "./messages/index";
import type { Messages } from "./messages/index";

export type { Messages } from "./messages/index";
export type MessageKey = keyof Messages[import("./config").Locale];
