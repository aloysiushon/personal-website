# 🧠 COPILOT OS CORE (SYSTEM KERNEL)

This project is a COPILOT-DRIVEN SOFTWARE ENGINEERING SYSTEM.

## SYSTEM PURPOSE

This system builds a:

- Drag & drop personal website builder
- Block-based UI engine
- Portfolio generator for students, jobseekers, developers
- AI-powered chat assistant for portfolio visitors (OpenRouter, opt-in via env var)

Everything is generated from:

- Blocks
- JSON schema
- Component registry
- Engine renderer

---

## 🧱 CORE ARCHITECTURE RULE

ALL UI MUST FOLLOW THIS FLOW:

USER INPUT → BLOCK SYSTEM → JSON LAYOUT → ENGINE → REACT UI

NO EXCEPTIONS.

---

## ❌ FORBIDDEN PATTERNS

- Hardcoded page layouts
- Direct DOM manipulation
- Tailwind classes inside `packages/` (use inline styles instead)
- Non-block UI structures
- Business logic inside UI components
- Story files without `import React from "react"`
- Components without a co-located `.stories.tsx` file

---

## ✅ REQUIRED PATTERNS

- Everything is a Block
- Everything is reusable
- Everything is schema-driven
- Everything is composable
- Every component has a Storybook story
- All styles in `packages/` are inline `style={{}}`

---

## 🧠 COPILOT BEHAVIOR RULE

Copilot must always:

1. Follow `.copilot/skills.md`
2. Follow `.copilot/rules.md`
3. Use `.copilot/tasks.md` for actions
4. Treat `.copilot/agents.md` as multi-engineer system
5. **Update all relevant `.copilot/` files when new tools, patterns, or fixes are introduced**

---

## SYSTEM GOAL

Build a system similar to:

- Webflow (layout engine)
- Notion (block system)
- Framer (interactive UI)
