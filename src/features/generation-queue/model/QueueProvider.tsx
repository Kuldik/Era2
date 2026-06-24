import { cloneFreshSeed, type GenerationTask } from "@/entities/generation-task";
import {
  type PropsWithChildren,
  useEffect,
  useMemo,
  useReducer,
  useRef,
} from "react";

import { QueueContext } from "./QueueContext";
import { createQueueEngine } from "./queueEngine";
import { QUEUE_STORAGE_KEY } from "../lib/constants";
import {
  initialQueueState,
  queueReducer,
} from "./queueReducer";

const LOAD_DELAY_MS = 600;
const LOAD_FAILURE_CHANCE = 0.05;

export function QueueProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(queueReducer, initialQueueState);
  const stateRef = useRef(state);
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    dispatch({ type: "loadStarted" });

    const timeoutId = window.setTimeout(() => {
      if (Math.random() < LOAD_FAILURE_CHANCE) {
        dispatch({
          type: "loadFailed",
          payload: "Не удалось загрузить очередь генераций",
        });
        return;
      }

      hasLoadedRef.current = true;
      dispatch({ type: "loadCompleted", tasks: readStoredTasks() });
    }, LOAD_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    const engine = createQueueEngine({
      getState: () => stateRef.current,
      dispatch,
    });

    engine.start();

    return () => {
      engine.stop();
    };
  }, []);

  useEffect(() => {
    if (!hasLoadedRef.current || state.isLoading || state.loadError) {
      return;
    }

    window.localStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(state.tasks));
  }, [state.isLoading, state.loadError, state.tasks]);

  const value = useMemo(
    () => ({
      state,
      dispatch,
    }),
    [state],
  );

  return <QueueContext.Provider value={value}>{children}</QueueContext.Provider>;
}

const readStoredTasks = (): GenerationTask[] => {
  const storedTasks = window.localStorage.getItem(QUEUE_STORAGE_KEY);

  if (storedTasks === null) {
    return cloneFreshSeed();
  }

  try {
    const parsedTasks: unknown = JSON.parse(storedTasks);

    return isGenerationTaskArray(parsedTasks) ? parsedTasks : cloneFreshSeed();
  } catch {
    return cloneFreshSeed();
  }
};

const isGenerationTaskArray = (value: unknown): value is GenerationTask[] =>
  Array.isArray(value) &&
  value.every(
    (task) =>
      typeof task === "object" &&
      task !== null &&
      "id" in task &&
      "type" in task &&
      "model" in task &&
      "prompt" in task &&
      "status" in task &&
      "progress" in task &&
      "createdAt" in task &&
      "updatedAt" in task &&
      "credits" in task &&
      "etaSeconds" in task,
  );
