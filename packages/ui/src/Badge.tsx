import React from "react";
import styles from "./Badge.module.scss";

// ============================================================
// Badge — skill/tech tag
// ============================================================

export interface BadgeProps {
  label: string;
  color?: "violet" | "blue" | "green" | "pink" | "gray";
}

export function Badge({ label, color = "violet" }: Readonly<BadgeProps>): React.ReactElement {
  const colorClass = styles[`badge--${color}` as keyof typeof styles];
  return (
    <span className={`${styles.badge} ${colorClass}`}>
      {label}
    </span>
  );
}
