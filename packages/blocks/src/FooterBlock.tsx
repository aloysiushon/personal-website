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
      <p className={styles.primary}>
        Built with ❤️ by{" "}
        <span className={styles.primary__name}>{name}</span>
        {" "}· {year}
      </p>
      <p className={styles.secondary}>
        Powered by Block Engine
      </p>
    </footer>
  );
}
