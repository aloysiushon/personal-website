import React from "react";
import { Badge } from "@personal-website/ui";
import styles from "./AboutBlock.module.scss";

// ============================================================
// ABOUT BLOCK
// ============================================================

export interface AboutBlockProps {
  bio: string;
  highlights: string[];
}

export function AboutBlock({
  bio,
  highlights,
}: Readonly<AboutBlockProps>): React.ReactElement {
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        {/* Left sidebar — file tree */}
        <aside className={styles.sidebar}>
          <div className={styles.sidebar__header}>
            <span className={styles.sidebar__icon}>⌂</span>
            <span className={styles.label}>Explorer</span>
          </div>
          <div className={styles.sidebar__tree}>
            {["about.md", "bio.txt", "highlights.json"].map((f, i) => (
              <div key={f} className={`${styles.sidebar__item} ${i === 0 ? styles["sidebar__item--active"] : ""}`}>
                {f}
              </div>
            ))}
          </div>
        </aside>

        {/* Right pane — editor */}
        <div className={styles.pane}>
          <div className={styles.pane__tabbar}>
            <div className={styles.pane__tab}>about.md</div>
          </div>
          <div className={styles.pane__content}>
            <h2 className={styles.heading}>
              Passionate about building things that matter.
            </h2>
            <p className={styles.bio}>{bio}</p>
            <div className={styles.badges}>
              {highlights.map((h) => (
                <Badge key={h} label={h} color="violet" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
