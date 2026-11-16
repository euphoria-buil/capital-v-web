export function LoadingBlock({ label = "Cargando…" }: { label?: string }) {
  return <div className="loading-block container page">{label}</div>;
}

export function EmptyState({ title, hint }: { title: string; hint?: string }) {
  return (
    <div className="empty-state">
      <p style={{ margin: 0, fontWeight: 600 }}>{title}</p>
      {hint && <p style={{ margin: "0.35rem 0 0" }}>{hint}</p>}
    </div>
  );
}