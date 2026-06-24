import type {
  GenerationTask,
  GenType,
  TaskStatus,
} from "@/entities/generation-task";

export const MAX_CONCURRENT = 2;

export type StatusFilter = "all" | TaskStatus;
export type TypeFilter = "all" | GenType;
export type SortMode = "newest" | "oldest";

export type CreateTaskInput = {
  type: GenType;
  model: string;
  prompt: string;
  credits: number;
};

export type QueueState = {
  tasks: GenerationTask[];
  isLoading: boolean;
  filter: StatusFilter;
  loadError: string | null;
  typeFilter: TypeFilter;
  sortMode: SortMode;
  search: string;
};

export type QueueAction =
  | { type: "loadStarted" }
  | { type: "loadCompleted"; tasks: GenerationTask[] }
  | { type: "loadFailed"; payload: string }
  | {
      type: "tickProgress";
      payload: { id: string; progressDelta: number; etaDelta: number };
    }
  | { type: "promoteQueued"; payload: { ids: string[] } }
  | { type: "completeTask"; payload: { id: string; resultUrl?: string } }
  | { type: "failTask"; payload: { id: string; error: string } }
  | { type: "cancelTask"; payload: { id: string } }
  | { type: "retryTask"; payload: { id: string } }
  | { type: "deleteTask"; payload: { id: string } }
  | { type: "clearCompleted" }
  | { type: "resetSimulation"; tasks: GenerationTask[] }
  | { type: "createTask"; payload: CreateTaskInput }
  | { type: "setFilter"; payload: StatusFilter }
  | { type: "setTypeFilter"; payload: TypeFilter }
  | { type: "setSortMode"; payload: SortMode }
  | { type: "setSearch"; payload: string };

export const initialQueueState: QueueState = {
  tasks: [],
  isLoading: false,
  loadError: null,
  filter: "all",
  typeFilter: "all",
  sortMode: "newest",
  search: "",
};

const now = () => Date.now();

const canCancel = (status: TaskStatus) =>
  status === "queued" || status === "running";

const canRetry = (status: TaskStatus) =>
  status === "failed" || status === "cancelled";

const countRunning = (tasks: GenerationTask[]) =>
  tasks.filter((task) => task.status === "running").length;

const clampProgress = (progress: number) =>
  Math.min(100, Math.max(0, Math.round(progress)));

const sortQueuedFifo = (tasks: GenerationTask[]) =>
  [...tasks]
    .filter((task) => task.status === "queued")
    .sort((a, b) => a.createdAt - b.createdAt);

const promoteNextQueued = (tasks: GenerationTask[]): GenerationTask[] => {
  const freeSlots = Math.max(0, MAX_CONCURRENT - countRunning(tasks));

  if (freeSlots === 0) {
    return tasks;
  }

  const idsToPromote = new Set(
    sortQueuedFifo(tasks)
      .slice(0, freeSlots)
      .map((task) => task.id),
  );

  if (idsToPromote.size === 0) {
    return tasks;
  }

  return tasks.map<GenerationTask>((task) => {
    if (!idsToPromote.has(task.id)) {
      return task;
    }

    return {
      ...task,
      status: "running",
      updatedAt: now(),
    };
  });
};

const restoreRunningAsQueued = (tasks: GenerationTask[]): GenerationTask[] =>
  tasks.map<GenerationTask>((task) => {
    if (task.status !== "running") {
      return task;
    }

    return {
      ...task,
      status: "queued",
      updatedAt: now(),
    };
  });

export const queueReducer = (
  state: QueueState,
  action: QueueAction,
): QueueState => {
  switch (action.type) {
    case "loadStarted":
      return {
        ...state,
        isLoading: true,
        loadError: null,
      };

    case "loadCompleted":
      return {
        ...state,
        tasks: promoteNextQueued(restoreRunningAsQueued(action.tasks)),
        isLoading: false,
        loadError: null,
      };

    case "loadFailed":
      return {
        ...state,
        isLoading: false,
        loadError: action.payload,
      };

    case "tickProgress": {
      const tasks = state.tasks.map<GenerationTask>((task) => {
        if (task.id !== action.payload.id || task.status !== "running") {
          return task;
        }

        return {
          ...task,
          progress: clampProgress(task.progress + action.payload.progressDelta),
          etaSeconds: Math.max(0, task.etaSeconds - action.payload.etaDelta),
          updatedAt: now(),
        };
      });

      return {
        ...state,
        tasks,
      };
    }

    case "promoteQueued": {
      const allowedIds = new Set(action.payload.ids);
      const freeSlots = Math.max(0, MAX_CONCURRENT - countRunning(state.tasks));
      const idsToPromote = new Set(
        sortQueuedFifo(state.tasks)
          .filter((task) => allowedIds.has(task.id))
          .slice(0, freeSlots)
          .map((task) => task.id),
      );

      if (idsToPromote.size === 0) {
        return state;
      }

      return {
        ...state,
        tasks: state.tasks.map((task) =>
          idsToPromote.has(task.id)
            ? { ...task, status: "running", updatedAt: now() }
            : task,
        ),
      };
    }

    case "completeTask": {
      const tasks = state.tasks.map<GenerationTask>((task) => {
        if (task.id !== action.payload.id || task.status !== "running") {
          return task;
        }

        return {
          ...task,
          status: "done",
          progress: 100,
          etaSeconds: 0,
          updatedAt: now(),
          resultUrl: action.payload.resultUrl ?? "#",
        };
      });

      return {
        ...state,
        tasks: promoteNextQueued(tasks),
      };
    }

    case "failTask": {
      const tasks = state.tasks.map<GenerationTask>((task) => {
        if (task.id !== action.payload.id || task.status !== "running") {
          return task;
        }

        return {
          ...task,
          status: "failed",
          error: action.payload.error,
          etaSeconds: 0,
          updatedAt: now(),
        };
      });

      return {
        ...state,
        tasks: promoteNextQueued(tasks),
      };
    }

    case "cancelTask": {
      const tasks = state.tasks.map<GenerationTask>((task) => {
        if (task.id !== action.payload.id || !canCancel(task.status)) {
          return task;
        }

        return {
          ...task,
          status: "cancelled",
          etaSeconds: 0,
          updatedAt: now(),
        };
      });

      return {
        ...state,
        tasks: promoteNextQueued(tasks),
      };
    }

    case "retryTask": {
      const tasks = state.tasks.map<GenerationTask>((task) => {
        if (task.id !== action.payload.id || !canRetry(task.status)) {
          return task;
        }

        return {
          ...task,
          status: "queued",
          progress: 0,
          error: undefined,
          resultUrl: undefined,
          etaSeconds: getDefaultEta(task.type),
          updatedAt: now(),
        };
      });

      return {
        ...state,
        tasks: promoteNextQueued(tasks),
      };
    }

    case "deleteTask": {
      return {
        ...state,
        tasks: promoteNextQueued(
          state.tasks.filter((task) => task.id !== action.payload.id),
        ),
      };
    }

    case "clearCompleted": {
      return {
        ...state,
        tasks: state.tasks.filter((task) => task.status !== "done"),
      };
    }

    case "resetSimulation": {
      return {
        ...state,
        tasks: promoteNextQueued(restoreRunningAsQueued(action.tasks)),
        isLoading: false,
        loadError: null,
        filter: "all",
        typeFilter: "all",
        search: "",
        sortMode: "newest",
      };
    }

    case "createTask": {
      return {
        ...state,
        tasks: promoteNextQueued([...state.tasks, createQueuedTask(action.payload)]),
      };
    }

    case "setFilter": {
      return {
        ...state,
        filter: action.payload,
      };
    }

    case "setTypeFilter": {
      return {
        ...state,
        typeFilter: action.payload,
      };
    }

    case "setSortMode": {
      return {
        ...state,
        sortMode: action.payload,
      };
    }

    case "setSearch": {
      return {
        ...state,
        search: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

const getDefaultEta = (type: GenType) => {
  switch (type) {
    case "text":
      return 25;
    case "image":
      return 45;
    case "video":
      return 150;
    case "audio":
      return 90;
  }
};

const createQueuedTask = (input: CreateTaskInput): GenerationTask => {
  const createdAt = now();

  return {
    id: createTaskId(),
    type: input.type,
    model: input.model,
    prompt: input.prompt.trim(),
    status: "queued",
    progress: 0,
    createdAt,
    updatedAt: createdAt,
    credits: input.credits,
    etaSeconds: getDefaultEta(input.type),
  };
};

const createTaskId = () => {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `task-${now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};
