import React from "react";
import styles from "./SectionWrapper.module.scss";

// ============================================================
// SectionWrapper — consistent section padding + id anchor
// ============================================================

export interface SectionWrapperProps {
  id: string;
  children: React.ReactNode;
  className?: string;
}

export function SectionWrapper({
  id,
  children,
  className = "",
}: Readonly<SectionWrapperProps>): React.ReactElement {
  return (
    <section
      id={id}
      className={`${styles.section} ${className}`}
    >
      {children}
    </section>
  );
}
