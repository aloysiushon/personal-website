import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { ProjectsBlock } from "./ProjectsBlock";

// ============================================================
// ProjectsBlock Stories
// ============================================================

const meta: Meta<typeof ProjectsBlock> = {
  title: "Blocks/ProjectsBlock",
  component: ProjectsBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  argTypes: {
    projects: { control: "object", description: "Array of Project objects" },
  },
};

export default meta;
type Story = StoryObj<typeof ProjectsBlock>;

// Shared dataset — 6 projects so carousel nav is always active on both desktop (3) and mobile (1)
const manyProjects = [
  {
    title:       "Block Engine",
    description: "A JSON-driven UI rendering engine that converts block schemas into live React components.",
    tags:        ["TypeScript", "React", "Monorepo"],
    emoji:       "⚙️",
    liveUrl:     "https://example.com",
    repoUrl:     "https://github.com",
  },
  {
    title:       "Portfolio Builder",
    description: "A drag-and-drop personal website builder inspired by Webflow and Framer.",
    tags:        ["Next.js", "TailwindCSS", "DnD"],
    emoji:       "🎨",
    liveUrl:     "https://example.com",
  },
  {
    title:       "AI Study Planner",
    description: "AI-powered study planner that generates personalised revision schedules.",
    tags:        ["Python", "FastAPI", "OpenAI"],
    emoji:       "🤖",
    repoUrl:     "https://github.com",
  },
  {
    title:       "E-Commerce Store",
    description: "Full-stack e-commerce app with cart, checkout, and Stripe integration.",
    tags:        ["React", "Node.js", "Stripe"],
    emoji:       "🛒",
    liveUrl:     "https://example.com",
    repoUrl:     "https://github.com",
  },
  {
    title:       "Real-time Chat",
    description: "WebSocket-based chat application with rooms and message history.",
    tags:        ["Socket.io", "Express", "Redis"],
    emoji:       "💬",
    repoUrl:     "https://github.com",
  },
  {
    title:       "Dev Dashboard",
    description: "Internal analytics dashboard with live metrics, charts, and alerting.",
    tags:        ["React", "Recharts", "PostgreSQL"],
    emoji:       "�",
    liveUrl:     "https://example.com",
    repoUrl:     "https://github.com",
  },
];

/** Default — 6 projects, carousel nav visible on both desktop (3 visible) and mobile (1 visible). */
export const Default: Story = {
  args: { projects: manyProjects },
};

/** Desktop viewport — 3 cards visible at once. */
export const Desktop: Story = {
  args: { projects: manyProjects },
  parameters: {
    viewport: { defaultViewport: "desktop" },
    chromatic: { viewports: [1280] },
  },
  name: "Desktop (3 visible)",
};

/** Mobile viewport — 1 card visible at once. */
export const Mobile: Story = {
  args: { projects: manyProjects },
  parameters: {
    viewport: { defaultViewport: "mobile1" },
    chromatic: { viewports: [375] },
  },
  name: "Mobile (1 visible)",
};

/** Single project — nav buttons should be disabled. */
export const SingleProject: Story = {
  args: {
    projects: [manyProjects[0]],
  },
  name: "Single Project (no nav)",
};

/** Cards with no links — link row should not render. */
export const NoLinks: Story = {
  args: {
    projects: manyProjects.map(({ liveUrl: _l, repoUrl: _r, ...rest }) => rest),
  },
  name: "Projects Without Links",
};
