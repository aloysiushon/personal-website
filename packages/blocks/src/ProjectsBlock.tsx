import React, { useState, useCallback } from "react";
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
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = React.useState(false);
  const [cardWidth, setCardWidth] = React.useState(0);
  const viewportRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const mq = globalThis.matchMedia("(max-width: 767px)");
    setIsMobile(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const visibleCount = isMobile ? 1 : 3;
  const gap = 24; // 1.5rem in px

  React.useEffect(() => {
    const measure = () => {
      if (viewportRef.current) {
        const vpW = viewportRef.current.offsetWidth;
        setCardWidth((vpW - gap * (visibleCount - 1)) / visibleCount);
      }
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (viewportRef.current) ro.observe(viewportRef.current);
    return () => ro.disconnect();
  }, [visibleCount]);

  const maxIndex = Math.max(0, projects.length - visibleCount);

  const prev = useCallback(() => setCurrentIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setCurrentIndex((i) => Math.min(maxIndex, i + 1)), [maxIndex]);

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  return (
    <section id="projects" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Projects</span>
          <h2 className={styles.heading}>Things I&apos;ve Built</h2>
        </div>

        <div className={styles.carouselWrapper}>
          <button
            className={`${styles.navBtn} ${canPrev ? "" : styles.navBtn__disabled}`}
            onClick={prev}
            aria-label="Previous"
            disabled={!canPrev}
          >
            &#8249;
          </button>

          <div className={styles.carouselViewport} ref={viewportRef}>
            <div
              className={styles.carouselTrack}
              style={{ transform: `translateX(-${currentIndex * (cardWidth + gap)}px)` }}
            >
              {projects.map((project) => (
                <article
                  key={project.title}
                  className={styles.card}
                  style={{ flex: `0 0 ${cardWidth}px`, minWidth: `${cardWidth}px` }}
                >
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

          <button
            className={`${styles.navBtn} ${canNext ? "" : styles.navBtn__disabled}`}
            onClick={next}
            aria-label="Next"
            disabled={!canNext}
          >
            &#8250;
          </button>
        </div>

        <div className={styles.dots}>
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              // eslint-disable-next-line react/no-array-index-key
              key={`dot-${i}`}
              className={`${styles.dot} ${i === currentIndex ? styles.dot__active : ""}`}
              onClick={() => setCurrentIndex(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
