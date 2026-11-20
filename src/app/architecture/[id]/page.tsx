import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ARCHITECTURE_PATTERNS } from "@/components/architecture/data/patternsData";
import { ArchitectureDetailClient } from "@/components/architecture/ArchitectureDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return ARCHITECTURE_PATTERNS.map((p) => ({
    id: p.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const pattern = ARCHITECTURE_PATTERNS.find(
    (p) => p.id === id || (id === "spring-security-filter-chain" && p.id === "spring-security-flow")
  );

  if (!pattern) {
    return {
      title: "Kiến Trúc Không Tồn Tại | JavaBuilder",
    };
  }

  return {
    title: `${pattern.title} - Sơ Đồ Kiến Trúc Động | JavaBuilder`,
    description: pattern.summary,
    openGraph: {
      title: `${pattern.title} | JavaBuilder Architecture Simulator`,
      description: pattern.summary,
      type: "website",
    },
  };
}

export default async function ArchitectureDetailPage({ params }: Props) {
  const { id } = await params;
  const pattern = ARCHITECTURE_PATTERNS.find(
    (p) => p.id === id || (id === "spring-security-filter-chain" && p.id === "spring-security-flow")
  );

  if (!pattern) {
    notFound();
  }

  // Related patterns (up to 3 other patterns)
  const relatedPatterns = ARCHITECTURE_PATTERNS.filter((p) => p.id !== pattern.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-[#F8F8F8] dark:bg-background py-8 px-4 sm:px-6 lg:px-8">
      <ArchitectureDetailClient
        pattern={pattern}
        relatedPatterns={relatedPatterns}
      />
    </div>
  );
}
