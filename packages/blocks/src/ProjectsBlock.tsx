import React from "react";
import { Badge } from "@personal-website/ui";
import styles from "./ProjectsBlock.module.scss";

// ============================================================
// PROJECTS BLOCK
// ============================================================

export interface Project {
  title: string;
  description: string;
  tags: string[];
  liveUrl?: string;
  repoUrl?: string;
  emoji?: string;
}

export interface ProjectsBlockProps {
  projects: Project[];
}

export function ProjectsBlock({ projects }: Readonly<ProjectsBlockProps>): React.ReactElement {
  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Projects</span>
          <h2 className={styles.heading}>Things I&apos;ve Built</h2>
        </div>

        <div className={styles.grid}>
          {projects.map((project) => (
            <article key={project.title} className={styles.card}>
              {project.emoji && (
                <span className={styles.card__emoji}>{project.emoji}</span>
              )}

              <h3 className={styles.card__title}>{project.title}</h3>

              <p className={styles.card__desc}>{project.description}</p>

              <div className={styles.card__tags}>
                {project.tags.map((tag) => (
                  <Badge key={tag} label={tag} color="blue" />
                ))}
              </div>

              <div className={styles.card__links}>
                {project.liveUrl && (
                  <a href={project.liveUrl} className={`${styles.card__link} ${styles["card__link--live"]}`}>
                    ↗ Live Demo
                  </a>
                )}
                {project.repoUrl && (
                  <a href={project.repoUrl} className={`${styles.card__link} ${styles["card__link--repo"]}`}>
                    ⌥ GitHub
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
