import { createContext, type Dispatch } from "react";

import type { QueueAction, QueueState } from "./queueReducer";

export type QueueContextValue = {
  state: QueueState;
  dispatch: Dispatch<QueueAction>;
};

export const QueueContext = createContext<QueueContextValue | null>(null);
