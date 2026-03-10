"use client";

import React from "react";
import { TopStatusBar } from "./TopStatusBar";
import { NavRail } from "./NavRail";
import { RightContextPanel } from "./RightContextPanel";
import { BottomStrip } from "./BottomStrip";
import { SystemStatusBar } from "../system/SystemStatusBar";
import type { RunState } from "@/types/ui-runs";

export interface AppShellProps {
  children: React.ReactNode;
  activeRun: RunState | null;
  selectedNodeId: string | null;
  onSelectArtifact: (artifactId: string) => void;
  runs: RunState[];
  activeRunId: string | null;
  onSelectRun: (id: string) => void;
}

export function AppShell({
  children,
  activeRun,
  selectedNodeId,
  onSelectArtifact,
  runs,
  activeRunId,
  onSelectRun,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <TopStatusBar />
      <SystemStatusBar runs={runs} />

      <div className="app-shell-main">
        <NavRail />

        <div className="app-shell-workspace">{children}</div>

        <RightContextPanel
          activeRun={activeRun}
          selectedNodeId={selectedNodeId}
          onSelectArtifact={onSelectArtifact}
        />
      </div>

      <BottomStrip
        runs={runs}
        activeRunId={activeRunId}
        onSelectRun={onSelectRun}
      />
    </div>
  );
}

