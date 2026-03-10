"use client";

import React from "react";

const ROWS = [
  { label: "Brand generation", state: "Done" },
  { label: "UI design", state: "Running" },
  { label: "Mockups", state: "Pending" },
  { label: "Build site", state: "Pending" },
  { label: "Deploy", state: "Pending" },
];

export function ExecutionTimelineStub() {
  return (
    <>
      <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 16 }}>
        Execution Timeline
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 8,
          overflowY: "auto",
          maxHeight: "calc(100vh - 260px)",
        }}
      >
        {ROWS.map((row) => (
          <div
            key={row.label}
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: 12,
              borderRadius: 12,
              background: "rgba(15,23,42,0.9)",
              border: "1px solid rgba(31,41,55,0.9)",
              fontSize: 14,
            }}
          >
            <span>{row.label}</span>
            <span style={{ fontSize: 12, opacity: 0.8 }}>{row.state}</span>
          </div>
        ))}
      </div>
    </>
  );
}

