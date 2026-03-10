"use client";

import React from "react";
import "./glass.css";

type GlassButtonVariant = "primary" | "secondary" | "ghost" | "danger";

export interface GlassButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: GlassButtonVariant;
}

export function GlassButton({
  children,
  className,
  variant = "primary",
  ...props
}: GlassButtonProps) {
  const variantClass = `glass-button--${variant}`;

  return (
    <button
      className={`glass-button ${variantClass} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}

