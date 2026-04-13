import type { BlockRegistry, BlockRenderer } from "./types";

// ============================================================
// BLOCK REGISTRY — central store for all block renderers
// ============================================================

const registry: BlockRegistry = new Map();

export function registerBlock<P extends Record<string, unknown>>(
  type: string,
  renderer: BlockRenderer<P>
): void {
  registry.set(type, renderer as BlockRenderer);
}

export function getBlock(type: string): BlockRenderer | undefined {
  return registry.get(type);
}

export function hasBlock(type: string): boolean {
  return registry.has(type);
}

export { registry };
