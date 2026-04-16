import React from "react";
import styles from "./ContactBlock.module.scss";

// ============================================================
// CONTACT BLOCK
// ============================================================

export interface ContactBlockProps {
  email: string;
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export function ContactBlock({
  email,
  github,
  linkedin,
  twitter,
}: Readonly<ContactBlockProps>): React.ReactElement {
  const links = [
    { label: "Email", href: `mailto:${email}`, primary: true },
    github   && { label: "GitHub",   href: github,   primary: false },
    linkedin && { label: "LinkedIn", href: linkedin, primary: false },
    twitter  && { label: "Twitter",  href: twitter,  primary: false },
  ].filter(Boolean) as { label: string; href: string; primary: boolean }[];

  return (
    <section id="contact" className={styles.section}>
      <div className={styles.container}>
        <div className={styles.glow} />

        <span className={styles.label}>Contact</span>
        <h2 className={styles.heading}>Let&apos;s Work Together</h2>
        <p className={styles.desc}>
          I&apos;m always open to new opportunities, collaborations, or just a good conversation. Drop me a message!
        </p>

        <div className={styles.links}>
          {links.map(({ label, href, primary }) => (
            <a
              key={href}
              href={href}
              className={`${styles.link} ${primary ? styles["link--primary"] : styles["link--secondary"]}`}
            >
              {label}
            </a>
          ))}
        </div>

        <p className={styles.email}>{email}</p>
      </div>
    </section>
  );
}
