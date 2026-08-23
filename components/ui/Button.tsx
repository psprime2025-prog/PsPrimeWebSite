import Link from "next/link";
import type { ButtonHTMLAttributes, ComponentProps, ReactNode } from "react";

export type ButtonVariant = "primary" | "secondary" | "outline";

const VARIANT_CLASS: Record<ButtonVariant, string> = {
  primary: "btn-glass btn-glass--primary",
  secondary: "btn-glass btn-glass--secondary",
  outline: "btn-glass btn-glass--outline",
};

function cx(...classes: (string | undefined | false)[]) {
  return classes.filter(Boolean).join(" ");
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

/** Botão "liquid glass" — usar para ações dentro de formulários/JS (type="submit"/onClick). */
export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button className={cx(VARIANT_CLASS[variant], className)} {...props}>
      <span className="btn-glass__label">{children}</span>
    </button>
  );
}

interface ButtonLinkProps extends ComponentProps<typeof Link> {
  variant?: ButtonVariant;
  children: ReactNode;
}

/** Versão "liquid glass" para navegação (envolve next/link). */
export function ButtonLink({ variant = "primary", className, children, ...props }: ButtonLinkProps) {
  return (
    <Link className={cx(VARIANT_CLASS[variant], className)} {...props}>
      <span className="btn-glass__label">{children}</span>
    </Link>
  );
}
