# WithAvi Architecture

## Product Overview

WithAvi is a **control-plane UI** for composing, running, and inspecting “missions” (multi-step build workflows). The interface is designed to feel like an operational console: you define intent, see the plan, run it, observe progress, inspect logs, and open produced artifacts.

Conceptually, WithAvi is split into two planes:

- **Control Plane (this repo today)**: Defines missions/runs/steps, renders state, and provides the UX for monitoring and intervention (select node, retry, cancel, view artifacts, view telemetry).
- **Execution Plane (simulated today)**: Executes steps, emits step events (status changes, logs, artifacts), and computes/streams runtime telemetry. In the current codebase, this is implemented as a client-side simulator.

The key idea is that the UI is built against stable **runtime contracts** (`RunState`, `NodeState`, `Artifact`) that can later be driven by a real backend/orchestrator.

## UI Surfaces

### CommandSurface
**File**: `src/components/command/CommandSurface.tsx`  
Mission composer used to start a run.

- **Inputs**: mission prompt (textarea), capability toggles.
- **Plan preview**: shows “Execution Plan” derived from selected capabilities.
- **Action**: “Run Mission” calls `onCreateRun({ label, projectId, capabilities })`.

### RunList
**File**: `src/components/timeline/RunList.tsx`  
Horizontal list of run “pills” to switch the active run.

- **Action**: clicking a run selects it (`onSelectRun(run.id)`).

### ExecutionTimeline
**File**: `src/components/timeline/ExecutionTimeline.tsx`  
List view of step execution for the active run.

- Shows **node name**, **status**, and **duration** (live while running; final when finished).
- Clicking a node selects it (`onSelectNode(node.id)`), updating the right-side inspector.

### ExecutionGraph
**File**: `src/components/timeline/ExecutionGraph.tsx`  
Simple column-based graph view to visualize dependencies and parallelism.

- Columns correspond to the default workflow: Brand → UI → (Mockups + Build) → Deploy.
- Nodes render as cards with status badges.
- Clicking a node selects it.

### RightContextPanel
**File**: `src/components/shell/RightContextPanel.tsx`  
Inspector panel for run telemetry, selected node details, logs, and artifacts.

- **RunSummary** at the top (per-run telemetry).
- **Node Details** for the selected node (status, error, last logs).
- **Active Artifacts** list (clicking selects an artifact).

### ArtifactViewer
**File**: `src/components/artifacts/ArtifactViewer.tsx`  
Modal overlay showing artifact details and a type-specific preview placeholder.

- Opens when an artifact is selected from the RightContextPanel.
- Displays metadata and a preview block for `brand`, `ui`, `mockup`, `build`, `deploy`.

### RunHistoryStrip
**File**: `src/components/timeline/RunHistoryStrip.tsx`  
Bottom strip showing recent runs grouped by day (“Today”, “Yesterday”, etc.).

- Supports quick navigation across runs and sessions.

### SystemStatusBar
**File**: `src/components/system/SystemStatusBar.tsx`  
Global system telemetry bar shown under the top bar.

- Indicates **System state**: Idle / Running / Warning.
- Shows **active run count**, **failed run count**, **avg runtime**, and **last run time**.

### RunSummary
**File**: `src/components/system/RunSummary.tsx`  
Per-run telemetry panel shown at the top of the RightContextPanel.

- Steps completed, steps failed, runtime, capabilities used.

## Runtime Model

Runtime contracts live in `src/types/ui-runs.ts` and are produced/updated by the orchestrator hook.

### RunState
Represents one mission execution.

- **Identity/config**: `id`, `label`, `projectId`, `createdAt`, `capabilities`
- **Lifecycle**: `status: "idle" | "running" | "succeeded" | "failed" | "cancelled"`
- **Graph**: `nodes: NodeState[]`
- **Outputs**: `artifacts: Artifact[]`
- **Telemetry**:
  - `completedSteps`, `failedSteps`, `runningSteps`
  - `totalDurationMs?` (computed)

### NodeState
Represents a single step in the workflow.

- **Identity**: `id`, `name`
- **Lifecycle**: `status: "pending" | "running" | "succeeded" | "failed" | "skipped"`
- **Dependencies**: `dependencies?: string[]` (node IDs that must succeed before this can start)
- **Timing**: `startedAt?`, `finishedAt?`, `durationMs?`
- **Failure**: `lastError?`
- **Logs**: `logs: NodeLogEntry[]`

### Artifact
Represents a run output produced by a node.

- `id`, `name`, `type`, `createdAt`, `nodeId`
- Created when a node succeeds (simulated today).

### Node logs
Each node has its own log list (`NodeLogEntry[]`).

- Start/finish logs are appended during simulation.
- Failures append an `"error"` log entry.
- Cancellation appends a `"warning"` log entry to running nodes that are skipped.

### Dependency execution
Execution is dependency-driven (not index-driven).

- Any node with `status === "pending"` can start **as soon as** all of its dependencies are `succeeded`.
- Nodes run concurrently when they become eligible at the same time.

### Parallel nodes
The default plan encodes a simple parallel stage:

- `mockups` and `build` both depend on `ui`, so they can be **running simultaneously**.
- `deploy` depends on `build`, so it starts after build succeeds.

### Failure + retry

- **Failure**: while running, nodes have a small randomized failure chance. On failure:
  - node becomes `failed`, `lastError` is set, and an error log entry is appended.
  - run becomes `failed`, and no new nodes will start.
- **Retry**: “Retry failed” resets failed nodes to `pending`, clears `lastError`, and restarts scheduling. Dependency rules ensure only eligible nodes start.

## Execution Flow

1. **User configures a mission** in `CommandSurface` (prompt + capabilities).
2. **User clicks “Run Mission”**:
   - `CommandSurface` calls `onCreateRun({ label, projectId, capabilities })`.
3. **Orchestrator creates a run** (`useRunOrchestrator.createRun`):
   - Creates `RunState` with dependency-annotated `NodeState[]`.
   - Adds it to `runs`, sets it active, and starts execution.
4. **Execution simulator runs** (`scheduleStep` loop):
   - Resolves all currently running nodes (succeed or fail).
   - Starts any pending nodes whose dependencies are satisfied.
   - Appends logs and generates artifacts on success.
   - Recomputes run telemetry (step counts and total runtime).
5. **UI updates**:
   - Timeline/Graph reflects statuses and parallel running nodes.
   - RightContextPanel shows selected node logs and artifacts.
   - ArtifactViewer opens when an artifact is selected.
6. **Run completes**:
   - `succeeded` when all nodes finish successfully.
   - `failed` when any node fails.
   - `cancelled` if user cancels.

## Project Structure

Current `src/` tree:

```text
src
 ├ app
 │  ├ favicon.ico
 │  ├ globals.css
 │  ├ layout.tsx
 │  └ page.tsx
 ├ components
 │  ├ artifacts
 │  │  └ ArtifactViewer.tsx
 │  ├ command
 │  │  ├ CommandSurface.tsx
 │  │  └ CommandSurfaceStub.tsx
 │  ├ glass
 │  │  ├ GlassButton.tsx
 │  │  ├ GlassPanel.tsx
 │  │  └ glass.css
 │  ├ shell
 │  │  ├ AppShell.tsx
 │  │  ├ BottomStrip.tsx
 │  │  ├ NavRail.tsx
 │  │  ├ RightContextPanel.tsx
 │  │  └ TopStatusBar.tsx
 │  ├ system
 │  │  ├ RunSummary.tsx
 │  │  └ SystemStatusBar.tsx
 │  └ timeline
 │     ├ ExecutionGraph.tsx
 │     ├ ExecutionTimeline.tsx
 │     ├ ExecutionTimelineStub.tsx
 │     ├ RunControls.tsx
 │     ├ RunHistoryStrip.tsx
 │     └ RunList.tsx
 ├ hooks
 │  └ useRunOrchestrator.ts
 └ types
    └ ui-runs.ts
```

## Core Files

### useRunOrchestrator.ts
**File**: `src/hooks/useRunOrchestrator.ts`

- Owns the in-memory run store: `runs`, `activeRunId`, `activeRun`.
- Exposes user actions: `createRun`, `cancelRun`, `retryFailedNodes`, `rerun`.
- Implements the execution simulator:
  - dependency-driven scheduling
  - parallel execution
  - randomized failure
  - log and artifact generation
  - telemetry computation

### ui-runs.ts
**File**: `src/types/ui-runs.ts`

- Defines the UI runtime contracts:
  - `RunState`, `NodeState`, `Artifact`, log types, status enums.
- Acts as a stable interface that a real backend can later satisfy.

### CommandSurface.tsx
**File**: `src/components/command/CommandSurface.tsx`

- Mission composer UI (prompt + capability selection).
- Displays a plan preview (“Execution Plan”).
- Starts runs via `onCreateRun(...)`.

### ExecutionTimeline.tsx
**File**: `src/components/timeline/ExecutionTimeline.tsx`

- Renders nodes as a list with status + duration.
- Supports selecting a node to inspect logs/details.

### RightContextPanel.tsx
**File**: `src/components/shell/RightContextPanel.tsx`

- Shows RunSummary, selected node details/logs, and artifacts list.
- Publishes artifact selection events (`onSelectArtifact`).

### ArtifactViewer.tsx
**File**: `src/components/artifacts/ArtifactViewer.tsx`

- Modal view for artifact inspection.
- Renders type-specific preview placeholders and metadata.

### SystemStatusBar.tsx
**File**: `src/components/system/SystemStatusBar.tsx`

- Global system health + telemetry derived from `runs`.
- Computes avg runtime over completed runs (where `totalDurationMs` exists).

## UI ↔ Orchestrator Wiring

**File**: `src/app/page.tsx`

`page.tsx` is the composition root:

- Calls `useRunOrchestrator()` to obtain state and actions.
- Wires state/actions into UI surfaces:
  - `CommandSurface` → `onCreateRun={createRun}`
  - `RunList` / `RunHistoryStrip` → `runs`, `activeRunId`, `onSelectRun={setActiveRunId}`
  - `ExecutionTimeline` / `ExecutionGraph` → `run={activeRun}`, `selectedNodeId`, `onSelectNode`
  - `RightContextPanel` → `activeRun`, `selectedNodeId`, `onSelectArtifact`
  - `SystemStatusBar` (via `AppShell`) → `runs`

Selection state (node/artifact) is kept at the page level so it can drive multiple panels.

## Simulation vs Real Backend

### Simulated today (client-side)

- Execution timing and progression (tick-based scheduler)
- Dependency scheduling + parallel node starts
- Random failures
- Node logs
- Artifact creation
- Run + node telemetry (durations and aggregates)

### Would be replaced by a real backend

- Persisted run storage and querying
- Real orchestrator/workers executing tasks
- Streaming events (SSE/WebSocket): node status/log/artifact updates
- Durable artifact storage (and retrieval/download)
- Auth, multi-project selection, and permissions
- Long-lived telemetry and aggregation (beyond current session)

