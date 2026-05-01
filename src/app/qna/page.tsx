import type { Metadata } from "next";
import QNAClient from "./QNAClient";

export const metadata: Metadata = {
  title: "Q&A - Hỏi đáp - JavaBuilder",
  description: "Nơi chia sẻ kiến thức, giải quyết các vấn đề lập trình và học hỏi lẫn nhau tại JavaBuilder",
};

export default function QNAPage() {
  return <QNAClient />;
}
