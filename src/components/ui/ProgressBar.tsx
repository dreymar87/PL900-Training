interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
}

export default function ProgressBar({ value, max = 100, label }: ProgressBarProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      {label !== undefined ? (
        <span className="text-xs text-text-secondary min-w-[3rem] text-right">{label}</span>
      ) : (
        <span className="text-xs text-text-secondary min-w-[3rem] text-right">{percent}%</span>
      )}
    </div>
  );
}
