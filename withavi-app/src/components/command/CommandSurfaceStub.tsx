"use client";

import React from "react";
import { GlassButton } from "../glass/GlassButton";

export function CommandSurfaceStub() {
  return (
    <>
      <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>
        What are we building today?
      </h2>
      <textarea
        placeholder="Describe the experiment, product, or build you want to run…"
        style={{
          width: "100%",
          minHeight: 96,
          borderRadius: 12,
          border: "1px solid rgba(148,163,184,0.4)",
          background: "rgba(15,23,42,0.9)",
          color: "#f9fafb",
          padding: 12,
          resize: "vertical",
        }}
      />
      <div
        style={{
          marginTop: 12,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <GlassButton variant="secondary">Generate UI</GlassButton>
          <GlassButton variant="secondary">Analyze PDF</GlassButton>
          <GlassButton variant="secondary">Deploy Site</GlassButton>
        </div>
        <GlassButton variant="primary">Run Build</GlassButton>
      </div>
    </>
  );
}

