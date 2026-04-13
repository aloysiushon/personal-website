# 💬 COPILOT PROMPTS

These are standard commands Copilot must understand.

---

## PROMPT: build UI component

"Create a reusable UI component in `/packages/ui/src/` with inline styles and a TypeScript interface. Include a co-located `.stories.tsx` file with `import React from 'react'`, `tags: ['autodocs']`, and stories for all variants."

---

## PROMPT: create block

"Create a new block `<Name>Block` in `/packages/blocks/src/`, register it in `register.ts`, export from `index.ts`, add it to the `blockComponents` map in `PortfolioPage.tsx`, and create a co-located `.stories.tsx` file with realistic sample data."

---

## PROMPT: add storybook story

"Add a Storybook story for `<ComponentName>`. File must start with `import React from 'react'`. Use `render:` functions when JSX children are involved. Include Default + all prop variant stories."

---

## PROMPT: add block to page

"Add a `<type>` block to `portfolio.schema.ts` with these props: <props>. Engine will render it automatically."

---

## PROMPT: update portfolio content

"Update my portfolio with: name=<>, role=<>, bio=<>, skills=<>, projects=<>. Edit only `portfolio.schema.ts`."

---

## PROMPT: generate page

"Convert this JSON layout into a `PageSchema` entry in `portfolio.schema.ts` and render it via the Engine."

---

## PROMPT: fix styling

"All styles must be inline `style={{}}`. Do not use Tailwind classes inside packages. Use the color palette in `skills.md`."

---

## PROMPT: persist layout

"Save the current DnD block order to localStorage in `PortfolioPage.tsx`. Load it on mount, falling back to `portfolioSchema`."

---

## PROMPT: add block to edit canvas

"Add an 'Add Block' button to the edit toolbar in `PortfolioPage.tsx` that inserts a new block of a chosen type into the schema state."

---

## PROMPT: portfolio generator

"Generate a full portfolio for a student/developer. Ask for: name, role, bio, 3–5 skills categories, 2–4 projects, contact links. Output as `portfolio.schema.ts`."

---

## PROMPT: add block to page

"Add a `<type>` block to `portfolio.schema.ts` with these props: <props>. Engine will render it automatically."

---

## PROMPT: update portfolio content

"Update my portfolio with: name=<>, role=<>, bio=<>, skills=<>, projects=<>. Edit only `portfolio.schema.ts`."

---

## PROMPT: generate page

"Convert this JSON layout into a `PageSchema` entry in `portfolio.schema.ts` and render it via the Engine."

---

## PROMPT: fix styling

"All styles must be inline `style={{}}`. Do not use Tailwind classes inside packages. Use the color palette in `skills.md`."

---

## PROMPT: persist layout

"Save the current DnD block order to localStorage in `PortfolioPage.tsx`. Load it on mount, falling back to `portfolioSchema`."

---

## PROMPT: add block to edit canvas

"Add an 'Add Block' button to the edit toolbar in `PortfolioPage.tsx` that inserts a new block of a chosen type into the schema state."

---

## PROMPT: portfolio generator

"Generate a full portfolio for a student/developer. Ask for: name, role, bio, 3–5 skills categories, 2–4 projects, contact links. Output as `portfolio.schema.ts`."
