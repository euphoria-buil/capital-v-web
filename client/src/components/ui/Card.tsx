import { type HTMLAttributes, type ReactNode } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  flat?: boolean;
  interactive?: boolean;
};

export function Card({ children, flat, interactive, className = "", ...rest }: Props) {
  const classes = ["card", flat ? "flat" : "", interactive ? "interactive" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <div className={classes} {...rest}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  eyebrow,
}: {
  title: string;
  description?: string;
  eyebrow?: string;
}) {
  return (
    <header className="page-header">
      {eyebrow && <span className="badge">{eyebrow}</span>}
      <h1 className="title-font">{title}</h1>
      {description && <p>{description}</p>}
    </header>
  );
}