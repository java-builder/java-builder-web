import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import VerifyCertificateClient from "./VerifyCertificateClient";

export const metadata = {
  title: "Xác Thực Chứng Chỉ | JavaBuilder",
  description: "Tra cứu & bảo chứng thông tin chứng chỉ phát hành chính thức bởi JavaBuilder Authority.",
};

export default function VerifyCertificatePage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[60vh] items-center justify-center p-6">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
            <p className="text-sm text-muted-foreground">
              Đang tải trang xác thực chứng chỉ...
            </p>
          </div>
        </div>
      }
    >
      <VerifyCertificateClient />
    </Suspense>
  );
}
