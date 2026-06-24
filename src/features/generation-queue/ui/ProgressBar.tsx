type ProgressBarProps = {
  value: number;
};

export function ProgressBar({ value }: ProgressBarProps) {
  const progress = Math.min(100, Math.max(0, Math.round(value)));

  return (
    <div className="flex items-center gap-3">
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-era-bg-3">
        <div
          className="era-progress-fill h-full rounded-full shadow-[0_0_18px_rgba(232,84,32,0.45)] transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="numeric-text w-10 text-right text-xs text-era-fg-dim">
        {progress}%
      </span>
    </div>
  );
}
