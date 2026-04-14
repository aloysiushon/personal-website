# Personal Website — `apps/web`

The Next.js 16 app that renders the personal portfolio. It is part of the `personal-website` pnpm monorepo.

## Tech Stack

- **[Next.js 16](https://nextjs.org)** (App Router)
- **[React 19](https://react.dev)**
- **[Tailwind CSS v4](https://tailwindcss.com)** + **SCSS Modules** for styling
- **[TypeScript](https://www.typescriptlang.org)**
- **[@dnd-kit/core + @dnd-kit/sortable](https://dndkit.com)** — drag-and-drop block reordering
- **[@personal-website/engine](../../packages/engine)** — block registry & renderer
- **[@personal-website/blocks](../../packages/blocks)** — pre-built page-section blocks
- **[@personal-website/ui](../../packages/ui)** — shared UI primitives

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts         # POST /api/chat — proxies to OpenRouter AI
│   ├── layout.tsx               # Root layout (imports global CSS & fonts)
│   ├── page.tsx                 # Entry point — renders <PortfolioPage /> + <ChatBot />
│   └── globals.css              # Global styles
├── components/
│   ├── PortfolioPage.tsx        # Wires the schema → Engine renderer; hosts the visual editor
│   ├── BlockEditSidebar.tsx     # Auto-generated prop editor for the selected block
│   ├── ChatBot.tsx              # Floating AI chat widget (optional — gated by API key)
│   └── ChatBot.module.scss      # Styles for the chat widget
└── data/
    └── portfolio.schema.ts      # Single source of truth for all page content
```

### How it works

All page content is declared in `src/data/portfolio.schema.ts` as a `PageSchema` object (a list of typed blocks). The `Engine` from `@personal-website/engine` reads that schema and renders the matching registered block component for each entry. Nothing is hardcoded in JSX — to update site content, edit the schema file only.

### Visual Editor

`PortfolioPage` ships a built-in **visual editing mode** (toggle with the ✏️ button). While active:

- **Drag & drop** — reorder blocks with `@dnd-kit/sortable`; a `DragOverlay` renders a live preview of the dragged block.
- **Visibility toggle** — hide/show individual blocks without removing them.
- **Add block** — insert any registered block type from the block catalog (`BLOCK_CATALOG`).
- **Remove block** — delete a block from the page.
- **Inline prop editing** — click a block to open `BlockEditSidebar`, which auto-generates form fields from the block's props shape (strings, booleans, numbers, arrays, and nested objects are all handled).

`BlockEditSidebar` is intentionally decoupled from the block components — block components stay 100% pure with no edit logic inside them.

### AI Chat Bot

`ChatBot` is a floating AI assistant widget (bottom-right corner, 💬 button) that answers visitor questions about the portfolio owner's background, skills, and projects.

- Powered by **[OpenRouter](https://openrouter.ai)** using model `openai/gpt-oss-120b`
- The system prompt is **auto-built at request time** from the live `portfolioSchema` — skills, projects, bio, and contact are all injected automatically
- The widget is **opt-in**: it only renders when `OPENROUTER_API_KEY` is set in the environment
- The API key is read **server-side only** in `page.tsx` — it is never exposed to the client bundle
- The API route lives at `POST /api/chat` (`src/app/api/chat/route.ts`)

#### Environment Setup

Create `apps/web/.env.local` (gitignored) with:

```env
OPENROUTER_API_KEY=sk-or-v1-...
```

Without this key the chat button is simply not rendered — no errors, no broken UI.

## Getting Started

From the **monorepo root**, run the development server:

```bash
pnpm dev
```

Or from this directory:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Available Scripts

| Script       | Description                          |
| ------------ | ------------------------------------ |
| `pnpm dev`   | Start the Next.js development server |
| `pnpm build` | Create a production build            |
| `pnpm start` | Start the production server          |
| `pnpm lint`  | Run ESLint                           |

## Environment Variables

| Variable             | Required | Description                                                                     |
| -------------------- | -------- | ------------------------------------------------------------------------------- |
| `OPENROUTER_API_KEY` | Optional | Enables the AI chat widget. Omit to hide the widget entirely. Server-side only. |

Create `apps/web/.env.local` to set these locally. This file is gitignored.

## Styling Guidelines

- Use **Tailwind utility classes** for layout, spacing, typography, and responsive utilities inside `apps/web/src/`.
- Use **SCSS Modules** (`.module.scss`, BEM-like naming) for component-specific styles, colour variants, gradients, and animations.
- **No** inline `style={{}}` props inside `apps/web/` — use SCSS Modules instead.
- Every new component must have a corresponding `.module.scss` file.
- Components in `packages/` must use **inline `style={{}}` only** (Tailwind is not loaded in Storybook).

## Monorepo Commands (from root)

```bash
pnpm dev              # Run the Next.js app
pnpm build            # Build the Next.js app
pnpm storybook        # Launch Storybook for @personal-website/ui
pnpm build-storybook  # Build Storybook
pnpm lint             # Lint all packages
```

## Deployment

Deploy with the [Vercel Platform](https://vercel.com/new). Set the root directory to `apps/web` or use the monorepo preset.

See the [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
