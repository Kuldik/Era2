export type GenType = "text" | "image" | "video" | "audio";

export type TaskStatus = "queued" | "running" | "done" | "failed" | "cancelled";

export type GenerationTask = {
  id: string;
  type: GenType;
  model: string;
  prompt: string;
  status: TaskStatus;
  progress: number;
  createdAt: number;
  updatedAt: number;
  credits: number;
  etaSeconds: number;
  error?: string;
  resultUrl?: string;
};
