import type { Dispatch } from "react";
import type { GenType, GenerationTask } from "@/entities/generation-task";

import {
  MAX_CONCURRENT,
  type QueueAction,
  type QueueState,
} from "./queueReducer";

const TICK_MS = 520;
const FAILURE_CHANCE = 0.15;

const FAILURE_MESSAGES = [
  "Недостаточно кредитов",
  "Превышено время ожидания",
  "Модель временно недоступна",
] as const;

type QueueEngineOptions = {
  getState: () => QueueState;
  dispatch: Dispatch<QueueAction>;
};

export const createQueueEngine = ({
  getState,
  dispatch,
}: QueueEngineOptions) => {
  let intervalId: number | null = null;
  const failedOnce = new Set<string>();

  const start = () => {
    if (intervalId !== null) {
      return;
    }

    intervalId = window.setInterval(() => {
      const state = getState();

      if (state.isLoading || state.loadError) {
        return;
      }

      promoteQueuedIfNeeded(state, dispatch);
      tickRunningTasks(state.tasks, dispatch, failedOnce);
    }, TICK_MS);
  };

  const stop = () => {
    if (intervalId === null) {
      return;
    }

    window.clearInterval(intervalId);
    intervalId = null;
  };

  return {
    start,
    stop,
  };
};

const promoteQueuedIfNeeded = (
  state: QueueState,
  dispatch: Dispatch<QueueAction>,
) => {
  const runningCount = state.tasks.filter(
    (task) => task.status === "running",
  ).length;
  const freeSlots = Math.max(0, MAX_CONCURRENT - runningCount);

  if (freeSlots === 0) {
    return;
  }

  const ids = [...state.tasks]
    .filter((task) => task.status === "queued")
    .sort((a, b) => a.createdAt - b.createdAt)
    .slice(0, freeSlots)
    .map((task) => task.id);

  if (ids.length > 0) {
    dispatch({ type: "promoteQueued", payload: { ids } });
  }
};

const tickRunningTasks = (
  tasks: GenerationTask[],
  dispatch: Dispatch<QueueAction>,
  failedOnce: Set<string>,
) => {
  const runningTasks = tasks.filter((task) => task.status === "running");

  for (const task of runningTasks) {
    if (shouldFail(task, failedOnce)) {
      failedOnce.add(task.id);
      dispatch({
        type: "failTask",
        payload: {
          id: task.id,
          error: randomFailureMessage(),
        },
      });
      continue;
    }

    const progressDelta = getProgressDelta(task.type);
    const nextProgress = task.progress + progressDelta;

    if (nextProgress >= 100) {
      dispatch({ type: "completeTask", payload: { id: task.id } });
      continue;
    }

    dispatch({
      type: "tickProgress",
      payload: {
        id: task.id,
        progressDelta,
        etaDelta: Math.ceil(TICK_MS / 1000),
      },
    });
  }
};

const shouldFail = (task: GenerationTask, failedOnce: Set<string>) => {
  if (failedOnce.has(task.id)) {
    return false;
  }

  if (task.progress < 12 || task.progress > 88) {
    return false;
  }

  return Math.random() < FAILURE_CHANCE / 12;
};

const getProgressDelta = (type: GenType) => {
  const [min, max] = getSpeedRange(type);
  return randomInt(min, max);
};

const getSpeedRange = (type: GenType): [number, number] => {
  switch (type) {
    case "text":
      return [8, 16];
    case "image":
      return [5, 11];
    case "video":
      return [2, 5];
    case "audio":
      return [3, 7];
  }
};

const randomFailureMessage = () =>
  FAILURE_MESSAGES[randomInt(0, FAILURE_MESSAGES.length - 1)];

const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;
