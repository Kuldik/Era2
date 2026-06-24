import { Loader2 } from "lucide-react";

export function LoadingStage() {
  return (
    <section className="space-y-3 rounded-3xl border border-era-line bg-era-bg-1 p-4">
      <div className="mb-4 flex items-center gap-3 text-era-fg-dim">
        <Loader2 className="size-4 animate-spin text-era-accent" />
        <span className="text-sm">Загружаем очередь...</span>
      </div>
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse rounded-3xl border border-era-line bg-era-bg-2 p-4"
        >
          <div className="h-4 w-2/3 rounded-full bg-era-bg-3" />
          <div className="mt-4 h-3 w-1/3 rounded-full bg-era-bg-3" />
        </div>
      ))}
    </section>
  );
}
