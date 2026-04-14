"use client";

import React, { useState, useCallback, useEffect, startTransition } from "react";
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

// ── Sortable block wrapper ──────────────────────────────────
interface SortableBlockProps {
  block: Block;
  isEditing: boolean;
}

function SortableBlock({ block, isEditing }: SortableBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.35 : 1,
    outline: isDragging ? "2px dashed #7c3aed" : "none",
    position: "relative",
    zIndex: isDragging ? 0 : "auto",
  };

  const Renderer = blockComponents[block.type];
  if (!Renderer) return null;

  return (
    <div ref={setNodeRef} style={style}>
      {isEditing && (
        <div
          {...attributes}
          {...listeners}
          style={{
            position: "absolute", top: 12, right: 12, zIndex: 100,
            background: "rgba(124,58,237,0.85)", color: "#fff",
            padding: "6px 12px", borderRadius: 8,
            fontSize: 12, fontWeight: 600, cursor: "grab",
            display: "flex", alignItems: "center", gap: 6,
            backdropFilter: "blur(8px)",
            userSelect: "none",
            boxShadow: "0 4px 16px rgba(124,58,237,0.4)",
          }}
        >
          ⠿ Drag
        </div>
      )}
      <Renderer {...block.props} />
    </div>
  );
}

const STORAGE_KEY = "portfolio-block-order";

/** Re-order portfolioSchema blocks to match a saved ID order. */
function applyStoredOrder(savedIds: string[]): PageSchema {
  const blockMap = new Map(portfolioSchema.blocks.map((b) => [b.id, b]));
  const ordered = savedIds.flatMap((id) => (blockMap.has(id) ? [blockMap.get(id)!] : []));
  // Append any new blocks not present in the saved order
  const savedSet = new Set(savedIds);
  const extra = portfolioSchema.blocks.filter((b) => !savedSet.has(b.id));
  return { ...portfolioSchema, blocks: [...ordered, ...extra] };
}

// ── Main PortfolioPage ──────────────────────────────────────
export function PortfolioPage(): React.ReactElement {
  // Always start with portfolioSchema so server & first client render match (avoids hydration mismatch).
  // Then, after mount, apply any saved order from localStorage.
  const [schema, setSchema] = useState<PageSchema>(portfolioSchema);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  // Rehydrate saved block order after mount (client-only)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const ids: string[] = JSON.parse(saved);
        startTransition(() => setSchema(applyStoredOrder(ids)));
      }
    } catch {
      // ignore malformed data
    }
  }, []);

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
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next.blocks.map((b) => b.id)));
      } catch {
        // ignore storage errors (e.g. private mode quota)
      }
      return next;
    });
  }, []);

  const activeBlock = schema.blocks.find((b) => b.id === activeId);
  const ActiveRenderer = activeBlock ? blockComponents[activeBlock.type] : null;

  // Non-editing mode: use the engine directly (clean read-only view)
  if (!isEditing) {
    return (
      <>
        {/* Edit mode toggle */}
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
        <Engine schema={schema} />
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
          <span style={{ fontSize: 18 }}>⠿</span> Block Editor — drag to reorder
        </span>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => {
              localStorage.removeItem(STORAGE_KEY);
              setSchema(portfolioSchema);
            }}
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
              <SortableBlock key={block.id} block={block} isEditing={isEditing} />
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
