import React, { useState, useCallback } from "react";
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
  const gap = 20; // 1.25rem in px

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

  const maxIndex = Math.max(0, categories.length - visibleCount);

  const prev = useCallback(() => setCurrentIndex((i) => Math.max(0, i - 1)), []);
  const next = useCallback(() => setCurrentIndex((i) => Math.min(maxIndex, i + 1)), [maxIndex]);

  const canPrev = currentIndex > 0;
  const canNext = currentIndex < maxIndex;

  return (
    <section id="skills" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.label}>Skills</span>
          <h2 className={styles.heading}>My Tech Stack</h2>
        </div>

        <div className={styles.carouselWrapper}>
          <button
            className={`${styles.navBtn} ${styles.navBtn__prev} ${canPrev ? "" : styles.navBtn__disabled}`}
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
              {categories.map((cat) => {
                const color = cat.color ?? "violet";
                const cardClass = styles[`card--${color}`];
                const headingClass = styles[`card__heading--${color}`];
                const dotClass = styles[`card__dot--${color}`];
                return (
                  <div
                    key={cat.category}
                    className={`${styles.card} ${cardClass}`}
                    style={{ flex: `0 0 ${cardWidth}px`, minWidth: `${cardWidth}px` }}
                  >
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

          <button
            className={`${styles.navBtn} ${styles.navBtn__next} ${canNext ? "" : styles.navBtn__disabled}`}
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
