"use client";

import React from "react";
import type { RunState, NodeState } from "@/types/ui-runs";

interface ExecutionTimelineProps {
  run: RunState | null;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string) => void;
  showHeader?: boolean;
}

function statusStyles(status: NodeState["status"]): { label: string; color: string } {
  switch (status) {
    case "running":
      return { label: "Running", color: "#4F9CF9" }; // accent blue
    case "succeeded":
      return { label: "Done", color: "#4ADE80" }; // green-ish
    case "failed":
      return { label: "Failed", color: "#F97373" }; // red-ish
    case "skipped":
      return { label: "Skipped", color: "#9CA3AF" }; // muted gray
    case "pending":
    default:
      return { label: "Pending", color: "#6B7280" }; // muted
  }
}

function formatDurationMs(durationMs: number | undefined): string {
  if (durationMs === undefined) return "—";
  return `${(durationMs / 1000).toFixed(1)}s`;
}

export function ExecutionTimeline({
  run,
  selectedNodeId,
  onSelectNode,
  showHeader = true,
}: ExecutionTimelineProps) {
  if (!run) {
    return (
      <>
        {showHeader && (
          <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 16 }}>
            Execution Timeline
          </h2>
        )}
        <div
          style={{
            fontSize: 13,
            opacity: 0.7,
          }}
        >
          No run selected.
        </div>
      </>
    );
  }

  return (
    <>
      {showHeader && (
        <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 16 }}>
          Execution Timeline
        </h2>
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "auto",
          maxHeight: "calc(100vh - 260px)",
        }}
      >
        {run.nodes.map((node) => {
          const { label, color } = statusStyles(node.status);
          const isSelected = node.id === selectedNodeId;
          const liveDurationMs =
            node.status === "running" && node.startedAt
              ? Date.now() - new Date(node.startedAt).getTime()
              : undefined;
          const durationMs =
            node.status === "running" ? liveDurationMs : node.durationMs;
          return (
            <div
              key={node.id}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 12,
                borderRadius: 12,
                background: isSelected
                  ? "rgba(15,23,42,0.98)"
                  : "rgba(15,23,42,0.9)",
                border: isSelected
                  ? "1px solid rgba(79,156,249,0.9)"
                  : "1px solid rgba(31,41,55,0.9)",
                fontSize: 14,
                cursor: "pointer",
              }}
              onClick={() => onSelectNode(node.id)}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 2,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  {node.name}
                  {node.lastError && (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        width: 14,
                        height: 14,
                        borderRadius: "999px",
                        background: "rgba(239,68,68,0.2)",
                        color: "#F97373",
                        fontSize: 10,
                        fontWeight: 700,
                      }}
                      title={node.lastError}
                    >
                      !
                    </span>
                  )}
                </span>
                {(node.startedAt || node.finishedAt) && (
                  <span style={{ fontSize: 11, opacity: 0.6 }}>
                    {node.startedAt && !node.finishedAt && "Started"}
                    {node.startedAt && node.finishedAt && "Completed"}
                  </span>
                )}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 500,
                    color,
                    minWidth: 64,
                    textAlign: "right",
                  }}
                >
                  {label}
                </span>
                <span
                  style={{
                    fontSize: 12,
                    opacity: 0.8,
                    minWidth: 44,
                    textAlign: "right",
                  }}
                >
                  {formatDurationMs(durationMs)}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

