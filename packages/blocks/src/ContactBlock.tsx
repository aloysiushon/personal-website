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

        {/* Left: Terminal output panel */}
        <div className={styles.terminal}>
          <div className={styles.terminal__chrome}>
            <div className={styles.terminal__dots}>
              <span style={{ background: "#ef4444", opacity: 0.7 }} />
              <span style={{ background: "#f59e0b", opacity: 0.7 }} />
              <span style={{ background: "#10b981", opacity: 0.7 }} />
            </div>
            <span className={styles.terminal__title}>bash — connect.sh</span>
          </div>
          <div className={styles.terminal__body}>
            <div className={`${styles.terminal__line} ${styles["terminal__line--comment"]}`}>
              initiating connection...
            </div>
            <div className={`${styles.terminal__line} ${styles["terminal__line--prompt"]}`}>
              whoami
            </div>
            <div className={`${styles.terminal__line} ${styles["terminal__line--output"]}`}>
              full-stack developer, open to opportunities
            </div>
            <div className={`${styles.terminal__line} ${styles["terminal__line--prompt"]}`}>
              curl --contact {email}
            </div>
            <div className={`${styles.terminal__line} ${styles["terminal__line--success"]}`}>
              &nbsp;connection endpoint ready
            </div>
            {github && (
              <div className={`${styles.terminal__line} ${styles["terminal__line--output"]}`}>
                github: {github.replace("https://", "")}
              </div>
            )}
            {linkedin && (
              <div className={`${styles.terminal__line} ${styles["terminal__line--output"]}`}>
                linkedin: {linkedin.replace("https://", "")}
              </div>
            )}
          </div>
        </div>

        {/* Right: Action panel */}
        <div className={styles.panel}>
          <div className={styles.panel__chrome}>
            <span className={styles.panel__title}>contact.md</span>
          </div>
          <div className={styles.panel__body}>
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
        </div>

      </div>
    </section>
  );
}
