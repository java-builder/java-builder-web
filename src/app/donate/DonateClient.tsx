"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Heart,
  Coffee,
  QrCode,
  Smartphone,
  Download,
  ShieldCheck,
  Server,
  Sparkles,
} from "lucide-react";
import MotionWrapper from "@/components/common/MotionWrapper";

type PaymentMethod = "mb" | "momo";

interface SupportTier {
  amount: string;
  label: string;
  icon: string;
}

const SUPPORT_TIERS: SupportTier[] = [
  { amount: "20.000đ", label: "Ly cà phê sáng", icon: "☕" },
  { amount: "50.000đ", label: "Ly trà sữa tiếp sức", icon: "🧋" },
  { amount: "100.000đ", label: "Bữa ăn ấm lòng", icon: "🍕" },
  { amount: "Tùy tâm", label: "Tấm lòng yêu quý", icon: "💖" },
];

export default function DonateClient() {
  const [method, setMethod] = useState<PaymentMethod>("mb");
  const [selectedTier, setSelectedTier] = useState<SupportTier>(SUPPORT_TIERS[0]);

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-10 sm:py-16 bg-gradient-to-b from-background via-muted/20 to-background">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col lg:flex-row items-center lg:items-start justify-between gap-8 lg:gap-12">
          
          {/* Left Column: Intro & Mission (Nằm bên trái thay vì ở trên) */}
          <MotionWrapper animation="fadeInUp" duration={0.6} className="w-full lg:w-5/12">
            <div className="text-left space-y-4 sm:space-y-5">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-semibold">
                <Coffee className="w-3.5 h-3.5" />
                <span>Buy JavaBuilder a Coffee</span>
                <Heart className="w-3 h-3 fill-rose-500 text-rose-500 ml-0.5" />
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-tight">
                Tiếp Sức Cho <br className="hidden sm:inline" />
                <span className="text-accent">JavaBuilder</span>
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                Mỗi sự đóng góp — dù chỉ là một ly cà phê — đều trực tiếp giúp duy trì hạ tầng máy chủ,
                database và giữ cho nội dung học Java Backend luôn miễn phí tới cộng đồng.
              </p>

              {/* Mission points */}
              <div className="pt-2 sm:pt-4 space-y-3.5 border-t border-border/70">
                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center shrink-0 border border-blue-500/20">
                    <Server className="w-4 h-4" />
                  </div>
                  <span>Duy trì máy chủ & hạ tầng cloud 24/7</span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center shrink-0 border border-emerald-500/20">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <span>100% ủng hộ tự nguyện, không ràng buộc</span>
                </div>

                <div className="flex items-center gap-3 text-xs sm:text-sm text-muted-foreground">
                  <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center shrink-0 border border-rose-500/20">
                    <Heart className="w-4 h-4 fill-rose-500" />
                  </div>
                  <span>Chân thành cảm ơn sự đồng hành của bạn</span>
                </div>
              </div>
            </div>
          </MotionWrapper>

          {/* Right Column: Payment Station Card */}
          <MotionWrapper animation="fadeInUp" duration={0.7} delay={0.1} className="w-full lg:w-7/12 max-w-lg mx-auto lg:max-w-none">
            <div className="bg-card text-card-foreground border border-border rounded-3xl p-5 sm:p-7 shadow-xl shadow-accent/5 relative overflow-hidden">
              {/* Ambient Background Accent Glow */}
              <div className="absolute -top-24 -right-24 w-60 h-60 bg-accent/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Method Tabs */}
              <div className="relative z-10 flex items-center justify-center p-1 bg-muted/70 dark:bg-muted/40 rounded-2xl border border-border/80 max-w-xs mx-auto mb-5">
                <button
                  type="button"
                  onClick={() => setMethod("mb")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    method === "mb"
                      ? "bg-card text-foreground shadow-sm border border-border/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <QrCode className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                  <span className="whitespace-nowrap">MB Bank</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod("momo")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    method === "momo"
                      ? "bg-card text-foreground shadow-sm border border-border/60"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-pink-500 shrink-0" />
                  <Smartphone className="w-3.5 h-3.5 text-pink-500 shrink-0" />
                  <span className="whitespace-nowrap">Ví MoMo</span>
                </button>
              </div>

              {/* Method Header: Bank Name & Badge */}
              <div className="relative z-10 flex items-center justify-between gap-3 pb-3 mb-5 border-b border-border">
                <div className="min-w-0 flex-1">
                  <h2 className="text-sm sm:text-base font-bold text-foreground truncate">
                    {method === "mb" ? "Ngân hàng Quân Đội (MB Bank)" : "Ví Điện Tử MoMo"}
                  </h2>
                  <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                    {method === "mb"
                      ? "Quét bằng app ngân hàng bất kỳ để chuyển khoản 24/7"
                      : "Quét bằng app MoMo để chuyển tiền tức thì"}
                  </p>
                </div>
                <span
                  className={`shrink-0 whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-bold ${
                    method === "mb"
                      ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
                      : "bg-pink-500/10 text-pink-600 dark:text-pink-400 border border-pink-500/20"
                  }`}
                >
                  {method === "mb" ? "VietQR 24/7" : "MoMo Pay"}
                </span>
              </div>

              {/* QR Code Container (Centered, crisp, camera viewfinder corners) */}
              <div className="relative z-10 flex flex-col items-center mb-5">
                <div className="relative p-2.5 bg-white rounded-2xl border border-border shadow-sm group">
                  {/* Camera Viewfinder Corners */}
                  <span className="absolute top-1.5 left-1.5 w-3 h-3 border-t-2 border-l-2 border-accent rounded-tl-md pointer-events-none" />
                  <span className="absolute top-1.5 right-1.5 w-3 h-3 border-t-2 border-r-2 border-accent rounded-tr-md pointer-events-none" />
                  <span className="absolute bottom-1.5 left-1.5 w-3 h-3 border-b-2 border-l-2 border-accent rounded-bl-md pointer-events-none" />
                  <span className="absolute bottom-1.5 right-1.5 w-3 h-3 border-b-2 border-r-2 border-accent rounded-br-md pointer-events-none" />

                  {/* Compact QR Code Size */}
                  <div className="relative w-44 h-44 sm:w-48 sm:h-48 rounded-xl overflow-hidden">
                    <Image
                      src={method === "mb" ? "/donate/qrcode.jpg" : "/donate/momo-qr.jpg"}
                      alt={method === "mb" ? "MB Bank VietQR" : "MoMo QR"}
                      fill
                      className="object-contain"
                      sizes="(max-width: 640px) 176px, 192px"
                      priority
                    />
                  </div>
                </div>

                {/* Download QR Button */}
                <a
                  href={method === "mb" ? "/donate/qrcode.jpg" : "/donate/momo-qr.jpg"}
                  download={method === "mb" ? "JavaBuilder-MB-VietQR.jpg" : "JavaBuilder-MoMo-QR.jpg"}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground hover:text-accent transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Tải ảnh mã QR</span>
                </a>
              </div>

              {/* Coffee Tiers */}
              <div className="relative z-10 space-y-2">
                <div className="text-[11px] font-medium text-muted-foreground flex items-center justify-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Chọn mức tiếp sức yêu thích:</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {SUPPORT_TIERS.map((tier) => {
                    const isSelected = selectedTier.amount === tier.amount;
                    return (
                      <button
                        key={tier.amount}
                        type="button"
                        onClick={() => setSelectedTier(tier)}
                        className={`text-center p-2 rounded-xl border transition-all text-xs cursor-pointer ${
                          isSelected
                            ? "bg-accent/10 border-accent/50 text-foreground ring-1 ring-accent/30 shadow-xs"
                            : "bg-muted/40 hover:bg-muted border-border/70 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center justify-center gap-1 font-bold text-foreground">
                          <span>{tier.icon}</span>
                          <span className="whitespace-nowrap">{tier.amount}</span>
                        </div>
                        <div className="text-[10px] text-muted-foreground truncate mt-0.5">
                          {tier.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </MotionWrapper>

        </div>
      </div>
    </div>
  );
}
