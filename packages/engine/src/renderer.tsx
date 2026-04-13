import React from "react";
import type { Block, PageSchema } from "./types";
import { getBlock } from "./registry";

// ============================================================
// ENGINE RENDERER — converts JSON schema → React UI
// ============================================================

interface BlockNodeProps {
  block: Block;
}

function BlockNode({ block }: BlockNodeProps): React.ReactElement | null {
  const Renderer = getBlock(block.type);

  if (!Renderer) {
    console.warn(`[Engine] No renderer found for block type: "${block.type}"`);
    return null;
  }

  return React.createElement(Renderer, block.props);
}

interface EngineProps {
  schema: PageSchema;
}

export function Engine({ schema }: EngineProps): React.ReactElement {
  return (
    <main id={`page-${schema.id}`} className="engine-root">
      {schema.blocks.map((block) => (
        <BlockNode key={block.id} block={block} />
      ))}
    </main>
  );
}
