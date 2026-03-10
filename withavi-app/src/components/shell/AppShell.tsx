"use client";

import React from "react";
import { TopStatusBar } from "./TopStatusBar";
import { NavRail } from "./NavRail";
import { RightContextPanel } from "./RightContextPanel";
import { BottomStrip } from "./BottomStrip";

export interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <TopStatusBar />

      <div className="app-shell-main">
        <NavRail />

        <div className="app-shell-workspace">{children}</div>

        <RightContextPanel />
      </div>

      <BottomStrip />
    </div>
  );
}

