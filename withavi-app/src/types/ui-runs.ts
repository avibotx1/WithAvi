export type RunStatus = "idle" | "running" | "succeeded" | "failed" | "cancelled";

export type NodeStatus = "pending" | "running" | "succeeded" | "failed" | "skipped";

export type NodeLogLevel = "info" | "warning" | "error";

export interface NodeLogEntry {
  id: string;
  timestamp: string; // ISO string; can be formatted for display later
  level: NodeLogLevel;
  message: string;
}

export interface NodeState {
  id: string;
  name: string; // e.g. "Brand generation"
  status: NodeStatus;
  dependencies?: string[];
  startedAt?: string;
  finishedAt?: string;
  durationMs?: number;
  lastError?: string;
  logs: NodeLogEntry[];
}

export type ArtifactType = "brand" | "ui" | "mockup" | "build" | "deploy";

export interface Artifact {
  id: string;
  name: string;
  type: ArtifactType;
  createdAt: string;
  nodeId: string;
}

export interface RunState {
  id: string;
  label: string; // e.g. "Landing page v1"
  createdAt: string;
  projectId: string;
  capabilities: string[];
  status: RunStatus;
  currentStepIndex: number | null; // index in nodes[] or null
  nodes: NodeState[];
  artifacts: Artifact[];
  completedSteps: number;
  failedSteps: number;
  runningSteps: number;
  totalDurationMs?: number;
  lastUpdatedAt?: string;
}

