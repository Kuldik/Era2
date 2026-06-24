import { Activity } from "lucide-react";
import { useQueue } from "../model/useQueue";

export const GlobalGenerationStatus = () => {
  const { activeTasks, averageActiveProgress } = useQueue();

  if (activeTasks.length === 0) {
    return null;
  }

  const firstTask = activeTasks[0];
  const isSingle = activeTasks.length === 1;

  const openQueue = () => {
    if (window.location.pathname !== "/queue") {
      window.history.pushState(null, "", "/queue");
      window.dispatchEvent(new PopStateEvent("popstate"));
    }

    document
      .getElementById("generation-queue")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <button
      type="button"
      aria-label="Открыть очередь генераций"
      className="fixed bottom-0 left-0 z-50 w-full border-t border-era-line bg-era-bg-1/95 p-4 text-left shadow-2xl backdrop-blur transition-all md:bottom-6 md:left-auto md:right-6 md:w-[360px] md:rounded-3xl md:border"
      onClick={openQueue}
    >
      {isSingle ? (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-era-accent-soft text-era-accent-2">
              <Activity className="size-4 animate-pulse" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-era-fg">
                {firstTask.model}
              </p>
              <p className="text-xs text-era-fg-muted">
                {firstTask.type} · {firstTask.progress}%
              </p>
            </div>
          </div>
          <div className="h-1.5 overflow-hidden rounded-full bg-era-bg-3">
            <div
              className="h-full rounded-full bg-era-accent transition-all duration-500"
              style={{ width: `${averageActiveProgress}%` }}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-semibold text-era-fg">
                Генерации идут · {activeTasks.length} активны ·{" "}
                {averageActiveProgress}%
              </p>
              <p className="text-xs text-era-fg-muted">
                Открыть очередь →
              </p>
            </div>
            <Activity className="size-5 animate-pulse text-era-accent-2" />
          </div>
          <div className="space-y-2">
            {activeTasks.slice(0, 3).map((task) => (
              <div className="space-y-1" key={task.id}>
                <div className="flex justify-between gap-3 text-xs">
                  <span className="truncate text-era-fg-dim">
                    {task.model}
                  </span>
                  <span className="font-mono text-era-accent-2">
                    {task.progress}%
                  </span>
                </div>
                <div className="h-1 overflow-hidden rounded-full bg-era-bg-3">
                  <div
                    className="h-full rounded-full bg-era-accent transition-all duration-500"
                    style={{ width: `${task.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </button>
  );
};
