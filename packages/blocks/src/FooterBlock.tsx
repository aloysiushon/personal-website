import React from "react";
import styles from "./FooterBlock.module.scss";

// ============================================================
// FOOTER BLOCK
// ============================================================

export interface FooterBlockProps {
  name: string;
  year?: number;
}

export function FooterBlock({ name, year = new Date().getFullYear() }: Readonly<FooterBlockProps>): React.ReactElement {
  return (
    <footer className={styles.footer}>
      {/* Left segments */}
      <div className={styles.segment}>
        <span className={styles.segment__dot} style={{ background: "#10b981", boxShadow: "0 0 5px #10b981" }} />
        <span style={{ color: "#10b981", opacity: 0.8 }}>main</span>
      </div>
      <div className={styles.segment} style={{ color: "#64748b" }}>
        <span style={{ color: "#a78bfa", opacity: 0.7 }}>{"<"}</span>
        <span style={{ color: "#e2e8f0", opacity: 0.7 }}>{name}</span>
        <span style={{ color: "#a78bfa", opacity: 0.7 }}>{" />"}</span>
      </div>
      <div className={styles.segment} style={{ color: "#334155" }}>
        block-engine · v1.0
      </div>
      {/* Right segment */}
      <div className={styles.segment} style={{ color: "#334155" }}>
        © {year}
      </div>
    </footer>
  );
}
