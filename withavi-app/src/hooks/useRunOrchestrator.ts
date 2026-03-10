"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type {
  RunState,
  RunStatus,
  NodeState,
  NodeLogEntry,
  Artifact,
} from "@/types/ui-runs";

const STEP_DELAY_MS = 1800;
const FAILURE_CHANCE = 0.2;

function createDemoRun(): RunState {
  const now = new Date().toISOString();

  const nodes: NodeState[] = [
    {
      id: "brand",
      name: "Brand generation",
      status: "pending",
      dependencies: [],
      logs: [],
    },
    {
      id: "ui",
      name: "UI design",
      status: "pending",
      dependencies: ["brand"],
      logs: [],
    },
    {
      id: "mockups",
      name: "Mockups",
      status: "pending",
      dependencies: ["ui"],
      logs: [],
    },
    {
      id: "build",
      name: "Build site",
      status: "pending",
      dependencies: ["ui"],
      logs: [],
    },
    {
      id: "deploy",
      name: "Deploy",
      status: "pending",
      dependencies: ["build"],
      logs: [],
    },
  ];

  return {
    id: "run-demo-1",
    label: "SAWFTLAUNCH landing page",
    createdAt: now,
    projectId: "sawftlaunch",
    capabilities: ["generate_ui", "mockups", "build", "deploy"],
    status: "idle",
    currentStepIndex: null,
    artifacts: [],
    nodes,
    completedSteps: 0,
    failedSteps: 0,
    runningSteps: 0,
    lastUpdatedAt: now,
  };
}

export interface UseRunOrchestratorResult {
  runs: RunState[];
  activeRunId: string | null;
  activeRun: RunState | null;
  setActiveRunId: (id: string | null) => void;
  createRun: (input: {
    label: string;
    projectId: string;
    capabilities: string[];
  }) => void;
  cancelRun: (runId: string) => void;
  retryFailedNodes: (runId: string) => void;
  rerun: (runId: string) => void;
}

export function useRunOrchestrator(): UseRunOrchestratorResult {
  const [runs, setRuns] = useState<RunState[]>(() => [createDemoRun()]);
  const [activeRunId, setActiveRunId] = useState<string | null>("run-demo-1");

  // Track timers per run so we can cancel progression when needed.
  const timersRef = useRef<Record<string, number | undefined>>({});

  const clearRunTimer = (runId: string) => {
    const timeoutId = timersRef.current[runId];
    if (timeoutId !== undefined) {
      clearTimeout(timeoutId);
      timersRef.current[runId] = undefined;
    }
  };

  const appendLog = (
    node: NodeState,
    runId: string,
    message: string,
  ): NodeLogEntry[] => {
    const now = new Date().toISOString();
    const entry: NodeLogEntry = {
      id: `${runId}-${node.id}-${now}`,
      timestamp: now,
      level: "info",
      message,
    };
    return [...node.logs, entry];
  };

  const scheduleStep = (runId: string) => {
    const timeoutId = window.setTimeout(() => {
      let shouldScheduleNext = false;

      setRuns((prev) =>
        prev.map((run) => {
          if (run.id !== runId) return run;
          if (run.status !== "running") return run; // cancelled or finished

          const now = new Date().toISOString();

          let nodes = [...run.nodes];
          let artifacts = run.artifacts;
          let runStatus: RunStatus = run.status;

          // First, resolve running nodes (complete or fail)
          nodes = nodes.map((node) => {
            if (node.status !== "running") return node;

            // Random failure simulation
            if (Math.random() < FAILURE_CHANCE) {
              const errorMessage = "Step failed due to agent error";
              runStatus = "failed";
              return {
                ...node,
                status: "failed",
                finishedAt: now,
                durationMs:
                  node.startedAt
                    ? new Date(now).getTime() - new Date(node.startedAt).getTime()
                    : undefined,
                lastError: errorMessage,
                logs: [
                  ...node.logs,
                  {
                    id: `${run.id}-${node.id}-fail-${now}`,
                    timestamp: now,
                    level: "error",
                    message: errorMessage,
                  },
                ],
              };
            }

            const updatedNode = {
              ...node,
              status: "succeeded",
              finishedAt: now,
              durationMs:
                node.startedAt
                  ? new Date(now).getTime() - new Date(node.startedAt).getTime()
                  : undefined,
              logs: appendLog(node, run.id, `Completed ${node.name} step`),
            };

            // Generate artifact for this node.
            const artifact: Artifact | null = (() => {
              switch (node.id) {
                case "brand":
                  return {
                    id: `${run.id}-art-brand-${now}`,
                    name: "Brand spec v1",
                    type: "brand",
                    createdAt: now,
                    nodeId: node.id,
                  };
                case "ui":
                  return {
                    id: `${run.id}-art-ui-${now}`,
                    name: "UI layout v1",
                    type: "ui",
                    createdAt: now,
                    nodeId: node.id,
                  };
                case "mockups":
                  return {
                    id: `${run.id}-art-mockup-${now}`,
                    name: "Landing mockup v1",
                    type: "mockup",
                    createdAt: now,
                    nodeId: node.id,
                  };
                case "build":
                  return {
                    id: `${run.id}-art-build-${now}`,
                    name: "Build bundle",
                    type: "build",
                    createdAt: now,
                    nodeId: node.id,
                  };
                case "deploy":
                  return {
                    id: `${run.id}-art-deploy-${now}`,
                    name: "Deployment result",
                    type: "deploy",
                    createdAt: now,
                    nodeId: node.id,
                  };
                default:
                  return null;
              }
            })();

            if (artifact) {
              artifacts = [...artifacts, artifact];
            }

            return updatedNode;
          });

          // Then, start any pending nodes whose dependencies are satisfied
          if (runStatus === "running") {
            nodes = nodes.map((node) => {
              if (node.status !== "pending") return node;
              const deps = node.dependencies ?? [];
              const depsSatisfied = deps.every((depId) => {
                const depNode = nodes.find((n) => n.id === depId);
                return depNode && depNode.status === "succeeded";
              });

              if (!depsSatisfied) return node;

              return {
                ...node,
                status: "running",
                startedAt: node.startedAt ?? now,
                logs: appendLog(node, run.id, `Started ${node.name} step`),
              };
            });
          }

          const hasActiveNodes = nodes.some(
            (n) => n.status === "pending" || n.status === "running",
          );

          if (!hasActiveNodes && runStatus === "running") {
            runStatus = "succeeded";
          }

          shouldScheduleNext = hasActiveNodes && runStatus === "running";

          const completedSteps = nodes.filter((n) => n.status === "succeeded")
            .length;
          const failedSteps = nodes.filter((n) => n.status === "failed").length;
          const runningSteps = nodes.filter((n) => n.status === "running")
            .length;

          const startedTimes = nodes
            .map((n) => (n.startedAt ? new Date(n.startedAt).getTime() : null))
            .filter((t): t is number => t !== null);
          const finishedTimes = nodes
            .map((n) => (n.finishedAt ? new Date(n.finishedAt).getTime() : null))
            .filter((t): t is number => t !== null);

          const minStarted = startedTimes.length
            ? Math.min(...startedTimes)
            : null;
          const maxFinishedOrNow =
            finishedTimes.length || runningSteps > 0
              ? Math.max(
                  ...(finishedTimes.length ? finishedTimes : []),
                  ...(runningSteps > 0 ? [new Date(now).getTime()] : []),
                )
              : null;

          const totalDurationMs =
            minStarted !== null && maxFinishedOrNow !== null
              ? Math.max(0, maxFinishedOrNow - minStarted)
              : undefined;

          return {
            ...run,
            nodes,
            artifacts,
            status: runStatus,
            currentStepIndex: null,
            completedSteps,
            failedSteps,
            runningSteps,
            totalDurationMs,
            lastUpdatedAt: now,
          };
        }),
      );

      if (shouldScheduleNext) {
        scheduleStep(runId);
      }
    }, STEP_DELAY_MS);

    timersRef.current[runId] = timeoutId;
  };

  const startRun = (runId: string) => {
    clearRunTimer(runId);
    const now = new Date().toISOString();

    setRuns((prev) =>
      prev.map((run) =>
        run.id === runId
          ? {
              ...run,
              status: "running" as RunStatus,
              currentStepIndex: null,
              lastUpdatedAt: now,
            }
          : run,
      ),
    );

    scheduleStep(runId);
  };

  const activeRun = useMemo(
    () => runs.find((run) => run.id === activeRunId) ?? null,
    [runs, activeRunId],
  );

  const createRun: UseRunOrchestratorResult["createRun"] = ({
    label,
    projectId,
    capabilities,
  }) => {
    const now = new Date().toISOString();

    const nodes: NodeState[] = [
      {
        id: "brand",
        name: "Brand generation",
        status: "pending",
        dependencies: [],
        logs: [],
      },
      {
        id: "ui",
        name: "UI design",
        status: "pending",
        dependencies: ["brand"],
        logs: [],
      },
      ...(capabilities.includes("mockups")
        ? [
            {
              id: "mockups",
              name: "Mockups",
              status: "pending",
              dependencies: ["ui"],
              logs: [],
            },
          ]
        : []),
      ...(capabilities.includes("build")
        ? [
            {
              id: "build",
              name: "Build site",
              status: "pending",
              dependencies: ["ui"],
              logs: [],
            },
          ]
        : []),
      ...(capabilities.includes("deploy")
        ? [
            {
              id: "deploy",
              name: "Deploy",
              status: "pending",
              dependencies: ["build"],
              logs: [],
            },
          ]
        : []),
    ];

    const newRun: RunState = {
      id: `run-${Date.now()}`,
      label,
      createdAt: now,
      projectId,
      capabilities,
      status: "idle" as RunStatus,
      currentStepIndex: null,
      artifacts: [],
      nodes,
      completedSteps: 0,
      failedSteps: 0,
      runningSteps: 0,
      lastUpdatedAt: now,
    };

    setRuns((prev) => [newRun, ...prev]);
    setActiveRunId(newRun.id);
    startRun(newRun.id);
  };

  const cancelRun = (runId: string) => {
    clearRunTimer(runId);

    setRuns((prev) =>
      prev.map((run) =>
        run.id === runId && (run.status === "running" || run.status === "idle")
          ? (() => {
              const now = new Date().toISOString();
              const nodes = run.nodes.map((node) =>
                node.status === "running"
                  ? {
                      ...node,
                      status: "skipped",
                      logs: [
                        ...node.logs,
                        {
                          id: `${run.id}-${node.id}-cancel-${now}`,
                          timestamp: now,
                          level: "warning",
                          message: `Cancelled during ${node.name} step`,
                        },
                      ],
                    }
                  : node,
              );

              return {
                ...run,
                status: "cancelled" as RunStatus,
                nodes,
                lastUpdatedAt: now,
              };
            })()
          : run,
      ),
    );
  };

  const retryFailedNodes = (runId: string) => {
    const now = new Date().toISOString();

    setRuns((prev) =>
      prev.map((run) => {
        if (run.id !== runId) return run;

        const updatedNodes = run.nodes.map((node) => {
          if (node.status === "failed") {
            return {
              ...node,
              status: "pending",
              lastError: undefined,
            };
          }
          return node;
        });

        const hasFailures = run.nodes.some((node) => node.status === "failed");

        return hasFailures
          ? {
              ...run,
              nodes: updatedNodes,
              status: "idle" as RunStatus,
              currentStepIndex: null,
              lastUpdatedAt: now,
            }
          : run;
      }),
    );

    startRun(runId);
  };

  const rerun = (runId: string) => {
    const original = runs.find((run) => run.id === runId);
    if (!original) return;

    createRun({
      label: original.label,
      projectId: original.projectId,
      capabilities: original.capabilities,
    });
  };

  // Kick off the demo run on first mount.
  useEffect(() => {
    if (runs.length > 0 && runs[0].id === "run-demo-1") {
      startRun("run-demo-1");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    runs,
    activeRunId,
    activeRun,
    setActiveRunId,
    createRun,
    cancelRun,
    retryFailedNodes,
    rerun,
  };
}

