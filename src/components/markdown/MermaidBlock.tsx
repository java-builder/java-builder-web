"use client";

import React, { useEffect, useState, useId } from "react";
import { useTheme } from "next-themes";

interface MermaidBlockProps {
  chart: string;
}

export default function MermaidBlock({ chart }: MermaidBlockProps) {
  const { resolvedTheme } = useTheme();
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
        const isDark = resolvedTheme === "dark";

        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "default",
          securityLevel: "loose",
        });

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
  }, [chart, resolvedTheme, chartId]);

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
      className="my-6 flex w-full justify-center overflow-x-auto [&>svg]:max-w-full [&>svg]:h-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
