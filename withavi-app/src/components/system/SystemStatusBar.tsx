"use client";

import React from "react";
import type { RunState } from "@/types/ui-runs";

interface SystemStatusBarProps {
  runs: RunState[];
}

export function SystemStatusBar({ runs }: SystemStatusBarProps) {
  const activeRuns = runs.filter((r) => r.status === "running");
  const failedRuns = runs.filter((r) => r.status === "failed");
  const completedRuns = runs.filter(
    (r) => r.status === "succeeded" || r.status === "failed" || r.status === "cancelled",
  );

  const avgRuntimeMs = (() => {
    const durations = completedRuns
      .map((r) => r.totalDurationMs)
      .filter((d): d is number => typeof d === "number");
    if (durations.length === 0) return null;
    return durations.reduce((a, b) => a + b, 0) / durations.length;
  })();

  const lastRun =
    runs.length > 0
      ? [...runs].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )[0]
      : null;

  let statusLabel = "Idle";
  let statusColor = "#9CA3AF"; // gray

  if (failedRuns.length > 0) {
    statusLabel = "Warning";
    statusColor = "#F97373"; // red
  } else if (activeRuns.length > 0) {
    statusLabel = "Running";
    statusColor = "#4F9CF9"; // blue
  }

  return (
    <div
      style={{
        padding: "4px 16px 8px",
        display: "flex",
        justifyContent: "flex-end",
        gap: 16,
        fontSize: 12,
        opacity: 0.85,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        <span
          style={{
            display: "inline-block",
            width: 8,
            height: 8,
            borderRadius: 999,
            backgroundColor: statusColor,
          }}
        />
        <span>
          System: {statusLabel} · {activeRuns.length} run active
          {activeRuns.length === 1 ? "" : "s"}
          {avgRuntimeMs !== null ? ` · avg runtime ${(avgRuntimeMs / 1000).toFixed(1)}s` : ""}
        </span>
      </div>
      <div>Failed runs: {failedRuns.length}</div>
      {lastRun && (
        <div>
          Last run: {new Date(lastRun.createdAt).toLocaleTimeString()}
        </div>
      )}
    </div>
  );
}

