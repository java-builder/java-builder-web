"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useI18n } from "@/contexts/I18nContext";

interface PipelineStep {
  id: string;
  title: string;
  description: string;
  imagePath: string;
}

export default function CICDPipelineSection() {
  const { t } = useI18n();
  const [activeStep, setActiveStep] = useState(0);

  const steps: PipelineStep[] = [
    { id: "developer", title: "Developer", description: "Push Code", imagePath: "/sections/developer.png" },
    { id: "github", title: "GitHub", description: "Repository", imagePath: "/sections/github.png" },
    { id: "actions", title: "GitHub Actions", description: "CI/CD", imagePath: "/sections/githubactions.svg" },
    { id: "maven", title: "Maven", description: "Build", imagePath: "/sections/maven.png" },
    { id: "sonar", title: "SonarQube", description: "Quality", imagePath: "/sections/sonarqube.svg" },
    { id: "docker", title: "Docker", description: "Image", imagePath: "/sections/docker.png" },
    { id: "scan", title: "Trivy", description: "Scan", imagePath: "/sections/trivy.png" },
    { id: "registry", title: "Registry", description: "Push", imagePath: "/sections/container-registry.svg" },
    { id: "deploy", title: "Deploy", description: "Production", imagePath: "/sections/container-service.svg" },
    { id: "slack", title: "Slack", description: "Notify", imagePath: "/sections/slack.png" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 800);
    return () => clearInterval(interval);
  }, [steps.length]);

  // ----- Reusable pieces -----
  const Card = ({ step, globalIndex }: { step: PipelineStep; globalIndex: number }) => {
    const isActive = globalIndex === activeStep;
    const isPassed = globalIndex < activeStep;

    return (
      <div
        className={`flex-shrink-0 w-20 h-20 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 xl:w-32 xl:h-32 bg-white dark:bg-slate-900/90 rounded-xl p-1.5 sm:p-2 md:p-2.5 lg:p-3 border-2 transition-all duration-300 shadow-md hover:shadow-lg dark:shadow-black/40 dark:hover:shadow-cyan-500/20 flex flex-col items-center justify-center relative ${
          isActive
            ? "border-cyan-500 dark:border-cyan-400 scale-105 shadow-cyan-500/50"
            : isPassed
            ? "border-blue-500 dark:border-blue-400"
            : "border-gray-200 dark:border-slate-700"
        }`}
      >
        <div className="w-7 h-7 sm:w-8 sm:h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 xl:w-12 xl:h-12 mb-1 md:mb-1.5 lg:mb-2 flex items-center justify-center">
          <Image
            src={step.imagePath}
            alt={step.title}
            width={48}
            height={48}
            className="object-contain w-full h-full"
          />
        </div>
        <h3 className="font-semibold text-[10px] md:text-xs lg:text-sm text-gray-900 dark:text-white text-center leading-tight">
          {step.title}
        </h3>
        <p className="text-[8px] md:text-[9px] lg:text-[10px] text-gray-600 dark:text-slate-300 text-center leading-tight mt-0.5">
          {step.description}
        </p>

        {isActive && (
          <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-3 h-3 sm:w-4 sm:h-4 bg-cyan-500 dark:bg-cyan-400 rounded-full animate-pulse-custom"></div>
        )}
      </div>
    );
  };

  const HorizontalArrow = ({ direction = "right" }: { direction?: "right" | "left" }) => (
    <div className="flex-shrink-0 w-5 sm:w-6 md:w-8 lg:w-10 xl:w-12">
      <svg viewBox="0 0 48 20" fill="none" className="w-full h-3 md:h-4 lg:h-5 text-blue-500 dark:text-cyan-400">
        {direction === "right" ? (
          <>
            <line x1="0" y1="10" x2="43" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" className="animate-dash" />
            <path d="M48 10 L42 6 L42 14 Z" fill="currentColor" />
          </>
        ) : (
          <>
            <line x1="48" y1="10" x2="5" y2="10" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" className="animate-dash" />
            <path d="M0 10 L6 6 L6 14 Z" fill="currentColor" />
          </>
        )}
      </svg>
    </div>
  );

  const DownArrow = ({ size = "default" }: { size?: "default" | "compact" }) => (
    <div className={`flex justify-center ${size === "compact" ? "py-1" : "py-2"}`}>
      <svg
        viewBox="0 0 20 48"
        fill="none"
        className={`text-blue-500 dark:text-cyan-400 ${size === "compact" ? "w-3 h-8" : "w-4 h-10 md:h-12"}`}
      >
        <line x1="10" y1="2" x2="10" y2="40" stroke="currentColor" strokeWidth="2" strokeDasharray="6 3" className="animate-dash" />
        <path d="M10 48 L5 40 L15 40 Z" fill="currentColor" />
      </svg>
    </div>
  );

  return (
    <section className="relative py-12 sm:py-16 md:py-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-blue-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10 sm:mb-12 md:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-slate-50 mb-4 leading-tight">
            {t("home.cicdTitle")}
            <span className="block mt-1 px-1 leading-tight">
              <span
                className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-blue-600 to-blue-700 dark:from-cyan-300 dark:via-sky-300 dark:to-blue-300"
                style={{ WebkitTextFillColor: "transparent", WebkitBackgroundClip: "text" }}
              >
                {t("home.cicdSubtitle")}
              </span>
            </span>
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-gray-600 dark:text-slate-200 max-w-3xl mx-auto leading-relaxed">
            {t("home.cicdDesc")}
          </p>
        </div>

        {/* Mobile (< sm): 2-column snake/zigzag layout */}
        <div className="sm:hidden flex flex-col max-w-sm mx-auto">
          {(() => {
            // Each row: [leftIdx, rightIdx, arrowDir, downSide]
            // arrowDir: direction of arrow between the two cards in the row
            // downSide: which side the down arrow goes to next row, or null on last
            const rows: { left: number; right: number; arrow: "right" | "left"; down: "right" | "left" | null }[] = [
              { left: 0, right: 1, arrow: "right", down: "right" },
              { left: 3, right: 2, arrow: "left", down: "left" },
              { left: 4, right: 5, arrow: "right", down: "right" },
              { left: 7, right: 6, arrow: "left", down: "left" },
              { left: 8, right: 9, arrow: "right", down: null },
            ];
            return rows.map((row, idx) => (
              <div key={idx} className="w-full">
                {/* Card row */}
                <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                  <div className="flex justify-center">
                    <Card step={steps[row.left]} globalIndex={row.left} />
                  </div>
                  <HorizontalArrow direction={row.arrow} />
                  <div className="flex justify-center">
                    <Card step={steps[row.right]} globalIndex={row.right} />
                  </div>
                </div>
                {/* Down arrow aligned under last flow card */}
                {row.down !== null && (
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
                    <div className="flex justify-center">
                      {row.down === "left" && <DownArrow size="compact" />}
                    </div>
                    <div className="w-5" aria-hidden />
                    <div className="flex justify-center">
                      {row.down === "right" && <DownArrow size="compact" />}
                    </div>
                  </div>
                )}
              </div>
            ));
          })()}
        </div>

        {/* Tablet/Desktop (sm+): U-shape, never wraps */}
        <div className="hidden sm:block max-w-7xl mx-auto">
          {/* Top Row */}
          <div className="flex items-center justify-center gap-2 md:gap-3 lg:gap-4 xl:gap-6">
            {steps.slice(0, 5).map((step, index) => (
              <div
                key={step.id}
                className="flex items-center gap-2 md:gap-3 lg:gap-4 xl:gap-6"
              >
                <div className="relative">
                  <Card step={step} globalIndex={index} />
                  {/* Vertical Arrow below SonarQube (last card of top row) */}
                  {index === 4 && (
                    <div className="absolute -bottom-10 md:-bottom-12 lg:-bottom-14 left-1/2 -translate-x-1/2">
                      <svg
                        viewBox="0 0 20 48"
                        fill="none"
                        className="text-blue-500 dark:text-cyan-400 w-3 h-8 md:w-4 md:h-10 lg:h-12"
                      >
                        <line
                          x1="10"
                          y1="2"
                          x2="10"
                          y2="40"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="6 3"
                          className="animate-dash"
                        />
                        <path d="M10 48 L5 40 L15 40 Z" fill="currentColor" />
                      </svg>
                    </div>
                  )}
                </div>
                {index < 4 && <HorizontalArrow direction="right" />}
              </div>
            ))}
          </div>

          {/* Spacer for vertical arrow */}
          <div className="h-10 md:h-12 lg:h-14"></div>

          {/* Bottom Row - REVERSED */}
          <div className="flex items-center justify-center gap-2 md:gap-3 lg:gap-4 xl:gap-6">
            {steps
              .slice(5, 10)
              .reverse()
              .map((step, index) => {
                const globalIndex = 9 - index;
                return (
                  <div
                    key={step.id}
                    className="flex items-center gap-2 md:gap-3 lg:gap-4 xl:gap-6"
                  >
                    {index > 0 && <HorizontalArrow direction="left" />}
                    <Card step={step} globalIndex={globalIndex} />
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes pulse-custom {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.3);
          }
        }
        .animate-dash {
          animation: dash 1.5s linear infinite;
        }
        .animate-pulse-custom {
          animation: pulse-custom 1.5s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}
