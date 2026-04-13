import React from "react";
import { Badge } from "@personal-website/ui";
import styles from "./AboutBlock.module.scss";

// ============================================================
// ABOUT BLOCK
// ============================================================

export interface AboutBlockProps {
  bio: string;
  highlights: string[];
  imageSide?: "left" | "right";
}

export function AboutBlock({
  bio,
  highlights,
  imageSide = "right",
}: Readonly<AboutBlockProps>): React.ReactElement {
  const innerClass = imageSide === "left" ? styles["inner--imageLeft"] : styles["inner--imageRight"];
  return (
    <section id="about" className={styles.section}>
      <div className={styles.container}>
        <div className={`${styles.inner} ${innerClass}`}>
          {/* Text */}
          <div className={styles.text}>
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

          {/* Decorative card */}
          <div className={styles.visual}>
            <div className={styles.card}>
              <div className={styles.card__glow} />
              <div className={styles.card__body}>👨‍💻</div>
              <div className={styles.card__badge}>✨ Open to Work</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
