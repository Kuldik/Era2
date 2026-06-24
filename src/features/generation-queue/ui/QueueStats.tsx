import { AlertCircle, CheckCircle2, Clock3, Loader2 } from "lucide-react";

type QueueStatsProps = {
  stats: {
    queued: number;
    running: number;
    done: number;
    failed: number;
  };
};

const ITEMS = [
  { key: "queued", label: "В очереди", icon: Clock3 },
  { key: "running", label: "Идёт", icon: Loader2 },
  { key: "done", label: "Готово", icon: CheckCircle2 },
  { key: "failed", label: "Ошибка", icon: AlertCircle },
] as const;

export function QueueStats({ stats }: QueueStatsProps) {
  return (
    <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {ITEMS.map(({ key, label, icon: Icon }) => (
        <article
          key={key}
          className="rounded-3xl border border-era-line bg-era-bg-1 p-4 shadow-lg shadow-black/20"
        >
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-era-fg-muted">{label}</span>
            <Icon className="size-4 text-era-accent" />
          </div>
          <strong className="numeric-text text-3xl font-semibold text-era-fg">
            {stats[key]}
          </strong>
        </article>
      ))}
    </section>
  );
}
