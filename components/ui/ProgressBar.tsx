export function ProgressBar({ progress }) {
  return (
    <div className="w-full h-2 bg-[var(--shadow)] rounded mt-1">
      <div
        className="h-2 bg-[var(--accent)] rounded transition-all"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
} 