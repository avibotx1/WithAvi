"use client";

import { useState } from "react";
import { AppShell } from "../components/shell/AppShell";
import { GlassPanel } from "../components/glass/GlassPanel";
import { CommandSurface } from "../components/command/CommandSurface";
import { RunList } from "../components/timeline/RunList";
import { ExecutionTimeline } from "../components/timeline/ExecutionTimeline";
import { ExecutionGraph } from "../components/timeline/ExecutionGraph";
import { RunControls } from "../components/timeline/RunControls";
import { ArtifactViewer } from "../components/artifacts/ArtifactViewer";
import { useRunOrchestrator } from "../hooks/useRunOrchestrator";

export default function Home() {
  const {
    runs,
    activeRunId,
    activeRun,
    setActiveRunId,
    createRun,
    cancelRun,
    retryFailedNodes,
    rerun,
  } = useRunOrchestrator();

  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [selectedArtifactId, setSelectedArtifactId] = useState<string | null>(
    null,
  );
  const [timelineView, setTimelineView] = useState<"timeline" | "graph">(
    "timeline",
  );

  // Temporary: verify orchestrator state in the browser console.
  // eslint-disable-next-line no-console
  console.log({ runs, activeRunId, activeRun });

  const selectedArtifact =
    activeRun?.artifacts.find((a) => a.id === selectedArtifactId) ?? null;

  return (
    <AppShell
      runs={runs}
      activeRunId={activeRunId}
      onSelectRun={setActiveRunId}
      activeRun={activeRun}
      selectedNodeId={selectedNodeId}
      onSelectArtifact={(id) => setSelectedArtifactId(id)}
    >
      <GlassPanel variant="primary">
        <CommandSurface onCreateRun={createRun} />
      </GlassPanel>

      <GlassPanel variant="primary">
        <RunList
          runs={runs}
          activeRunId={activeRunId}
          onSelectRun={setActiveRunId}
        />
        <RunControls
          activeRun={activeRun}
          onCancel={() => activeRun && cancelRun(activeRun.id)}
          onRetryFailedNodes={() =>
            activeRun && retryFailedNodes(activeRun.id)
          }
          onRerun={() => activeRun && rerun(activeRun.id)}
        />
        <div
          style={{
            marginTop: 8,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 8,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 16 }}>Execution</h2>
            <div
              style={{
                display: "inline-flex",
                borderRadius: 999,
                border: "1px solid rgba(31,41,55,0.9)",
                overflow: "hidden",
              }}
            >
              {(
                [
                  { id: "timeline", label: "Timeline" },
                  { id: "graph", label: "Graph" },
                ] as const
              ).map((tab) => {
                const isActive = timelineView === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setTimelineView(tab.id)}
                    style={{
                      padding: "4px 10px",
                      fontSize: 11,
                      border: "none",
                      background: isActive
                        ? "rgba(15,23,42,0.98)"
                        : "rgba(15,23,42,0.6)",
                      color: isActive ? "#E5E7EB" : "#9CA3AF",
                      cursor: "pointer",
                    }}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>
          {timelineView === "timeline" ? (
            <ExecutionTimeline
              run={activeRun}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
              showHeader={false}
            />
          ) : (
            <ExecutionGraph
              run={activeRun}
              selectedNodeId={selectedNodeId}
              onSelectNode={setSelectedNodeId}
            />
          )}
        </div>
      </GlassPanel>
      <ArtifactViewer
        artifact={selectedArtifact ?? null}
        onClose={() => setSelectedArtifactId(null)}
      />
    </AppShell>
  );
}

