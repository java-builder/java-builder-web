"use client";

import React, { useState } from "react";
import { ARCHITECTURE_PATTERNS } from "./data/patternsData";
import { ArchitecturePattern, PatternCategory } from "./types";
import { ArchitectureHero } from "./ArchitectureHero";
import { FlowCanvas } from "./FlowCanvas";

export const ArchitectureClient: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<PatternCategory>("all");
  const [activePatternId, setActivePatternId] = useState<string>(
    ARCHITECTURE_PATTERNS[0].id
  );

  const activePattern: ArchitecturePattern =
    ARCHITECTURE_PATTERNS.find((p: ArchitecturePattern) => p.id === activePatternId) ||
    ARCHITECTURE_PATTERNS[0];

  const [selectedNodeId, setSelectedNodeId] = useState<string>(
    activePattern.initialNodes[0]?.id || ""
  );

  const handleSelectPattern = (patternId: string) => {
    setActivePatternId(patternId);
    const pattern = ARCHITECTURE_PATTERNS.find((p: ArchitecturePattern) => p.id === patternId);
    if (pattern && pattern.initialNodes.length > 0) {
      setSelectedNodeId(pattern.initialNodes[0].id);
    }
  };

  const handleSelectNode = (nodeId: string) => {
    setSelectedNodeId(nodeId);
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto pb-12">
      {/* Header, Categories & Pattern Selector Tabs */}
      <ArchitectureHero
        patterns={ARCHITECTURE_PATTERNS}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        activePattern={activePattern}
        onSelectPattern={handleSelectPattern}
      />

      {/* Main Interactive Flow Canvas (React Flow) */}
      <FlowCanvas
        pattern={activePattern}
        selectedNodeId={selectedNodeId}
        onSelectNode={handleSelectNode}
      />
    </div>
  );
};
