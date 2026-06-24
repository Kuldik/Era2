import { cloneFreshSeed } from "@/entities/generation-task";
import { useCallback, useContext, useMemo } from "react";

import { QueueContext } from "./QueueContext";
import { QUEUE_STORAGE_KEY } from "../lib/constants";
import type {
  CreateTaskInput,
  SortMode,
  StatusFilter,
  TypeFilter,
} from "./queueReducer";
import {
  selectActiveTasks,
  selectAverageActiveProgress,
  selectQueueStats,
  selectVisibleTasks,
} from "./selectors";

export const useQueue = () => {
  const context = useContext(QueueContext);

  if (context === null) {
    throw new Error("useQueue must be used within QueueProvider");
  }

  const { state, dispatch } = context;

  const visibleTasks = useMemo(() => selectVisibleTasks(state), [state]);
  const stats = useMemo(() => selectQueueStats(state), [state]);
  const activeTasks = useMemo(() => selectActiveTasks(state), [state]);
  const averageActiveProgress = useMemo(
    () => selectAverageActiveProgress(state),
    [state],
  );

  const cancelTask = useCallback(
    (id: string) => dispatch({ type: "cancelTask", payload: { id } }),
    [dispatch],
  );
  const retryTask = useCallback(
    (id: string) => dispatch({ type: "retryTask", payload: { id } }),
    [dispatch],
  );
  const deleteTask = useCallback(
    (id: string) => dispatch({ type: "deleteTask", payload: { id } }),
    [dispatch],
  );
  const clearCompleted = useCallback(
    () => dispatch({ type: "clearCompleted" }),
    [dispatch],
  );
  const resetSimulation = useCallback(() => {
    window.localStorage.removeItem(QUEUE_STORAGE_KEY);
    dispatch({ type: "resetSimulation", tasks: cloneFreshSeed() });
  }, [dispatch]);
  const createTask = useCallback(
    (input: CreateTaskInput) =>
      dispatch({ type: "createTask", payload: input }),
    [dispatch],
  );
  const setFilter = useCallback(
    (filter: StatusFilter) => dispatch({ type: "setFilter", payload: filter }),
    [dispatch],
  );
  const setTypeFilter = useCallback(
    (typeFilter: TypeFilter) =>
      dispatch({ type: "setTypeFilter", payload: typeFilter }),
    [dispatch],
  );
  const setSortMode = useCallback(
    (sortMode: SortMode) =>
      dispatch({ type: "setSortMode", payload: sortMode }),
    [dispatch],
  );
  const setSearch = useCallback(
    (search: string) => dispatch({ type: "setSearch", payload: search }),
    [dispatch],
  );

  const actions = useMemo(
    () => ({
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
    }),
    [
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
    ],
  );

  return {
    state,
    visibleTasks,
    stats,
    activeTasks,
    averageActiveProgress,
    actions,
  };
};
