"use client";

import React from "react";
import type { RunState } from "@/types/ui-runs";

interface RunListProps {
  runs: RunState[];
  activeRunId: string | null;
  onSelectRun: (id: string) => void;
}

export function RunList({ runs, activeRunId, onSelectRun }: RunListProps) {
  if (runs.length === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: 8,
        display: "flex",
        gap: 8,
        overflowX: "auto",
        paddingBottom: 4,
      }}
    >
      {runs.map((run) => {
        const isActive = run.id === activeRunId;

        return (
          <button
            key={run.id}
            type="button"
            onClick={() => onSelectRun(run.id)}
            style={{
              minWidth: 180,
              padding: "8px 12px",
              borderRadius: 999,
              border: isActive
                ? "1px solid rgba(79,156,249,0.9)"
                : "1px solid rgba(31,41,55,0.9)",
              background: isActive
                ? "rgba(15,23,42,0.95)"
                : "rgba(15,23,42,0.85)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 12,
              color: "#e5e7eb",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            <span
              style={{
                overflow: "hidden",
                textOverflow: "ellipsis",
                maxWidth: 120,
              }}
            >
              {run.label}
            </span>
            <span style={{ opacity: 0.8 }}>{run.status}</span>
          </button>
        );
      })}
    </div>
  );
}

