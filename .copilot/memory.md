# 🧠 PROJECT MEMORY

This system is a BLOCK-BASED WEBSITE BUILDER.

---

## USERS

- Students
- Job seekers
- Developers

---

## CORE CONCEPT

Everything is a block.

Blocks define:

- UI
- Layout
- Content
- Behavior

---

## SYSTEM FLOW

User → Blocks → JSON → Engine → UI

---

## RULE

Never break block-based architecture.

---

## ✅ CURRENT BUILD STATE (April 2026)

### Stack

- **Next.js 16** (App Router, Turbopack)
- **React 19**
- **TypeScript 5** (strict mode)
- **Tailwind CSS 4** (CSS-first config — `apps/web` only; `packages/` use inline styles)
- **pnpm workspaces** (monorepo)
- **@dnd-kit/core + @dnd-kit/sortable** (drag & drop)
- **Storybook 8** (React + Vite — `packages/ui/.storybook/`, port 6006)
- **OpenRouter API** (`openai/gpt-oss-120b`) — AI chat, server-side only via `POST /api/chat`

### Monorepo Packages

| Package                    | Status                                                       |
| -------------------------- | ------------------------------------------------------------ |
| `@personal-website/engine` | ✅ Built — block registry + JSON→React renderer              |
| `@personal-website/ui`     | ✅ Built — Button, Badge, SectionWrapper + Storybook stories |
| `@personal-website/blocks` | ✅ Built — 7 blocks registered + Storybook stories for all   |
| `apps/web`                 | ✅ Running at localhost:3000                                 |
| `apps/web` AI Chat         | ✅ `ChatBot` widget + `POST /api/chat` route (OpenRouter)    |

### Registered Blocks

| Block Type | Component       | Description                                                       |
| ---------- | --------------- | ----------------------------------------------------------------- |
| `navbar`   | `NavbarBlock`   | Fixed top bar, glassmorphism backdrop                             |
| `hero`     | `HeroBlock`     | Full-screen, gradient bg, ambient blobs, role pill, gradient name |
| `about`    | `AboutBlock`    | Bio text + highlights badges + decorative avatar card             |
| `skills`   | `SkillsBlock`   | Categorised grid, colour-coded cards per category                 |
| `projects` | `ProjectsBlock` | Card grid with emoji, tags, live/repo links                       |
| `contact`  | `ContactBlock`  | Email + GitHub + LinkedIn buttons                                 |
| `footer`   | `FooterBlock`   | Minimal name + year signature                                     |

### Drag & Drop System

- Implemented inside `apps/web/src/components/PortfolioPage.tsx` (client component).
- Uses `@dnd-kit/core` + `@dnd-kit/sortable` with `verticalListSortingStrategy`.
- **"✏️ Edit Layout"** button (bottom-right) activates sortable DnD canvas.
- Each block shows a **"⠿ drag"** handle in edit mode.
- **"✓ Done"** returns to clean read-only Engine view.
- **"↺ Reset"** restores original `portfolioSchema` block order.
- `DragOverlay` renders a scaled-down ghost of the dragged block.

### Storybook Setup

- Installed in `packages/ui` (`storybook@8`, `@storybook/react-vite`)
- Config at `packages/ui/.storybook/main.ts` — scans stories from both `packages/ui` and `packages/blocks`
- Default background: dark (`#030712`) set in `preview.ts`
- Run: `pnpm storybook` from workspace root → `http://localhost:6006`
- **All story files must begin with `import React from "react"`** (JSX transform not auto-injected in story context)
- **Use `render:` functions** (not `args`) whenever JSX children are passed
- **All components use inline styles** — Tailwind is NOT loaded in Storybook
- **Exception**: `apps/web` components (e.g. `ChatBot`) use **SCSS Modules**, not inline styles. Their stories import the component via relative path from `packages/blocks/src/`

### Stories Inventory

| Story file                                      | Stories                                                              |
| ----------------------------------------------- | -------------------------------------------------------------------- |
| `packages/ui/src/Badge.stories.tsx`             | Violet, Blue, Green, Pink, Gray, AllColors                           |
| `packages/ui/src/Button.stories.tsx`            | Primary, Outline, Ghost, Small, Large, AsLink, AllVariants, AllSizes |
| `packages/blocks/src/NavbarBlock.stories.tsx`   | Default, ShortName, MinimalLinks, ManyLinks                          |
| `packages/blocks/src/HeroBlock.stories.tsx`     | Default, WithAvatar, StudentPortfolio, LongNameWithAvatar            |
| `packages/blocks/src/AboutBlock.stories.tsx`    | Default, MinimalHighlights                                           |
| `packages/blocks/src/ProjectsBlock.stories.tsx` | Default, Desktop, Mobile, SingleProject, NoLinks                     |
| `packages/blocks/src/SkillsBlock.stories.tsx`   | Default, Desktop, Mobile, SingleCategory, AllColors                  |
| `packages/blocks/src/ContactBlock.stories.tsx`  | Default, EmailOnly, EmailAndGitHub, AllSocialLinks                   |
| `packages/blocks/src/FooterBlock.stories.tsx`   | Default, WithCustomYear, ShortName                                   |
| `packages/blocks/src/ChatBot.stories.tsx`       | Enabled, Disabled, SlowResponse, ApiError, NetworkError              |

### Styling Approach

- All UI components (`Button`, `Badge`) and all blocks use **inline React styles** — no Tailwind class dependency.
- This guarantees correct rendering regardless of Tailwind's `@source` scanning.
- `globals.css` includes `@source` directives for workspace packages as a supplementary scan.
- `next.config.ts` uses `transpilePackages` to resolve workspace packages through Turbopack.

### Portfolio Data Source

- All page content lives in `apps/web/src/data/portfolio.schema.ts` as a `PageSchema` JSON object.
- To update personal info: **edit only `portfolio.schema.ts`** — no code changes needed elsewhere.
- The AI chat system prompt is **auto-generated at request time** from this same schema — skills, bio, projects and contact are always in sync.

### AI Chat Bot

- Component: `apps/web/src/components/ChatBot.tsx` + `ChatBot.module.scss`
- API route: `apps/web/src/app/api/chat/route.ts` → `POST /api/chat`
- Model: `openai/gpt-oss-120b` via OpenRouter (`https://openrouter.ai/api/v1/chat/completions`)
- **Opt-in**: `page.tsx` reads `process.env.OPENROUTER_API_KEY` server-side and passes `enabled` prop to `<ChatBot>`. No key → widget is not rendered.
- API key stored in `apps/web/.env.local` (gitignored). **Never use `NEXT_PUBLIC_` prefix** — this key must stay server-side only.
- The `ChatBot` component is split into a private `ChatBotWidget` (all hooks) + a public `ChatBot` wrapper that returns `null` when `enabled={false}`, respecting Rules of Hooks.
- Storybook story: `packages/blocks/src/ChatBot.stories.tsx` (imports component via relative path; stubs `globalThis.fetch` per-story via `beforeEach`)

### Known Design Decisions

- `HeroBlock` has `paddingTop: 64` to offset the fixed 64px navbar.
- Role pill uses `fontSize: 12`, `letterSpacing: 0.08em` to accommodate long titles (e.g. "Full Stack Developer & CS Student").
- Tagline `<p>` is constrained to `maxWidth: 560` with `margin: "0 auto"` for centred alignment.
- All section backgrounds alternate between `#030712` and `#060b18` to create visual rhythm.

### Design Token Reference (all blocks)

All block SCSS files (`AboutBlock`, `SkillsBlock`, `ProjectsBlock`, `ContactBlock`, `NavbarBlock`, `FooterBlock`, `HeroBlock`) share these token values for consistency:

| Token           | Value                                    | Purpose                                  |
| --------------- | ---------------------------------------- | ---------------------------------------- |
| `$bg`           | `#080c14`                                | Section background                       |
| `$bg-panel`     | `#0d1422`                                | Header / sidebar panel background        |
| `$accent`       | `#7c3aed`                                | Primary violet accent                    |
| `$accent-light` | `#a78bfa`                                | Lighter violet for text/icons            |
| `$accent-dim`   | `rgba(124,58,237,0.15)`                  | Subtle accent fill                       |
| `$text`         | `#e2e8f0`                                | Primary text                             |
| `$text-muted`   | `#8b9dc3`                                | Secondary / muted text (~5.5:1 contrast) |
| `$border`       | `rgba(124,58,237,0.30)`                  | Accent borders                           |
| `$border-dim`   | `rgba(255,255,255,0.10)`                 | Structural dividers                      |
| `$mono`         | `"JetBrains Mono","Fira Code",monospace` | Monospace font stack                     |

Body prose text (`bio`, `card__desc`, `desc`) uses `#a0aec0` (~6:1 contrast) for better readability.
Chrome label / heading `opacity` values are `1` (labels) and `0.75` (secondary headings) — no stacking on already-dim colours.
