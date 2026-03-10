"use client";

import React from "react";
import { GlassPanel } from "../glass/GlassPanel";

export function BottomStrip() {
  return (
    <footer style={{ padding: "0 16px 16px", zIndex: 10 }}>
      <GlassPanel variant="secondary">
        <div
          style={{
            display: "flex",
            gap: 12,
            overflowX: "auto",
            paddingBottom: 4,
          }}
        >
          <div
            style={{
              minWidth: 160,
              padding: 12,
              borderRadius: 12,
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(31,41,55,0.9)",
              fontSize: 13,
            }}
          >
            <div>Session: Today</div>
            <div style={{ fontSize: 12, opacity: 0.7 }}>
              SAWFTLAUNCH · 3 graphs
            </div>
          </div>
        </div>
      </GlassPanel>
    </footer>
  );
}

