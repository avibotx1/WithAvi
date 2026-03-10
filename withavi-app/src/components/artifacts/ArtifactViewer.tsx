"use client";

import React from "react";
import type { Artifact } from "@/types/ui-runs";
import { GlassPanel } from "../glass/GlassPanel";

interface ArtifactViewerProps {
  artifact: Artifact | null;
  onClose: () => void;
}

export function ArtifactViewer({ artifact, onClose }: ArtifactViewerProps) {
  if (!artifact) return null;

  const preview = (() => {
    // Shared container style; inner content differs by type.
    const containerStyle: React.CSSProperties = {
      marginBottom: 12,
      borderRadius: 12,
      background: "rgba(15,23,42,0.9)",
      border: "1px solid rgba(31,41,55,0.9)",
      height: 300,
      padding: 16,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 13,
      opacity: 0.9,
    };

    switch (artifact.type) {
      case "brand":
        return (
          <div style={containerStyle}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 16,
                width: "100%",
                height: "100%",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>Color system</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: "#0f172a",
                    }}
                  />
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: "#e5e7eb",
                    }}
                  />
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 8,
                      background: "#4F9CF9",
                    }}
                  />
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, marginTop: 8 }}>
                  Typography
                </div>
                <div style={{ opacity: 0.85 }}>
                  <div style={{ fontSize: 18 }}>Heading / WithAvi</div>
                  <div style={{ fontSize: 13 }}>Body text example for brand spec.</div>
                </div>
              </div>
              <div
                style={{
                  borderRadius: 10,
                  border: "1px dashed rgba(148,163,184,0.6)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  opacity: 0.8,
                }}
              >
                Brand system preview
              </div>
            </div>
          </div>
        );
      case "ui":
        return (
          <div style={containerStyle}>
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                background: "rgba(15,23,42,0.95)",
                border: "1px solid rgba(31,41,55,0.9)",
                padding: 12,
                display: "grid",
                gridTemplateColumns: "240px 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  borderRadius: 8,
                  background: "rgba(15,23,42,1)",
                  border: "1px solid rgba(55,65,81,1)",
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  borderRadius: 8,
                  background: "rgba(15,23,42,1)",
                  border: "1px solid rgba(55,65,81,1)",
                }}
              />
              <div
                style={{
                  gridColumn: "1 / span 2",
                  display: "grid",
                  gap: 8,
                  gridTemplateColumns: "repeat(3, 1fr)",
                }}
              >
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    style={{
                      borderRadius: 8,
                      background: "rgba(15,23,42,1)",
                      border: "1px solid rgba(55,65,81,1)",
                      height: 70,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        );
      case "mockup":
        return (
          <div style={containerStyle}>
            <div
              style={{
                width: "100%",
                height: "100%",
                borderRadius: 10,
                background:
                  "radial-gradient(circle at top left, #1f2937, #020617)",
                border: "1px solid rgba(31,41,55,0.9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 13,
                opacity: 0.9,
              }}
            >
              Mockup preview placeholder
            </div>
          </div>
        );
      case "build":
        return (
          <div style={containerStyle}>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                Build bundle ready
              </div>
              <div>Estimated size: ~320kb</div>
              <div>Optimizations: tree-shaking, minification, code-splitting</div>
              <div>Artifacts: client bundle, server bundle, static assets</div>
            </div>
          </div>
        );
      case "deploy":
        return (
          <div style={containerStyle}>
            <div style={{ fontSize: 13, lineHeight: 1.6 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>
                Deployment successful
              </div>
              <div>Environment: preview</div>
              <div>URL: https://example-site.preview</div>
              <div>Region: us-east-1</div>
            </div>
          </div>
        );
      default:
        return (
          <div style={containerStyle}>
            Preview placeholder for {artifact.type} artifact
          </div>
        );
    }
  })();

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "rgba(0,0,0,0.55)",
      }}
    >
      <div style={{ maxWidth: 600, width: "90%" }}>
        <GlassPanel variant="secondary">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <h2 style={{ margin: 0, fontSize: 18 }}>{artifact.name}</h2>
            <button
              type="button"
              onClick={onClose}
              style={{
                fontSize: 12,
                padding: "6px 10px",
                borderRadius: 999,
                border: "1px solid rgba(148,163,184,0.5)",
                background: "rgba(15,23,42,0.9)",
                color: "#e5e7eb",
                cursor: "pointer",
              }}
            >
              Close
            </button>
          </div>

          {preview}

          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            <div>
              <strong>Type:</strong> {artifact.type}
            </div>
            <div>
              <strong>Created:</strong>{" "}
              {new Date(artifact.createdAt).toLocaleString()}
            </div>
            <div>
              <strong>Produced by node:</strong> {artifact.nodeId}
            </div>
          </div>
        </GlassPanel>
      </div>
    </div>
  );
}

