export function PageSkeleton() {
  return <div className="page-container min-h-[75vh] py-10" role="status" aria-label="Loading page">
    <div className="animate-pulse space-y-5" aria-hidden="true">
      <div className="h-4 w-32 rounded-lg bg-[var(--line)]" />
      <div className="h-9 w-3/4 max-w-md rounded-xl bg-[var(--line)]" />
      <div className="h-12 rounded-xl bg-[var(--line)]" />
      <div className="h-72 rounded-3xl bg-[var(--line)]" />
      <div className="grid grid-cols-2 gap-4"><div className="h-36 rounded-2xl bg-[var(--line)]" /><div className="h-36 rounded-2xl bg-[var(--line)]" /></div>
    </div>
  </div>;
}
