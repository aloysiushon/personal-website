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

      <div className={styles.content}>
        {/* Avatar */}
        {avatarUrl && (
          <div className={styles.avatar}>
            <div className={styles.avatar__wrap}>
              <div className={styles.avatar__glow} />
              <img
                src={avatarUrl}
                alt={name}
                className={styles.avatar__img}
              />
            </div>
          </div>
        )}

        {/* Role pill */}
        <div className={styles.role}>
          <span className={styles.role__pill}>
            <span className={styles.role__dot} />
            {role}
          </span>
        </div>

        {/* Name */}
        <h1 className={styles.name}>
          Hi, I&apos;m{" "}
          <span className={styles.name__gradient}>{name}</span>
        </h1>

        {/* Tagline */}
        <p className={styles.tagline}>{tagline}</p>

        {/* CTAs */}
        <div className={styles.ctas}>
          <Button label={ctaPrimary.label} href={ctaPrimary.href} variant="primary" size="lg" />
          <Button label={ctaSecondary.label} href={ctaSecondary.href} variant="outline" size="lg" />
        </div>

        {/* Scroll hint */}
        <div className={styles.scroll}>
          <span className={styles.scroll__label}>scroll</span>
          <div className={styles.scroll__line} />
        </div>
      </div>
    </section>
  );
}
