# 🧠 COPILOT SKILLS (ENGINEERING RULEBOOK)

## REACT RULES

- Use functional components only
- Use hooks only (`useState`, `useCallback`, `useSensor`, etc.)
- No class components
- No direct DOM manipulation (except `e.currentTarget` for hover effects)

---

## TYPESCRIPT RULES

- Strict mode enabled
- No `any` unless absolutely necessary (use `// eslint-disable-next-line` if needed)
- All props must be typed with explicit interfaces
- Use `React.CSSProperties` for inline style objects

---

## STYLING RULES ⚠️ CRITICAL

- **ALL block and UI components MUST use inline `style={{}}` props**
- Do NOT use Tailwind utility classes inside `packages/` — they are not reliably scanned and Storybook does not load Tailwind
- Tailwind 4 uses CSS-first config with `@source` directives; it is only valid inside `apps/web/src/app/`
- Color palette (use these values consistently):

| Token           | Value                  |
| --------------- | ---------------------- |
| Background dark | `#030712`              |
| Background mid  | `#060b18`              |
| Background card | `#0f172a`              |
| Violet primary  | `#7c3aed`              |
| Violet light    | `#a78bfa`              |
| Pink accent     | `#f472b6`              |
| Blue accent     | `#60a5fa`              |
| Text primary    | `#f1f5f9`              |
| Text secondary  | `#94a3b8`              |
| Text muted      | `#475569`              |
| Border subtle   | `rgba(124,58,237,0.2)` |

---

## STORYBOOK RULES ⚠️ MANDATORY

- Every component in `packages/ui/src/` MUST have a co-located `<Component>.stories.tsx`
- Every block in `packages/blocks/src/` MUST have a co-located `<Block>.stories.tsx`
- **Always add `import React from "react"` at the top of every story file** — without it JSX will throw "React is not defined"
- Use `render:` functions (not `args`) whenever JSX children or complex props are passed
- Story file structure:

  ```tsx
  import React from "react"; // ← always required
  import type { Meta, StoryObj } from "@storybook/react";
  import { MyComponent } from "./MyComponent";

  const meta: Meta<typeof MyComponent> = {
    title: "UI/MyComponent", // or "Blocks/MyBlock"
    component: MyComponent,
    tags: ["autodocs"],
  };
  export default meta;
  type Story = StoryObj<typeof MyComponent>;

  export const Default: Story = {
    args: {
      /* default props */
    },
  };

  // Use render: when children/JSX are involved
  export const WithChildren: Story = {
    render: () => (
      <div style={{ background: "#030712" }}>
        <MyComponent id="demo">
          <p style={{ color: "#f1f5f9" }}>Content</p>
        </MyComponent>
      </div>
    ),
  };
  ```

- Title convention: `"UI/<ComponentName>"` for atoms, `"Blocks/<BlockName>"` for blocks
- Must include: `Default` story + one story per meaningful variant + edge cases
- Run Storybook: `pnpm storybook` (from workspace root) → opens on port **6006**
- Storybook config: `packages/ui/.storybook/` — scans both `packages/ui` and `packages/blocks`

---

## ARCHITECTURE RULES

### Folder structure MUST be respected:

```
/packages/ui      → pure UI atoms (Button, Badge, SectionWrapper)
/packages/blocks  → page section blocks (Hero, About, Skills, etc.)
/packages/engine  → block registry + JSON→React renderer
/apps/web         → Next.js app only — no business logic
```

### Key files:

- `apps/web/src/data/portfolio.schema.ts` — single source of truth for all content
- `apps/web/src/components/PortfolioPage.tsx` — DnD canvas + Engine integration
- `packages/blocks/src/register.ts` — registers all blocks into engine
- `packages/engine/src/registry.ts` — central block registry (Map)
- `packages/ui/.storybook/main.ts` — Storybook config (stories glob covers both ui + blocks)
- `packages/ui/.storybook/preview.ts` — Storybook global parameters (dark background default)

---

## BLOCK SYSTEM RULE

Every UI element MUST follow this type:

```ts
type Block = {
  id: string;
  type: string; // must match a registered key in registry
  props: Record<string, unknown>;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
};
```

---

## DRAG & DROP RULES

- DnD logic lives exclusively in `PortfolioPage.tsx` (client component)
- Block components themselves must be pure — no DnD hooks inside blocks
- Use `PointerSensor` with `activationConstraint: { distance: 8 }` to prevent accidental drags
- Always wrap DnD in `isEditing` guard — read-only mode uses plain `<Engine>` with zero overhead

- Every component in `packages/ui/src/` MUST have a co-located `<Component>.stories.tsx`
- Every block in `packages/blocks/src/` MUST have a co-located `<Block>.stories.tsx`
- Story file structure:

  ```tsx
  import React from "react"; // ← always required in story files
  import type { Meta, StoryObj } from "@storybook/react";
  import { MyComponent } from "./MyComponent";

  const meta: Meta<typeof MyComponent> = {
    title: "UI/MyComponent", // or "Blocks/MyBlock"
    component: MyComponent,
    tags: ["autodocs"],
  };
  export default meta;
  type Story = StoryObj<typeof MyComponent>;

  export const Default: Story = {
    args: {
      /* default props */
    },
  };
  ```

- Title convention: `"UI/<ComponentName>"` for atoms, `"Blocks/<BlockName>"` for blocks
- Must include: `Default` story + one story per meaningful variant + edge cases
- Run Storybook: `pnpm storybook` (from root) → opens on port **6006**
- Storybook config lives in `packages/ui/.storybook/` and scans both `packages/ui` and `packages/blocks`

---

- Use functional components only
- Use hooks only (`useState`, `useCallback`, `useSensor`, etc.)
- No class components
- No direct DOM manipulation (except `e.currentTarget` for hover effects)

---

## TYPESCRIPT RULES

- Strict mode enabled
- No `any` unless absolutely necessary (use `// eslint-disable-next-line` if needed)
- All props must be typed with explicit interfaces
- Use `React.CSSProperties` for inline style objects

---

## STYLING RULES ⚠️ CRITICAL

- **ALL block and UI components MUST use inline `style={{}}` props**
- Do NOT use Tailwind utility classes inside `packages/` — they are not reliably scanned
- Tailwind 4 uses CSS-first config with `@source` directives; this only supplements, not replaces inline styles
- Color palette (use these values consistently):

| Token           | Value                  |
| --------------- | ---------------------- |
| Background dark | `#030712`              |
| Background mid  | `#060b18`              |
| Background card | `#0f172a`              |
| Violet primary  | `#7c3aed`              |
| Violet light    | `#a78bfa`              |
| Pink accent     | `#f472b6`              |
| Blue accent     | `#60a5fa`              |
| Text primary    | `#f1f5f9`              |
| Text secondary  | `#94a3b8`              |
| Text muted      | `#475569`              |
| Border subtle   | `rgba(124,58,237,0.2)` |

---

## ARCHITECTURE RULES

### Folder structure MUST be respected:

```
/packages/ui      → pure UI atoms (Button, Badge, SectionWrapper)
/packages/blocks  → page section blocks (Hero, About, Skills, etc.)
/packages/engine  → block registry + JSON→React renderer
/apps/web         → Next.js app only — no business logic
```

### Key files:

- `apps/web/src/data/portfolio.schema.ts` — single source of truth for all content
- `apps/web/src/components/PortfolioPage.tsx` — DnD canvas + Engine integration
- `packages/blocks/src/register.ts` — registers all blocks into engine
- `packages/engine/src/registry.ts` — central block registry (Map)

---

## BLOCK SYSTEM RULE

Every UI element MUST follow this type:

```ts
type Block = {
  id: string;
  type: string; // must match a registered key in registry
  props: Record<string, unknown>;
  layout: {
    x: number;
    y: number;
    w: number;
    h: number;
  };
};
```

---

## DRAG & DROP RULES

- DnD logic lives exclusively in `PortfolioPage.tsx` (client component)
- Block components themselves must be pure — no DnD hooks inside blocks
- Use `PointerSensor` with `activationConstraint: { distance: 8 }` to prevent accidental drags
- Always wrap DnD in `isEditing` guard — read-only mode uses plain `<Engine>` with zero overhead
