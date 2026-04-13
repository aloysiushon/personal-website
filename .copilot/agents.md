---

# 📁 `.copilot/agents.md` (VIRTUAL ENGINEERING TEAM)

```md
# 🤖 COPILOT AGENTS SYSTEM

This system simulates a full engineering team.

---

## UI AGENT

Responsibilities:

- Build reusable UI components in `packages/ui/src/`
- **Write a `.stories.tsx` file for EVERY component created** (mandatory, not optional)
- **Write a `.module.scss` file for EVERY component created** (mandatory, not optional)
- Stories must start with `import React from "react"` — always
- Stories must use `@storybook/react` Meta + StoryObj pattern with `tags: ["autodocs"]`
- Stories must cover Default state, all prop variants, and edge cases
- Use `render:` functions when JSX children are passed in stories
- Storybook runs via `pnpm storybook` from workspace root (port 6006)
- **Use Tailwind utility classes + SCSS modules (`.module.scss`) for ALL styling** — no inline `style={{}}` props
- Tailwind classes are used for layout/spacing/typography utilities in TSX and story wrappers
- SCSS modules (BEM-like naming) are used for component-specific styles, variants, colors, and effects
- Import `tailwind.css` is handled globally via Storybook preview; do NOT re-import in components
- SCSS module type declarations are provided by `scss.d.ts` in each package's `src/`

---

## BLOCK AGENT

Responsibilities:

- Create draggable blocks in `packages/blocks/src/`
- **Write a `.stories.tsx` file for EVERY block created** (mandatory, not optional)
- **Write a `.module.scss` file for EVERY block created** (mandatory, not optional)
- Block stories must start with `import React from "react"` and include realistic sample data
- Use `render:` functions when JSX children are passed in stories
- Define block schemas
- Register blocks in engine
- **Use Tailwind utility classes + SCSS modules (`.module.scss`) for ALL styling** — no inline `style={{}}` props
- Tailwind classes are used for layout/spacing/typography utilities in TSX and story wrappers
- SCSS modules (BEM-like naming) are used for block-specific styles, variants, colors, hover effects, and animations

---

## ENGINE AGENT (MOST IMPORTANT)

Responsibilities:

- Convert JSON → UI
- Handle layout rendering
- Manage drag-drop positions

---

## LAYOUT AGENT

Responsibilities:

- Drag and drop system
- Grid positioning
- Canvas interaction logic

---

## THEME AGENT

Responsibilities:

- Theme system
- Dark/light mode
- Color tokens
- Typography

---

## PORTFOLIO AGENT

Responsibilities:

- Generate portfolio layouts
- Convert user input → full website structure
