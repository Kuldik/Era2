import type { TaskStatus } from "@/entities/generation-task";
import { cn } from "@/shared/lib/cn";

type StatusBadgeProps = {
  status: TaskStatus;
};

const STATUS_LABEL: Record<TaskStatus, string> = {
  queued: "В очереди",
  running: "Идёт",
  done: "Готово",
  failed: "Ошибка",
  cancelled: "Отменено",
};

const STATUS_CLASS: Record<TaskStatus, string> = {
  queued: "border-era-line bg-era-bg-2 text-era-fg-muted",
  running: "border-era-accent/35 bg-era-accent-soft text-era-accent-2",
  done: "border-emerald-500/25 bg-emerald-500/10 text-emerald-300",
  failed: "border-destructive/30 bg-destructive/10 text-destructive",
  cancelled: "border-era-line bg-era-bg-2 text-era-fg-low",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium",
        STATUS_CLASS[status],
      )}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}
