"use client";

import React from "react";
import "./glass.css";

// GlassPanel is a structural material primitive.
// Use it only for zone-level surfaces (panels), never for item-level cards.
// Do not nest a GlassPanel inside another GlassPanel.

type GlassVariant = "primary" | "secondary";

export interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  variant?: GlassVariant;
}

export function GlassPanel({
  children,
  className,
  variant = "primary",
}: GlassPanelProps) {
  const variantClass =
    variant === "primary" ? "glass-panel--primary" : "glass-panel--secondary";

  return (
    <div className={`glass-panel ${variantClass} ${className || ""}`}>
      <div className="glass-highlight" />
      <div className="glass-tint" />
      <div className="glass-content">{children}</div>
    </div>
  );
}

