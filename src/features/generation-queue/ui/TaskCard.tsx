import type { GenerationTask } from "@/entities/generation-task";
import { FileText, Image, Mic, Video } from "lucide-react";

import { ProgressBar } from "./ProgressBar";
import { StatusBadge } from "./StatusBadge";
import { TaskActions } from "./TaskActions";

type TaskCardProps = {
  task: GenerationTask;
  queuePosition?: number;
  onCancel: (id: string) => void;
  onRetry: (id: string) => void;
  onDelete: (id: string) => void;
  onDownload: (task: GenerationTask) => void;
};

export function TaskCard({
  task,
  queuePosition,
  onCancel,
  onRetry,
  onDelete,
  onDownload,
}: TaskCardProps) {
  const TypeIcon = TYPE_ICON[task.type];

  return (
    <article className="rounded-3xl border border-era-line bg-era-bg-1 p-4 shadow-lg shadow-black/20 lg:hidden">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl border border-era-line bg-era-bg-2 text-era-accent">
          <TypeIcon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className="line-clamp-2 text-sm font-semibold text-era-fg">
              {task.prompt}
            </p>
            <StatusBadge status={task.status} />
          </div>
          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-era-fg-muted">
            <span className="model-text rounded-full bg-era-bg-2 px-2.5 py-1 text-era-fg-dim">
              {task.model}
            </span>
            <span>{TYPE_LABEL[task.type]}</span>
            <span>{task.credits} credits</span>
            {queuePosition !== undefined && <span>#{queuePosition}</span>}
          </div>
        </div>
      </div>

      <div className="mt-4">
        {task.status === "running" ? (
          <ProgressBar value={task.progress} />
        ) : (
          <p className="text-sm text-era-fg-muted">{getTaskMeta(task)}</p>
        )}
        {task.status === "failed" && task.error !== undefined && (
          <p className="mt-2 text-xs text-destructive">{task.error}</p>
        )}
      </div>

      <div className="mt-4">
        <TaskActions
          status={task.status}
          onCancel={() => onCancel(task.id)}
          onRetry={() => onRetry(task.id)}
          onDelete={() => onDelete(task.id)}
          onDownload={() => onDownload(task)}
        />
      </div>
    </article>
  );
}

const TYPE_LABEL: Record<GenerationTask["type"], string> = {
  text: "Текст",
  image: "Изображение",
  video: "Видео",
  audio: "Аудио",
};

const TYPE_ICON = {
  text: FileText,
  image: Image,
  video: Video,
  audio: Mic,
} satisfies Record<GenerationTask["type"], typeof FileText>;

const getTaskMeta = (task: GenerationTask) => {
  if (task.status === "done") {
    return "Готово к скачиванию";
  }

  if (task.status === "queued") {
    return `ETA ${formatEta(task.etaSeconds)}`;
  }

  if (task.status === "cancelled") {
    return "Задача отменена";
  }

  return `${task.progress}% · ${formatEta(task.etaSeconds)}`;
};

const formatEta = (seconds: number) => {
  if (seconds <= 0) {
    return "0 сек";
  }

  const minutes = Math.floor(seconds / 60);
  const restSeconds = seconds % 60;

  return minutes > 0 ? `${minutes} мин ${restSeconds} сек` : `${restSeconds} сек`;
};
