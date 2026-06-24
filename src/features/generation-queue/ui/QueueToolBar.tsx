import { cn } from "@/shared/lib/cn";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import type { SortMode, StatusFilter, TypeFilter } from "../model/queueReducer";

type QueueToolBarProps = {
  filter: StatusFilter;
  typeFilter: TypeFilter;
  sortMode: SortMode;
  search: string;
  onFilterChange: (filter: StatusFilter) => void;
  onTypeFilterChange: (typeFilter: TypeFilter) => void;
  onSortModeChange: (sortMode: SortMode) => void;
  onSearchChange: (search: string) => void;
};

const STATUS_FILTERS: Array<{ value: StatusFilter; label: string }> = [
  { value: "all", label: "Все" },
  { value: "queued", label: "В очереди" },
  { value: "running", label: "Идёт" },
  { value: "done", label: "Готово" },
  { value: "failed", label: "Ошибка" },
];

const TYPE_FILTERS: Array<{ value: TypeFilter; label: string }> = [
  { value: "all", label: "Все типы" },
  { value: "text", label: "Текст" },
  { value: "image", label: "Изображения" },
  { value: "video", label: "Видео" },
  { value: "audio", label: "Аудио" },
];

export function QueueToolBar({
  filter,
  typeFilter,
  sortMode,
  search,
  onFilterChange,
  onTypeFilterChange,
  onSortModeChange,
  onSearchChange,
}: QueueToolBarProps) {
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onSearchChange(localSearch);
    }, 250);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [localSearch, onSearchChange]);

  return (
    <section className="rounded-3xl border border-era-line bg-era-bg-1 p-4">
      <div className="flex flex-col gap-4">
        <ChipGroup
          label="Статус"
          items={STATUS_FILTERS}
          value={filter}
          onChange={onFilterChange}
        />
        <ChipGroup
          label="Тип"
          items={TYPE_FILTERS}
          value={typeFilter}
          onChange={onTypeFilterChange}
        />

        <div className="grid gap-3 lg:grid-cols-[220px_minmax(260px,1fr)]">
          <select
            value={sortMode}
            onChange={(event) => onSortModeChange(event.target.value as SortMode)}
            className="h-11 rounded-full border border-form-border bg-era-bg-2 px-4 text-sm text-era-fg outline-none transition hover:border-era-accent/45 focus:border-era-accent focus:ring-2 focus:ring-era-accent/20"
          >
            <option value="newest">Сначала новые</option>
            <option value="oldest">Сначала старые</option>
          </select>

          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-era-fg-muted" />
            <input
              type="search"
              value={localSearch}
              onChange={(event) => setLocalSearch(event.target.value)}
              placeholder="Поиск по prompt или model..."
              className="h-11 w-full rounded-full border border-form-border bg-form-input py-2 pl-11 pr-4 text-sm text-era-fg outline-none placeholder:text-era-fg-low transition hover:border-era-accent/45 focus:border-era-accent focus:ring-2 focus:ring-era-accent/20"
            />
          </label>
        </div>
      </div>
    </section>
  );
}

type ChipGroupProps<T extends string> = {
  label: string;
  items: Array<{ value: T; label: string }>;
  value: T;
  onChange: (value: T) => void;
};

function ChipGroup<T extends string>({
  label,
  items,
  value,
  onChange,
}: ChipGroupProps<T>) {
  return (
    <div>
      <p className="mb-2 text-xs font-medium uppercase tracking-[0.18em] text-era-fg-low">
        {label}
      </p>
      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {items.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onChange(item.value)}
            className={cn(
              "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-era-accent",
              item.value === value
                ? "border-era-accent bg-era-accent text-white shadow-[0_0_24px_rgba(232,84,32,0.35)]"
                : "border-era-line bg-era-bg-2 text-era-fg-dim hover:border-era-accent/50 hover:text-era-fg",
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}
