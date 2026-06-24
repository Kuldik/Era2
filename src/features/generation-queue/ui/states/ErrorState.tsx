import { AlertTriangle } from "lucide-react";

type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <section className="rounded-3xl border border-destructive/30 bg-destructive/10 p-8 text-center">
      <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </div>
      <h2 className="text-xl font-semibold text-era-fg">Очередь не загрузилась</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-era-fg-muted">{message}</p>
      <button
        type="button"
        onClick={() => window.location.reload()}
        className="mt-5 rounded-full bg-era-accent px-5 py-2.5 text-sm font-semibold text-white shadow-[0_0_28px_rgba(232,84,32,0.35)] transition hover:bg-era-accent-2 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-era-accent"
      >
        Повторить
      </button>
    </section>
  );
}
