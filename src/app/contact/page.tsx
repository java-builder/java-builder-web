import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Liên hệ - JavaBuilder",
  description: "Liên hệ với JavaBuilder để được hỗ trợ và giải đáp thắc mắc về lập trình Java",
};

export default function ContactPage() {
  return <ContactClient />;
}
