# ⚙️ COPILOT TASK EXECUTION SYSTEM

This defines executable AI tasks.

---

## TASK: create-ui-component

INPUT:
component name + props

OUTPUT:

- React component in `packages/ui/src/<Name>.tsx`
- TypeScript interface for props
- **Storybook story in `packages/ui/src/<Name>.stories.tsx`** ← REQUIRED
- Export in `packages/ui/src/index.ts`

NOTE: Use **inline styles only** — no Tailwind classes inside `packages/`.

---

## TASK: create-block

INPUT:
block name + props

OUTPUT:

- React component in `packages/blocks/src/<Name>Block.tsx`
- TypeScript interface for props
- **Storybook story in `packages/blocks/src/<Name>Block.stories.tsx`** ← REQUIRED
- Registration entry in `packages/blocks/src/register.ts`
- Export in `packages/blocks/src/index.ts`
- Entry in `blockComponents` map inside `PortfolioPage.tsx`

NOTE: Use **inline styles only** — no Tailwind classes. Tailwind scanning
is not guaranteed across workspace packages at build time.

---

## TASK: create-storybook-story

INPUT:
component/block name

OUTPUT:

- `<Name>.stories.tsx` co-located next to the component
- Starts with `import React from "react"` (mandatory)
- Uses `Meta<typeof X>` + `StoryObj<typeof X>` types
- Includes `tags: ["autodocs"]`
- Uses `render:` functions when JSX children are involved
- Covers: Default + all prop variants + edge cases

---

## TASK: create-page

INPUT:
JSON layout schema

OUTPUT:

- Entry added to `apps/web/src/data/portfolio.schema.ts`
- Next.js page renders it via `Engine` component automatically

---

## TASK: create-theme

INPUT:
theme name / color tokens

OUTPUT:

- CSS custom properties in `apps/web/src/app/globals.css`
- Updated inline style color values across blocks

---

## TASK: generate-portfolio

INPUT:
user profile (name, role, bio, skills, projects, contact)

OUTPUT:

- Updated `apps/web/src/data/portfolio.schema.ts`
- All `props` fields updated across all 7 blocks
- No code changes required anywhere else

---

## TASK: add-dnd ✅ COMPLETED

STATUS: Implemented via `@dnd-kit/core` + `@dnd-kit/sortable`.

IMPLEMENTATION:

- `PortfolioPage.tsx` manages `schema` state + `isEditing` toggle
- `SortableBlock` wrapper uses `useSortable` hook per block
- `DragOverlay` renders ghost during drag
- Edit toolbar: Reset / Done buttons
- Activation constraint: 8px pointer distance to avoid accidental drags

NEXT STEPS (not yet done):

- Persist reordered layout to localStorage
- Add block add/remove UI in edit mode

---

## TASK: setup-storybook ✅ COMPLETED

STATUS: Storybook 8 installed and configured.

IMPLEMENTATION:

- Installed in `packages/ui` with `@storybook/react-vite`
- Config: `packages/ui/.storybook/main.ts` (scans `packages/ui` + `packages/blocks`)
- Global dark background set in `packages/ui/.storybook/preview.ts`
- Scripts added: `pnpm storybook` (root) → port 6006
- Stories created for all 3 UI atoms + all 7 blocks
- **Known rule**: always `import React from "react"` in story files
- **Known rule**: use `render:` not `args` when JSX children are involved
- **Known rule**: `SectionWrapper` uses inline styles (Tailwind removed)

---

## TASK: add-block (future)

INPUT:
block type to add to canvas

OUTPUT:

- New block inserted into schema state at chosen position
- Block registered and available in engine

---

## TASK: persist-layout (future)

INPUT:
current schema state after DnD reorder

OUTPUT:

- Saved to `localStorage` under key `portfolio-layout`
- Loaded on mount, falls back to `portfolioSchema` default

INPUT:
block name + props

OUTPUT:

- React component in `packages/blocks/src/<Name>Block.tsx`
- TypeScript interface for props
- **Storybook story in `packages/blocks/src/<Name>Block.stories.tsx`** ← REQUIRED
- Registration entry in `packages/blocks/src/register.ts`
- Export in `packages/blocks/src/index.ts`
- Entry in `blockComponents` map inside `PortfolioPage.tsx`

NOTE: Use **inline styles only** — no Tailwind classes. Tailwind scanning
is not guaranteed across workspace packages at build time.

---

## TASK: create-page

INPUT:
JSON layout schema

OUTPUT:

- Entry added to `apps/web/src/data/portfolio.schema.ts`
- Next.js page renders it via `Engine` component automatically

---

## TASK: create-theme

INPUT:
theme name / color tokens

OUTPUT:

- CSS custom properties in `apps/web/src/app/globals.css`
- Updated inline style color values across blocks

---

## TASK: generate-portfolio

INPUT:
user profile (name, role, bio, skills, projects, contact)

OUTPUT:

- Updated `apps/web/src/data/portfolio.schema.ts`
- All `props` fields updated across all 7 blocks
- No code changes required anywhere else

---

## TASK: add-dnd ✅ COMPLETED

STATUS: Implemented via `@dnd-kit/core` + `@dnd-kit/sortable`.

IMPLEMENTATION:

- `PortfolioPage.tsx` manages `schema` state + `isEditing` toggle
- `SortableBlock` wrapper uses `useSortable` hook per block
- `DragOverlay` renders ghost during drag
- Edit toolbar: Reset / Done buttons
- Activation constraint: 8px pointer distance to avoid accidental drags

NEXT STEPS (not yet done):

- Persist reordered layout to localStorage
- Add block add/remove UI in edit mode

---

## TASK: add-block (future)

INPUT:
block type to add to canvas

OUTPUT:

- New block inserted into schema state at chosen position
- Block registered and available in engine

---

## TASK: persist-layout (future)

INPUT:
current schema state after DnD reorder

OUTPUT:

- Saved to `localStorage` under key `portfolio-layout`
- Loaded on mount, falls back to `portfolioSchema` default
