import type { ReactNode } from "react";

// ============================================================
// BLOCK TYPE DEFINITIONS
// ============================================================

export type BlockLayout = {
  x: number;
  y: number;
  w: number;
  h: number;
};

export type Block = {
  id: string;
  type: string;
  props: Record<string, unknown>;
  layout: BlockLayout;
};

export type PageSchema = {
  id: string;
  title: string;
  blocks: Block[];
};

export type BlockRenderer<P extends Record<string, unknown> = Record<string, unknown>> = (
  props: P
) => ReactNode;

export type BlockRegistry = Map<string, BlockRenderer>;
