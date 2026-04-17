import React, { useState, useCallback } from "react";
import styles from "./NavbarBlock.module.scss";

// ============================================================
// NAVBAR BLOCK
// ============================================================

export interface NavItem {
  label: string;
  href: string;
}

export interface NavbarBlockProps {
  name: string;
  links: NavItem[];
}

export function NavbarBlock({ name, links }: Readonly<NavbarBlockProps>): React.ReactElement {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLinkClick = useCallback(() => setMenuOpen(false), []);

  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="#hero" className={styles.brand}>
          <span className={styles.brand__bracket}>{"<"}</span>
          <span className={styles.brand__name}>{name}</span>
          <span className={styles.brand__bracket}>{" />"}</span>
        </a>

        {/* Desktop links */}
        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        {/* Hamburger button — mobile only */}
        <button
          className={`${styles.hamburger} ${menuOpen ? styles["hamburger--open"] : ""}`}
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </nav>

      {/* Mobile drawer */}
      {menuOpen && (
        <ul className={styles.mobileMenu}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.mobileLink} onClick={handleLinkClick}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      )}
    </header>
  );
}
