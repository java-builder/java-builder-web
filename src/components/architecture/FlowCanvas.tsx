"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  Node,
  Edge,
  MarkerType,
  ReactFlowProvider,
  useReactFlow,
  useNodesInitialized,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { CardNode } from "./CardNode";
import { ArchitecturePattern, FlowNodeData } from "./types";
import {
  Sparkles,
  Maximize2,
  Minimize2,
  RotateCcw,
} from "lucide-react";

const nodeTypes = {
  cardNode: CardNode,
};

// Component to automatically center and fit view comfortably (scaled down with generous padding as requested)
function AutoCenterView({ patternId }: { patternId: string }) {
  const { fitView } = useReactFlow();
  const nodesInitialized = useNodesInitialized();

  useEffect(() => {
    if (nodesInitialized) {
      const timer = setTimeout(() => {
        // padding: 0.45 and maxZoom: 0.85 renders the diagram comfortably compact in the center
        fitView({ padding: 0.45, maxZoom: 0.85, duration: 350 });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [patternId, nodesInitialized, fitView]);

  return null;
}

interface FlowCanvasProps {
  pattern: ArchitecturePattern;
  selectedNodeId?: string;
  onSelectNode?: (nodeId: string, nodeData: FlowNodeData) => void;
}

const FlowCanvasContent: React.FC<FlowCanvasProps> = ({
  pattern,
  selectedNodeId: controlledSelectedNodeId,
  onSelectNode,
}) => {
  const { fitView } = useReactFlow();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [internalSelectedId, setInternalSelectedId] = useState<string>(
    pattern.initialNodes[0]?.id || ""
  );

  const activeSelectedId = controlledSelectedNodeId !== undefined ? controlledSelectedNodeId : internalSelectedId;

  // Format nodes with isSelected state and ensure stepNumber is passed
  const formattedNodes = useMemo(() => {
    return pattern.initialNodes.map((n, idx) => {
      const isSelected = n.id === activeSelectedId;
      return {
        id: n.id,
        type: "cardNode",
        position: n.position,
        data: {
          ...n.data,
          stepNumber: n.data.stepNumber !== undefined ? n.data.stepNumber : idx + 1,
          isSelected,
        },
      } as Node;
    });
  }, [pattern, activeSelectedId]);

  // Format edges with animated smooth curves and highlight on selection
  const formattedEdges = useMemo(() => {
    return pattern.initialEdges.map((e) => {
      const isConnected =
        e.source === activeSelectedId || e.target === activeSelectedId;

      return {
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle,
        targetHandle: e.targetHandle,
        label: e.label,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: isConnected ? "#FF5A1F" : "#94A3B8",
          strokeWidth: isConnected ? 2.5 : 1.75,
        },
        labelStyle: {
          fill: isConnected ? "#FF5A1F" : "#334155",
          fontWeight: isConnected ? 700 : 600,
          fontSize: 10,
        },
        labelBgStyle: {
          fill: "#FFFFFF",
          fillOpacity: 0.98,
          rx: 6,
          ry: 6,
          stroke: isConnected ? "#FF5A1F" : "#CBD5E1",
          strokeWidth: 1,
        },
        labelBgPadding: [6, 3] as [number, number],
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: isConnected ? "#FF5A1F" : "#94A3B8",
          width: 14,
          height: 14,
        },
      } as Edge;
    });
  }, [pattern, activeSelectedId]);

  const [nodes, setNodes, onNodesChange] = useNodesState(formattedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(formattedEdges);

  useEffect(() => {
    setNodes(formattedNodes);
  }, [formattedNodes, setNodes]);

  useEffect(() => {
    setEdges(formattedEdges);
  }, [formattedEdges, setEdges]);

  const handleResetView = () => {
    fitView({ padding: 0.45, maxZoom: 0.85, duration: 400 });
  };

  return (
    <div className="w-full">
      {/* Canvas Frame */}
      <div
        className={`relative w-full rounded-3xl border border-[#E8E8E8] dark:border-border overflow-hidden bg-[#FAFAFA] dark:bg-[#12161E] shadow-sm transition-all duration-300 ${
          isFullscreen
            ? "fixed inset-0 z-50 rounded-none h-screen w-screen bg-[#FAFAFA] dark:bg-[#12161E]"
            : "h-[600px] sm:h-[680px]"
        }`}
      >
        <style jsx global>{`
          @keyframes flowDash {
            from {
              stroke-dashoffset: 24;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
          .react-flow__edge.animated path {
            stroke-dasharray: 6 4 !important;
            animation: flowDash 0.9s linear infinite !important;
          }
          /* Hide React Flow attribution watermark completely */
          .react-flow__attribution {
            display: none !important;
            opacity: 0 !important;
            visibility: hidden !important;
            pointer-events: none !important;
          }
          /* Dark mode edge label styles */
          .react-flow__edge-textbg {
            fill: #FFFFFF !important;
            stroke: #CBD5E1 !important;
            rx: 6px !important;
            ry: 6px !important;
          }
          :is(.dark) .react-flow__edge-textbg {
            fill: #161B22 !important;
            stroke: #2D3748 !important;
          }
          .react-flow__edge-text {
            fill: #334155 !important;
            font-weight: 600 !important;
            font-size: 11px !important;
          }
          :is(.dark) .react-flow__edge-text {
            fill: #E2E8F0 !important;
          }
        `}</style>

        {/* Top Control Bar */}
        <div className="absolute top-3 left-3 right-3 z-10 pointer-events-none flex items-center justify-between gap-2">
          {/* Active Flow Badge */}
          <div className="bg-white/95 dark:bg-surface/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-border shadow-xs pointer-events-auto flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FF5A1F] animate-pulse shrink-0" />
            <span className="text-xs font-bold text-foreground font-mono truncate">
              {pattern.title}
            </span>
          </div>

          {/* Quick Actions (Reset & Fullscreen) */}
          <div className="flex items-center gap-1.5 pointer-events-auto">
            <button
              onClick={handleResetView}
              title="Căn giữa sơ đồ (Fit & Center View)"
              className="px-3 py-1.5 rounded-xl bg-white/95 dark:bg-surface/95 backdrop-blur-md border border-border hover:border-[#FF5A1F] hover:text-[#FF5A1F] text-xs font-medium text-foreground transition-colors shadow-xs flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Căn giữa</span>
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              title={isFullscreen ? "Thu nhỏ" : "Toàn màn hình"}
              className="p-1.5 rounded-xl bg-white/95 dark:bg-surface/95 backdrop-blur-md border border-border hover:border-[#FF5A1F] hover:text-[#FF5A1F] text-foreground transition-colors shadow-xs"
            >
              {isFullscreen ? (
                <Minimize2 className="w-4 h-4" />
              ) : (
                <Maximize2 className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* React Flow Viewport with compact initial view */}
        <ReactFlow
          key={pattern.id}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={(_, node) => {
            setInternalSelectedId(node.id);
            if (onSelectNode) {
              onSelectNode(node.id, (node.data as unknown) as FlowNodeData);
            }
          }}
          fitView
          fitViewOptions={{ padding: 0.45, maxZoom: 0.85 }}
          minZoom={0.2}
          maxZoom={1.8}
          defaultEdgeOptions={{ type: "smoothstep" }}
          proOptions={{ hideAttribution: true }}
          className="touch-none"
        >
          <AutoCenterView patternId={pattern.id} />
          <Background color="#CBD5E1" gap={24} size={1} />
          <Controls
            showInteractive={false}
            className="!bg-white dark:!bg-surface !border !border-border !rounded-2xl !overflow-hidden !shadow-xs"
          />
        </ReactFlow>

        {/* Bottom Helper Bar */}
        <div className="absolute bottom-3 left-3 z-10 pointer-events-none">
          <div className="bg-white/90 dark:bg-surface/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-border text-[11px] text-muted-foreground shadow-xs pointer-events-auto flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5A1F]" />
            <span>Sơ đồ căn giữa vừa vặn. Lăn chuột để phóng to hoặc kéo thả canvas tùy ý.</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export const FlowCanvas: React.FC<FlowCanvasProps> = (props) => {
  return (
    <ReactFlowProvider>
      <FlowCanvasContent {...props} />
    </ReactFlowProvider>
  );
};
