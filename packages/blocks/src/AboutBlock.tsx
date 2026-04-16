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
        {/* Text */}
        <span className={styles.label}>About Me</span>
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
    </section>
  );
}
