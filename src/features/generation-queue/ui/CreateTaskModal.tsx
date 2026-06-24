import type { GenType } from "@/entities/generation-task";
import { X } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";

import {
  DEFAULT_CREDITS_BY_TYPE,
  MODELS_BY_TYPE,
} from "../lib/createTaskDefault";
import type { CreateTaskInput } from "../model/queueReducer";

type CreateTaskModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onCreateTask: (input: CreateTaskInput) => void;
};

const TYPE_OPTIONS: Array<{ value: GenType; label: string }> = [
  { value: "text", label: "Текст" },
  { value: "image", label: "Изображение" },
  { value: "video", label: "Видео" },
  { value: "audio", label: "Аудио" },
];

export function CreateTaskModal({
  isOpen,
  onClose,
  onCreateTask,
}: CreateTaskModalProps) {
  const [type, setType] = useState<GenType>("text");
  const [model, setModel] = useState(MODELS_BY_TYPE.text[0]);
  const [prompt, setPrompt] = useState("");
  const [credits, setCredits] = useState(DEFAULT_CREDITS_BY_TYPE.text);
  const models = useMemo(() => MODELS_BY_TYPE[type], [type]);

  if (!isOpen) {
    return null;
  }

  const canSubmit = prompt.trim().length > 0 && credits > 0;

  const handleTypeChange = (nextType: GenType) => {
    setType(nextType);
    setModel(MODELS_BY_TYPE[nextType][0]);
    setCredits(DEFAULT_CREDITS_BY_TYPE[nextType]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    onCreateTask({
      type,
      model,
      prompt,
      credits,
    });
    setPrompt("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end bg-black/70 px-4 py-5 backdrop-blur-sm sm:items-center sm:justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-4xl border border-era-line bg-era-bg-1 p-5 shadow-2xl shadow-black/50 sm:max-w-xl sm:p-6"
      >
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <p className="model-text mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-era-accent">
              Новая генерация
            </p>
            <h2 className="text-2xl font-semibold text-era-fg">Создать задачу</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-era-line bg-era-bg-2 p-2 text-era-fg-muted transition hover:border-era-accent/50 hover:text-era-fg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-era-accent"
            aria-label="Закрыть"
          >
            <X className="size-4" />
          </button>
        </div>

        <div className="grid gap-4">
          <label className="grid gap-2">
            <span className="text-sm text-era-fg-dim">Тип</span>
            <select
              value={type}
              onChange={(event) => handleTypeChange(event.target.value as GenType)}
              className="h-11 rounded-2xl border border-form-border bg-form-input px-4 text-sm text-era-fg outline-none focus:border-era-accent focus:ring-2 focus:ring-era-accent/20"
            >
              {TYPE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-era-fg-dim">Модель</span>
            <select
              value={model}
              onChange={(event) => setModel(event.target.value)}
              className="h-11 rounded-2xl border border-form-border bg-form-input px-4 text-sm text-era-fg outline-none focus:border-era-accent focus:ring-2 focus:ring-era-accent/20"
            >
              {models.map((modelOption) => (
                <option key={modelOption} value={modelOption}>
                  {modelOption}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-era-fg-dim">Запрос</span>
            <textarea
              value={prompt}
              onChange={(event) => setPrompt(event.target.value)}
              placeholder="Опишите, что нужно сгенерировать..."
              rows={4}
              className="resize-none rounded-2xl border border-form-border bg-form-input px-4 py-3 text-sm text-era-fg outline-none placeholder:text-era-fg-low focus:border-era-accent focus:ring-2 focus:ring-era-accent/20"
            />
          </label>

          <label className="grid gap-2">
            <span className="text-sm text-era-fg-dim">Кредиты</span>
            <input
              type="number"
              min={1}
              value={credits}
              onChange={(event) => setCredits(Number(event.target.value))}
              className="h-11 rounded-2xl border border-form-border bg-form-input px-4 text-sm text-era-fg outline-none focus:border-era-accent focus:ring-2 focus:ring-era-accent/20"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-era-line bg-era-bg-2 px-5 py-2.5 text-sm font-semibold text-era-fg-dim transition hover:border-era-accent/50 hover:text-era-fg"
          >
            Отмена
          </button>
          <button
            type="submit"
            disabled={!canSubmit}
            className="rounded-full bg-era-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(232,84,32,0.35)] transition hover:bg-era-accent-2 disabled:cursor-not-allowed disabled:bg-era-bg-3 disabled:text-era-fg-low disabled:shadow-none"
          >
            Создать
          </button>
        </div>
      </form>
    </div>
  );
}
