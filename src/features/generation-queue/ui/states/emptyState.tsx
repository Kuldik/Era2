import { Inbox } from "lucide-react";

export function EmptyState() {
  return (
    <section className="rounded-3xl border border-dashed border-era-line bg-era-bg-1 p-8 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-era-bg-2 text-era-accent">
        <Inbox className="size-5" />
      </div>
      <h2 className="text-xl font-semibold text-era-fg">Ничего не найдено</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-era-fg-muted">
        Очередь пуста или текущие фильтры скрывают все задачи. Измените фильтр,
        тип или поисковый запрос.
      </p>
    </section>
  );
}
