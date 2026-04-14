"use client";

import React, { useState, useCallback, useEffect, startTransition, useRef } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Engine } from "@personal-website/engine";
import type { Block, PageSchema } from "@personal-website/engine";
import { registerAllBlocks, HeroBlock, AboutBlock, SkillsBlock, ProjectsBlock, ContactBlock, NavbarBlock, FooterBlock } from "@personal-website/blocks";
import { portfolioSchema } from "@/data/portfolio.schema";

// Register all blocks once on module load
registerAllBlocks();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyBlockComponent = React.ComponentType<any>;

// Map of block type → component for DragOverlay preview
const blockComponents: Record<string, AnyBlockComponent> = {
  hero: HeroBlock,
  about: AboutBlock,
  skills: SkillsBlock,
  projects: ProjectsBlock,
  contact: ContactBlock,
  navbar: NavbarBlock,
  footer: FooterBlock,
};

// Human-readable labels + emoji for the "Add Block" menu
const BLOCK_CATALOG: { type: string; label: string; emoji: string }[] = [
  { type: "navbar",   label: "Navbar",   emoji: "🔝" },
  { type: "hero",     label: "Hero",     emoji: "🦸" },
  { type: "about",    label: "About",    emoji: "🪪" },
  { type: "skills",   label: "Skills",   emoji: "⚡" },
  { type: "projects", label: "Projects", emoji: "🗂️" },
  { type: "contact",  label: "Contact",  emoji: "✉️" },
  { type: "footer",   label: "Footer",   emoji: "🔚" },
];

// ── Sortable block wrapper ──────────────────────────────────
interface SortableBlockProps {
  readonly block: Block;
  readonly isEditing: boolean;
  readonly isHidden: boolean;
  readonly onRemove: (id: string) => void;
  readonly onToggleVisibility: (id: string) => void;
}

function SortableBlock({ block, isEditing, isHidden, onRemove, onToggleVisibility }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const blockOpacity = isDragging || isHidden ? 0.35 : 1;
  let blockOutline = "none";
  if (isDragging) blockOutline = "2px dashed #7c3aed";
  else if (isEditing) blockOutline = "1px dashed rgba(124,58,237,0.25)";

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: blockOpacity,
    outline: blockOutline,
    position: "relative",
    zIndex: isDragging ? 0 : "auto",
    filter: isHidden ? "grayscale(0.6)" : "none",
  };

  const Renderer = blockComponents[block.type];
  if (!Renderer) return null;

  return (
    <div ref={setNodeRef} style={style}>
      {isEditing && (
        <div style={{
          position: "absolute", top: 12, right: 12, zIndex: 100,
          display: "flex", alignItems: "center", gap: 6,
        }}>
          {/* Hide / Show toggle */}
          <button
            onClick={() => onToggleVisibility(block.id)}
            title={isHidden ? "Show block" : "Hide block"}
            style={{
              background: isHidden ? "rgba(100,116,139,0.85)" : "rgba(30,41,59,0.85)",
              color: "#fff", border: "1px solid rgba(255,255,255,0.15)",
              padding: "5px 10px", borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
          >
            {isHidden ? "👁️ Show" : "🙈 Hide"}
          </button>

          {/* Remove block */}
          <button
            onClick={() => onRemove(block.id)}
            title="Remove block"
            style={{
              background: "rgba(239,68,68,0.85)", color: "#fff",
              border: "1px solid rgba(255,255,255,0.15)",
              padding: "5px 10px", borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: "pointer",
              backdropFilter: "blur(8px)",
              boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
            }}
          >
            ✕ Remove
          </button>

          {/* Drag handle */}
          <div
            {...attributes}
            {...listeners}
            style={{
              background: "rgba(124,58,237,0.85)", color: "#fff",
              padding: "5px 12px", borderRadius: 8,
              fontSize: 13, fontWeight: 600, cursor: "grab",
              display: "flex", alignItems: "center", gap: 6,
              backdropFilter: "blur(8px)",
              userSelect: "none",
              boxShadow: "0 2px 8px rgba(124,58,237,0.4)",
              border: "1px solid rgba(255,255,255,0.15)",
            }}
          >
            ⠿ Drag
          </div>
        </div>
      )}

      {/* Hidden overlay label */}
      {isEditing && isHidden && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 50,
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "rgba(3,7,18,0.45)", backdropFilter: "blur(2px)",
          pointerEvents: "none",
        }}>
          <span style={{
            background: "rgba(100,116,139,0.9)", color: "#f1f5f9",
            padding: "8px 20px", borderRadius: 8, fontSize: 14, fontWeight: 700,
            letterSpacing: "0.05em",
          }}>
            HIDDEN
          </span>
        </div>
      )}

      <Renderer {...block.props} />
    </div>
  );
}

// ── Add Block dropdown ──────────────────────────────────────
interface AddBlockMenuProps {
  readonly existingTypes: string[];
  readonly onAdd: (type: string) => void;
}

function AddBlockMenu({ existingTypes, onAdd }: AddBlockMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} style={{ position: "relative" }}>
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)",
          color: "#34d399", padding: "6px 14px", borderRadius: 8,
          fontSize: 13, fontWeight: 600, cursor: "pointer",
          display: "flex", alignItems: "center", gap: 6,
        }}
      >
        + Add Block
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 10000,
          background: "rgba(15,23,42,0.98)", border: "1px solid rgba(124,58,237,0.3)",
          borderRadius: 12, padding: "8px 0", minWidth: 180,
          boxShadow: "0 16px 48px rgba(0,0,0,0.6)",
          backdropFilter: "blur(16px)",
        }}>
          <p style={{ color: "#64748b", fontSize: 11, fontWeight: 600, padding: "4px 14px 8px", margin: 0, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Choose a block
          </p>
          {BLOCK_CATALOG.map(({ type, label, emoji }) => {
            const alreadyAdded = existingTypes.filter((t) => t === type).length;
            return (
              <button
                key={type}
                onClick={() => { onAdd(type); setOpen(false); }}
                style={{
                  display: "flex", width: "100%", alignItems: "center", gap: 10,
                  background: "transparent", border: "none",
                  color: alreadyAdded ? "#94a3b8" : "#e2e8f0",
                  padding: "8px 14px", fontSize: 13, fontWeight: 500,
                  cursor: "pointer", textAlign: "left",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.15)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; }}
              >
                <span style={{ fontSize: 16 }}>{emoji}</span>
                <span>{label}</span>
                {alreadyAdded > 0 && (
                  <span style={{ marginLeft: "auto", fontSize: 11, color: "#64748b" }}>
                    ×{alreadyAdded}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

const STORAGE_KEY   = "portfolio-block-order";
const HIDDEN_KEY    = "portfolio-block-hidden";
const REMOVED_KEY   = "portfolio-block-removed";
const ADDED_KEY     = "portfolio-block-added";

// ── Default props for newly added blocks ───────────────────
// When a user adds a block type, we seed it with sensible defaults.
const defaultProps: Record<string, Record<string, unknown>> = {
  navbar: {
    name: "Your Name",
    links: [
      { label: "About",    href: "#about"    },
      { label: "Skills",   href: "#skills"   },
      { label: "Projects", href: "#projects" },
      { label: "Contact",  href: "#contact"  },
    ],
  },
  hero: {
    name: "Your Name",
    role: "Your Role",
    tagline: "Your tagline here.",
    ctaPrimary:   { label: "View My Work",  href: "#projects" },
    ctaSecondary: { label: "Get In Touch",  href: "#contact"  },
  },
  about: {
    bio: "Write something about yourself here.",
    highlights: ["Highlight 1", "Highlight 2", "Highlight 3"],
  },
  skills: {
    categories: [
      { category: "Frontend", color: "violet", skills: ["React", "TypeScript"] },
    ],
  },
  projects: {
    projects: [
      {
        title: "My Project",
        description: "A short description.",
        tags: ["React"],
        emoji: "🚀",
        liveUrl: "#",
        repoUrl: "#",
      },
    ],
  },
  contact: {
    email:    "you@example.com",
    github:   "https://github.com/you",
    linkedin: "https://linkedin.com/in/you",
  },
  footer: {
    name: "Your Name",
    year: new Date().getFullYear(),
  },
};

/** Re-order portfolioSchema blocks to match a saved ID order, merging any runtime-added blocks. */
function applyStoredState(savedIds: string[], addedBlocks: Block[], removedIds: Set<string>): PageSchema {
  // Base blocks from schema excluding removed ones + any runtime-added ones
  const baseBlocks = portfolioSchema.blocks.filter((b) => !removedIds.has(b.id));
  const allBlocks = [...baseBlocks, ...addedBlocks];
  const blockMap = new Map(allBlocks.map((b) => [b.id, b]));
  const ordered = savedIds.flatMap((id) => (blockMap.has(id) ? [blockMap.get(id)!] : []));
  // Append any new blocks not present in the saved order
  const savedSet = new Set(savedIds);
  const extra = allBlocks.filter((b) => !savedSet.has(b.id));
  return { ...portfolioSchema, blocks: [...ordered, ...extra] };
}

// ── Main PortfolioPage ──────────────────────────────────────
export function PortfolioPage(): React.ReactElement {
  // Always start with portfolioSchema so server & first client render match (avoids hydration mismatch).
  // Then, after mount, apply any saved state from localStorage.
  const [schema, setSchema] = useState<PageSchema>(portfolioSchema);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [mounted, setMounted] = useState(false);
  /** Set of block IDs that are hidden (but not removed) */
  const [hiddenIds, setHiddenIds] = useState<Set<string>>(new Set());
  /** Tracks removed original-schema block IDs — used only to clear on reset */
  const removedIdsRef = useRef<Set<string>>(new Set());
  /** Counter used to generate unique IDs for added blocks */
  const addedCounterRef = useRef(0);

  // Rehydrate saved state after mount (client-only)
  useEffect(() => {
    try {
      const savedOrder   = localStorage.getItem(STORAGE_KEY);
      const savedHidden  = localStorage.getItem(HIDDEN_KEY);
      const savedAdded   = localStorage.getItem(ADDED_KEY);
      const savedRemoved = localStorage.getItem(REMOVED_KEY);

      const addedBlocks: Block[]   = savedAdded   ? (JSON.parse(savedAdded)   as Block[])   : [];
      const removedSet = new Set<string>(savedRemoved ? (JSON.parse(savedRemoved) as string[]) : []);

      // Track counter so new IDs don't clash
      addedBlocks.forEach((b) => {
        const num = Number.parseInt(b.id.replace("block-added-", ""), 10);
        if (!Number.isNaN(num)) addedCounterRef.current = Math.max(addedCounterRef.current, num + 1);
      });

      if (removedSet.size > 0) {
        removedIdsRef.current = removedSet;
      }

      if (savedOrder) {
        const ids: string[] = JSON.parse(savedOrder);
        startTransition(() => setSchema(applyStoredState(ids, addedBlocks, removedSet)));
      } else if (addedBlocks.length > 0 || removedSet.size > 0) {
        startTransition(() => setSchema(applyStoredState([], addedBlocks, removedSet)));
      }

      if (savedHidden) {
        const hiddenSet = new Set(JSON.parse(savedHidden) as string[]);
        startTransition(() => setHiddenIds(hiddenSet));
      }
    } catch {
      // ignore malformed data
    }
    // Mark as mounted only after all localStorage state is applied
    startTransition(() => setMounted(true));
  }, []);

  // ── Persist helpers ───────────────────────────────────────
  const persistOrder = useCallback((blocks: Block[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(blocks.map((b) => b.id)));
    } catch { /* ignore */ }
  }, []);

  const persistHidden = useCallback((ids: Set<string>) => {
    try {
      localStorage.setItem(HIDDEN_KEY, JSON.stringify([...ids]));
    } catch { /* ignore */ }
  }, []);

  const persistAdded = useCallback((blocks: Block[]) => {
    try {
      // Only store blocks that are NOT in the original schema
      const originalIds = new Set(portfolioSchema.blocks.map((b) => b.id));
      const added = blocks.filter((b) => !originalIds.has(b.id));
      localStorage.setItem(ADDED_KEY, JSON.stringify(added));
    } catch { /* ignore */ }
  }, []);

  const persistRemoved = useCallback((ids: Set<string>) => {
    try {
      localStorage.setItem(REMOVED_KEY, JSON.stringify([...ids]));
    } catch { /* ignore */ }
  }, []);

  // ── DnD ───────────────────────────────────────────────────
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;

    setSchema((prev) => {
      const oldIndex = prev.blocks.findIndex((b) => b.id === active.id);
      const newIndex = prev.blocks.findIndex((b) => b.id === over.id);
      const next = { ...prev, blocks: arrayMove(prev.blocks, oldIndex, newIndex) };
      persistOrder(next.blocks);
      persistAdded(next.blocks);
      return next;
    });
  }, [persistOrder, persistAdded]);

  // ── Remove block ──────────────────────────────────────────
  const handleRemove = useCallback((id: string) => {
    const originalIds = new Set(portfolioSchema.blocks.map((b) => b.id));

    // If it's an original schema block, record the removal so it stays gone on refresh
    if (originalIds.has(id)) {
      const next = new Set(removedIdsRef.current);
      next.add(id);
      removedIdsRef.current = next;
      persistRemoved(next);
    }

    setSchema((prev) => {
      const next = { ...prev, blocks: prev.blocks.filter((b) => b.id !== id) };
      persistOrder(next.blocks);
      persistAdded(next.blocks);
      return next;
    });
    // Also remove from hidden set if present
    setHiddenIds((prev) => {
      if (!prev.has(id)) return prev;
      const next = new Set(prev);
      next.delete(id);
      persistHidden(next);
      return next;
    });
  }, [persistOrder, persistAdded, persistHidden, persistRemoved]);

  // ── Toggle visibility ─────────────────────────────────────
  const handleToggleVisibility = useCallback((id: string) => {
    setHiddenIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      persistHidden(next);
      return next;
    });
  }, [persistHidden]);

  // ── Add block ─────────────────────────────────────────────
  const handleAddBlock = useCallback((type: string) => {
    const newId = `block-added-${addedCounterRef.current++}`;
    const newBlock: Block = {
      id: newId,
      type,
      layout: { x: 0, y: 999, w: 12, h: 4 },
      props: defaultProps[type] ?? {},
    };
    setSchema((prev) => {
      const next = { ...prev, blocks: [...prev.blocks, newBlock] };
      persistOrder(next.blocks);
      persistAdded(next.blocks);
      return next;
    });
  }, [persistOrder, persistAdded]);

  // ── Reset ─────────────────────────────────────────────────
  const handleReset = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(HIDDEN_KEY);
    localStorage.removeItem(ADDED_KEY);
    localStorage.removeItem(REMOVED_KEY);
    setSchema(portfolioSchema);
    setHiddenIds(new Set());
    removedIdsRef.current = new Set();
  }, []);

  const activeBlock = schema.blocks.find((b) => b.id === activeId);
  const ActiveRenderer = activeBlock ? blockComponents[activeBlock.type] : null;

  // Non-editing mode: render only visible blocks using the Engine
  if (!isEditing) {
    const visibleSchema: PageSchema = {
      ...schema,
      blocks: schema.blocks.filter((b) => !hiddenIds.has(b.id)),
    };
    return (
      <>
        <button
          onClick={() => setIsEditing(true)}
          style={{
            position: "fixed", bottom: 24, right: 24, zIndex: 9999,
            background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
            color: "#fff", border: "none", borderRadius: 12,
            padding: "12px 20px", fontSize: 14, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 8px 32px rgba(124,58,237,0.5)",
          }}
        >
          ✏️ Edit Layout
        </button>
        {/* Suppress render until localStorage state is rehydrated to avoid flash of removed/hidden blocks */}
        {mounted && <Engine schema={visibleSchema} />}
      </>
    );
  }

  // Editing mode: DnD sortable canvas
  return (
    <>
      {/* Editing toolbar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 9999,
        background: "rgba(3,7,18,0.95)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(124,58,237,0.3)",
        padding: "0 1.5rem",
        height: 56, display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ color: "#a78bfa", fontWeight: 700, fontSize: 15, display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 18 }}>⠿</span>{" "}Block Editor
          <span style={{ color: "#475569", fontWeight: 400, fontSize: 12 }}>{"— drag • hide • remove • add"}</span>
        </span>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {/* Add block */}
          <AddBlockMenu
            existingTypes={schema.blocks.map((b) => b.type)}
            onAdd={handleAddBlock}
          />
          <button
            onClick={handleReset}
            style={{
              background: "transparent", border: "1px solid rgba(100,116,139,0.4)",
              color: "#94a3b8", padding: "6px 14px", borderRadius: 8,
              fontSize: 13, fontWeight: 500, cursor: "pointer",
            }}
          >
            ↺ Reset
          </button>
          <button
            onClick={() => setIsEditing(false)}
            style={{
              background: "linear-gradient(135deg, #7c3aed, #6d28d9)",
              border: "none", color: "#fff", padding: "6px 16px",
              borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
              boxShadow: "0 4px 14px rgba(124,58,237,0.4)",
            }}
          >
            ✓ Done
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div style={{ paddingTop: 56 }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={schema.blocks.map((b) => b.id)}
            strategy={verticalListSortingStrategy}
          >
            {schema.blocks.map((block) => (
              <SortableBlock
                key={block.id}
                block={block}
                isEditing={isEditing}
                isHidden={hiddenIds.has(block.id)}
                onRemove={handleRemove}
                onToggleVisibility={handleToggleVisibility}
              />
            ))}
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 200 }}>
            {activeBlock && ActiveRenderer ? (
              <div style={{ opacity: 0.9, pointerEvents: "none", transform: "scale(0.98)", boxShadow: "0 24px 80px rgba(124,58,237,0.4)" }}>
                <ActiveRenderer {...activeBlock.props} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </>
  );
}
