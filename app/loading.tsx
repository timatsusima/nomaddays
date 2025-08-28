'use client';

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--surface)]">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[var(--text)] animate-bounce [animation-delay:-0.2s]"></div>
        <div className="w-2 h-2 rounded-full bg-[var(--text)] animate-bounce [animation-delay:-0.1s]"></div>
        <div className="w-2 h-2 rounded-full bg-[var(--text)] animate-bounce"></div>
      </div>
      <div className="absolute inset-x-0 bottom-16 text-center">
        <div className="text-2xl font-bold tracking-wide text-[var(--text)]">NomadDays</div>
      </div>
    </div>
  );
}


