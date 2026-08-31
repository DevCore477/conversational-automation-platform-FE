"use client";

import { X } from "lucide-react";
import { type FC, memo, useState, useMemo } from "react";
import {
  type EdgeProps,
  BaseEdge,
  getSmoothStepPath,
  EdgeLabelRenderer,
  Position,
} from "reactflow";

import { Button } from "@/components/ui/button";
import { useFlowStore } from "@/store/flow.store";

interface CustomEdgeProps extends EdgeProps {
  data?: {
    sourceHandleId?: string;
    targetHandleId?: string;
  };
}

// Helper to determine if we should use straight path for short connections
const shouldUseStraightPath = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
): boolean => {
  const distance = Math.hypot(targetX - sourceX, targetY - sourceY);
  return distance < 150; // Use straight lines for very short connections
};

// Helper to determine edge curvature based on relative positions
const getEdgeCurvature = (
  sourceX: number,
  sourceY: number,
  targetX: number,
  targetY: number,
  sourcePosition: Position,
  targetPosition: Position,
  index: number = 0,
  total: number = 1,
): number => {
  // Base curvature
  let curvature = 0.25;

  // Adjust curvature based on positions to avoid overlapping
  const dx = Math.abs(targetX - sourceX);
  const dy = Math.abs(targetY - sourceY);

  // If nodes are vertically aligned, increase curvature
  if (dx < 50 && dy > 100) {
    curvature = 0.5;
  }

  // If nodes are horizontally aligned, use different curvature
  if (dy < 50 && dx > 100) {
    curvature = 0.3;
  }

  // Add offset based on edge index to create bundled but separate paths
  if (total > 1) {
    const offset = (index - (total - 1) / 2) * 0.15;
    curvature += offset;
  }

  // Adjust based on positions to create more natural curves
  if (sourcePosition === Position.Right && targetPosition === Position.Left) {
    curvature = 0.2; // Straighter when going right to left
  } else if (
    sourcePosition === Position.Bottom &&
    targetPosition === Position.Top
  ) {
    curvature = 0.4; // More curved when going bottom to top
  }

  return Math.max(0.1, Math.min(0.8, curvature)); // Clamp between 0.1 and 0.8
};

export const CustomEdge: FC<CustomEdgeProps> = memo(
  ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    source,
    target,
  }) => {
    const { flow } = useFlowStore(); // Get flow from store, not edges directly
    const [isHovered, setIsHovered] = useState(false);

    // Count parallel edges between same source and target from flow.edges
    const parallelEdges = useMemo(() => {
      return flow.edges.filter(
        (e) =>
          (e.source === source && e.target === target) ||
          (e.source === target && e.target === source),
      );
    }, [flow.edges, source, target]);

    // Find this edge's index among parallel edges
    const edgeIndex = useMemo(() => {
      return parallelEdges.findIndex((e) => e.id === id);
    }, [parallelEdges, id]);

    const totalParallelEdges = parallelEdges.length;

    // Determine if this is a self-loop
    const isSelfLoop = source === target;

    // Get edge path with dynamic curvature to avoid overlaps
    const [edgePath, labelX, labelY] = useMemo(() => {
      if (isSelfLoop) {
        // Handle self-loop edges specially
        const radiusX = 50;
        const radiusY = 30;
        const path = `M ${sourceX} ${sourceY - 10} 
                     C ${sourceX + radiusX} ${sourceY - radiusY}, 
                       ${sourceX + radiusX} ${targetY - radiusY}, 
                       ${targetX} ${targetY - 10}`;
        return [path, sourceX + radiusX, sourceY - radiusY];
      }

      const useStraight = shouldUseStraightPath(
        sourceX,
        sourceY,
        targetX,
        targetY,
      );

      if (useStraight) {
        // Straight line for very short connections
        return [
          `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`,
          (sourceX + targetX) / 2,
          (sourceY + targetY) / 2,
        ];
      }

      const curvature = getEdgeCurvature(
        sourceX,
        sourceY,
        targetX,
        targetY,
        sourcePosition,
        targetPosition,
        edgeIndex,
        totalParallelEdges,
      );

      return getSmoothStepPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
        borderRadius: 16,
        offset: curvature * 100, // Add offset based on curvature
      });
    }, [
      sourceX,
      sourceY,
      targetX,
      targetY,
      sourcePosition,
      targetPosition,
      isSelfLoop,
      edgeIndex,
      totalParallelEdges,
    ]);

    const handleDeleteEdge = (e: React.MouseEvent) => {
      e.stopPropagation();
      // Use deleteEdge from store
      useFlowStore.getState().deleteEdge(id);
    };

    // Generate unique color for each edge based on its ID
    const edgeColor = useMemo(() => {
      if (isSelfLoop) {
        return "#f59e0b"; // warning color for self-loops
      }

      // Generate a consistent color based on edge ID hash
      let hash = 0;
      for (let i = 0; i < id.length; i++) {
        hash = id.charCodeAt(i) + ((hash << 5) - hash);
      }

      // Use hash to generate a hue (0-360) with good saturation and lightness
      const hue = Math.abs(hash) % 360;
      // Use different saturation/lightness for better visibility
      const saturation = 65 + (Math.abs(hash) % 15); // 65-80%
      const lightness = 45 + (Math.abs(hash) % 15); // 45-60%

      const color = `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      // Export edge color to a global map for nodes to access
      if (typeof window !== "undefined") {
        if (!(window as any).edgeColors) {
          (window as any).edgeColors = new Map();
        }
        (window as any).edgeColors.set(id, color);
      }

      return color;
    }, [id, isSelfLoop]);

    // Determine edge style
    const edgeStyle = useMemo(() => {
      if (isSelfLoop) {
        return {
          stroke: edgeColor,
          strokeWidth: 2,
          strokeDasharray: "5,5", // Dashed for self-loops
        };
      }

      return {
        stroke: edgeColor,
        strokeWidth: 2,
      };
    }, [isSelfLoop, edgeColor]);

    return (
      <>
        <BaseEdge path={edgePath} style={edgeStyle} />

        {/* Invisible path for hover detection - wider for easier interaction */}
        <path
          d={edgePath}
          fill="none"
          stroke="transparent"
          strokeWidth={20}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{ cursor: "pointer" }}
        />

        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              left: labelX,
              top: labelY,
              transform: "translate(-50%, -50%)",
              width: 28,
              height: 28,
              pointerEvents: "auto",
              zIndex: 10,
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            {isHovered && (
              <Button
                size="sm"
                variant="ghost"
                className="h-6 w-6 p-0 bg-destructive hover:bg-destructive/90 text-white rounded-full shadow-lg"
                onClick={handleDeleteEdge}
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>
        </EdgeLabelRenderer>
      </>
    );
  },
);

CustomEdge.displayName = "CustomEdge";
