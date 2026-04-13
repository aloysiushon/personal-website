import React from "react";
import { Badge } from "@personal-website/ui";
import styles from "./SkillsBlock.module.scss";

// ============================================================
// SKILLS BLOCK
// ============================================================

export interface SkillCategory {
  category: string;
  skills: string[];
  color?: "violet" | "blue" | "green" | "pink" | "gray";
  icon?: string;
}

export interface SkillsBlockProps {
  categories: SkillCategory[];
}

export function SkillsBlock({ categories }: Readonly<SkillsBlockProps>): React.ReactElement {
  return (
    <section id="skills" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Skills</span>
          <h2 className={styles.heading}>My Tech Stack</h2>
        </div>

        <div className={styles.grid}>
          {categories.map((cat) => {
            const color = cat.color ?? "violet";
            const cardClass = styles[`card--${color}` as keyof typeof styles];
            const headingClass = styles[`card__heading--${color}` as keyof typeof styles];
            const dotClass = styles[`card__dot--${color}` as keyof typeof styles];
            return (
              <div key={cat.category} className={`${styles.card} ${cardClass}`}>
                <h3 className={`${styles.card__heading} ${headingClass}`}>
                  <span className={`${styles.card__dot} ${dotClass}`} />
                  {cat.category}
                </h3>
                <div className={styles.card__badges}>
                  {cat.skills.map((skill) => (
                    <Badge key={skill} label={skill} color={cat.color ?? "violet"} />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
