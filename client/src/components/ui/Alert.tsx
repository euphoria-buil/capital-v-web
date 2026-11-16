export function Alert({ variant, children }: { variant: "error" | "ok"; children: React.ReactNode }) {
  return <div className={`alert ${variant}`}>{children}</div>;
}