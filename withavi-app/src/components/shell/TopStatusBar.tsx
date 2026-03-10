"use client";

import React from "react";
import { GlassPanel } from "../glass/GlassPanel";

export function TopStatusBar() {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 48,
        padding: "8px 16px",
        zIndex: 10,
      }}
    >
      <GlassPanel variant="primary">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontWeight: 600 }}>WithAvi</span>
            <span
              style={{
                fontSize: 12,
                padding: "4px 10px",
                borderRadius: 999,
                background: "rgba(15,23,42,0.8)",
                border: "1px solid rgba(148,163,184,0.45)",
              }}
            >
              Active project: SAWFTLAUNCH
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ fontSize: 12, opacity: 0.8 }}>Session: Today</span>
            <span style={{ fontSize: 12, opacity: 0.8 }}>Owner mode</span>
          </div>
        </div>
      </GlassPanel>
    </header>
  );
}

