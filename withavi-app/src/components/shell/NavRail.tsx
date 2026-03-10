"use client";

import React from "react";

const NAV_ITEMS = [
  { icon: "🏠", label: "Home" },
  { icon: "📦", label: "Projects" },
  { icon: "📚", label: "Vault" },
  { icon: "📝", label: "Logs" },
  { icon: "🚀", label: "Deployments" },
  { icon: "🔌", label: "APIs" },
  { icon: "⚙️", label: "Settings" },
];

export function NavRail() {
  return (
    <nav
      style={{
        width: 72,
        flexShrink: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 16,
        paddingTop: 8,
      }}
    >
      {NAV_ITEMS.map((item) => (
        <button
          key={item.label}
          aria-label={item.label}
          style={{
            width: 48,
            height: 48,
            borderRadius: 999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "#e5e7eb",
            background: "rgba(15,23,42,0.7)",
            border: "1px solid rgba(15,23,42,0.9)",
          }}
        >
          <span>{item.icon}</span>
        </button>
      ))}
    </nav>
  );
}

