import type { Metadata } from "next";
import { generateSEO } from "@/lib/seo";
import DonateClient from "./DonateClient";

export const metadata: Metadata = {
  ...generateSEO({
    title: "Ủng hộ dự án - JavaBuilder | Chung tay phát triển cộng đồng",
    description:
      "Ủng hộ dự án JavaBuilder - Mọi đóng góp giúp chúng mình duy trì máy chủ, hạ tầng và tiếp tục cung cấp nội dung học lập trình Java Backend chất lượng cao hoàn toàn miễn phí.",
    url: "/donate",
    tags: ["Ủng hộ", "Donate", "JavaBuilder", "Java", "Backend"],
  }),
};

export default function DonatePage() {
  return <DonateClient />;
}
