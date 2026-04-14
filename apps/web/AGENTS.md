<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

<!-- BEGIN:styling-rules -->

# Styling Rules

- **Use Tailwind utility classes + SCSS modules (`.module.scss`) for ALL styling** — no inline `style={{}}` props
- Tailwind classes handle layout, spacing, typography, and responsive utilities
- SCSS modules (BEM-like naming, e.g. `styles.card`, `styles['card--active']`) handle component-specific styles, color variants, gradients, animations, and hover/focus effects
- Every new component or page section must have a corresponding `.module.scss` file
- SCSS type declarations are in `scss.d.ts` — declare `*.module.scss` modules there if adding a new package
- `tailwind.css` (`@import "tailwindcss"`) is the global entry point; import it once in the app's root layout or Storybook preview
<!-- END:styling-rules -->

<!-- BEGIN:architecture-rules -->

# Architecture Rules

## Block System

- All page content is declared in `src/data/portfolio.schema.ts` as a `PageSchema` (list of `Block` objects)
- The `Engine` from `@personal-website/engine` maps each block's `type` to a registered renderer — nothing is hardcoded in JSX
- Register new block types via `registerBlock(type, Component)` in `packages/blocks/src/register.ts`, then add the type to `BLOCK_CATALOG` in `PortfolioPage.tsx`
- Block components must be **pure** — they receive only their `props` and render UI; no editor logic, no side-effects

## Visual Editor (`PortfolioPage` + `BlockEditSidebar`)

- The visual editor lives entirely in `PortfolioPage.tsx`; block components have zero awareness of it
- Drag-and-drop reordering uses `@dnd-kit/sortable` with a `DragOverlay` for live previews — do not use any other DnD library
- `BlockEditSidebar` auto-generates form fields by reflecting on a block's `props` shape at runtime; no manual field declarations per block type
- Editor state (block order, visibility, selected block) is local React state — do not reach for a global store

<!-- END:architecture-rules -->
