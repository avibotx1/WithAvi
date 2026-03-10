"use client";

import React from "react";
import { GlassPanel } from "../glass/GlassPanel";
import type { RunState, NodeState, Artifact } from "@/types/ui-runs";
import { RunSummary } from "../system/RunSummary";

interface RightContextPanelProps {
  activeRun: RunState | null;
  selectedNodeId: string | null;
  onSelectArtifact: (artifactId: string) => void;
}

function formatStatus(status: NodeState["status"]): string {
  switch (status) {
    case "running":
      return "Running";
    case "succeeded":
      return "Done";
    case "failed":
      return "Failed";
    case "skipped":
      return "Skipped";
    case "pending":
    default:
      return "Pending";
  }
}

export function RightContextPanel({
  activeRun,
  selectedNodeId,
  onSelectArtifact,
}: RightContextPanelProps) {
  const selectedNode =
    activeRun?.nodes.find((node) => node.id === selectedNodeId) ?? null;

  const artifacts: Artifact[] = activeRun?.artifacts ?? [];

  return (
    <aside
      className="right-context-panel"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <RunSummary run={activeRun} />

      <GlassPanel variant="secondary">
        <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 14 }}>
          Node Details
        </h3>
        {!selectedNode && (
          <p style={{ opacity: 0.7, fontSize: 13 }}>
            Select a step in the timeline to view details.
          </p>
        )}
        {selectedNode && (
          <div style={{ fontSize: 13 }}>
            <div style={{ marginBottom: 4 }}>
              <strong>Node:</strong> {selectedNode.name}
            </div>
            <div style={{ marginBottom: 4 }}>
              <strong>Status:</strong> {formatStatus(selectedNode.status)}
            </div>
            {selectedNode.lastError && (
              <div
                style={{
                  marginBottom: 8,
                  color: "#F97373",
                }}
              >
                <strong>Error:</strong> {selectedNode.lastError}
              </div>
            )}
            <div style={{ marginTop: 8 }}>
              <strong>Logs</strong>
              {selectedNode.logs.length === 0 && (
                <p style={{ opacity: 0.7, marginTop: 4 }}>No logs yet.</p>
              )}
              {selectedNode.logs.length > 0 && (
                <div
                  style={{
                    marginTop: 4,
                    maxHeight: 160,
                    overflowY: "auto",
                    paddingRight: 4,
                  }}
                >
                  {selectedNode.logs.slice(-5).map((log) => (
                    <div
                      key={log.id}
                      style={{
                        fontSize: 11,
                        opacity: log.level === "info" ? 0.8 : 1,
                        color:
                          log.level === "error"
                            ? "#F97373"
                            : log.level === "warning"
                              ? "#FBBF24"
                              : "#e5e7eb",
                        marginBottom: 2,
                      }}
                    >
                      [{log.level}] {log.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </GlassPanel>

      <GlassPanel variant="secondary">
        <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 14 }}>
          Active Artifacts
        </h3>
        {artifacts.length === 0 && (
          <p style={{ opacity: 0.7, fontSize: 13 }}>No artifacts yet.</p>
        )}
        {artifacts.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {artifacts.map((artifact) => (
              <div
                key={artifact.id}
                onClick={() => onSelectArtifact(artifact.id)}
                style={{
                  padding: 8,
                  borderRadius: 10,
                  background: "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(31,41,55,0.9)",
                  fontSize: 12,
                  cursor: "pointer",
                }}
              >
                <div style={{ fontWeight: 500 }}>{artifact.name}</div>
                <div style={{ opacity: 0.8, marginTop: 2 }}>
                  {artifact.type} · {new Date(artifact.createdAt).toLocaleTimeString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassPanel>

      <GlassPanel variant="secondary">
        <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 14 }}>
          System Snapshot
        </h3>
        <p style={{ opacity: 0.7, fontSize: 13 }}>
          Active jobs, artifacts today, current provider & compute.
        </p>
      </GlassPanel>
    </aside>
  );
}

