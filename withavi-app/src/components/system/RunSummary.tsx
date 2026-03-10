"use client";

import React from "react";
import type { RunState } from "@/types/ui-runs";
import { GlassPanel } from "../glass/GlassPanel";

interface RunSummaryProps {
  run: RunState | null;
}

function fmtMs(ms: number | undefined): string {
  if (ms === undefined) return "—";
  return `${(ms / 1000).toFixed(1)}s`;
}

export function RunSummary({ run }: RunSummaryProps) {
  return (
    <GlassPanel variant="secondary">
      <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 14 }}>
        Run Summary
      </h3>
      {!run && (
        <p style={{ opacity: 0.7, fontSize: 13, margin: 0 }}>
          No run selected.
        </p>
      )}
      {run && (
        <div style={{ fontSize: 13, display: "flex", flexDirection: "column", gap: 6 }}>
          <div>
            <strong>Steps:</strong> {run.completedSteps} / {run.nodes.length}
          </div>
          <div>
            <strong>Failed:</strong> {run.failedSteps}
          </div>
          <div>
            <strong>Runtime:</strong> {fmtMs(run.totalDurationMs)}
          </div>
          <div>
            <strong>Capabilities:</strong>{" "}
            {run.capabilities.length > 0 ? run.capabilities.join(", ") : "—"}
          </div>
        </div>
      )}
    </GlassPanel>
  );
}

