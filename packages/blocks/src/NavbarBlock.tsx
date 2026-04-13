import React from "react";
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
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="#hero" className={styles.brand}>
          <span className={styles.brand__bracket}>{"<"}</span>
          <span className={styles.brand__name}>{name}</span>
          <span className={styles.brand__bracket}>{" />"}</span>
        </a>

        <ul className={styles.links}>
          {links.map((link) => (
            <li key={link.href}>
              <a href={link.href} className={styles.link}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
