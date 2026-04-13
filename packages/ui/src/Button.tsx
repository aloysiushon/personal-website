import React from "react";
import styles from "./Button.module.scss";

// ============================================================
// Button  pure UI atom (Tailwind + SCSS module)
// ============================================================

export interface ButtonProps {
  label: string;
  href?: string;
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
}

export function Button({
  label,
  href,
  variant = "primary",
  size = "md",
  onClick,
}: Readonly<ButtonProps>): React.ReactElement {
  const variantClass = styles[`btn--${variant}` as keyof typeof styles];
  const sizeClass = styles[`btn--${size}` as keyof typeof styles];
  const className = `${styles.btn} ${variantClass} ${sizeClass}`;

  if (href) {
    return (
      <a href={href} className={className}>
        {label}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {label}
    </button>
  );
}
