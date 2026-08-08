import { Suspense } from "react";
import { Metadata } from "next";
import { Loader2 } from "lucide-react";
import VerifyCertificateClient from "./VerifyCertificateClient";

type Props = {
  searchParams: Promise<{ code?: string }>;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const resolvedParams = await searchParams;
  const code = resolvedParams?.code;

  if (code) {
    let studentName = "";
    let courseName = "";

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.javabuilder.online";
      const res = await fetch(`${baseUrl}/api/v1/certificates/public/verify/${code}`, {
        next: { revalidate: 3600 },
      });
      if (res.ok) {
        const json = await res.json();
        if (json?.data) {
          studentName = json.data.studentName || "";
          courseName = json.data.courseName || "";
        }
      }
    } catch {
    }

    const title = studentName && courseName
      ? `🎓 Chúc Mừng ${studentName} Hoàn Thành Khóa Học "${courseName}"`
      : `🎓 Chúc Mừng Học Viên Hoàn Thành Khóa Học (${code}) | JavaBuilder Authority`;

    const description = studentName && courseName
      ? `🎉 Chúc mừng ${studentName} đã xuất sắc hoàn thành khóa học "${courseName}" và được trao chứng chỉ bảo chứng mã ${code} từ JavaBuilder Authority. Nhấp để xem chi tiết bằng cấp!`
      : `🎉 Chúc mừng học viên đã xuất sắc hoàn thành khóa học và được trao chứng chỉ bảo chứng mã ${code} từ JavaBuilder Authority. Nhấp để xem chi tiết bằng cấp!`;

    const url = `https://javabuilder.online/verify-certificate?code=${encodeURIComponent(code)}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        url,
        siteName: "JavaBuilder Authority",
        type: "website",
        images: [
          {
            url: "https://res.cloudinary.com/drdskl2up/image/upload/v1780847977/java-logo_facxkn.png",
            width: 800,
            height: 600,
            alt: "JavaBuilder Official Certificate Verification",
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
    };
  }

  return {
    title: "Xác Thực & Tra Cứu Chứng Chỉ | JavaBuilder Authority",
    description: "Hệ thống tra cứu & bảo chứng thông tin chứng chỉ phát hành chính thức bởi JavaBuilder Authority.",
  };
}

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
