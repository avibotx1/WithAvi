"use client";

import React, { useState } from "react";
import { GlassButton } from "../glass/GlassButton";

interface CommandSurfaceProps {
  onCreateRun: (input: {
    label: string;
    projectId: string;
    capabilities: string[];
  }) => void;
}

const AVAILABLE_CAPABILITIES: { id: string; label: string }[] = [
  { id: "generate_ui", label: "Generate UI" },
  { id: "mockups", label: "Mockups" },
  { id: "build", label: "Build" },
  { id: "deploy", label: "Deploy" },
];

export function CommandSurface({ onCreateRun }: CommandSurfaceProps) {
  const [prompt, setPrompt] = useState("");
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [projectId] = useState<string>("project-default");

  const planSteps: string[] = [
    "Brand generation",
    "UI design",
    ...(selectedCapabilities.includes("mockups") ? ["Mockups"] : []),
    ...(selectedCapabilities.includes("build") ? ["Build site"] : []),
    ...(selectedCapabilities.includes("deploy") ? ["Deploy"] : []),
  ];

  const toggleCapability = (id: string) => {
    setSelectedCapabilities((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleRun = () => {
    const label = prompt.trim() || "New mission";
    onCreateRun({
      label,
      projectId,
      capabilities: selectedCapabilities,
    });
    setPrompt("");
  };

  return (
    <>
      <h2 style={{ marginTop: 0, marginBottom: 12, fontSize: 18 }}>
        Mission
      </h2>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.8 }}>Describe what to build:</div>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
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
            fontSize: 13,
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 8,
            marginTop: 4,
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.8 }}>Capabilities</div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
            }}
          >
            {AVAILABLE_CAPABILITIES.map((cap) => {
              const selected = selectedCapabilities.includes(cap.id);
              return (
                <button
                  key={cap.id}
                  type="button"
                  onClick={() => toggleCapability(cap.id)}
                  style={{
                    borderRadius: 999,
                    padding: "6px 12px",
                    fontSize: 12,
                    border: selected
                      ? "1px solid rgba(79,156,249,0.9)"
                      : "1px solid rgba(148,163,184,0.5)",
                    background: selected
                      ? "rgba(15,23,42,0.98)"
                      : "rgba(15,23,42,0.6)",
                    color: "#e5e7eb",
                    cursor: "pointer",
                    transition: "background 120ms ease, border-color 120ms ease",
                  }}
                >
                  {cap.label}
                </button>
              );
            })}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            marginTop: 8,
          }}
        >
          <div style={{ fontSize: 13, opacity: 0.8 }}>Execution Plan</div>
          <div
            style={{
              fontSize: 12,
              opacity: 0.85,
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {planSteps.map((step, index) => (
              <div key={step} style={{ display: "flex", gap: 6 }}>
                <span
                  style={{
                    width: 16,
                    textAlign: "right",
                    opacity: 0.6,
                  }}
                >
                  {index + 1}.
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 8,
          }}
        >
          <GlassButton variant="primary" onClick={handleRun}>
            Run Mission
          </GlassButton>
        </div>
      </div>
    </>
  );
}

