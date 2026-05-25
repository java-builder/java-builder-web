import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Ủng hộ & Liên hệ - JavaBuilder",
  description: "Ủng hộ JavaBuilder qua QR code và kết nối qua email, Zalo hoặc Facebook",
};

export default function ContactPage() {
  return <ContactClient />;
}
