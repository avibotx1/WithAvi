"use client";

import React from "react";
import type { RunState, NodeState } from "@/types/ui-runs";

interface ExecutionGraphProps {
  run: RunState | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
}

function statusStyles(
  status: NodeState["status"],
): { label: string; color: string } {
  switch (status) {
    case "running":
      return { label: "Running", color: "#4F9CF9" };
    case "succeeded":
      return { label: "Done", color: "#4ADE80" };
    case "failed":
      return { label: "Failed", color: "#F97373" };
    case "skipped":
      return { label: "Skipped", color: "#9CA3AF" };
    case "pending":
    default:
      return { label: "Pending", color: "#6B7280" };
  }
}

export function ExecutionGraph({
  run,
  selectedNodeId,
  onSelectNode,
}: ExecutionGraphProps) {
  if (!run) {
    return (
      <div
        style={{
          fontSize: 13,
          opacity: 0.7,
        }}
      >
        No run selected.
      </div>
    );
  }

  const getNodesByIds = (ids: string[]): NodeState[] =>
    run.nodes.filter((n) => ids.includes(n.id));

  const col1 = getNodesByIds(["brand"]);
  const col2 = getNodesByIds(["ui"]);
  const col3 = getNodesByIds(["mockups", "build"]);
  const col4 = getNodesByIds(["deploy"]);

  const columns: NodeState[][] = [col1, col2, col3, col4].filter(
    (col) => col.length > 0,
  );

  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        marginTop: 8,
        overflowX: "auto",
        paddingBottom: 4,
      }}
    >
      {columns.map((col, colIndex) => (
        <div
          key={colIndex}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 12,
            minWidth: 140,
          }}
        >
          {col.map((node) => {
            const { label, color } = statusStyles(node.status);
            const isSelected = node.id === selectedNodeId;
            return (
              <button
                key={node.id}
                type="button"
                onClick={() => onSelectNode(node.id)}
                style={{
                  textAlign: "left",
                  padding: 12,
                  borderRadius: 12,
                  border: isSelected
                    ? "1px solid rgba(79,156,249,0.9)"
                    : "1px solid rgba(31,41,55,0.9)",
                  background: isSelected
                    ? "rgba(15,23,42,0.98)"
                    : "rgba(15,23,42,0.9)",
                  cursor: "pointer",
                  fontSize: 13,
                  display: "flex",
                  flexDirection: "column",
                  gap: 4,
                }}
              >
                <span>{node.name}</span>
                <span
                  style={{
                    alignSelf: "flex-start",
                    fontSize: 11,
                    fontWeight: 500,
                    color,
                    padding: "2px 8px",
                    borderRadius: 999,
                    background: "rgba(15,23,42,0.8)",
                    border: `1px solid ${color}33`,
                  }}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

