"use client";

import Image from "next/image";
import {
  Layers,
  ShieldCheck,
  Cpu,
  Settings,
  Cloud,
  ArrowRight,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { useI18n } from "@/contexts/I18nContext";

export default function MentorClient() {
  const { t } = useI18n();

  const modules = [
    {
      icon: <Layers className="w-6 h-6 text-blue-500" />,
      title: t("mentorPage.curriculum.module1.title"),
      items: [
        t("mentorPage.curriculum.module1.item1"),
        t("mentorPage.curriculum.module1.item2"),
        t("mentorPage.curriculum.module1.item3"),
      ]
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-purple-500" />,
      title: t("mentorPage.curriculum.module2.title"),
      items: [
        t("mentorPage.curriculum.module2.item1"),
        t("mentorPage.curriculum.module2.item2"),
        t("mentorPage.curriculum.module2.item3"),
        t("mentorPage.curriculum.module2.item4"),
      ]
    },
    {
      icon: <Cpu className="w-6 h-6 text-emerald-500" />,
      title: t("mentorPage.curriculum.module3.title"),
      items: [
        t("mentorPage.curriculum.module3.item1"),
        t("mentorPage.curriculum.module3.item2"),
        t("mentorPage.curriculum.module3.item3"),
        t("mentorPage.curriculum.module3.item4"),
        t("mentorPage.curriculum.module3.item5"),
        t("mentorPage.curriculum.module3.item6"),
      ]
    },
    {
      icon: <Sparkles className="w-6 h-6 text-pink-500" />,
      title: t("mentorPage.curriculum.module4.title"),
      items: [
        t("mentorPage.curriculum.module4.item1"),
        t("mentorPage.curriculum.module4.item2"),
        t("mentorPage.curriculum.module4.item3"),
        t("mentorPage.curriculum.module4.item4"),
        t("mentorPage.curriculum.module4.item5"),
        t("mentorPage.curriculum.module4.item6"),
      ]
    },
    {
      icon: <Settings className="w-6 h-6 text-orange-500" />,
      title: t("mentorPage.curriculum.module5.title"),
      items: [
        t("mentorPage.curriculum.module5.item1"),
        t("mentorPage.curriculum.module5.item2"),
      ]
    },
    {
      icon: <Cloud className="w-6 h-6 text-sky-500" />,
      title: t("mentorPage.curriculum.module6.title"),
      items: [
        t("mentorPage.curriculum.module6.item1"),
        t("mentorPage.curriculum.module6.item2"),
        t("mentorPage.curriculum.module6.item3"),
        t("mentorPage.curriculum.module6.item4"),
        t("mentorPage.curriculum.module6.item5"),
      ]
    }
  ];

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({
        top: topOffset,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 transition-colors duration-300">

      {/* Hero Section - Full Width, borderless on sides */}
      <section className="relative py-10 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800/40 dark:to-slate-900 border-b border-border overflow-hidden text-center transition-all duration-300">
        {/* Subtle Dynamic Ambient Background Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-transparent pointer-events-none" />

        {/* Logo Brand Integration */}
        <div className="flex flex-col items-center justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-background border border-border flex items-center justify-center shadow-xs">
            <Image
              src="/logos/java-logo.png"
              alt="JavaBuilder Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </div>
          <div className="flex flex-col items-center mt-2.5 -space-y-0.5">
            <span className="text-xs font-bold text-foreground tracking-widest uppercase">
              JavaBuilder
            </span>
            <span className="text-[0.6rem] font-semibold text-muted-foreground tracking-widest uppercase">
              Learning Platform
            </span>
          </div>
        </div>

        {/* Special Program Badge */}
        <div className="inline-block mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent/10 text-accent border border-accent/20 animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
            {t("mentorPage.hero.badge")}
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-foreground leading-tight max-w-4xl mx-auto">
          {t("mentorPage.hero.title")} <span className="text-accent">{t("mentorPage.hero.titleAccent")}</span>
        </h1>
        <p className="mt-4 max-w-3xl mx-auto text-base sm:text-lg text-muted-foreground leading-relaxed">
          {t("mentorPage.hero.description")}
        </p>

        <div className="mt-8 flex justify-center gap-4 flex-wrap relative z-10">
          <a
            href="#contact-info"
            onClick={(e) => scrollToSection(e, "contact-info")}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl bg-accent text-white font-semibold shadow-sm hover:bg-accent-600 transition-all duration-200 active:scale-[0.98] text-sm cursor-pointer"
          >
            {t("mentorPage.hero.ctaContact")}
            <ArrowRight className="w-4 h-4" />
          </a>
          <a
            href="#curriculum"
            onClick={(e) => scrollToSection(e, "curriculum")}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-xl border border-input bg-background hover:bg-muted text-foreground font-semibold shadow-xs transition-all duration-200 active:scale-[0.98] text-sm cursor-pointer"
          >
            {t("mentorPage.hero.ctaCurriculum")}
          </a>
        </div>
      </section>

      {/* Main Content Area - Boxed width */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-12 space-y-12">

        {/* Curriculum Section */}
        <div id="curriculum" className="space-y-6">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              {t("mentorPage.curriculum.title")}
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              {t("mentorPage.curriculum.description")}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {modules.map((mod, idx) => (
              <div
                key={idx}
                className="bg-card text-card-foreground border border-border rounded-3xl p-6 sm:p-8 space-y-4 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-gray-100 dark:bg-slate-800 rounded-2xl transition-colors">
                    {mod.icon}
                  </div>
                  <h3 className="text-lg font-bold text-foreground">
                    {mod.title}
                  </h3>
                </div>

                <ul className="space-y-2.5">
                  {mod.items.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5">
                      <span className="h-1.5 w-1.5 flex-shrink-0 rounded-full bg-accent mt-2" />
                      <span className="text-sm text-muted-foreground font-medium">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info Section */}
        <div
          id="contact-info"
          className="max-w-4xl mx-auto bg-card text-card-foreground rounded-3xl border border-border shadow-sm overflow-hidden"
        >
          <div className="p-6 sm:p-10 border-b border-border bg-gradient-to-r from-blue-600/5 to-purple-600/5 text-center">
            <GraduationCap className="w-10 h-10 mx-auto text-accent mb-3" />
            <h3 className="text-xl sm:text-2xl font-bold text-foreground">
              {t("mentorPage.contact.title")}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto">
              {t("mentorPage.contact.description")}
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              {/* Facebook Card */}
              <a
                href="https://www.facebook.com/le.khanh.uc.10632"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-background border border-border hover:border-blue-500/50 hover:shadow-lg dark:hover:shadow-blue-950/20 hover:-translate-y-0.5 rounded-2xl transition-all duration-300 group active:scale-[0.98] text-left cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/facebook.svg"
                    alt="Facebook"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">{t("mentorPage.contact.facebook")}</p>
                  <p className="text-sm font-bold text-foreground truncate mt-0.5">Lê Khánh Đức</p>
                  <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground mt-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {t("mentorPage.contact.facebookAction")}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>

              {/* Zalo Card */}
              <a
                href="https://zalo.me/0368103455"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-background border border-border hover:border-teal-500/50 hover:shadow-lg dark:hover:shadow-teal-950/20 hover:-translate-y-0.5 rounded-2xl transition-all duration-300 group active:scale-[0.98] text-left cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/zalo.png"
                    alt="Zalo"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-[10px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider">{t("mentorPage.contact.zalo")}</p>
                  <p className="text-sm font-bold text-foreground truncate mt-0.5">0368 103 455</p>
                  <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground mt-1 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
                    {t("mentorPage.contact.zaloAction")}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>

              {/* Email Card */}
              <a
                href="mailto:javabuilder.platform@gmail.com"
                className="flex items-center gap-4 p-4 bg-background border border-border hover:border-rose-500/50 hover:shadow-lg dark:hover:shadow-rose-950/20 hover:-translate-y-0.5 rounded-2xl transition-all duration-300 group active:scale-[0.98] text-left cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl bg-white dark:bg-slate-800 border border-border flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src="/email.svg"
                    alt="Email"
                    width={28}
                    height={28}
                    className="object-contain"
                  />
                </div>
                <div className="flex-grow min-w-0">
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">{t("mentorPage.contact.email")}</p>
                  <p className="text-sm font-bold text-foreground truncate mt-0.5">javabuilder.platform</p>
                  <span className="inline-flex items-center gap-0.5 text-xs text-muted-foreground mt-1 group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                    {t("mentorPage.contact.emailAction")}
                    <ArrowRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </a>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
