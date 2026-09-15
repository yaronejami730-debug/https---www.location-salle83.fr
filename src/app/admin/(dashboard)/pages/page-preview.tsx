export function PagePreview({ path }: { path: string }) {
  return (
    <div className="relative aspect-[4/3] overflow-hidden bg-[var(--background-muted)]">
      <iframe
        src={path}
        tabIndex={-1}
        title=""
        className="pointer-events-none absolute left-0 top-0 origin-top-left border-0"
        style={{ width: "400%", height: "400%", transform: "scale(0.25)" }}
      />
    </div>
  );
}
