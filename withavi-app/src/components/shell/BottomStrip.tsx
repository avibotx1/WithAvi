"use client";

import React from "react";
import { GlassPanel } from "../glass/GlassPanel";
import type { RunState } from "@/types/ui-runs";
import { RunHistoryStrip } from "../timeline/RunHistoryStrip";

export interface BottomStripProps {
  runs: RunState[];
  activeRunId: string | null;
  onSelectRun: (id: string) => void;
}

export function BottomStrip({
  runs,
  activeRunId,
  onSelectRun,
}: BottomStripProps) {
  return (
    <footer style={{ padding: "0 16px 16px", zIndex: 10 }}>
      <GlassPanel variant="secondary">
        <RunHistoryStrip
          runs={runs}
          activeRunId={activeRunId}
          onSelectRun={onSelectRun}
        />
      </GlassPanel>
    </footer>
  );
}

