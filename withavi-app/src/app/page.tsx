import { AppShell } from "../components/shell/AppShell";
import { GlassPanel } from "../components/glass/GlassPanel";
import { CommandSurfaceStub } from "../components/command/CommandSurfaceStub";
import { ExecutionTimelineStub } from "../components/timeline/ExecutionTimelineStub";

export default function Home() {
  return (
    <AppShell>
      <GlassPanel variant="primary">
        <CommandSurfaceStub />
      </GlassPanel>

      <GlassPanel variant="primary">
        <ExecutionTimelineStub />
      </GlassPanel>
    </AppShell>
  );
}

