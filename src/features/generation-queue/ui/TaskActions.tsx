import type { TaskStatus } from "@/entities/generation-task";
import { cn } from "@/shared/lib/cn";
import { Download, RotateCcw, Trash2, X } from "lucide-react";
import type { ReactNode } from "react";

type TaskActionsProps = {
  status: TaskStatus;
  onCancel: () => void;
  onRetry: () => void;
  onDelete: () => void;
  onDownload: () => void;
};

export function TaskActions({
  status,
  onCancel,
  onRetry,
  onDelete,
  onDownload,
}: TaskActionsProps) {
  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {(status === "queued" || status === "running") && (
        <ActionButton label="Отмена" onClick={onCancel}>
          <X className="size-3.5" />
        </ActionButton>
      )}
      {(status === "failed" || status === "cancelled") && (
        <ActionButton label="Повторить" onClick={onRetry}>
          <RotateCcw className="size-3.5" />
        </ActionButton>
      )}
      {status === "done" && (
        <ActionButton label="Скачать" onClick={onDownload}>
          <Download className="size-3.5" />
        </ActionButton>
      )}
      <ActionButton
        label="Удалить"
        onClick={onDelete}
        className="border-destructive/25 text-destructive hover:border-destructive/50 hover:bg-destructive/10"
      >
        <Trash2 className="size-3.5" />
      </ActionButton>
    </div>
  );
}

type ActionButtonProps = {
  label: string;
  onClick: () => void;
  children: ReactNode;
  className?: string;
};

function ActionButton({ label, onClick, children, className }: ActionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-era-line bg-era-bg-2 px-3 py-1.5 text-xs font-medium text-era-fg-dim transition hover:border-era-accent/50 hover:bg-era-accent-soft hover:text-era-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-era-accent",
        className,
      )}
    >
      {children}
      {label}
    </button>
  );
}
