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
import { BlockEditSidebar } from "@/components/BlockEditSidebar";
import styles from "./PortfolioPage.module.scss";

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
  readonly isSelected: boolean;
  readonly onRemove: (id: string) => void;
  readonly onToggleVisibility: (id: string) => void;
  readonly onSelect: (id: string) => void;
}

function SortableBlock({ block, isEditing, isHidden, isSelected, onRemove, onToggleVisibility, onSelect }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  // These values come from @dnd-kit at runtime — they must stay as inline style.
  let outline = "none";
  if (isDragging) outline = "2px dashed #7c3aed";
  else if (isSelected) outline = "2px solid #7c3aed";
  else if (isEditing) outline = "1px dashed rgba(124,58,237,0.25)";

  const dndStyle: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging || isHidden ? 0.35 : 1,
    outline,
    position: "relative",
    zIndex: isDragging ? 0 : "auto",
    filter: isHidden ? "grayscale(0.6)" : "none",
  };

  const Renderer = blockComponents[block.type];
  if (!Renderer) return null;

  return (
    <div ref={setNodeRef} style={dndStyle}>
      {isEditing && (
        <div className={styles.blockControls}>
          <button
            onClick={() => onSelect(block.id)}
            title="Edit block content"
            className={`${styles.blockBtn} ${isSelected ? styles["blockBtn--editActive"] : styles["blockBtn--edit"]}`}
          >
            ✏️ Edit
          </button>
          <button
            onClick={() => onToggleVisibility(block.id)}
            title={isHidden ? "Show block" : "Hide block"}
            className={`${styles.blockBtn} ${isHidden ? styles["blockBtn--hidden"] : styles["blockBtn--visibility"]}`}
          >
            {isHidden ? "👁️ Show" : "🙈 Hide"}
          </button>
          <button
            onClick={() => onRemove(block.id)}
            title="Remove block"
            className={`${styles.blockBtn} ${styles["blockBtn--remove"]}`}
          >
            ✕ Remove
          </button>
          <div
            {...attributes}
            {...listeners}
            className={styles.blockDragHandle}
          >
            ⠿ Drag
          </div>
        </div>
      )}

      {isEditing && isHidden && (
        <div className={styles.hiddenOverlay}>
          <span className={styles.hiddenLabel}>HIDDEN</span>
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
    <div ref={menuRef} className={styles.addMenu}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={styles.addMenu__trigger}
      >
        + Add Block
      </button>

      {open && (
        <div className={styles.addMenu__dropdown}>
          <p className={styles.addMenu__heading}>Choose a block</p>
          {BLOCK_CATALOG.map(({ type, label, emoji }) => {
            const alreadyAdded = existingTypes.filter((t) => t === type).length;
            return (
              <button
                key={type}
                onClick={() => { onAdd(type); setOpen(false); }}
                className={`${styles.addMenu__item} ${alreadyAdded ? styles["addMenu__item--duplicate"] : styles["addMenu__item--available"]}`}
              >
                <span className={styles.addMenu__emoji}>{emoji}</span>
                <span>{label}</span>
                {alreadyAdded > 0 && (
                  <span className={styles.addMenu__count}>×{alreadyAdded}</span>
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
const EDITED_KEY    = "portfolio-block-edited";

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
function applyStoredState(
  savedIds: string[],
  addedBlocks: Block[],
  removedIds: Set<string>,
  editedProps: Record<string, Record<string, unknown>>,
): PageSchema {
  // Base blocks from schema excluding removed ones + any runtime-added ones
  const baseBlocks = portfolioSchema.blocks.filter((b) => !removedIds.has(b.id));
  const allBlocks = [...baseBlocks, ...addedBlocks];
  // Merge any edited props
  const mergedBlocks = allBlocks.map((b) =>
    editedProps[b.id] ? { ...b, props: { ...b.props, ...editedProps[b.id] } } : b
  );
  const blockMap = new Map(mergedBlocks.map((b) => [b.id, b]));
  const ordered = savedIds.flatMap((id) => (blockMap.has(id) ? [blockMap.get(id)!] : []));
  // Append any new blocks not present in the saved order
  const savedSet = new Set(savedIds);
  const extra = mergedBlocks.filter((b) => !savedSet.has(b.id));
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
  /** Block currently selected for content editing in the sidebar */
  const [selectedId, setSelectedId] = useState<string | null>(null);
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
      const savedEdited  = localStorage.getItem(EDITED_KEY);

      const addedBlocks: Block[]   = savedAdded   ? (JSON.parse(savedAdded)   as Block[])   : [];
      const removedSet = new Set<string>(savedRemoved ? (JSON.parse(savedRemoved) as string[]) : []);
      const editedMap: Record<string, Record<string, unknown>> =
        savedEdited ? (JSON.parse(savedEdited) as Record<string, Record<string, unknown>>) : {};

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
        startTransition(() => setSchema(applyStoredState(ids, addedBlocks, removedSet, editedMap)));
      } else if (addedBlocks.length > 0 || removedSet.size > 0 || Object.keys(editedMap).length > 0) {
        startTransition(() => setSchema(applyStoredState([], addedBlocks, removedSet, editedMap)));
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

  const persistEdited = useCallback((map: Record<string, Record<string, unknown>>) => {
    try {
      localStorage.setItem(EDITED_KEY, JSON.stringify(map));
    } catch { /* ignore */ }
  }, []);

  // ── Edit block props ──────────────────────────────────────
  const handlePropChange = useCallback((id: string, newProps: Record<string, unknown>) => {
    setSchema((prev) => {
      const next = {
        ...prev,
        blocks: prev.blocks.map((b) => b.id === id ? { ...b, props: newProps } : b),
      };
      // Build a patch map: only store props that differ from the original schema for original blocks,
      // or the full props for added blocks (already stored in ADDED_KEY).
      const originalIds = new Set(portfolioSchema.blocks.map((b) => b.id));
      if (originalIds.has(id)) {
        const savedEdited = localStorage.getItem(EDITED_KEY);
        const current: Record<string, Record<string, unknown>> =
          savedEdited ? (JSON.parse(savedEdited) as Record<string, Record<string, unknown>>) : {};
        persistEdited({ ...current, [id]: newProps });
      }
      // For added blocks, re-persist the whole added list with updated props
      persistAdded(next.blocks);
      return next;
    });
    setSelectedId(null);
  }, [persistEdited, persistAdded]);
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
    localStorage.removeItem(EDITED_KEY);
    setSchema(portfolioSchema);
    setHiddenIds(new Set());
    setSelectedId(null);
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
          className={styles.editFab}
        >
          ✏️ Edit Layout
        </button>
        {/* Suppress render until localStorage state is rehydrated to avoid flash of removed/hidden blocks */}
        {mounted && <Engine schema={visibleSchema} />}
      </>
    );
  }

  // Editing mode: DnD sortable canvas
  const selectedBlock = schema.blocks.find((b) => b.id === selectedId) ?? null;
  const sidebarOpen = selectedBlock !== null;

  return (
    <>
      {/*
        In edit mode, un-fix the Navbar so it flows normally in the canvas
        below the Block Editor toolbar. The selector targets the CSS Module
        class that NavbarBlock.module.scss compiles to (starts with "header").
      */}
      <style>{`
        header[class*="header"] {
          position: relative !important;
          top: auto !important;
          z-index: auto !important;
        }
      `}</style>

      {/* Editing toolbar */}
      <div className={styles.toolbar}>
        <span className={styles.toolbar__title}>
          <span className={styles.toolbar__icon}>⠿</span>
          {" "}Block Editor
          <span className={styles.toolbar__hint}>{"— drag • edit • hide • remove • add"}</span>
        </span>
        <div className={styles.toolbar__actions}>
          <AddBlockMenu
            existingTypes={schema.blocks.map((b) => b.type)}
            onAdd={handleAddBlock}
          />
          <button onClick={handleReset} className={styles.toolbar__reset}>
            ↺ Reset
          </button>
          <button
            onClick={() => { setIsEditing(false); setSelectedId(null); }}
            className={styles.toolbar__done}
          >
            ✓ Done
          </button>
        </div>
      </div>

      {/* Canvas — shrinks when sidebar is open, offset only by toolbar (56px) */}
      <div className={`${styles.canvas} ${sidebarOpen ? styles["canvas--sidebarOpen"] : ""}`}>
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
                isSelected={block.id === selectedId}
                isHidden={hiddenIds.has(block.id)}
                onRemove={handleRemove}
                onToggleVisibility={handleToggleVisibility}
                onSelect={setSelectedId}
              />
            ))}
          </SortableContext>

          <DragOverlay dropAnimation={{ duration: 200 }}>
            {activeBlock && ActiveRenderer ? (
              <div className={styles.dragOverlay}>
                <ActiveRenderer {...activeBlock.props} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Block edit sidebar */}
      <BlockEditSidebar
        block={selectedBlock}
        onClose={() => setSelectedId(null)}
        onChange={handlePropChange}
      />
    </>
  );
}
