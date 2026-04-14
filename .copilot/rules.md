# 🚨 COPILOT RULES (STRICT ENFORCEMENT)

These rules override all instructions.

---

## 1. ARCHITECTURE RULE

Never create UI outside block system.

---

## 2. RENDER RULE

All pages MUST be generated via engine.

---

## 3. COMPONENT RULE

UI components must not contain business logic.

---

## 4. BLOCK RULE

Everything visible on screen is a block.

---

## 5. STYLING RULE (STRICT)

- **ALL** components in `packages/` MUST use inline `style={{}}` — no Tailwind classes
- Tailwind is only valid inside `apps/web/src/app/` (globals, layout)
- Storybook does NOT load Tailwind — inline styles are the only guarantee of correct rendering

---

## 6. MODIFICATION RULE

Any feature must:

- Create or modify a block
- Update engine if needed
- **Create or update a `.stories.tsx` file alongside every component** — no exceptions
- Stories must live next to their component file (co-located)
- Stories must cover: Default, all prop variants, and edge cases

---

## 7. STORYBOOK RULE (STRICT)

Every UI component and block MUST have a Storybook story file:

- `packages/ui/src/<Component>.stories.tsx` — for UI atoms
- `packages/blocks/src/<Block>.stories.tsx` — for blocks
- `packages/blocks/src/<Name>.stories.tsx` — for `apps/web`-specific components (import via relative path; stub `globalThis.fetch` in `beforeEach` for API-calling components)
- Stories MUST start with `import React from "react"` — always, no exceptions
- Stories must use `Meta` and `StoryObj` types from `@storybook/react`
- Stories must include `tags: ["autodocs"]` for auto-generated docs
- Use `render:` functions (not `args`) whenever JSX children are passed
- Stories must include at least one story per meaningful prop combination
- Title convention: `"UI/X"` for atoms · `"Blocks/X"` for blocks · `"Web/X"` for `apps/web` components
- A PR or change that adds/modifies a component without a story is **REJECTED**

---

## 8. COPILOT BEHAVIOR RULE

Copilot must:

- Follow `skills.md` first
- Then `rules.md`
- Then `tasks.md`
- Update all relevant `.copilot/` files when new patterns or tools are introduced
