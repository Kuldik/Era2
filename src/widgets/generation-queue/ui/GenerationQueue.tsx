import type { GenerationTask } from "@/entities/generation-task";
import {
  CreateTaskModal,
  EmptyState,
  ErrorState,
  LoadingStage,
  QueueStats,
  QueueToolBar,
  TaskCard,
  TaskRow,
  useQueue,
} from "@/features/generation-queue";
import { useState } from "react";

export function GenerationQueue() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    state,
    visibleTasks,
    stats,
    actions: {
      cancelTask,
      retryTask,
      deleteTask,
      clearCompleted,
      resetSimulation,
      createTask,
      setFilter,
      setTypeFilter,
      setSortMode,
      setSearch,
    },
  } = useQueue();

  const queuePositions = getQueuePositions(state.tasks);

  const handleResetSimulation = () => {
    if (!window.confirm("Перезапустить симуляцию и сбросить текущую очередь?")) {
      return;
    }

    resetSimulation();
  };

  return (
    <main
      id="generation-queue"
      className="min-h-screen bg-era-bg px-4 py-6 text-era-fg sm:px-6 lg:px-10 lg:py-9"
    >
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-5 rounded-4xl border border-era-line bg-era-bg-1 p-5 shadow-2xl shadow-black/30 sm:p-7 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="model-text mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-era-accent">
              ERA2
            </p>
            <h1 className="text-4xl font-semibold tracking-[-0.045em] text-era-fg sm:text-5xl lg:text-6xl">
              Очередь генераций
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-era-fg-muted sm:text-base">
              Следите за задачами, управляйте очередью и забирайте готовые
              результаты в одном тёмном рабочем пространстве.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="rounded-full bg-era-accent px-5 py-3 text-sm font-semibold text-white shadow-[0_0_30px_rgba(232,84,32,0.38)] transition hover:bg-era-accent-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-era-accent"
            >
              Создать задачу
            </button>
            <button
              type="button"
              onClick={handleResetSimulation}
              className="rounded-full border border-era-line bg-era-bg-2 px-5 py-3 text-sm font-semibold text-era-fg-dim transition hover:border-era-accent/50 hover:text-era-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-era-accent"
            >
              Перезапустить симуляцию
            </button>
            <button
              type="button"
              onClick={clearCompleted}
              disabled={stats.done === 0}
              className="rounded-full border border-era-accent/30 bg-era-accent-soft px-5 py-3 text-sm font-semibold text-era-accent-2 transition hover:border-era-accent/60 hover:text-era-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-era-accent disabled:cursor-not-allowed disabled:border-era-line disabled:bg-era-bg-3 disabled:text-era-fg-low"
            >
              Очистить готовые
            </button>
          </div>
        </header>

        {state.isLoading ? (
          <LoadingStage />
        ) : state.loadError !== null ? (
          <ErrorState message={state.loadError} />
        ) : (
          <>
            <QueueStats stats={stats} />
            <QueueToolBar
              filter={state.filter}
              typeFilter={state.typeFilter}
              sortMode={state.sortMode}
              search={state.search}
              onFilterChange={setFilter}
              onTypeFilterChange={setTypeFilter}
              onSortModeChange={setSortMode}
              onSearchChange={setSearch}
            />

            {visibleTasks.length === 0 ? (
              <EmptyState />
            ) : (
              <section className="space-y-3">
                {visibleTasks.map((task) => (
                  <div key={task.id}>
                    <TaskRow
                      task={task}
                      queuePosition={queuePositions.get(task.id)}
                      onCancel={cancelTask}
                      onRetry={retryTask}
                      onDelete={deleteTask}
                      onDownload={handleDownload}
                    />
                    <TaskCard
                      task={task}
                      queuePosition={queuePositions.get(task.id)}
                      onCancel={cancelTask}
                      onRetry={retryTask}
                      onDelete={deleteTask}
                      onDownload={handleDownload}
                    />
                  </div>
                ))}
              </section>
            )}
          </>
        )}
      </div>
      <CreateTaskModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateTask={createTask}
      />
    </main>
  );
}

const getQueuePositions = (tasks: GenerationTask[]) => {
  const positions = new Map<string, number>();

  tasks
    .filter((task) => task.status === "queued")
    .sort((a, b) => a.createdAt - b.createdAt)
    .forEach((task, index) => {
      positions.set(task.id, index + 1);
    });

  return positions;
};

const handleDownload = (task: GenerationTask) => {
  window.alert(`Скачивание результата: ${task.model}`);
};
