import React from "react";
import { Button } from "@personal-website/ui";
import styles from "./HeroBlock.module.scss";

// ============================================================
// HERO BLOCK
// ============================================================

export interface HeroBlockProps {
  name: string;
  role: string;
  tagline: string;
  ctaPrimary: { label: string; href: string };
  ctaSecondary: { label: string; href: string };
  avatarUrl?: string;
}

export function HeroBlock({
  name,
  role,
  tagline,
  ctaPrimary,
  ctaSecondary,
  avatarUrl,
}: Readonly<HeroBlockProps>): React.ReactElement {
  return (
    <section id="hero" className={styles.hero}>
      {/* Ambient blobs */}
      <div className={styles.blobs}>
        <div className={`${styles.blob} ${styles["blob--violet"]}`} />
        <div className={`${styles.blob} ${styles["blob--pink"]}`} />
        <div className={`${styles.blob} ${styles["blob--blue"]}`} />
      </div>

      {/* Subtle grid overlay */}
      <div className={styles.grid} />

      {/* Two-column grid */}
      <div className={styles.content}>

        {/* Left col — Avatar */}
        {avatarUrl ? (
          <div className={styles.avatar}>
            <div className={styles.avatar__wrap}>
              <div className={styles.avatar__glow} />
              <img src={avatarUrl} alt={name} className={styles.avatar__img} />
            </div>
          </div>
        ) : (
          <div className={styles.avatar} />
        )}

        {/* Left col — Name */}
        <h1 className={styles.name}>
          {name.split(" ")[0]}
          <span className={styles.name__gradient}>{name.split(" ").slice(1).join(" ")}</span>
        </h1>

        {/* Right col — Role pill */}
        <div className={styles.role}>
          <span className={styles.role__pill}>
            <span className={styles.role__dot} />
            {role}
          </span>
        </div>

        {/* Right col — Tagline */}
        <p className={styles.tagline}>{tagline}</p>

        {/* Right col — CTAs */}
        <div className={styles.ctas}>
          <Button label={ctaPrimary.label} href={ctaPrimary.href} variant="primary" size="md" />
          <Button label={ctaSecondary.label} href={ctaSecondary.href} variant="outline" size="md" />
        </div>

        {/* Left col — Scroll hint */}
        <div className={styles.scroll}>
          <span className={styles.scroll__label}>scroll</span>
          <div className={styles.scroll__line} />
        </div>

      </div>
    </section>
  );
}
