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
