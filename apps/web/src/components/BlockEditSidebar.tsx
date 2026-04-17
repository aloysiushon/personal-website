"use client";

import React, { useState, useEffect } from "react";
import type { Block } from "@personal-website/engine";
import styles from "./BlockEditSidebar.module.scss";

// ============================================================
// BLOCK EDIT SIDEBAR
// Auto-generates form fields from a block's props shape.
// Block components stay 100% pure — no edit logic inside them.
// Styling: Tailwind utility classes + SCSS modules — no inline styles.
// ============================================================

interface BlockEditSidebarProps {
  readonly block: Block | null;
  readonly onClose: () => void;
  readonly onChange: (id: string, newProps: Record<string, unknown>) => void;
}

// ── Field renderers ─────────────────────────────────────────

interface FieldProps {
  readonly path: string;
  readonly value: unknown;
  readonly onChange: (path: string, value: unknown) => void;
}

/** Dot-path setter: set(obj, "a.b.c", val) */
function setPath(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split(".");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: Record<string, unknown> = { ...obj } as any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let cur: Record<string, unknown> = result as any;
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    cur[key] = Array.isArray(cur[key])
      ? [...(cur[key] as unknown[])]
      : { ...(cur[key] as Record<string, unknown>) };
    cur = cur[key] as Record<string, unknown>;
  }
  const lastKey = keys.at(-1) ?? "";
  cur[lastKey] = value;
  return result;
}

// ── String field ────────────────────────────────────────────
function StringField({ path, value, onChange }: FieldProps) {
  const strVal = typeof value === "string" ? value : "";
  const isLong = strVal.length > 60 || path === "bio" || path.endsWith(".description") || path === "tagline";
  const label = path.split(".").pop() ?? path;

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {isLong ? (
        <textarea
          value={strVal}
          rows={3}
          onChange={(e) => onChange(path, e.target.value)}
          className={`${styles.input} ${styles["input--textarea"]}`}
        />
      ) : (
        <input
          type="text"
          value={strVal}
          onChange={(e) => onChange(path, e.target.value)}
          className={styles.input}
        />
      )}
    </div>
  );
}

// ── Number field ────────────────────────────────────────────
function NumberField({ path, value, onChange }: FieldProps) {
  const label = path.split(".").pop() ?? path;
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      <input
        type="number"
        value={Number(value)}
        onChange={(e) => onChange(path, Number(e.target.value))}
        className={`${styles.input} ${styles["input--number"]}`}
      />
    </div>
  );
}

// ── String array field (tags / highlights / skills list) ────
function StringArrayField({ path, value, onChange }: FieldProps) {
  const arr = (value as string[]) ?? [];
  const label = path.split(".").pop() ?? path;

  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>
      {arr.map((item, i) => (
        <div key={`str-${path}-${i}`} className={styles.arrayItem}>
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...arr];
              next[i] = e.target.value;
              onChange(path, next);
            }}
            className={`${styles.input} grow`}
          />
          <button
            onClick={() => onChange(path, arr.filter((_, j) => j !== i))}
            className={styles.arrayItem__remove}
          >✕</button>
        </div>
      ))}
      <button
        onClick={() => onChange(path, [...arr, ""])}
        className={styles.addBtn}
      >+ Add</button>
    </div>
  );
}

// ── Link object field { label, href } ───────────────────────
function LinkObjectField({ path, value, onChange }: FieldProps) {
  const obj = (value as Record<string, string>) ?? {};
  const label = path.split(".").pop() ?? path;

  return (
    <div className={styles.linkBox}>
      <span className={styles.linkBox__title}>📎 {label}</span>
      <div className={styles.field}>
        <label htmlFor={`${path}-label`} className={styles.label}>label</label>
        <input
          id={`${path}-label`}
          type="text"
          value={obj.label ?? ""}
          onChange={(e) => onChange(path, { ...obj, label: e.target.value })}
          className={styles.input}
        />
      </div>
      <div className={styles.field}>
        <label htmlFor={`${path}-href`} className={styles.label}>href</label>
        <input
          id={`${path}-href`}
          type="text"
          value={obj.href ?? ""}
          onChange={(e) => onChange(path, { ...obj, href: e.target.value })}
          className={styles.input}
        />
      </div>
    </div>
  );
}

// ── Generic object array (projects, categories, nav links) ──
interface ObjectArrayFieldProps {
  readonly path: string;
  readonly value: unknown;
  readonly itemTemplate: Record<string, unknown>;
  readonly onChange: (path: string, value: unknown) => void;
}

// Module-level counter — incremented only in event handlers, never during render.
let _keySeq = 0;
const newKey = () => { _keySeq += 1; return `oak-${_keySeq}`; };

function ObjectArrayField({ path, value, itemTemplate, onChange }: ObjectArrayFieldProps) {
  const arr = (value as Record<string, unknown>[]) ?? [];
  const label = path.split(".").pop() ?? path;
  const [expanded, setExpanded] = useState<number | null>(null);
  // One stable key per item. Initial keys are created once; updates happen
  // only inside event handlers — never during render.
  const [keys, setKeys] = useState<string[]>(() => arr.map(newKey));

  function handleAdd() {
    const next = [...arr, { ...itemTemplate }];
    onChange(path, next);
    setKeys((prev) => [...prev, newKey()]);
    setExpanded(next.length - 1);
  }

  function handleRemove(i: number) {
    onChange(path, arr.filter((_, j) => j !== i));
    setKeys((prev) => prev.filter((_, j) => j !== i));
    setExpanded((prev) => (prev === i ? null : prev));
  }

  return (
    <div className={styles.field}>
      <div className={styles.objArray__header}>
        <label className={styles.label}>{label}</label>
        <button onClick={handleAdd} className={styles.objArray__addBtn}>+ Add</button>
      </div>

      {arr.map((item, i) => {
        const isOpen = expanded === i;
        const title = (item.title ?? item.label ?? item.category ?? `Item ${i + 1}`) as string;
        const stableKey = keys[i] ?? `${path}-${i}`;
        return (
          <div key={stableKey} className={styles.objArray__item}>
            {/* Item header */}
            <div className={styles.objArray__itemHeader}>
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                className={styles.objArray__expand}
              >
                <span className={styles.objArray__caret}>{isOpen ? "▼" : "▶"}</span>
                {title}
              </button>
              <button
                onClick={() => handleRemove(i)}
                className={styles.objArray__remove}
              >✕</button>
            </div>

            {/* Item fields */}
            {isOpen && (
              <div className={styles.objArray__fields}>
                {Object.entries(item).map(([key, val]) => {
                  const subPath = `${path}.${i}.${key}`;
                  if (Array.isArray(val) && val.every((v) => typeof v === "string")) {
                    return <StringArrayField key={key} path={subPath} value={val} onChange={onChange} />;
                  }
                  if (typeof val === "string") return <StringField key={key} path={subPath} value={val} onChange={onChange} />;
                  if (typeof val === "number") return <NumberField key={key} path={subPath} value={val} onChange={onChange} />;
                  return null;
                })}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Nav links array (array of { label, href }) ───────────────
function NavLinksField({ path, value, onChange }: FieldProps) {
  return (
    <ObjectArrayField
      path={path} value={value}
      itemTemplate={{ label: "Link", href: "#" }}
      onChange={onChange}
    />
  );
}

// ── Array field dispatcher ──────────────────────────────────
function ArrayField({ path, value, onChange }: FieldProps) {
  const arr = value as unknown[];
  // string[]
  if (arr.every((v) => typeof v === "string")) {
    return <StringArrayField path={path} value={arr} onChange={onChange} />;
  }
  const first = arr[0];
  if (!first || typeof first !== "object") return null;
  // { label, href }[] → nav links (exactly 2 keys)
  if ("label" in first && "href" in first && Object.keys(first).length === 2) {
    return <NavLinksField path={path} value={arr} onChange={onChange} />;
  }
  // projects[]
  if ("title" in first) {
    return (
      <ObjectArrayField
        path={path} value={arr}
        itemTemplate={{ title: "", description: "", tags: [], emoji: "🚀", liveUrl: "#", repoUrl: "#" }}
        onChange={onChange}
      />
    );
  }
  // categories[]
  if ("category" in first) {
    return (
      <ObjectArrayField
        path={path} value={arr}
        itemTemplate={{ category: "", color: "violet", skills: [] }}
        onChange={onChange}
      />
    );
  }
  return null;
}

// ── Top-level field dispatcher ──────────────────────────────
function PropField({ path, value, onChange }: FieldProps) {
  if (typeof value === "string") return <StringField path={path} value={value} onChange={onChange} />;
  if (typeof value === "number") return <NumberField path={path} value={value} onChange={onChange} />;
  if (Array.isArray(value))      return <ArrayField  path={path} value={value} onChange={onChange} />;

  // { label, href } object
  if (typeof value === "object" && value !== null && "label" in value && "href" in value) {
    return <LinkObjectField path={path} value={value} onChange={onChange} />;
  }

  return null;
}

// ── Block label map ─────────────────────────────────────────
const BLOCK_LABELS: Record<string, string> = {
  navbar: "≡ Navbar", hero: "◆ Hero", about: "$ About",
  skills: "{} Skills", projects: "[] Projects", contact: "@ Contact", footer: "— Footer",
};

// ── Main sidebar ────────────────────────────────────────────
export function BlockEditSidebar({ block, onClose, onChange }: BlockEditSidebarProps): React.ReactElement | null {
  // Local draft — only committed to parent on "Apply"
  const [draft, setDraft] = useState<Record<string, unknown>>({});

  // Reset draft whenever the selected block changes
  useEffect(() => {
    if (block) {
      const props = block.props;
      queueMicrotask(() => setDraft(props));
    }
  }, [block]);

  if (!block) return null;

  const blockId = block.id;

  function handleFieldChange(path: string, value: unknown) {
    setDraft((prev) => setPath(prev, path, value));
  }

  function handleApply() {
    onChange(blockId, draft);
  }

  return (
    <div className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <p className={styles.header__title}>
            {BLOCK_LABELS[block.type] ?? block.type}
          </p>
          <p className={styles.header__subtitle}>Edit content</p>
        </div>
        <button onClick={onClose} className={styles.header__close}>✕</button>
      </div>

      {/* Scrollable fields */}
      <div className={styles.fields}>
        {Object.entries(draft).map(([key, value]) => (
          <PropField
            key={key}
            path={key}
            value={value}
            onChange={handleFieldChange}
          />
        ))}
      </div>

      {/* Footer — Apply / Discard */}
      <div className={styles.footer}>
        <button onClick={handleApply} className={styles.footer__apply}>
          ✓ Apply Changes
        </button>
        <button
          onClick={() => block && setDraft(block.props)}
          title="Discard changes"
          className={styles.footer__discard}
        >↺</button>
      </div>
    </div>
  );
}
