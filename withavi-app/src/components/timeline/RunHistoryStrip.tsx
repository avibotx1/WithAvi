"use client";

import React from "react";
import type { RunState } from "@/types/ui-runs";

interface RunHistoryStripProps {
  runs: RunState[];
  activeRunId: string | null;
  onSelectRun: (id: string) => void;
}

function formatDayLabel(date: Date): string {
  const today = new Date();
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
  const targetStart = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const diffDays = Math.round((todayStart - targetStart) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString();
}

function formatRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();
  const diffSec = Math.round(diffMs / 1000);
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHours = Math.round(diffMin / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.round(diffHours / 24);
  return `${diffDays}d ago`;
}

export function RunHistoryStrip({
  runs,
  activeRunId,
  onSelectRun,
}: RunHistoryStripProps) {
  if (runs.length === 0) return null;

  // Sort runs by createdAt descending.
  const sorted = [...runs].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  // Group by day label.
  const groups: Record<string, RunState[]> = {};
  sorted.forEach((run) => {
    const d = new Date(run.createdAt);
    const label = formatDayLabel(d);
    if (!groups[label]) groups[label] = [];
    groups[label].push(run);
  });

  const groupEntries = Object.entries(groups);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {groupEntries.map(([label, groupRuns]) => (
        <div key={label}>
          <div
            style={{
              fontSize: 12,
              opacity: 0.75,
              marginBottom: 4,
            }}
          >
            {label}
          </div>
          <div
            style={{
              display: "flex",
              gap: 8,
              overflowX: "auto",
              paddingBottom: 4,
            }}
          >
            {groupRuns.map((run) => {
              const createdAtDate = new Date(run.createdAt);
              const isActive = run.id === activeRunId;
              const statusColor =
                run.status === "succeeded"
                  ? "#4ADE80"
                  : run.status === "failed"
                    ? "#F97373"
                    : run.status === "running"
                      ? "#4F9CF9"
                      : "#9CA3AF";

              return (
                <button
                  key={run.id}
                  type="button"
                  onClick={() => onSelectRun(run.id)}
                  style={{
                    minWidth: 180,
                    height: 60,
                    padding: 10,
                    borderRadius: 12,
                    border: isActive
                      ? "1px solid rgba(79,156,249,0.9)"
                      : "1px solid rgba(31,41,55,0.9)",
                    background: isActive
                      ? "rgba(15,23,42,0.98)"
                      : "rgba(15,23,42,0.9)",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    fontSize: 12,
                    color: "#e5e7eb",
                    cursor: "pointer",
                    textAlign: "left",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      width: "100%",
                    }}
                  >
                    <span
                      style={{
                        display: "inline-block",
                        width: 8,
                        height: 8,
                        borderRadius: 999,
                        backgroundColor: statusColor,
                      }}
                    />
                    <span
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {run.label}
                    </span>
                  </div>
                  <div
                    style={{
                      opacity: 0.8,
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%",
                    }}
                  >
                    <span>{run.status}</span>
                    <span>{formatRelativeTime(createdAtDate)}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

