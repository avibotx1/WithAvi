"use client";

import React from "react";
import type { RunState } from "@/types/ui-runs";
import { GlassButton } from "../glass/GlassButton";

interface RunControlsProps {
  activeRun: RunState | null;
  onCancel: () => void;
  onRetryFailedNodes: () => void;
  onRerun: () => void;
}

export function RunControls({
  activeRun,
  onCancel,
  onRetryFailedNodes,
  onRerun,
}: RunControlsProps) {
  if (!activeRun) return null;

  const isRunning = activeRun.status === "running";
  const hasFailedNodes =
    activeRun.nodes.some((node) => node.status === "failed") ||
    activeRun.status === "failed";

  return (
    <div
      style={{
        marginBottom: 8,
        display: "flex",
        alignItems: "center",
        gap: 8,
        justifyContent: "space-between",
      }}
    >
      <div
        style={{
          fontSize: 12,
          opacity: 0.8,
        }}
      >
        <span style={{ fontWeight: 500 }}>{activeRun.label}</span>
        <span style={{ marginLeft: 6 }}>· {activeRun.status}</span>
      </div>
      <div
        style={{
          display: "flex",
          gap: 8,
        }}
      >
        {isRunning && (
          <GlassButton variant="danger" onClick={onCancel}>
            Cancel
          </GlassButton>
        )}
        {!isRunning && hasFailedNodes && (
          <GlassButton variant="primary" onClick={onRetryFailedNodes}>
            Retry failed
          </GlassButton>
        )}
        <GlassButton variant="secondary" onClick={onRerun}>
          Rerun
        </GlassButton>
      </div>
    </div>
  );
}

