"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface PipelineStep {
  id: string;
  title: string;
  description: string;
  imagePath: string;
}

export default function CICDPipelineSection() {
  const [activeStep, setActiveStep] = useState(0);

  const steps: PipelineStep[] = [
    { id: "developer", title: "Developer", description: "Push Code", imagePath: "/sections/developer.png" },
    { id: "github", title: "GitHub", description: "Repository", imagePath: "/sections/github.png" },
    { id: "actions", title: "GitHub Actions", description: "CI/CD", imagePath: "/sections/githubactions.svg" },
    { id: "maven", title: "Maven", description: "Build", imagePath: "/sections/maven.png" },
    { id: "sonar", title: "SonarQube", description: "Quality", imagePath: "/sections/sonarqube.svg" },
    // Bottom row - REVERSED ORDER
    { id: "docker", title: "Docker", description: "Image", imagePath: "/sections/docker.png" },
    { id: "scan", title: "Trivy", description: "Scan", imagePath: "/sections/trivy.png" },
    { id: "registry", title: "Registry", description: "Push", imagePath: "/sections/container-registry.svg" },
    { id: "deploy", title: "Deploy", description: "Production", imagePath: "/sections/container-service.svg" },
    { id: "slack", title: "Slack", description: "Notify", imagePath: "/sections/slack.png" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1200); // Faster: 1.2s instead of 2s
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Từ Code Đến Production
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 to-blue-600 dark:from-cyan-400 dark:to-blue-500 mt-2">
              Quy Trình CI/CD Chuyên Nghiệp
            </span>
          </h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-slate-400 max-w-3xl mx-auto">
            Tự động hóa toàn bộ quy trình: Build → Test → Security Scan → Deploy. 
            Học cách triển khai ứng dụng như các công ty công nghệ hàng đầu.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Top Row */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8 mb-4">
            {steps.slice(0, 5).map((step, index) => {
              const isActive = index === activeStep;
              const isPassed = index < activeStep;
              
              return (
                <div key={step.id} className="flex items-center gap-6 md:gap-8">
                  {/* Square Card */}
                  <div className={`w-28 h-28 sm:w-32 sm:h-32 bg-white dark:bg-slate-800 rounded-xl p-3 border-2 transition-all duration-300 shadow-md hover:shadow-lg flex flex-col items-center justify-center relative ${
                    isActive 
                      ? 'border-cyan-500 dark:border-cyan-400 scale-105 shadow-cyan-500/50' 
                      : isPassed
                      ? 'border-blue-500 dark:border-blue-400'
                      : 'border-gray-200 dark:border-slate-700'
                  }`}>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 flex items-center justify-center">
                      <Image 
                        src={step.imagePath} 
                        alt={step.title}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white text-center leading-tight mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-400 text-center">
                      {step.description}
                    </p>
                    
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-500 rounded-full animate-pulse"></div>
                    )}
                    
                    {/* Vertical Arrow below SonarQube (last card) */}
                    {index === 4 && (
                      <div className="absolute -bottom-14 left-1/2 -translate-x-1/2 hidden sm:block">
                        <svg width="20" height="48" viewBox="0 0 20 48" fill="none" className="text-blue-500 dark:text-cyan-400">
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
                          <path
                            d="M10 48 L5 40 L15 40 Z"
                            fill="currentColor"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Arrow to next (except last) */}
                  {index < 4 && (
                    <div className="hidden sm:block flex-shrink-0">
                      <svg width="48" height="20" viewBox="0 0 48 20" fill="none" className="text-blue-500 dark:text-cyan-400">
                        <line
                          x1="0"
                          y1="10"
                          x2="43"
                          y2="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="6 3"
                          className="animate-dash"
                        />
                        <path
                          d="M48 10 L42 6 L42 14 Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Spacer for vertical arrow */}
          <div className="mb-16"></div>

          {/* Bottom Row - REVERSED */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:gap-8">
            {steps.slice(5, 10).reverse().map((step, index) => {
              const globalIndex = 9 - index;
              const isActive = globalIndex === activeStep;
              const isPassed = globalIndex < activeStep;
              
              return (
                <div key={step.id} className="flex items-center gap-6 md:gap-8">
                  {/* Arrow to next (except last) - pointing LEFT */}
                  {index > 0 && (
                    <div className="hidden sm:block flex-shrink-0">
                      <svg width="48" height="20" viewBox="0 0 48 20" fill="none" className="text-blue-500 dark:text-cyan-400">
                        <line
                          x1="48"
                          y1="10"
                          x2="5"
                          y2="10"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeDasharray="6 3"
                          className="animate-dash"
                        />
                        <path
                          d="M0 10 L6 6 L6 14 Z"
                          fill="currentColor"
                        />
                      </svg>
                    </div>
                  )}
                  
                  {/* Square Card */}
                  <div className={`w-28 h-28 sm:w-32 sm:h-32 bg-white dark:bg-slate-800 rounded-xl p-3 border-2 transition-all duration-300 shadow-md hover:shadow-lg flex flex-col items-center justify-center relative ${
                    isActive 
                      ? 'border-cyan-500 dark:border-cyan-400 scale-105 shadow-cyan-500/50' 
                      : isPassed
                      ? 'border-blue-500 dark:border-blue-400'
                      : 'border-gray-200 dark:border-slate-700'
                  }`}>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mb-2 flex items-center justify-center">
                      <Image 
                        src={step.imagePath} 
                        alt={step.title}
                        width={48}
                        height={48}
                        className="object-contain"
                      />
                    </div>
                    <h3 className="font-semibold text-xs sm:text-sm text-gray-900 dark:text-white text-center leading-tight mb-1">
                      {step.title}
                    </h3>
                    <p className="text-[9px] sm:text-[10px] text-gray-600 dark:text-gray-400 text-center">
                      {step.description}
                    </p>
                    
                    {isActive && (
                      <div className="absolute -top-2 -right-2 w-4 h-4 bg-cyan-500 rounded-full animate-pulse"></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* CSS Animations */}
      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        @keyframes dash-reverse {
          to {
            stroke-dashoffset: 20;
          }
        }
        .animate-dash {
          animation: dash 1.5s linear infinite;
        }
        .animate-dash-reverse {
          animation: dash-reverse 1.5s linear infinite;
        }
      `}</style>
    </section>
  );
}
