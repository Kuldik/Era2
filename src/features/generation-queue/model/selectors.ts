import type { GenerationTask, TaskStatus } from "@/entities/generation-task";

import type { QueueState } from "./queueReducer";

export type QueueStatsValue = Record<TaskStatus, number>;

export const selectQueueStats = (state: QueueState): QueueStatsValue => ({
  queued: state.tasks.filter((task) => task.status === "queued").length,
  running: state.tasks.filter((task) => task.status === "running").length,
  done: state.tasks.filter((task) => task.status === "done").length,
  failed: state.tasks.filter((task) => task.status === "failed").length,
  cancelled: state.tasks.filter((task) => task.status === "cancelled").length,
});

export const selectActiveTasks = (state: QueueState) =>
  state.tasks.filter(
    (task) => task.status === "queued" || task.status === "running",
  );

export const selectAverageActiveProgress = (state: QueueState) => {
  const activeTasks = selectActiveTasks(state);

  if (activeTasks.length === 0) {
    return 0;
  }

  const totalProgress = activeTasks.reduce(
    (sum, task) => sum + task.progress,
    0,
  );

  return Math.round(totalProgress / activeTasks.length);
};

export const selectVisibleTasks = (state: QueueState) => {
  const search = state.search.trim().toLocaleLowerCase("ru-RU");

  return state.tasks
    .filter((task) => matchesStatusFilter(task, state))
    .filter((task) => matchesTypeFilter(task, state))
    .filter((task) => matchesSearch(task, search))
    .sort((a, b) =>
      state.sortMode === "newest"
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt,
    );
};

const matchesStatusFilter = (task: GenerationTask, state: QueueState) =>
  state.filter === "all" || task.status === state.filter;

const matchesTypeFilter = (task: GenerationTask, state: QueueState) =>
  state.typeFilter === "all" || task.type === state.typeFilter;

const matchesSearch = (task: GenerationTask, search: string) => {
  if (search.length === 0) {
    return true;
  }

  return `${task.prompt} ${task.model}`.toLocaleLowerCase("ru-RU").includes(search);
};
