"use client";

import React, { useState, useEffect } from "react";
import type { Block } from "@personal-website/engine";

// ============================================================
// BLOCK EDIT SIDEBAR
// Auto-generates form fields from a block's props shape.
// Block components stay 100% pure — no edit logic inside them.
// ============================================================

interface BlockEditSidebarProps {
  readonly block: Block | null;
  readonly onClose: () => void;
  readonly onChange: (id: string, newProps: Record<string, unknown>) => void;
}

// ── Shared input styles ─────────────────────────────────────
const inputStyle: React.CSSProperties = {
  width: "100%", background: "rgba(30,41,59,0.8)",
  border: "1px solid rgba(100,116,139,0.35)", borderRadius: 6,
  color: "#e2e8f0", fontSize: 13, padding: "6px 10px",
  outline: "none", boxSizing: "border-box",
  fontFamily: "inherit",
};

const labelStyle: React.CSSProperties = {
  display: "block", color: "#94a3b8", fontSize: 11,
  fontWeight: 600, letterSpacing: "0.06em",
  textTransform: "uppercase", marginBottom: 4,
};

const fieldRowStyle: React.CSSProperties = {
  marginBottom: 14,
};

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
    <div style={fieldRowStyle}>
      <label style={labelStyle}>{label}</label>
      {isLong ? (
        <textarea
          value={strVal}
          rows={3}
          onChange={(e) => onChange(path, e.target.value)}
          style={{ ...inputStyle, resize: "vertical", lineHeight: 1.5 }}
        />
      ) : (
        <input
          type="text"
          value={strVal}
          onChange={(e) => onChange(path, e.target.value)}
          style={inputStyle}
        />
      )}
    </div>
  );
}

// ── Number field ────────────────────────────────────────────
function NumberField({ path, value, onChange }: FieldProps) {
  const label = path.split(".").pop() ?? path;
  return (
    <div style={fieldRowStyle}>
      <label style={labelStyle}>{label}</label>
      <input
        type="number"
        value={Number(value)}
        onChange={(e) => onChange(path, Number(e.target.value))}
        style={{ ...inputStyle, width: 120 }}
      />
    </div>
  );
}

// ── String array field (tags / highlights / skills list) ────
function StringArrayField({ path, value, onChange }: FieldProps) {
  const arr = (value as string[]) ?? [];
  const label = path.split(".").pop() ?? path;

  return (
    <div style={fieldRowStyle}>
      <label style={labelStyle}>{label}</label>
      {arr.map((item, i) => (
        <div key={`str-${path}-${i}`} style={{ display: "flex", gap: 6, marginBottom: 6 }}>
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...arr];
              next[i] = e.target.value;
              onChange(path, next);
            }}
            style={{ ...inputStyle, flex: 1 }}
          />
          <button
            onClick={() => onChange(path, arr.filter((_, j) => j !== i))}
            style={{
              background: "rgba(239,68,68,0.2)", border: "1px solid rgba(239,68,68,0.4)",
              color: "#f87171", borderRadius: 6, padding: "0 8px",
              cursor: "pointer", fontSize: 14, flexShrink: 0,
            }}
          >✕</button>
        </div>
      ))}
      <button
        onClick={() => onChange(path, [...arr, ""])}
        style={{
          background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
          color: "#34d399", borderRadius: 6, padding: "4px 10px",
          cursor: "pointer", fontSize: 12, fontWeight: 600,
        }}
      >+ Add</button>
    </div>
  );
}

// ── Link object field { label, href } ───────────────────────
function LinkObjectField({ path, value, onChange }: FieldProps) {
  const obj = (value as Record<string, string>) ?? {};
  const label = path.split(".").pop() ?? path;

  return (
    <div style={{ ...fieldRowStyle, background: "rgba(124,58,237,0.07)", borderRadius: 8, padding: "10px 12px", border: "1px solid rgba(124,58,237,0.15)" }}>
      <p style={{ ...labelStyle, color: "#a78bfa", marginBottom: 8 }}>📎 {label}</p>
      <div style={fieldRowStyle}>
        <label htmlFor={`${path}-label`} style={labelStyle}>label</label>
        <input id={`${path}-label`} type="text" value={obj.label ?? ""} onChange={(e) => onChange(path, { ...obj, label: e.target.value })} style={inputStyle} />
      </div>
      <div style={{ ...fieldRowStyle, marginBottom: 0 }}>
        <label htmlFor={`${path}-href`} style={labelStyle}>href</label>
        <input id={`${path}-href`} type="text" value={obj.href ?? ""} onChange={(e) => onChange(path, { ...obj, href: e.target.value })} style={inputStyle} />
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

function ObjectArrayField({ path, value, itemTemplate, onChange }: ObjectArrayFieldProps) {
  const arr = (value as Record<string, unknown>[]) ?? [];
  const label = path.split(".").pop() ?? path;
  const [expanded, setExpanded] = useState<number | null>(null);

  return (
    <div style={fieldRowStyle}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <label style={labelStyle}>{label}</label>
        <button
          onClick={() => {
            const next = [...arr, { ...itemTemplate }];
            onChange(path, next);
            setExpanded(next.length - 1);
          }}
          style={{
            background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)",
            color: "#34d399", borderRadius: 6, padding: "3px 10px",
            cursor: "pointer", fontSize: 12, fontWeight: 600,
          }}
        >+ Add</button>
      </div>

      {arr.map((item, i) => {
        const isOpen = expanded === i;
        const title = (item.title ?? item.label ?? item.category ?? `Item ${i + 1}`) as string;
        return (
          // stable key: use title/label/category when available, fallback to index
          <div key={(item.title ?? item.label ?? item.category ?? i) as string} style={{ border: "1px solid rgba(100,116,139,0.2)", borderRadius: 8, marginBottom: 8, overflow: "hidden" }}>
            {/* Item header */}
            <div style={{ display: "flex", alignItems: "center", background: "rgba(30,41,59,0.6)", padding: "7px 10px", gap: 8 }}>
              <button
                onClick={() => setExpanded(isOpen ? null : i)}
                style={{ flex: 1, background: "none", border: "none", color: "#e2e8f0", fontSize: 12, fontWeight: 500, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 6 }}
              >
                <span style={{ color: "#64748b", fontSize: 10 }}>{isOpen ? "▼" : "▶"}</span>
                {title}
              </button>
              <button
                onClick={() => {
                  onChange(path, arr.filter((_, j) => j !== i));
                  if (expanded === i) setExpanded(null);
                }}
                style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 14, padding: "0 2px" }}
              >✕</button>
            </div>

            {/* Item fields */}
            {isOpen && (
              <div style={{ padding: "10px 12px" }}>
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
  navbar: "🔝 Navbar", hero: "🦸 Hero", about: "🪪 About",
  skills: "⚡ Skills", projects: "🗂️ Projects", contact: "✉️ Contact", footer: "🔚 Footer",
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

  const sidebarWidth = 340;

  return (
    <div style={{
      position: "fixed", top: 112, right: 0, bottom: 0, width: sidebarWidth,
      zIndex: 9000, background: "rgba(8,14,28,0.97)",
      borderLeft: "1px solid rgba(124,58,237,0.25)",
      backdropFilter: "blur(16px)",
      display: "flex", flexDirection: "column",
      boxShadow: "-8px 0 40px rgba(0,0,0,0.4)",
    }}>
      {/* Header */}
      <div style={{
        padding: "14px 16px", borderBottom: "1px solid rgba(124,58,237,0.2)",
        display: "flex", alignItems: "center", justifyContent: "space-between", flexShrink: 0,
      }}>
        <div>
          <p style={{ margin: 0, color: "#a78bfa", fontWeight: 700, fontSize: 14 }}>
            {BLOCK_LABELS[block.type] ?? block.type}
          </p>
          <p style={{ margin: 0, color: "#475569", fontSize: 11, marginTop: 2 }}>
            Edit content
          </p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(100,116,139,0.15)", border: "1px solid rgba(100,116,139,0.25)",
            color: "#94a3b8", borderRadius: 8, width: 32, height: 32,
            cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >✕</button>
      </div>

      {/* Scrollable fields */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px", minHeight: 0 }}>
        {Object.entries(draft).map(([key, value]) => (
          <PropField
            key={key}
            path={key}
            value={value}
            onChange={handleFieldChange}
          />
        ))}
      </div>

      {/* Footer — Apply button */}
      <div style={{
        padding: "12px 16px", borderTop: "1px solid rgba(124,58,237,0.2)", flexShrink: 0,
        display: "flex", gap: 8,
      }}>
        <button
          onClick={handleApply}
          style={{
            flex: 1, background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            border: "none", color: "#fff", borderRadius: 8,
            padding: "9px 0", fontSize: 13, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
          }}
        >
          ✓ Apply Changes
        </button>
        <button
          onClick={() => block && setDraft(block.props)}
          title="Discard changes"
          style={{
            background: "rgba(100,116,139,0.1)", border: "1px solid rgba(100,116,139,0.25)",
            color: "#94a3b8", borderRadius: 8, padding: "9px 12px",
            fontSize: 13, fontWeight: 600, cursor: "pointer",
          }}
        >↺</button>
      </div>
    </div>
  );
}
