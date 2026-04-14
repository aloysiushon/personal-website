# Personal Website — `apps/web`

The Next.js 16 app that renders the personal portfolio. It is part of the `personal-website` pnpm monorepo.

## Tech Stack

- **[Next.js 16](https://nextjs.org)** (App Router)
- **[React 19](https://react.dev)**
- **[Tailwind CSS v4](https://tailwindcss.com)** + **SCSS Modules** for styling
- **[TypeScript](https://www.typescriptlang.org)**
- **[@personal-website/engine](../../packages/engine)** — block registry & renderer
- **[@personal-website/blocks](../../packages/blocks)** — pre-built page-section blocks
- **[@personal-website/ui](../../packages/ui)** — shared UI primitives

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout (imports global CSS & fonts)
│   ├── page.tsx          # Entry point — renders <PortfolioPage />
│   └── globals.css       # Global styles
├── components/
│   └── PortfolioPage.tsx # Wires the schema → Engine renderer
└── data/
    └── portfolio.schema.ts  # Single source of truth for all page content
```

### How it works

All page content is declared in `src/data/portfolio.schema.ts` as a `PageSchema` object (a list of typed blocks). The `Engine` from `@personal-website/engine` reads that schema and renders the matching registered block component for each entry. Nothing is hardcoded in JSX — to update site content, edit the schema file only.

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

## Styling Guidelines

- Use **Tailwind utility classes** for layout, spacing, typography, and responsive utilities.
- Use **SCSS Modules** (`.module.scss`, BEM-like naming) for component-specific styles, colour variants, gradients, and animations.
- **No** inline `style={{}}` props.
- Every new component must have a corresponding `.module.scss` file.

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
