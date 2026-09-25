"use client";

import React, { useEffect, useState, useId } from "react";
import { useTheme } from "next-themes";

interface MermaidBlockProps {
  chart: string;
}

export default function MermaidBlock({ chart }: MermaidBlockProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark";
  const rawId = useId().replace(/:/g, "_");
  const chartId = `mermaid_${rawId}`;

  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;

    async function renderDiagram() {
      try {
        setError(false);
        const mermaid = (await import("mermaid")).default;

        if (isDark) {
          mermaid.initialize({
            startOnLoad: false,
            theme: "base",
            themeVariables: {
              darkMode: true,
              background: "transparent",
              fontFamily: "inherit",

              // General / Flowchart
              primaryColor: "#1e293b",
              primaryTextColor: "#f8fafc",
              primaryBorderColor: "#38bdf8",
              lineColor: "#93c5fd",
              secondaryColor: "#0f172a",
              tertiaryColor: "#1e293b",
              mainBkg: "#1e293b",
              nodeBorder: "#38bdf8",
              clusterBkg: "#0f172a",
              clusterBorder: "#334155",
              edgeLabelBackground: "#1e293b",

              // Sequence Diagram
              actorBkg: "#1e293b",
              actorBorder: "#38bdf8",
              actorTextColor: "#f8fafc",
              actorLineColor: "#64748b",

              signalColor: "#93c5fd",
              signalTextColor: "#f1f5f9",

              labelBoxBkgColor: "#1e293b",
              labelBoxBorderColor: "#38bdf8",
              labelTextColor: "#f8fafc",

              loopTextColor: "#f8fafc",

              noteBkgColor: "#1e293b",
              noteBorderColor: "#38bdf8",
              noteTextColor: "#f8fafc",

              rectBkgColor: "#1e293b",
              rectBorderColor: "#38bdf8",

              activationBorderColor: "#38bdf8",
              activationBkgColor: "#0369a1",

              sequenceNumberColor: "#ffffff",
            },
            securityLevel: "loose",
          });
        } else {
          // Keep original default configuration for light mode
          mermaid.initialize({
            startOnLoad: false,
            theme: "default",
            securityLevel: "loose",
          });
        }

        const existingEl = document.getElementById(chartId);
        if (existingEl) existingEl.remove();

        const { svg: renderedSvg } = await mermaid.render(chartId, chart.trim());
        if (isMounted) {
          setSvg(renderedSvg);
        }
      } catch {
        if (isMounted) {
          setError(true);
          const errEl = document.getElementById(chartId);
          if (errEl) errEl.remove();
        }
      }
    }

    renderDiagram();

    return () => {
      isMounted = false;
      const el = document.getElementById(chartId);
      if (el) el.remove();
    };
  }, [chart, isDark, chartId]);

  if (error) {
    return (
      <pre className="my-4 overflow-x-auto rounded-lg bg-muted p-4 text-xs font-mono text-foreground">
        <code>{chart}</code>
      </pre>
    );
  }

  if (!svg) {
    return null;
  }

  return (
    <div
      className={
        isDark
          ? "my-6 flex w-full justify-center overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 transition-colors [&>svg]:max-w-full [&>svg]:h-auto [&_.actor]:fill-[#1e293b] [&_.actor]:stroke-[#38bdf8] [&_.actor-line]:stroke-[#64748b] [&_.messageLine0]:stroke-[#93c5fd] [&_.messageLine1]:stroke-[#93c5fd] [&_.messageText]:fill-[#f1f5f9] [&_.messageText]:font-medium [&_.note]:fill-[#1e293b] [&_.note]:stroke-[#38bdf8] [&_.noteText]:fill-[#f8fafc] [&_.labelText]:fill-[#f8fafc] [&_.loopText]:fill-[#f8fafc] [&_.loopText>tspan]:fill-[#f8fafc] [&_.sequenceNumber]:fill-[#0284c7]"
          : "my-6 flex w-full justify-center overflow-x-auto [&>svg]:max-w-full [&>svg]:h-auto"
      }
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
