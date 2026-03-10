"use client";

import React from "react";
import { GlassPanel } from "../glass/GlassPanel";

export function RightContextPanel() {
  return (
    <aside
      className="right-context-panel"
      style={{ display: "flex", flexDirection: "column", gap: 16 }}
    >
      <GlassPanel variant="secondary">
        <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 14 }}>
          Active Artifacts
        </h3>
        <p style={{ opacity: 0.7, fontSize: 13 }}>
          UI layout, mockup, deployment link…
        </p>
      </GlassPanel>

      <GlassPanel variant="secondary">
        <h3 style={{ marginTop: 0, marginBottom: 8, fontSize: 14 }}>
          Recent Uploads
        </h3>
        <p style={{ opacity: 0.7, fontSize: 13 }}>
          shapewear_research.pdf, model_reference.jpg…
        </p>
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

