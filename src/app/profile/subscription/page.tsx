import type { Metadata } from "next";
import SubscriptionClient from "./SubscriptionClient";

export const metadata: Metadata = {
  title: "Gói Premium - JavaBuilder",
  description: "Quản lý gói Premium và các quyền lợi của bạn",
};

export default function SubscriptionPage() {
  return <SubscriptionClient />;
}
