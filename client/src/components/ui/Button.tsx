import { type ButtonHTMLAttributes, type ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "sm";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
  children: ReactNode;
};

export function Button({ variant = "primary", size = "md", className = "", children, ...rest }: Props) {
  const classes = ["btn", variant !== "primary" ? variant : "", size === "sm" ? "sm" : "", className]
    .filter(Boolean)
    .join(" ");
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  );
}

/** Para uso con react-router Link via className */
export function linkBtnClass(variant: Variant = "primary", size: Size = "md", extra = ""): string {
  return ["btn", variant !== "primary" ? variant : "", size === "sm" ? "sm" : "", extra].filter(Boolean).join(" ");
}