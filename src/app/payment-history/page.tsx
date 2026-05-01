import type { Metadata } from "next";
import PaymentHistoryClient from "./PaymentHistoryClient";

export const metadata: Metadata = {
  title: "Lịch sử thanh toán - JavaBuilder",
  description: "Xem lịch sử các giao dịch và thanh toán của bạn",
};

export default function PaymentHistoryPage() {
  return <PaymentHistoryClient />;
}
